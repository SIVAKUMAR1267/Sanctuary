import React, { useState, useRef } from 'react';
import { Lock, UploadCloud, FileUp } from 'lucide-react';
import { startEncryptionSession, encryptChunk, calculateFileHash } from '../utils/encryption';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import api from '../api';

const FileUpload = ({ token, refreshFiles, isConnected }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState(""); 
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadState, setUploadState] = useState("IDLE"); 
  
  const isPaused = useRef(false);
  const isCancelled = useRef(false);
  const currentChunkRef = useRef(0);
  const cryptoData = useRef(null);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setStatus("");
      setUploadProgress(0);
      setUploadState("IDLE");
      currentChunkRef.current = 0;
      cryptoData.current = null;
      isPaused.current = false;
      isCancelled.current = false;
    }
  };

  const initUpload = async () => {
    isPaused.current = false;
    isCancelled.current = false;
    try {
      if (currentChunkRef.current === 0) {
        setStatus("Scanning the elements...");
        setUploadState("SCANNING");
        
        try {
          const fileHash = await calculateFileHash(selectedFile);
          const scanRes = await api.post('/scan-file', { fileHash }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (scanRes.data.data?.attributes?.last_analysis_stats?.malicious > 0) {
              setStatus("Upload Blocked: Impurity Detected");
              setUploadState("IDLE");
              return alert("DANGER: Virus Detected!");
          }
        } catch (e) { console.warn("Virus scan skipped or failed."); }

        setStatus("Weaving encryption...");
        cryptoData.current = await startEncryptionSession();
      }
      processUploadLoop();
    } catch (err) {
      setStatus("Setup Failed. Try again.");
      setUploadState("ERROR");
    }
  };

  const processUploadLoop = async () => {
    setUploadState("UPLOADING");
    setStatus(currentChunkRef.current > 0 ? "Resuming journey..." : "Uploading securely...");
    const CHUNK_SIZE = 5 * 1024 * 1024; 
    const totalChunks = Math.ceil(selectedFile.size / CHUNK_SIZE);
    const { aesKey, encryptedKey, iv } = cryptoData.current;

    try {
      while (currentChunkRef.current < totalChunks) {
        if (isCancelled.current) {
          setStatus("Journey Halted");
          setUploadState("IDLE");
          setSelectedFile(null);
          setUploadProgress(0);
          return;
        }
        if (isPaused.current) {
          setStatus("Resting...");
          setUploadState("PAUSED");
          return; 
        }

        const i = currentChunkRef.current;
        const fileSlice = selectedFile.slice(i * CHUNK_SIZE, Math.min((i + 1) * CHUNK_SIZE, selectedFile.size));
        const encryptedChunk = await encryptChunk(fileSlice, aesKey, iv, i);

        const formData = new FormData();
        formData.append('chunkIndex', i);
        formData.append('totalChunks', totalChunks);
        formData.append('originalName', selectedFile.name);
        formData.append('file', encryptedChunk);
        formData.append('passwordHash', encryptedKey); 
        formData.append('salt', window.btoa(String.fromCharCode(...iv))); 

        await api.post('/upload', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        currentChunkRef.current = i + 1; 
        setUploadProgress(Math.round((currentChunkRef.current / totalChunks) * 100));
      }

      setStatus("Planted safely in your Drive!");
      setUploadState("IDLE");
      setSelectedFile(null);
      setUploadProgress(0);
      currentChunkRef.current = 0;
      refreshFiles();

    } catch (err) {
      setStatus("Connection faded (Network Error)");
      setUploadState("ERROR"); 
    }
  };

  const handlePause = () => { isPaused.current = true; };
  const handleResume = () => { isPaused.current = false; processUploadLoop(); };
  const handleCancel = () => { isCancelled.current = true; };

  // --- THE LOCK GUARD UI ---
  if (!isConnected) {
    return (
      <Card className="mb-12 relative overflow-hidden bg-muted/10 border-border/40">
        <div className="flex flex-col items-center justify-center p-12 text-center relative z-10">
          <div className="w-20 h-20 rounded-full bg-muted/50 border border-border/50 flex items-center justify-center mb-6 shadow-inner">
            <Lock size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-3xl font-serif text-foreground mb-4 tracking-tight">Sanctuary Locked</h3>
          <p className="text-muted-foreground font-sans text-lg max-w-lg mx-auto leading-relaxed">
            We refuse to store your files on our servers. Please connect your Google Drive canopy above to unlock uploads and take true ownership of your data.
          </p>
        </div>
      </Card>
    );
  }

  // --- THE UPLOAD UI ---
  return (
    <Card className="mb-12 relative overflow-visible z-10 p-2 group">
      {/* The Tactile Dropzone Area */}
      <div className={`
        flex flex-col items-center justify-center p-12 
        border-2 border-dashed rounded-[1.5rem] transition-all duration-500 text-center relative overflow-hidden
        ${selectedFile ? 'border-primary/50 bg-primary/5' : 'border-border/60 bg-muted/10 hover:border-primary/40 hover:bg-muted/20'}
      `}>
        
        {/* Dynamic Icon */}
        <div className={`w-20 h-20 rounded-blob-1 flex items-center justify-center mb-8 shadow-sm transition-all duration-500 ${selectedFile ? 'bg-primary text-primary-foreground scale-105' : 'bg-white border border-border/50 text-muted-foreground'}`}>
          {selectedFile ? <FileUp size={36} /> : <UploadCloud size={36} />}
        </div>

        <h3 className="text-3xl font-serif text-foreground mb-4 tracking-tight">
          {selectedFile ? "Ready to Plant" : "Store a New Memory"}
        </h3>
        <p className="text-muted-foreground font-sans mb-8 max-w-md">
          {selectedFile ? "Your file is ready to be encrypted and woven into the sanctuary." : "Select a file to securely encrypt and upload to your personal vault."}
        </p>
        
        <div className="relative z-10 w-full flex flex-col items-center gap-8">
          
          {/* Hidden File Input & Custom Label Button */}
          <input 
            type="file" 
            id="file-upload"
            className="hidden"
            onChange={handleFileSelect} 
            disabled={uploadState === "UPLOADING" || uploadState === "SCANNING"} 
          />
          <label 
            htmlFor="file-upload" 
            className={`
              cursor-pointer px-8 py-4 rounded-full border-2 font-bold font-sans transition-all duration-300 shadow-sm
              ${selectedFile 
                ? 'border-border bg-white text-foreground hover:border-primary hover:text-primary' 
                : 'border-primary text-primary bg-primary/5 hover:bg-primary hover:text-white'}
            `}
          >
            {selectedFile ? selectedFile.name : "Select File"}
          </label>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            {uploadState === "IDLE" && selectedFile && (
              <Button onClick={initUpload} size="lg" className="w-48 shadow-soft">
                Upload Now
              </Button>
            )}

            {uploadState === "SCANNING" && (
              <Button disabled size="lg" variant="outline" className="w-48">Scanning...</Button>
            )}

            {uploadState === "UPLOADING" && (
              <>
                <Button onClick={handlePause} variant="outline" size="lg" className="!border-secondary !text-secondary hover:!bg-secondary/10">Pause</Button>
                <Button onClick={handleCancel} variant="destructive" size="lg">Cancel</Button>
              </>
            )}

            {(uploadState === "PAUSED" || uploadState === "ERROR") && (
              <>
                <Button onClick={handleResume} variant="primary" size="lg">
                  {uploadState === "ERROR" ? "Retry" : "Resume"}
                </Button>
                <Button onClick={handleCancel} variant="outline" size="lg" className="!border-border hover:!border-destructive hover:!text-destructive hover:!bg-destructive/10">Cancel</Button>
              </>
            )}
          </div>
        </div>

        {/* Status Text */}
        {status && (
          <p className="mt-8 text-primary font-serif italic text-xl transition-all duration-500 animate-pulse">
            {status}
          </p>
        )}
        
        {/* Organic Progress Bar */}
        {uploadProgress > 0 && (
          <div className="w-full mt-8 max-w-md transition-all duration-500">
            <div className="w-full bg-border/40 rounded-full h-4 overflow-hidden shadow-inner p-0.5">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-300 ease-out relative" 
                style={{ width: `${uploadProgress}%` }}
              >
                {/* A tiny shine effect on the progress bar to make it feel fluid */}
                <div className="absolute top-0 right-0 bottom-0 left-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              </div>
            </div>
            <div className="text-center text-sm font-sans font-bold uppercase tracking-wider mt-3 text-muted-foreground">
              {uploadProgress}% Complete
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default FileUpload;