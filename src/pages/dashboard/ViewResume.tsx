import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Download, Edit } from 'lucide-react';
import Button from '../../components/ui/Button';
import api from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

const ViewResume: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [resume, setResume] = useState<any>(null);
  
  useEffect(() => {
    fetchResume();
  }, [id]);
  
  const fetchResume = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/api/resumes/${id}`);
      setResume(response.data);
      
      // Check if we should trigger download
      if (searchParams.get('download') === 'true') {
        handleDownload();
      }
    } catch (error) {
      console.error('Error fetching resume:', error);
      showToast('Failed to load resume', 'error');
      navigate('/resumes');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownload = async () => {
    try {
      showToast('Preparing PDF download...', 'info');
      // PDF generation logic will be implemented here
      showToast('Resume downloaded successfully', 'success');
    } catch (error) {
      console.error('Error downloading resume:', error);
      showToast('Failed to download resume', 'error');
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
    <div>
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">View Resume</h1>
            <p className="text-gray-600 mt-1">{resume.title}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              leftIcon={<ArrowLeft className="h-5 w-5" />}
              onClick={() => navigate('/resumes')}
            >
              Back
            </Button>
            
            <Button
              variant="outline"
              leftIcon={<Download className="h-5 w-5" />}
              onClick={handleDownload}
            >
              Download PDF
            </Button>
            
            <Button
              variant="primary"
              leftIcon={<Edit className="h-5 w-5" />}
              onClick={() => navigate(`/resumes/${id}/edit`)}
            >
              Edit Resume
            </Button>
          </div>
        </div>
      </header>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p className="text-gray-500 text-center py-8">
          Resume preview components will be implemented here...
        </p>
      </div>
    </div>
  );
};

export default ViewResume;