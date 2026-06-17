import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // הוספתי את useNavigate לכאן
import Input from '../features/login/components/Input';
import Button from '../features/login/components/Button';

function RegisterPage() {
  // חובה לקרוא ל-Hooks ברמה העליונה של הקומפוננטה!
  const navigate = useNavigate(); 

  const handleSignIn = async () => {
    // כאן תוכל להוסיף בעתיד לוגיקה של שמירת משתמש במסד הנתונים
    
    // מעבר לעמוד העובדים
    navigate('/EmployeePage');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0f172a] font-sans">
     <div className="w-full max-w-[400px] bg-white p-10 rounded-[16px] shadow-[0_10px_25px_rgba(0,0,0,0.3)]">
        
        <h2 className="text-center mb-[30px] text-2xl font-sans text-gray-900">
          Sign up
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
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" className="w-5 h-5 shrink-0" alt="A" />
              <span className="font-medium">Continue with Apple</span>
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
          <Input type="email" placeholder="Enter your Email or Username" />
        </div>
        
        <div className="flex flex-col gap-1.5 mb-6">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <Input type="password" placeholder="Enter your password" />
        </div>
        
        <Button variant="primary" className="w-full" onClick={handleSignIn}>
          Continue
        </Button>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline">
              Sign in →
            </Link>
          </p>
        </div>
        
      </div>
    </div>
  );
}

export default RegisterPage;