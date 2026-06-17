import React from 'react';
import './Button&Input.css'; 

const Input = ({ placeholder, type = "email" }) => {
  return (
    <input 
      type={type} 
      placeholder={placeholder} 
      className="input" 
    />
  );
};

export default Input;