import React from 'react';

const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full bg-border/40 rounded-full h-4 overflow-hidden shadow-inner p-0.5">
      <div 
        className="bg-primary h-full rounded-full transition-all duration-300 ease-out relative" 
        style={{ width: `${progress}%` }}
      >
        <div className="absolute top-0 right-0 bottom-0 left-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};

export default ProgressBar;