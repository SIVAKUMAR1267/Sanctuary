import React from 'react';

export const Card = ({ children, className = '', asymmetric = false, ...props }) => {
  // WABI-SABI SHAPES: 
  // If asymmetric is true, we apply complex border-radii so the card looks slightly hand-formed.
  // Otherwise, it uses a soft, standard 2rem curve.
  const shape = asymmetric 
    ? "rounded-[2rem] rounded-tl-[4rem] rounded-br-[3rem]" 
    : "rounded-[2rem]";

  return (
    <div 
      className={`
        bg-white/80 backdrop-blur-sm 
        border border-border/50 
        shadow-soft transition-all duration-500 ease-in-out 
        hover:-translate-y-1 hover:shadow-float 
        relative overflow-hidden 
        ${shape} 
        ${className}
      `}
      {...props}
    >
      <div className="relative z-10 p-8 md:p-10">
        {children}
      </div>
    </div>
  );
};