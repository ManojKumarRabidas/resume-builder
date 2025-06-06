import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilePlus, FileText, Trash2, Edit, Eye, Download, Search } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import api from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

interface Resume {
  _id: string;
  title: string;
  template: string;
  createdAt: string;
  updatedAt: string;
}

const Resumes: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  useEffect(() => {
    fetchResumes();
  }, []);
  
  const fetchResumes = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/resumes');
      setResumes(response.data.resumes);
    } catch (error) {
      console.error('Error fetching resumes:', error);
      showToast('Failed to load resumes', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteResume = async (id: string) => {
    try {
      setIsDeleting(id);
      await api.delete(`/api/resumes/${id}`);
      setResumes((prevResumes) => prevResumes.filter((resume) => resume._id !== id));
      showToast('Resume deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting resume:', error);
      showToast('Failed to delete resume', 'error');
    } finally {
      setIsDeleting(null);
    }
  };
  
  const filteredResumes = resumes.filter((resume) =>
    resume.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div>
      <header className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Resumes</h1>
          <p className="text-gray-600 mt-1">Manage all your resumes in one place</p>
        </div>
        
        <Button
          variant="primary"
          leftIcon={<FilePlus className="h-5 w-5" />}
          // onClick={() => navigate('/resumes/create')}
          onClick={() => navigate('/templates')}
        >
          Create New Resume
        </Button>
      </header>
      
      <div className="mb-6">
        <Input
          placeholder="Search resumes..."
          leftIcon={<Search className="h-5 w-5" />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
        />
      </div>
      
      {isLoading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
      ) : filteredResumes.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Template</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredResumes.map((resume) => (
                  <tr key={resume._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-3" />
                        <div className="font-medium text-gray-900">{resume.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {resume.template.charAt(0).toUpperCase() + resume.template.slice(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {new Date(resume.createdAt).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {new Date(resume.updatedAt).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Eye className="h-4 w-4" />}
                        onClick={() => navigate(`/resumes/${resume._id}/view`)}
                      >
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Edit className="h-4 w-4" />}
                        onClick={() => navigate(`/resumes/${resume._id}/edit`)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Download className="h-4 w-4" />}
                        onClick={() => navigate(`/resumes/${resume._id}/view?download=true`)}
                      >
                        Download
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Trash2 className="h-4 w-4 text-red-500" />}
                        className="text-red-500 hover:bg-red-50"
                        isLoading={isDeleting === resume._id}
                        onClick={() => handleDeleteResume(resume._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">No resumes found</h2>
          {searchTerm ? (
            <p className="text-gray-500 mb-6">
              No resumes match your search criteria. Try a different search term.
            </p>
          ) : (
            <p className="text-gray-500 mb-6">
              You haven't created any resumes yet. Get started by creating your first resume.
            </p>
          )}
          {!searchTerm && (
            <Button
              variant="primary"
              leftIcon={<FilePlus className="h-5 w-5" />}
              // onClick={() => navigate('/resumes/create')}
              onClick={() => navigate('/templates')}
            >
              Create Your First Resume
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Resumes;