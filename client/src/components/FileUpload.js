import React, { useState, useRef } from 'react';
import axios from 'axios';
import { startEncryptionSession, encryptChunk, calculateFileHash } from '../utils/encryption';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

const FileUpload = ({ token, refreshFiles }) => {
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

  const initUpload = async () => { /* ... existing exact logic ... */
    isPaused.current = false;
    isCancelled.current = false;
    try {
      if (currentChunkRef.current === 0) {
        setStatus("🔍 Scanning the elements...");
        setUploadState("SCANNING");
        const fileHash = await calculateFileHash(selectedFile);
        try {
          const scanRes = await axios.post('http://localhost:5000/scan-file', { fileHash });
          if (scanRes.data.data?.attributes?.last_analysis_stats?.malicious > 0) {
              setStatus("❌ Upload Blocked: Impurity Detected");
              setUploadState("IDLE");
              return alert("❌ DANGER: Virus Detected!");
          }
        } catch (e) { console.warn("Virus scan skipped."); }

        setStatus("🔐 Weaving encryption...");
        cryptoData.current = await startEncryptionSession();
      }
      processUploadLoop();
    } catch (err) {
      setStatus("❌ Setup Failed. Try again.");
      setUploadState("ERROR");
    }
  };

  const processUploadLoop = async () => { /* ... existing exact logic ... */
    setUploadState("UPLOADING");
    setStatus(currentChunkRef.current > 0 ? "🚀 Resuming journey..." : "🚀 Uploading securely...");
    const CHUNK_SIZE = 5 * 1024 * 1024; 
    const totalChunks = Math.ceil(selectedFile.size / CHUNK_SIZE);
    const { aesKey, encryptedKey, iv } = cryptoData.current;

    try {
      while (currentChunkRef.current < totalChunks) {
        if (isCancelled.current) {
          setStatus("🚫 Journey Halted");
          setUploadState("IDLE");
          setSelectedFile(null);
          setUploadProgress(0);
          return;
        }
        if (isPaused.current) {
          setStatus("⏸️ Resting...");
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

        await axios.post('http://localhost:5000/upload', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        currentChunkRef.current = i + 1; 
        setUploadProgress(Math.round((currentChunkRef.current / totalChunks) * 100));
      }

      setStatus("✨ Planted safely!");
      setUploadState("IDLE");
      setSelectedFile(null);
      setUploadProgress(0);
      currentChunkRef.current = 0;
      refreshFiles();

    } catch (err) {
      setStatus("❌ Connection faded (Network Error)");
      setUploadState("ERROR"); 
    }
  };

  const handlePause = () => { isPaused.current = true; };
  const handleResume = () => { isPaused.current = false; processUploadLoop(); };
  const handleCancel = () => { isCancelled.current = true; };

  return (
    <Card className="mb-12">
      <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border/60 bg-muted/30 rounded-[2rem] hover:border-primary/50 transition-all duration-500 text-center relative overflow-hidden group">
        <h3 className="text-2xl font-serif text-foreground mb-4">Store a New Memory</h3>
        
        <div className="relative z-10 w-full flex flex-col items-center gap-6">
          <input 
            type="file" 
            id="file-upload"
            className="hidden"
            onChange={handleFileSelect} 
            disabled={uploadState === "UPLOADING" || uploadState === "SCANNING"} 
          />
          <label 
            htmlFor="file-upload" 
            className="cursor-pointer px-8 py-3 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all duration-300"
          >
            {selectedFile ? selectedFile.name : "Select File"}
          </label>

          <div className="flex flex-wrap gap-4 justify-center">
            {uploadState === "IDLE" && (
              <Button onClick={initUpload} disabled={!selectedFile} variant={selectedFile ? 'primary' : 'outline'}>
                Upload Now
              </Button>
            )}

            {uploadState === "SCANNING" && (
              <Button disabled variant="outline">Scanning...</Button>
            )}

            {uploadState === "UPLOADING" && (
              <>
                <Button onClick={handlePause} variant="warning">Pause</Button>
                <Button onClick={handleCancel} variant="destructive">Cancel</Button>
              </>
            )}

            {(uploadState === "PAUSED" || uploadState === "ERROR") && (
              <>
                <Button onClick={handleResume} variant="primary">
                  {uploadState === "ERROR" ? "Retry" : "Resume"}
                </Button>
                <Button onClick={handleCancel} variant="destructive">Cancel</Button>
              </>
            )}
          </div>
        </div>

        {status && <p className="mt-6 text-primary font-serif italic text-lg">{status}</p>}
        
        {uploadProgress > 0 && (
          <div className="w-full mt-6 max-w-md">
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <div className="text-center text-sm font-sans mt-2 text-muted-foreground">{uploadProgress}%</div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default FileUpload;