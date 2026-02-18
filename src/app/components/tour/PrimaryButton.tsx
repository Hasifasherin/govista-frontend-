import React, { ButtonHTMLAttributes, ReactNode } from "react";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ 
  children, 
  className = "", 
  variant = "primary",
  size = "md",
  fullWidth = false,
  ...props 
}) => {
  const baseStyles = "font-medium rounded-xl transition-all duration-200 font-poppins " +
    "inline-flex items-center justify-center gap-2 focus:outline-none focus:ring-2 " +
    "focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-[var(--green-primary)] to-[var(--green-accent)] " +
      "text-white hover:from-[var(--green-dark)] hover:to-[var(--green-primary)] " +
      "shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 " +
      "focus:ring-[var(--green-primary)]",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 " +
      "border border-gray-300 focus:ring-gray-400",
    outline: "border-2 border-[var(--green-primary)] text-[var(--green-primary)] " +
      "hover:bg-[var(--green-light)] focus:ring-[var(--green-primary)]"
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-3 text-base",
    lg: "px-6 py-3.5 text-lg"
  };
  
  const widthStyle = fullWidth ? "w-full" : "";
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;