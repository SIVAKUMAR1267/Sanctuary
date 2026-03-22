import React from 'react';
import { FileUp } from 'lucide-react';

const FilePreview = ({ file }) => {
  return (
    <div className="mt-8 p-6 bg-white/60 backdrop-blur-sm border border-border/50 rounded-[2rem] flex items-center gap-5 shadow-soft transition-all duration-500 hover:shadow-float group">
      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
        <FileUp size={24} />
      </div>
      <div>
        <p className="text-xl font-serif font-semibold text-foreground mb-1">{file.name}</p>
        <p className="text-xs font-sans font-bold uppercase tracking-wider text-muted-foreground">
          {(file.size / 1024 / 1024).toFixed(2)} MB • Ready to weave
        </p>
      </div>
    </div>
  );
};

export default FilePreview;