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

  const initUpload = async () => { /* Upload Logic remains the same */
    isPaused.current = false;
    isCancelled.current = false;
    try {
      if (currentChunkRef.current === 0) {
        setStatus("Scanning the elements...");
        setUploadState("SCANNING");
        try {
          const fileHash = await calculateFileHash(selectedFile);
          const scanRes = await api.post('/scan-file', { fileHash }, { headers: { Authorization: `Bearer ${token}` } });
          if (scanRes.data.data?.attributes?.last_analysis_stats?.malicious > 0) {
              setStatus("Upload Blocked: Impurity Detected");
              setUploadState("IDLE");
              return alert("DANGER: Virus Detected!");
          }
        } catch (e) {}
        setStatus("Weaving encryption...");
        cryptoData.current = await startEncryptionSession();
      }
      processUploadLoop();
    } catch (err) {
      setStatus("Setup Failed. Try again.");
      setUploadState("ERROR");
    }
  };

  const processUploadLoop = async () => { /* Process Logic remains the same */
    setUploadState("UPLOADING");
    setStatus(currentChunkRef.current > 0 ? "Resuming journey..." : "Uploading securely...");
    const CHUNK_SIZE = 5 * 1024 * 1024; 
    const totalChunks = Math.ceil(selectedFile.size / CHUNK_SIZE);
    const { aesKey, encryptedKey, iv } = cryptoData.current;

    try {
      while (currentChunkRef.current < totalChunks) {
        if (isCancelled.current) {
          setStatus("Journey Halted"); setUploadState("IDLE"); setSelectedFile(null); setUploadProgress(0); return;
        }
        if (isPaused.current) {
          setStatus("Resting..."); setUploadState("PAUSED"); return; 
        }

        const i = currentChunkRef.current;
        const fileSlice = selectedFile.slice(i * CHUNK_SIZE, Math.min((i + 1) * CHUNK_SIZE, selectedFile.size));
        const encryptedChunk = await encryptChunk(fileSlice, aesKey, iv, i);

        const formData = new FormData();
        formData.append('chunkIndex', i); formData.append('totalChunks', totalChunks); formData.append('originalName', selectedFile.name); formData.append('file', encryptedChunk); formData.append('passwordHash', encryptedKey); formData.append('salt', window.btoa(String.fromCharCode(...iv))); 

        await api.post('/upload', formData, { headers: { Authorization: `Bearer ${token}` } });
        currentChunkRef.current = i + 1; 
        setUploadProgress(Math.round((currentChunkRef.current / totalChunks) * 100));
      }

      setStatus("Planted safely in your Drive!"); setUploadState("IDLE"); setSelectedFile(null); setUploadProgress(0); currentChunkRef.current = 0; refreshFiles();
    } catch (err) {
      setStatus("Connection faded (Network Error)"); setUploadState("ERROR"); 
    }
  };

  const handlePause = () => { isPaused.current = true; };
  const handleResume = () => { isPaused.current = false; processUploadLoop(); };
  const handleCancel = () => { isCancelled.current = true; };

  if (!isConnected) {
    return (
      <Card className="mb-10 md:mb-12 relative overflow-hidden bg-muted/10 border-border/40 p-6 md:p-10">
        <div className="flex flex-col items-center justify-center text-center relative z-10">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-muted/50 border border-border/50 flex items-center justify-center mb-4 md:mb-6 shadow-inner">
            <Lock className="w-6 h-6 md:w-8 md:h-8 text-muted-foreground" />
          </div>
          <h3 className="text-2xl md:text-3xl font-serif text-foreground mb-3 md:mb-4 tracking-tight">Sanctuary Locked</h3>
          <p className="text-muted-foreground font-sans text-base md:text-lg max-w-lg mx-auto leading-relaxed">
            Please connect your Google Drive canopy above to unlock uploads and take true ownership of your data.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="mb-10 md:mb-12 relative overflow-visible z-10 p-1 md:p-2 group">
      {/* Reduced padding to p-6 for mobile, kept p-12 for desktop */}
      <div className={`
        flex flex-col items-center justify-center p-6 py-10 md:p-12 
        border-2 border-dashed rounded-[1.2rem] md:rounded-[1.5rem] transition-all duration-500 text-center relative overflow-hidden
        ${selectedFile ? 'border-primary/50 bg-primary/5' : 'border-border/60 bg-muted/10 hover:border-primary/40 hover:bg-muted/20'}
      `}>
        
        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-blob-1 flex items-center justify-center mb-6 md:mb-8 shadow-sm transition-all duration-500 ${selectedFile ? 'bg-primary text-primary-foreground scale-105' : 'bg-white border border-border/50 text-muted-foreground'}`}>
          {selectedFile ? <FileUp className="w-8 h-8 md:w-10 md:h-10" /> : <UploadCloud className="w-8 h-8 md:w-10 md:h-10" />}
        </div>

        <h3 className="text-2xl md:text-3xl font-serif text-foreground mb-3 md:mb-4 tracking-tight">
          {selectedFile ? "Ready to Plant" : "Store a New Memory"}
        </h3>
        <p className="text-muted-foreground font-sans text-sm md:text-base mb-6 md:mb-8 max-w-md px-2">
          {selectedFile ? "Your file is ready to be encrypted and woven into the sanctuary." : "Select a file to securely encrypt and upload to your personal vault."}
        </p>
        
        <div className="relative z-10 w-full flex flex-col items-center gap-6 md:gap-8">
          <input 
            type="file" id="file-upload" className="hidden"
            onChange={handleFileSelect} 
            disabled={uploadState === "UPLOADING" || uploadState === "SCANNING"} 
          />
          <label 
            htmlFor="file-upload" 
            className={`
              w-full sm:w-auto cursor-pointer px-6 md:px-8 py-3 md:py-4 rounded-full border-2 font-bold font-sans text-sm md:text-base transition-all duration-300 shadow-sm
              ${selectedFile ? 'border-border bg-white text-foreground hover:border-primary hover:text-primary' : 'border-primary text-primary bg-primary/5 hover:bg-primary hover:text-white'}
            `}
          >
            {selectedFile ? (selectedFile.name.length > 20 ? selectedFile.name.substring(0, 20) + "..." : selectedFile.name) : "Select File"}
          </label>

          {/* Buttons expand to full width on mobile */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 justify-center w-full px-4 sm:px-0">
            {uploadState === "IDLE" && selectedFile && (
              <Button onClick={initUpload} size="lg" className="w-full sm:w-48 shadow-soft">Upload Now</Button>
            )}

            {uploadState === "SCANNING" && (
              <Button disabled size="lg" variant="outline" className="w-full sm:w-48">Scanning...</Button>
            )}

            {uploadState === "UPLOADING" && (
              <>
                <Button onClick={handlePause} variant="outline" size="lg" className="w-full sm:w-auto !border-secondary !text-secondary hover:!bg-secondary/10">Pause</Button>
                <Button onClick={handleCancel} variant="destructive" size="lg" className="w-full sm:w-auto">Cancel</Button>
              </>
            )}

            {(uploadState === "PAUSED" || uploadState === "ERROR") && (
              <>
                <Button onClick={handleResume} variant="primary" size="lg" className="w-full sm:w-auto">
                  {uploadState === "ERROR" ? "Retry" : "Resume"}
                </Button>
                <Button onClick={handleCancel} variant="outline" size="lg" className="w-full sm:w-auto !border-border hover:!border-destructive hover:!text-destructive hover:!bg-destructive/10">Cancel</Button>
              </>
            )}
          </div>
        </div>

        {status && (
          <p className="mt-6 md:mt-8 text-primary font-serif italic text-lg md:text-xl transition-all duration-500 animate-pulse px-2">
            {status}
          </p>
        )}
        
        {uploadProgress > 0 && (
          <div className="w-full mt-6 md:mt-8 max-w-md transition-all duration-500 px-4 sm:px-0">
            <div className="w-full bg-border/40 rounded-full h-3 md:h-4 overflow-hidden shadow-inner p-0.5">
              <div className="bg-primary h-full rounded-full transition-all duration-300 ease-out relative" style={{ width: `${uploadProgress}%` }}></div>
            </div>
            <div className="text-center text-xs md:text-sm font-sans font-bold uppercase tracking-wider mt-2 md:mt-3 text-muted-foreground">
              {uploadProgress}% Complete
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default FileUpload;