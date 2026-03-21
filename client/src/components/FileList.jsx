import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../ui/Button"; // <-- Import our shared primitive
import api from '../api';
const FileList = ({ user }) => {
  const [files, setFiles] = useState([]);

  const fetchFiles = async () => {
    try {
      const res = await api.get(`/my-files?user=${user}`);
      setFiles(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchFiles(); }, [user]);

  const handleDownload = (id, fileName) => {
    window.open(`/download/${id}`, "_blank");
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Let this memory return to the earth?")) return;
    
    try {
      await api.delete(`/files/${id}`);
      toast.success("File returned to earth.");
      fetchFiles(); 
    } catch (err) {
      toast.error("Failed to delete.");
    }
  };

  return (
    <div className="w-full max-w-3xl mt-16 mx-auto">
      <h3 className="text-3xl font-serif mb-8 text-foreground tracking-tight">Your Stored Files</h3>
      
      {files.length === 0 ? (
        <p className="text-muted-foreground italic font-sans text-lg">Your sanctuary is empty. Store something above.</p>
      ) : (
        <div className="space-y-4">
          {files.map((file) => (
            <div 
              key={file._id} 
              className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-[#FEFEFA] border border-border/50 rounded-[1.5rem] shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-float"
            >
              <div className="flex flex-col mb-4 sm:mb-0">
                <span className="font-sans font-bold text-foreground text-lg mb-1">{file.originalName}</span>
                <span className="text-sm font-sans text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB • Planted on {new Date(file.uploadDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex gap-3">
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownload(file._id, file.originalName)}
                >
                  Retrieve
                </Button>
                <Button 
                  size="sm"
                  variant="outline"
                  className="!border-destructive !text-destructive hover:!bg-destructive/10"
                  onClick={() => handleDelete(file._id)}
                >
                  Burn
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileList;