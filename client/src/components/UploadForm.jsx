import React, { useState } from "react";
import { toast } from "react-toastify";
import { UploadCloud, Sprout } from 'lucide-react';
import ProgressBar from "./ProgressBar"; 
import FilePreview from "./FilePreview"; 
import { generateAESKey, encryptChunk, encryptSessionKeyWithRSA } from "../utils/encryption"; 
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import api from '../api';

const CHUNK_SIZE = 1024 * 1024; // 1MB
const CONCURRENCY = 3;

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Resting");

  const onFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setProgress(0);
    setStatus("Ready to Encrypt & Upload");
  };

  const handleSecureUpload = async () => { 
    if (!file) return;

    try {
      setStatus("🔐 1/3 Crafting Keys...");
      const aesKey = await generateAESKey();
      const encryptedSessionKey = await encryptSessionKeyWithRSA(aesKey);

      setStatus("🚀 2/3 Weaving & Uploading...");
      
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
      let chunksUploaded = 0;
      const queue = Array.from({ length: totalChunks }, (_, i) => i);

      const uploadWorker = async () => {
        while (queue.length > 0) {
          const index = queue.shift();
          const start = index * CHUNK_SIZE;
          const end = Math.min(file.size, start + CHUNK_SIZE);

          const fileSlice = file.slice(start, end);
          const arrayBuffer = await fileSlice.arrayBuffer();

          const encryptedBlob = await encryptChunk(arrayBuffer, aesKey);

          const formData = new FormData();
          formData.append("file", encryptedBlob);
          formData.append("chunkIndex", index);
          formData.append("totalChunks", totalChunks);
          formData.append("originalName", file.name);
          
          if (index === 0) formData.append("passwordHash", encryptedSessionKey);

          await api.post('/upload', formData);

          chunksUploaded++;
          setProgress(Math.round((chunksUploaded / totalChunks) * 100));
        }
      };

      await Promise.all(Array(CONCURRENCY).fill(null).map(uploadWorker));

      setStatus("✨ Safely Stowed in the Earth!");
      toast.success("Memory encrypted and stored successfully.");
      setFile(null); 
      setProgress(0);

    } catch (error) {
      console.error(error);
      setStatus("❌ The weave unraveled (Error)");
      toast.error("Upload failed. Check server console.");
    }
  };

  return (
    <Card className="max-w-3xl mx-auto mt-12 relative overflow-visible z-10 p-2 group">
      
      {/* The Tactile Dropzone Area */}
      <div className={`
        w-full min-h-[16rem] border-2 border-dashed rounded-[1.5rem] flex flex-col items-center justify-center transition-all duration-500 relative overflow-hidden group/drop
        ${file ? 'border-primary/50 bg-primary/5' : 'border-border/60 bg-muted/10 hover:border-primary/40 hover:bg-muted/20'}
      `}>
        <input 
          type="file" 
          onChange={(e) => onFileSelect(e.target.files[0])} 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          title="Select a file to plant"
          disabled={progress > 0 && progress < 100}
        />
        
        <div className="text-center relative z-10 flex flex-col items-center pointer-events-none transition-transform duration-700 group-hover/drop:scale-105">
          {/* Organic Icon Blob */}
          <div className={`w-20 h-20 rounded-blob-1 flex items-center justify-center mb-6 shadow-sm transition-all duration-500 ${file ? 'bg-primary text-primary-foreground scale-110' : 'bg-white border border-border/50 text-muted-foreground'}`}>
            {file ? <Sprout size={36} /> : <UploadCloud size={36} />}
          </div>
          
          <p className="text-foreground font-serif text-3xl mb-3 tracking-tight">
            {file ? "Memory Selected" : "Plant a New Memory"}
          </p>
          <p className="text-muted-foreground font-sans text-base max-w-sm px-6 leading-relaxed">
            {file ? "Your file is ready to be encrypted and woven into the sanctuary." : "Click or drop a file here to securely encrypt and store it."}
          </p>
        </div>
      </div>

      {/* Selected File Preview Component */}
      {file && <FilePreview file={file} />}

      {/* Progress & Status */}
      {progress > 0 && (
        <div className="mt-10 space-y-4 px-4">
          <ProgressBar progress={progress} />
          <p className="text-center text-lg text-primary font-serif italic animate-pulse transition-all duration-500">
            {status}
          </p>
        </div>
      )}

      {/* Action Button */}
      <div className="mt-10 px-4 pb-4">
        <Button
          size="lg"
          disabled={!file || (progress > 0 && progress < 100)}
          onClick={handleSecureUpload}
          variant={progress === 100 ? "outline" : "primary"}
          className={`w-full shadow-soft ${progress === 100 && '!border-border hover:!bg-muted/20 !text-foreground'}`}
        >
          {progress === 100 ? "Plant Another Memory" : "Begin Secure Weave"}
        </Button>
      </div>
    </Card>
  );
};

export default UploadForm;