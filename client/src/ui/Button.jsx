import React from 'react';

export const Button = ({ children, variant = 'primary', size = 'default', className = '', ...props }) => {
  // BASE: Pill shape (rounded-full), smooth transition, tactile press (active:scale-95)
  const baseStyles = "inline-flex items-center justify-center rounded-full font-sans font-bold transition-all duration-300 ease-out active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";
  
  const variants = {
    // PRIMARY: Moss green, soft shadow, lifts on hover
    primary: "bg-primary text-primary-foreground shadow-soft hover:shadow-[0_6px_24px_-4px_rgba(93,112,82,0.25)] hover:-translate-y-0.5",
    // OUTLINE: Terracotta border, transparent background, fills slightly on hover
    outline: "border-2 border-secondary text-secondary hover:bg-secondary/5",
    // GHOST: Transparent, subtle moss hover
    ghost: "bg-transparent text-primary hover:bg-primary/10",
    // DESTRUCTIVE: Burnt Sienna, soft shadow
    destructive: "bg-destructive text-white shadow-soft hover:shadow-[0_6px_24px_-4px_rgba(168,84,72,0.25)] hover:-translate-y-0.5",
  };

  const sizes = {
    // Generous horizontal padding
    default: "h-12 px-8 text-base",
    sm: "h-10 px-6 text-sm",
    lg: "h-14 px-10 text-lg",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};