import React, { ButtonHTMLAttributes } from 'react';
import './Button&Input.css';

// אנחנו יורשים את כל התכונות של כפתור HTML רגיל
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'base' | string;
  icon?: string; // מכיוון שאת משתמשת בזה כ-src לתמונה, הטיפוס הוא מחרוזת טקסט (URL)
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'base', 
  icon, 
  className, // שולפים את ה-className שמגיע מבחוץ (למשל מ-LoginPage)
  ...props   // אוספים את שאר התכונות (disabled, type וכו')
}) => {
  
  // מחליטים על מחלקת הבסיס לפי ה-variant
  const baseClass = variant === 'primary' ? 'main-continue-btn' : 'social-btn';
  
  // ממזגים את מחלקת הבסיס עם העיצוב שמגיע מבחוץ (אם קיים)
  const combinedClassName = className ? `${baseClass} ${className}` : baseClass;

  return (
    <button className={combinedClassName} onClick={onClick} {...props}>
      {icon && <img src={icon} alt="icon" className="btn-icon" />}
      <span className="btn-text">{children}</span>
    </button>
  );
};

export default Button;