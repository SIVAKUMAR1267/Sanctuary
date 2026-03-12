import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ProgressBar from "./ProgressBar"; 
import FilePreview from "./FilePreview"; 
import { generateAESKey, encryptChunk, encryptSessionKeyWithRSA } from "../utils/encryption"; 
import { Button } from "./ui/Button"; // <-- Using our new primitive
import { Card } from "./ui/Card";     // <-- Using our new primitive

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

  const handleSecureUpload = async () => { /* ... existing untouched logic ... */
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

          await axios.post("http://localhost:5000/upload", formData);
          
          chunksUploaded++;
          setProgress(Math.round((chunksUploaded / totalChunks) * 100));
        }
      };

      await Promise.all(Array(CONCURRENCY).fill(null).map(uploadWorker));

      setStatus("🎉 Safely Stowed!");
      toast.success("Memory encrypted and stored successfully.");
      setFile(null); 

    } catch (error) {
      console.error(error);
      setStatus("❌ The weave unraveled (Error)");
      toast.error("Upload failed. Check server console.");
    }
  };

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <div className="relative group">
        <div className="w-full h-40 border-2 border-dashed border-border/60 flex items-center justify-center bg-muted/20 rounded-[2rem] cursor-pointer transition-all duration-500 hover:border-primary/50 hover:bg-muted/40 overflow-hidden">
          <input 
            type="file" 
            onChange={(e) => onFileSelect(e.target.files[0])} 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="text-center group-hover:scale-105 transition-transform duration-500">
            <p className="text-foreground font-serif text-xl mb-1">Select a Memory</p>
            <p className="text-muted-foreground font-sans text-sm">Click or drop a file here</p>
          </div>
        </div>
      </div>

      {file && <FilePreview file={file} />}

      {progress > 0 && (
        <div className="mt-8 space-y-3">
          <ProgressBar progress={progress} />
          <p className="text-center text-sm text-primary font-serif italic">{status}</p>
        </div>
      )}

      <div className="mt-8">
        <Button
          disabled={!file || (progress > 0 && progress < 100)}
          onClick={handleSecureUpload}
          variant={progress === 100 ? "outline" : "primary"}
          className="w-full"
        >
          {progress === 100 ? "Store Another" : "Start Secure Upload"}
        </Button>
      </div>
    </Card>
  );
};

export default UploadForm;