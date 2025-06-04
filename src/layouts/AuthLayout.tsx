import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FileText } from 'lucide-react';

const AuthLayout: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Left panel - Branding */}
      <div className="hidden md:flex md:w-1/2 lg:w-2/3 bg-blue-600 text-white p-8 flex-col justify-between">
        <div>
          <div className="flex items-center">
            <FileText className="h-8 w-8 mr-2" />
            <h1 className="text-2xl font-bold">ResumeBuilder</h1>
          </div>
          <p className="mt-2 text-blue-100">Create professional resumes in minutes, not hours.</p>
        </div>
        
        <div className="mt-auto">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Build your resume.<br />
            Boost your career.
          </h2>
          <p className="text-lg text-blue-100">
            Stand out with a professionally designed resume that gets you noticed by employers.
          </p>
          
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-semibold text-xl mb-2">Easy to Use</h3>
              <p className="text-blue-100">Create beautiful resumes with our intuitive editor.</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-semibold text-xl mb-2">AI Powered</h3>
              <p className="text-blue-100">Get content suggestions tailored to your experience.</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-semibold text-xl mb-2">Export Ready</h3>
              <p className="text-blue-100">Download your resume as a PDF for job applications.</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-sm text-blue-200">
          © 2025 ResumeBuilder. All rights reserved.
        </div>
      </div>
      
      {/* Right panel - Auth forms */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="md:hidden mb-8 flex items-center justify-center">
            <FileText className="h-8 w-8 mr-2 text-blue-600" />
            <h1 className="text-2xl font-bold text-blue-600">ResumeBuilder</h1>
          </div>
          
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;