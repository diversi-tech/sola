import React, { InputHTMLAttributes } from 'react';
import './Button&Input.css'; 

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
}

const Input: React.FC<InputProps> = ({ 
  className, 
  type = "email", 
  ...props 
}) => {
  
  const combinedClassName = className ? `input ${className}` : 'input';

  return (
    <input 
      type={type} 
      className={combinedClassName} 
      {...props} 
    />
  );
};

export default Input;