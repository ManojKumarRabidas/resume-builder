import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FileText, Save } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import api from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

const CreateResume: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  
  // Get template from URL params or default to 'modern'
  const template = searchParams.get('template') || 'modern';
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      showToast('Please enter a title for your resume', 'error');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const response = await api.post('/api/resumes', {
        title: title.trim(),
        template
      });
      showToast('Resume created successfully', 'success');
      navigate(`/resumes/${response.data._id}/edit`);
    } catch (error) {
      console.error('Error creating resume:', error);
      showToast('Failed to create resume', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create New Resume</h1>
        <p className="text-gray-600 mt-1">Start building your professional resume</p>
      </header>
      
      <div className="max-w-2xl">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <Input
                label="Resume Title"
                placeholder="e.g., Software Developer Resume"
                leftIcon={<FileText className="h-5 w-5" />}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                required
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                variant="primary"
                leftIcon={<Save className="h-5 w-5" />}
                isLoading={isLoading}
              >
                Create Resume
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateResume;