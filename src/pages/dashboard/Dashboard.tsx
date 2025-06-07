import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, FilePlus, Briefcase as BriefcaseBusiness, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import api from '../../services/api';

interface Resume {
  _id: string;
  title: string;
  updatedAt: string;
  template: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentResumes, setRecentResumes] = useState<Resume[]>([]);
  const [totalResumes, setTotalResumes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchRecentResumes = async () => {
      try {
        const response = await api.get('/api/resumes?limit=3');
        setRecentResumes(response.data.resumes);
        setTotalResumes(response.data.totalResumes);
      } catch (error) {
        console.error('Error fetching recent resumes:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecentResumes();
  }, []);
  
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name || 'User'}</h1>
        <p className="text-gray-600 mt-1">Here's an overview of your resume building journey.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-700">My Resumes</h2>
            <div className="p-2 bg-blue-100 rounded-full text-blue-600">
              <FileText className="h-6 w-6" />
            </div>
          </div>
          <p className="text-3xl font-bold">{isLoading ? '...' : totalResumes}</p>
          <p className="text-gray-500 text-sm mt-1">Total created resumes</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-700">Templates</h2>
            <div className="p-2 bg-teal-100 rounded-full text-teal-600">
              <BriefcaseBusiness className="h-6 w-6" />
            </div>
          </div>
          <p className="text-3xl font-bold">4</p>
          <p className="text-gray-500 text-sm mt-1">Available templates</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-700">AI Suggestions</h2>
            <div className="p-2 bg-purple-100 rounded-full text-purple-600">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
          <p className="text-3xl font-bold">∞</p>
          <p className="text-gray-500 text-sm mt-1">Content improvements</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col">
          <h2 className="font-semibold text-gray-700 mb-2">Quick Actions</h2>
          <p className="text-sm text-gray-500 mb-4">Create or manage your resumes</p>
          <div className="mt-auto space-y-2">
            <Button
              variant="primary"
              leftIcon={<FilePlus className="h-5 w-5" />}
              fullWidth
              // onClick={() => navigate('/resumes/create')}
              onClick={() => navigate('/templates')}
            >
              Create Resume
            </Button>
            <Button
              variant="outline"
              leftIcon={<FileText className="h-5 w-5" />}
              fullWidth
              onClick={() => navigate('/resumes')}
            >
              View All Resumes
            </Button>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Resumes</h2>
          <Button
            variant="ghost"
            onClick={() => navigate('/resumes')}
          >
            View all
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        ) : recentResumes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Template</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentResumes.map((resume) => (
                  <tr key={resume._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{resume.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {resume.template.charAt(0).toUpperCase() + resume.template.slice(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {new Date(resume.updatedAt).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/resumes/${resume._id}/view`)}
                      >
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/resumes/${resume._id}/edit`)}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You haven't created any resumes yet.</p>
            <Button
              variant="primary"
              leftIcon={<FilePlus className="h-5 w-5" />}
              // onClick={() => navigate('/resumes/create')}
              onClick={() => navigate('/templates')}
            >
              Create Your First Resume
            </Button>
          </div>
        )}
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Tips for a Great Resume</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="font-semibold text-gray-800 mb-2">Keep it Concise</h3>
            <p className="text-gray-600 text-sm">
              Aim for a one-page resume unless you have extensive relevant experience. Be selective about what you include.
            </p>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="font-semibold text-gray-800 mb-2">Use Action Verbs</h3>
            <p className="text-gray-600 text-sm">
              Start bullet points with powerful action verbs like "achieved," "implemented," or "developed."
            </p>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="font-semibold text-gray-800 mb-2">Quantify Achievements</h3>
            <p className="text-gray-600 text-sm">
              Include numbers and metrics to showcase your impact. For example, "Increased sales by 20%."
            </p>
          </div>
        </div>
      </div>
      <footer>
        <div className="mt-8 text-center text-gray-500 text-sm">
          Developed by <a href="https://manojkumarrabidas.github.io/portfolio" target='_blank' className="text-blue-600 hover:text-blue-800 font-medium">Manoj Kumar Rabidas</a> |
          &copy; {new Date().getFullYear()} Resume Builder. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;