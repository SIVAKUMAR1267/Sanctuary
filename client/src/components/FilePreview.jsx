import React from 'react';


const FilePreview = ({ file }) => {
  return (
    <div className="mt-6 p-5 bg-muted/30 border border-border/50 rounded-[1.5rem] flex items-center justify-between shadow-soft transition-all duration-300 hover:shadow-float">
      <div>
        <p className="text-base font-sans font-bold text-foreground">{file.name}</p>
        <p className="text-sm font-sans text-muted-foreground mt-1">
          {(file.size / 1024 / 1024).toFixed(2)} MB • Ready to weave
        </p>
      </div>
    </div>
  );
};

export default FilePreview;