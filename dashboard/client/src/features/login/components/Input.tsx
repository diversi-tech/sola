import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
}

const Input: React.FC<InputProps> = ({ 
  className, 
  type = "email", 
  ...props 
}) => {
  
  const baseTailwindClasses = "w-full px-4 py-3 mt-2 mb-3 border border-gray-300 rounded-full text-base box-border outline-none focus:border-[#d4dbe4]";
  
  const combinedClassName = className ? `${baseTailwindClasses} ${className}` : baseTailwindClasses;

  return (
    <input 
      type={type} 
      className={combinedClassName} 
      {...props} 
    />
  );
};

export default Input;