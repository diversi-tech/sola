import React, { ButtonHTMLAttributes } from 'react';
import './Button&Input.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'base' | string;
  icon?: string; 
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'base', 
  icon, 
  className, 
  ...props   
}) => {
  
  const baseClass = variant === 'primary' ? 'main-continue-btn' : 'social-btn';
  
  const combinedClassName = className ? `${baseClass} ${className}` : baseClass;

  return (
    <button className={combinedClassName} onClick={onClick} {...props}>
      {icon && <img src={icon} alt="icon" className="btn-icon" />}
      <span className="btn-text">{children}</span>
    </button>
  );
};

export default Button;