import React from 'react';
import { Link } from 'react-router-dom';
import Input from '../login/components/Input';
import Button from '../login/components/Button';

export default function LoginPage() {
  return (
    <div className="login-page-wrapper">
      <div className="login-form-container">
        <h2 className="login-title">Sign in</h2>
        
           <Button className="social-btn">
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
        <Input placeholder="Enter your Email or Username" />
       
       </div>
        <div className="input-group">
          <label>Password</label>
        <Input  type="password" placeholder="Enter your password" />
        </div>
        <Button variant="primary">Sign in</Button>

        <div className="login-link">
          <p>New to this site? <Link to="/signup">Create an account →</Link></p>
        </div>
      </div>
    </div>
  );
}