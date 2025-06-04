import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Eye } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import api from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

const EditResume: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [resume, setResume] = useState<any>(null);
  
  useEffect(() => {
    fetchResume();
  }, [id]);
  
  const fetchResume = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/api/resumes/${id}`);
      setResume(response.data);
    } catch (error) {
      console.error('Error fetching resume:', error);
      showToast('Failed to load resume', 'error');
      navigate('/resumes');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSave = async () => {
    try {
      setIsSaving(true);
      await api.put(`/api/resumes/${id}`, resume);
      showToast('Resume saved successfully', 'success');
    } catch (error) {
      console.error('Error saving resume:', error);
      showToast('Failed to save resume', 'error');
    } finally {
      setIsSaving(false);
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
            <h1 className="text-2xl font-bold text-gray-900">Edit Resume</h1>
            <p className="text-gray-600 mt-1">Update your resume content</p>
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
              leftIcon={<Eye className="h-5 w-5" />}
              onClick={() => navigate(`/resumes/${id}/view`)}
            >
              Preview
            </Button>
            
            <Button
              variant="primary"
              leftIcon={<Save className="h-5 w-5" />}
              isLoading={isSaving}
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </header>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <Input
            label="Resume Title"
            value={resume.title}
            onChange={(e) => setResume({ ...resume, title: e.target.value })}
            fullWidth
          />
        </div>
        
        <p className="text-gray-500 text-center py-8">
          Resume editor components will be implemented here...
        </p>
      </div>
    </div>
  );
};

export default EditResume;