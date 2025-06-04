import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileQuestion } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full text-center">
        <div className="h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileQuestion className="h-12 w-12 text-blue-600" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h2>
        
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </p>
        
        <Link to="/">
          <Button
            variant="primary"
            leftIcon={<ArrowLeft className="h-5 w-5" />}
            size="lg"
          >
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;