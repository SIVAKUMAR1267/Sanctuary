import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FileText, Sprout } from 'lucide-react';
import { Button } from "../ui/Button"; 
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
    <div className="w-full max-w-4xl mt-16 mx-auto relative z-10">
      <div className="flex items-center gap-4 mb-10">
        <h3 className="text-3xl font-serif text-foreground tracking-tight">Your Stored Files</h3>
        <div className="h-px bg-border/50 flex-1 mt-2"></div>
      </div>
      
      {files.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 border-2 border-dashed border-border/50 rounded-[2rem] bg-white/30 backdrop-blur-sm">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 shadow-sm">
            <Sprout size={32} />
          </div>
          <p className="text-muted-foreground font-sans text-center max-w-sm">Your sanctuary is empty. Store something above.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {files.map((file) => (
            <div 
              key={file._id} 
              className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-white/80 backdrop-blur-sm border border-border/50 rounded-[2rem] shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-float"
            >
              <div className="flex items-center gap-5 mb-6 sm:mb-0">
                <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-500 shrink-0">
                  <FileText size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif font-semibold text-foreground text-xl mb-1">{file.originalName}</span>
                  <span className="text-sm font-sans font-bold uppercase tracking-wider text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • Planted {new Date(file.uploadDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <Button size="sm" onClick={() => handleDownload(file._id, file.originalName)} className="flex-1 sm:flex-none shadow-sm">
                  Retrieve
                </Button>
                <Button size="sm" variant="outline" className="!border-border hover:!border-destructive hover:!text-destructive hover:!bg-destructive/10 px-6" onClick={() => handleDelete(file._id)}>
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