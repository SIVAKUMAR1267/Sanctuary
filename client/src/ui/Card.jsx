import React from 'react';

export const Card = ({ children, className = '', asymmetric = false, ...props }) => {
  const shape = asymmetric ? "rounded-[2rem] rounded-tl-[4rem] rounded-br-[3rem]" : "rounded-[2rem]";

  return (
    <div 
      className={`bg-[#FEFEFA] border border-border/50 shadow-soft transition-all duration-500 ease-in-out hover:-translate-y-1 hover:shadow-float relative overflow-hidden ${shape} ${className}`}
      {...props}
    >
      <div className="relative z-10 p-8 md:p-10">
        {children}
      </div>
    </div>
  );
};