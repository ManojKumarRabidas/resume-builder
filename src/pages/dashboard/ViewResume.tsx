// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
// import { ArrowLeft, Download, Edit } from 'lucide-react';
// import Button from '../../components/ui/Button';
// import api from '../../services/api';
// import { useToast } from '../../contexts/ToastContext';
// import pdfapi from "../../services/pdfapi";

// const ViewResume: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const { showToast } = useToast();
//   const [isLoading, setIsLoading] = useState(true);
//   const [resume, setResume] = useState<any>(null);
  
//   useEffect(() => {
//     fetchResume();
//   }, [id]);
  
//   const fetchResume = async () => {
//     try {
//       setIsLoading(true);
//       const response = await api.get(`/api/resumes/${id}`);
//       setResume(response.data);
      
//       // Check if we should trigger download
//       if (searchParams.get('download') === 'true' && id) {
//         handleDownload(id);
//       }
//     } catch (error) {
//       console.error('Error fetching resume:', error);
//       showToast('Failed to load resume', 'error');
//       navigate('/resumes');
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
//   const handleDownload = async (id: string) => {
//     try {
//       showToast('Preparing PDF download...', 'info');
//         try {
//           const response = await pdfapi.get(`/api/resumes/generate-resume/${id}`, {
//             responseType: 'blob', // Important for handling binary data
//           });
//           const blob = new Blob([response.data], { type: 'application/pdf' });
//           const url = window.URL.createObjectURL(blob);
//           const link = document.createElement('a');
//           link.href = url;
//           link.setAttribute('download', 'resume.pdf');
//           document.body.appendChild(link);
//           link.click();
//           link.remove();
//           setTimeout(() => window.URL.revokeObjectURL(url), 100); // Delay cleanup to ensure download starts
//         } catch (error) {
//           console.error('Error downloading resume:', error);
//         }
//       showToast('Resume downloaded successfully', 'success');
//     } catch (error) {
//       console.error('Error downloading resume:', error);
//       showToast('Failed to download resume', 'error');
//     }
//   };
  
//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center py-16">
//         <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
//       </div>
//     );
//   }
  
//   return (
//     <div>
//       <header className="mb-8">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">View Resume</h1>
//             <p className="text-gray-600 mt-1">{resume.title}</p>
//           </div>
          
//           <div className="flex items-center gap-3">
//             <Button
//               variant="ghost"
//               leftIcon={<ArrowLeft className="h-5 w-5" />}
//               onClick={() => navigate('/resumes')}
//             >
//               Back
//             </Button>
            
//             <Button
//               variant="outline"
//               leftIcon={<Download className="h-5 w-5" />}
//               onClick={() => id && handleDownload(id)}
//             >
//               Download PDF
//             </Button>
            
//             <Button
//               variant="primary"
//               leftIcon={<Edit className="h-5 w-5" />}
//               onClick={() => navigate(`/resumes/${id}/edit`)}
//             >
//               Edit Resume
//             </Button>
//           </div>
//         </div>
//       </header>
      
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//         <p className="text-gray-500 text-center py-8">
//           Resume preview components will be implemented here...
//         </p>
//       </div>
//     </div>
//   );
// };

// export default ViewResume;


import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Download, Edit } from 'lucide-react';
import Button from '../../components/ui/Button';
import api from '../../services/api';
import pdfapi from '../../services/pdfapi';
import { useToast } from '../../contexts/ToastContext';

const ViewResume: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [resume, setResume] = useState<any>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const hasDownloaded = useRef(false); // Track if download has been triggered

  useEffect(() => {
    if (id) {
      const shouldDownload = searchParams.get('download') === 'true';
      fetchResumeAndPdf(id, shouldDownload);
    }
    // Cleanup PDF URL on unmount
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [id]); // Removed searchParams from dependencies to prevent re-runs

  const fetchResumeAndPdf = async (resumeId: string, shouldDownload: boolean) => {
    try {
      setIsLoading(true);

      // Fetch resume metadata
      const resumeResponse = await api.get(`/api/resumes/${resumeId}`);
      setResume(resumeResponse.data);

      // Fetch PDF
      const pdfResponse = await pdfapi.get(`/api/resumes/generate-resume/${resumeId}`, {
        responseType: 'blob',
      });
      const blob = new Blob([pdfResponse.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfBlob(blob);
      setPdfUrl(url);

      // Trigger download only once if shouldDownload is true
      if (shouldDownload && !hasDownloaded.current) {
        hasDownloaded.current = true;
        handleDownload(blob);
      }
    } catch (error) {
      console.error('Error fetching resume or PDF:', error);
      showToast('Failed to load resume or PDF', 'error');
      navigate('/resumes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (blob: Blob) => {
    try {
      showToast('Preparing PDF download...', 'info');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `resume-${resume?.title || 'document'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 100);
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
            <p className="text-gray-600 mt-1">{resume?.title}</p>
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
              onClick={() => pdfBlob && handleDownload(pdfBlob)}
              disabled={!pdfBlob}
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
        {pdfUrl ? (
          <embed
            src={pdfUrl}
            type="application/pdf"
            width="100%"
            height="800px"
            className="rounded-lg"
          />
        ) : (
          <p className="text-gray-500 text-center py-8">
            Unable to load resume preview. Please try again.
          </p>
        )}
      </div>
    </div>
  );
};

export default ViewResume;
