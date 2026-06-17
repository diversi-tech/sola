import React from 'react';
import { Link } from 'react-router-dom'; // הוספת הייבוא החשוב הזה
import Input from '../features/login/components/Input';
import Button from '../features/login/components/Button';
function RegisterPage() {

  const handleGoogleClick = async () => {
    try {
      const data = await loginWithGoogle();
      console.log("Logged in successfully!", data);
    } catch (err) {
      alert("Something went wrong");
    }
  };



  return (
    <div className="login-page-wrapper">
      <div className="login-form-container">
        <h2 className="login-title">Sign up</h2>
        
        <Button onClick={handleGoogleClick} className="social-btn">
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" className="icon-img" alt="G" />
          Continue with Google
        </Button>

        <Button className="social-btn">
          <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" className="icon-img" alt="A" />
          Continue with Apple
        </Button>
        
        <div className="or-divider">
          <div className="line"></div>
          <span className="or-text">or</span>
          <div className="line"></div>
        </div>
        
        <div className="input-group">
          <label>Email or Username</label>
          <Input type="email" placeholder="Enter your Email or Username"  />
        </div>
        
        <div className="input-group">
          <label>Password</label>
          <Input type="password" placeholder="Enter your password"/>
        </div>
        
        <Button variant="primary">Continue</Button>
        <div className="login-link">
          <p>Already have an account? <Link to="/login">Sign in →</Link></p>
        </div>
      </div>
    </div>
  );
}// בסוף הקובץ:
export default RegisterPage;