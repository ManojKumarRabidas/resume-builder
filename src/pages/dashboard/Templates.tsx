import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Check } from 'lucide-react';
import Button from '../../components/ui/Button';

interface Template {
  id: string;
  name: string;
  description: string;
  image: string;
  features: string[];
}

const Templates: React.FC = () => {
  const navigate = useNavigate();
  
  const templates: Template[] = [
    {
      id: 'modern',
      name: 'Modern',
      description: 'A clean, contemporary design with a touch of color to highlight key sections.',
      image: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      features: [
        'Professional, clean layout',
        'Colored section headers',
        'Sidebar for skills and contact info',
        'Perfect for most industries'
      ]
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'A minimalist design that puts content first with elegant typography.',
      image: 'https://images.pexels.com/photos/5940841/pexels-photo-5940841.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      features: [
        'Simple, elegant design',
        'Excellent readability',
        'ATS-friendly layout',
        'Works well for all experience levels'
      ]
    },
    {
      id: 'executive',
      name: 'Executive',
      description: 'A sophisticated design for senior professionals and executives.',
      image: 'https://images.pexels.com/photos/5849592/pexels-photo-5849592.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      features: [
        'Premium, distinguished design',
        'Emphasis on experience and achievements',
        'Professional header with contact details',
        'Ideal for senior positions'
      ]
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'A bold, creative design for standing out in creative industries.',
      image: 'https://images.pexels.com/photos/1764956/pexels-photo-1764956.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      features: [
        'Unique, eye-catching design',
        'Visual skills representation',
        'Portfolio section integration',
        'Perfect for creative fields'
      ]
    }
  ];
  
  const handleSelectTemplate = (templateId: string) => {
    navigate(`/resumes/create?template=${templateId}`);
  };
  
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Resume Templates</h1>
        <p className="text-gray-600 mt-1">
          Choose from our professional resume templates to make your resume stand out
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {templates.map((template) => (
          <div 
            key={template.id} 
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="aspect-[3/4] relative overflow-hidden bg-gray-100">
              <img 
                src={template.image} 
                alt={template.name} 
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                <div className="p-4 text-white">
                  <h3 className="font-bold text-lg">{template.name}</h3>
                  <p className="text-white/80 text-sm">{template.description}</p>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <ul className="mb-4 space-y-2">
                {template.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button
                variant="primary"
                fullWidth
                onClick={() => handleSelectTemplate(template.id)}
              >
                Use This Template
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-blue-800 mb-3">
          Can't find what you're looking for?
        </h2>
        <p className="text-blue-700 mb-4">
          We're constantly adding new templates to our collection. Check back soon for more options!
        </p>
        <Button
          variant="outline"
          leftIcon={<FileText className="h-5 w-5" />}
          onClick={() => navigate('/resumes/create')}
        >
          Start with Basic Template
        </Button>
      </div>
    </div>
  );
};

export default Templates;