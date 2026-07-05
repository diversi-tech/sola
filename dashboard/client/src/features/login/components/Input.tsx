import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
}

const Input: React.FC<InputProps> = ({ 
  className, 
  type = "email", 
  ...props 
}) => {
  
  // הגדרת מחלקות ה-Tailwind המקבילות לעיצוב ה-CSS המקורי
  const baseTailwindClasses = "w-full px-4 py-3 mt-2 mb-3 border border-gray-300 rounded-full text-base box-border outline-none focus:border-[#d4dbe4]";
  
  // שילוב של מחלקות הבסיס יחד עם קלאסים נוספים אם יתקבלו מבחוץ
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