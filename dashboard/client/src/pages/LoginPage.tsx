import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import Input from '../features/login/components/Input';
import Button from '../features/login/components/Button';


export  const LoginPage: React.FC = () => {
  const navigate = useNavigate(); 

  const handleSignIn = async (): Promise<void> => {
    navigate('/EmployeePage');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0f172a] font-sans">
      
      <div className="w-full max-w-[400px] bg-white p-10 rounded-[16px] shadow-[0_10px_25px_rgba(0,0,0,0.3)]">
        
        <h2 className="text-center mb-[30px] text-2xl font-sans text-gray-900">
          Sign in
        </h2>
        
        <div className="flex flex-col gap-4">
          <Button className="w-full border border-gray-300 bg-white text-gray-700 py-3 rounded-full hover:bg-gray-50 transition-colors">
            <div className="flex flex-row items-center justify-center gap-3">
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" className="w-5 h-5 shrink-0" alt="G" />
              <span className="font-medium">Continue with Google</span>
            </div>
          </Button>
          
          <Button className="w-full border border-gray-300 bg-white text-gray-700 py-3 rounded-full hover:bg-gray-50 transition-colors">
            <div className="flex flex-row items-center justify-center gap-3">
              <svg className="w-5 h-5 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="#1877F2" d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
              </svg>
              <span className="font-medium">Continue with Facebook</span>
            </div>
          </Button>
        </div>

        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-[#eee]"></div>
          <span className="px-2.5 text-[#888] text-sm">or</span>
          <div className="flex-1 h-px bg-[#eee]"></div>
        </div>
      
        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-sm font-medium text-gray-700">Email or Username</label>
          <Input placeholder="Enter your Email or Username" />
        </div>
        
        <div className="flex flex-col gap-1.5 mb-6">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <Input type="password" placeholder="Enter your password" />
        </div>
        
        <Button variant="primary" className="w-full" onClick={handleSignIn}>
          Sign in
        </Button>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            New to this site?{' '}
            <Link to="/signup" className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline">
              Create an account →
            </Link>
          </p>
        </div>
        
      </div>
    </div>
  );
};