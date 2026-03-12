import React from 'react';

const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full bg-muted rounded-full h-3 overflow-hidden shadow-inner">
      <div 
        className="bg-primary h-full rounded-full transition-all duration-500 ease-out" 
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;