import React from 'react';
import './Button&Input.css';

const Button = ({ children, onClick, variant = 'base', icon }) => {
  // אם variant הוא 'primary', נשתמש במחלקה הכחולה, אחרת בבסיסית
  const className = variant === 'primary' ? 'main-continue-btn' : 'social-btn';
  return (
    <button className={className} onClick={onClick}>
      {icon && <img src={icon} alt="icon" className="btn-icon" />}
      <span className="btn-text">{children}</span>
    </button>
  );
};

export default Button;