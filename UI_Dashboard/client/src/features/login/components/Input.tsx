import React, { InputHTMLAttributes } from 'react';
import './Button&Input.css'; 

// יורשים את כל התכונות של שדה קלט סטנדרטי
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  // מכיוון ש-type, placeholder וכו' הם כבר חלק מ-InputHTMLAttributes,
  // אין צורך לכתוב אותם כאן שוב. 
  // את יכולה להוסיף כאן פרופס מיוחדים משלך אם תצטרכי בעתיד.
}

const Input: React.FC<InputProps> = ({ 
  className, 
  type = "email", // שומרים על ברירת המחדל שהגדרת
  ...props // אוסף את כל שאר התכונות (כמו placeholder, onChange, value)
}) => {
  
  // מיזוג של מחלקת הבסיס 'input' יחד עם מחלקות שהגיעו מבחוץ (אם יש)
  const combinedClassName = className ? `input ${className}` : 'input';

  return (
    <input 
      type={type} 
      className={combinedClassName} 
      {...props} // פורש את כל שאר התכונות על האלמנט באופן אוטומטי
    />
  );
};

export default Input;