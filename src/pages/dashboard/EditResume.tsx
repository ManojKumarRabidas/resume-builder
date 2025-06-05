// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Save, ArrowLeft, Eye } from 'lucide-react';
// import Button from '../../components/ui/Button';
// import Input from '../../components/ui/Input';
// import api from '../../services/api';
// import { useToast } from '../../contexts/ToastContext';

// const EditResume: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const { showToast } = useToast();
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSaving, setIsSaving] = useState(false);
//   const [resume, setResume] = useState<any>(null);
  
//   useEffect(() => {
//     fetchResume();
//   }, [id]);
  
//   const fetchResume = async () => {
//     try {
//       setIsLoading(true);
//       const response = await api.get(`/api/resumes/${id}`);
//       setResume(response.data);
//     } catch (error) {
//       console.error('Error fetching resume:', error);
//       showToast('Failed to load resume', 'error');
//       navigate('/resumes');
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
//   const handleSave = async () => {
//     try {
//       setIsSaving(true);
//       await api.put(`/api/resumes/${id}`, resume);
//       showToast('Resume saved successfully', 'success');
//     } catch (error) {
//       console.error('Error saving resume:', error);
//       showToast('Failed to save resume', 'error');
//     } finally {
//       setIsSaving(false);
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
//             <h1 className="text-2xl font-bold text-gray-900">Edit Resume</h1>
//             <p className="text-gray-600 mt-1">Update your resume content</p>
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
//               leftIcon={<Eye className="h-5 w-5" />}
//               onClick={() => navigate(`/resumes/${id}/view`)}
//             >
//               Preview
//             </Button>
            
//             <Button
//               variant="primary"
//               leftIcon={<Save className="h-5 w-5" />}
//               isLoading={isSaving}
//               onClick={handleSave}
//             >
//               Save Changes
//             </Button>
//           </div>
//         </div>
//       </header>
      
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//         <div className="mb-6">
//           <Input label="Resume Title" value={resume.title} onChange={(e) => setResume({ ...resume, title: e.target.value })}
//             fullWidth />
//         </div>
//         <p className="text-gray-500 text-center py-1 mb-4">
//           Basic Details
//         </p>
//         <div className="grid grid-cols-3 gap-4 mb-6">
//           <div className="col-span-1">
//             <Input label="Name" value={resume.content.basic.name}
//               onChange={(e) => setResume({ ...resume,content: {...resume.content, basic: {...resume.content.basic, name: e.target.value}}})}
//               fullWidth/>
//           </div>
//           <div className="col-span-1">
//             <Input label="Email" value={resume.content.basic.email}
//               onChange={(e) => setResume({ ...resume,content: {...resume.content, basic: {...resume.content.basic, email: e.target.value}}})}
//               fullWidth/>
//           </div>
//           <div className="col-span-1">
//             <Input label="Phone" value={resume.content.basic.phone}
//               onChange={(e) => setResume({ ...resume,content: {...resume.content, basic: {...resume.content.basic, phone: e.target.value}}})}
//               fullWidth/>
//           </div>
//         </div>
//         <div className="grid grid-cols-2 gap-4 mb-6">
//           <div className="col-span-1">
//             <Input label="Location" value={resume.content.basic.location}
//               onChange={(e) => setResume({ ...resume,content: {...resume.content, basic: {...resume.content.basic, location: e.target.value}}})}
//               fullWidth/>
//           </div>
//           <div className="col-span-1">
//             <Input label="Website" value={resume.content.basic.website}
//               onChange={(e) => setResume({ ...resume,content: {...resume.content, basic: {...resume.content.basic, website: e.target.value}}})}
//               fullWidth/>
//           </div>
//         </div>
//         <div className="mb-6">
//           <Input label="Bio" value={resume.content.basic.bio}
//             onChange={(e) => setResume({ ...resume,content: {...resume.content, basic: {...resume.content.basic, bio: e.target.value}}})}
//             fullWidth/>
//         </div>
//         <p className="text-gray-500 text-center py-1 mb-4">
//           Education
//         </p>
//         <div className="grid grid-cols-2 gap-4 mb-6">
//           <div className="col-span-1">
//             <Input label="Degree" value={resume.content.education.degree}
//               onChange={(e) => setResume({ ...resume,content: {...resume.content, education: {...resume.content.education, degree: e.target.value}}})}
//               fullWidth/>
//           </div>
//           <div className="col-span-1">
//             <Input label="Institute" value={resume.content.education.institute}
//               onChange={(e) => setResume({ ...resume,content: {...resume.content, education: {...resume.content.education, institute: e.target.value}}})}
//               fullWidth/>
//           </div>
//         </div>
//         <p className="text-gray-500 text-center py-1 mb-4">
//           Experience
//         </p>
//         <p className="text-gray-500 text-center py-1 mb-4">
//           Skills
//         </p>
//         <p className="text-gray-500 text-center py-1 mb-4">
//           Projects
//         </p>
//         <p className="text-gray-500 text-center py-1 mb-4">
//           Certifications
//         </p>
//       </div>
//     </div>
//   );
// };

// export default EditResume;


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Eye, Plus, Trash2 } from 'lucide-react';
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
  const handlePreview = async () => {
    try {
      handleSave()
      navigate(`/resumes/${id}/view`)} catch (error) {
      console.error('Error previewing resume:', error);
      showToast('Failed to preview resume', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Handlers for adding new entries
  const addEducation = () => {
    setResume({
      ...resume,
      content: {
        ...resume.content,
        education: [
          ...resume.content.education,
          {
            institution: '',
            degree: '',
            field: '',
            startDate: '',
            endDate: '',
            description: '',
            _id: { $oid: `new-${Date.now()}` }, // Temporary ID
          },
        ],
      },
    });
  };

  const addExperience = () => {
    setResume({
      ...resume,
      content: {
        ...resume.content,
        experience: [
          ...resume.content.experience,
          {
            company: '',
            position: '',
            location: '',
            startDate: '',
            endDate: '',
            current: false,
            description: '',
            highlights: [],
            _id: { $oid: `new-${Date.now()}` },
          },
        ],
      },
    });
  };

  const addProject = () => {
    setResume({
      ...resume,
      content: {
        ...resume.content,
        projects: [
          ...resume.content.projects,
          {
            name: '',
            description: '',
            link: '',
            technologies: [],
            highlights: [],
            _id: { $oid: `new-${Date.now()}` },
          },
        ],
      },
    });
  };

  const addCertification = () => {
    setResume({
      ...resume,
      content: {
        ...resume.content,
        certifications: [
          ...resume.content.certifications,
          {
            name: '',
            issuer: '',
            date: '',
            link: '',
            _id: { $oid: `new-${Date.now()}` },
          },
        ],
      },
    });
  };

  const addSkill = (type: 'technical' | 'soft' | 'languages') => {
    setResume({
      ...resume,
      content: {
        ...resume.content,
        skills: {
          ...resume.content.skills,
          [type]: [...resume.content.skills[type], ''],
        },
      },
    });
  };

  // Handlers for deleting entries
  const deleteEducation = (index: number) => {
    setResume({
      ...resume,
      content: {
        ...resume.content,
        education: resume.content.education.filter((_: any, i: number) => i !== index),
      },
    });
  };

  const deleteExperience = (index: number) => {
    setResume({
      ...resume,
      content: {
        ...resume.content,
        experience: resume.content.experience.filter((_: any, i: number) => i !== index),
      },
    });
  };

  const deleteProject = (index: number) => {
    setResume({
      ...resume,
      content: {
        ...resume.content,
        projects: resume.content.projects.filter((_: any, i: number) => i !== index),
      },
    });
  };

  const deleteCertification = (index: number) => {
    setResume({
      ...resume,
      content: {
        ...resume.content,
        certifications: resume.content.certifications.filter((_: any, i: number) => i !== index),
      },
    });
  };

  const deleteSkill = (type: 'technical' | 'soft' | 'languages', index: number) => {
    setResume({
      ...resume,
      content: {
        ...resume.content,
        skills: {
          ...resume.content.skills,
          [type]: resume.content.skills[type].filter((_: any, i: number) => i !== index),
        },
      },
    });
  };

  // Handlers for updating array entries
  const updateEducation = (index: number, field: string, value: string) => {
    setResume({
      ...resume,
      content: {
        ...resume.content,
        education: resume.content.education.map((edu: any, i: number) =>
          i === index ? { ...edu, [field]: value } : edu
        ),
      },
    });
  };

  const updateExperience = (index: number, field: string, value: any) => {
    setResume({
      ...resume,
      content: {
        ...resume.content,
        experience: resume.content.experience.map((exp: any, i: number) =>
          i === index ? { ...exp, [field]: value } : exp
        ),
      },
    });
  };

  const updateProject = (index: number, field: string, value: string | string[]) => {
      setResume({
        ...resume,
        content: {
          ...resume.content,
          projects: resume.content.projects.map((proj: any, i: number) =>
            i === index ? { ...proj, [field]: value } : proj
          ),
        },
      });
    };

  const updateCertification = (index: number, field: string, value: string) => {
    setResume({
      ...resume,
      content: {
        ...resume.content,
        certifications: resume.content.certifications.map((cert: any, i: number) =>
          i === index ? { ...cert, [field]: value } : cert
        ),
      },
    });
  };

  const updateSkill = (type: 'technical' | 'soft' | 'languages', index: number, value: string) => {
    setResume({
      ...resume,
      content: {
        ...resume.content,
        skills: {
          ...resume.content.skills,
          [type]: resume.content.skills[type].map((skill: string, i: number) =>
            i === index ? value : skill
          ),
        },
      },
    });
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
              onClick={handlePreview}
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
        {/* Resume Title */}
        <div className="mb-6">
          <Input
            label="Resume Title"
            value={resume.title}
            onChange={(e) => setResume({ ...resume, title: e.target.value })}
            fullWidth
          />
        </div>

        {/* Basic Details */}
        <p className="text-gray-500 text-center py-1 mb-4">Basic Details</p>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="col-span-1">
            <Input
              label="Name"
              value={resume.content.basic.name}
              onChange={(e) =>
                setResume({
                  ...resume,
                  content: {
                    ...resume.content,
                    basic: { ...resume.content.basic, name: e.target.value },
                  },
                })
              }
              fullWidth
            />
          </div>
          <div className="col-span-1">
            <Input
              label="Email"
              value={resume.content.basic.email}
              onChange={(e) =>
                setResume({
                  ...resume,
                  content: {
                    ...resume.content,
                    basic: { ...resume.content.basic, email: e.target.value },
                  },
                })
              }
              fullWidth
            />
          </div>
          <div className="col-span-1">
            <Input
              label="Phone"
              value={resume.content.basic.phone}
              onChange={(e) =>
                setResume({
                  ...resume,
                  content: {
                    ...resume.content,
                    basic: { ...resume.content.basic, phone: e.target.value },
                  },
                })
              }
              fullWidth
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="col-span-1">
            <Input
              label="Location"
              value={resume.content.basic.location}
              onChange={(e) =>
                setResume({
                  ...resume,
                  content: {
                    ...resume.content,
                    basic: { ...resume.content.basic, location: e.target.value },
                  },
                })
              }
              fullWidth
            />
          </div>
          <div className="col-span-1">
            <Input
              label="Website"
              value={resume.content.basic.website}
              onChange={(e) =>
                setResume({
                  ...resume,
                  content: {
                    ...resume.content,
                    basic: { ...resume.content.basic, website: e.target.value },
                  },
                })
              }
              fullWidth
            />
          </div>
        </div>
        <div className="mb-6">
          <Input
            label="Bio"
            value={resume.content.basic.bio}
            onChange={(e) =>
              setResume({
                ...resume,
                content: {
                  ...resume.content,
                  basic: { ...resume.content.basic, bio: e.target.value },
                },
              })
            }
            fullWidth
          />
        </div>

        {/* Education */}
        <p className="text-gray-500 text-center py-1 mb-4">Education</p>
        {resume.content.education.map((edu: any, index: number) => (
          <div key={edu._id.$oid} className="mb-6 border-b pb-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <Input
                  label="Degree"
                  value={edu.degree}
                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                  fullWidth
                />
              </div>
              <div className="col-span-1">
                <Input
                  label="Institution"
                  value={edu.institution}
                  onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                  fullWidth
                />
              </div>
              <div className="col-span-1">
                <Input
                  label="Field"
                  value={edu.field}
                  onChange={(e) => updateEducation(index, 'field', e.target.value)}
                  fullWidth
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="col-span-1">
                <Input
                  label="Start Date"
                  type="date"
                  value={edu.startDate ? new Date(edu.startDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                  fullWidth
                />
              </div>
              <div className="col-span-1">
                <Input
                  label="End Date"
                  type="date"
                  value={edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                  fullWidth
                />
              </div>
            </div>
            <div className="mt-4">
              <Input
                label="Description"
                value={edu.description}
                onChange={(e) => updateEducation(index, 'description', e.target.value)}
                fullWidth
              />
            </div>
            <div className="mt-4">
              <Button
                variant="ghost"
                leftIcon={<Trash2 className="h-5 w-5" />}
                onClick={() => deleteEducation(index)}
                className="text-red-600"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
        <Button
          variant="outline"
          leftIcon={<Plus className="h-5 w-5" />}
          onClick={addEducation}
          className="mb-6"
        >
          Add Education
        </Button>

        {/* Experience */}
        <p className="text-gray-500 text-center py-1 mb-4">Experience</p>
        {resume.content.experience.map((exp: any, index: number) => (
          <div key={exp._id.$oid} className="mb-6 border-b pb-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <Input
                  label="Company"
                  value={exp.company}
                  onChange={(e) => updateExperience(index, 'company', e.target.value)}
                  fullWidth
                />
              </div>
              <div className="col-span-1">
                <Input
                  label="Position"
                  value={exp.position}
                  onChange={(e) => updateExperience(index, 'position', e.target.value)}
                  fullWidth
                />
              </div>
              <div className="col-span-1">
                <Input
                  label="Location"
                  value={exp.location}
                  onChange={(e) => updateExperience(index, 'location', e.target.value)}
                  fullWidth
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="col-span-1">
                <Input
                  label="Start Date"
                  type="date"
                  value={exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                  fullWidth
                />
              </div>
              <div className="col-span-1">
                <Input
                  label="End Date"
                  type="date"
                  value={exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                  fullWidth
                />
              </div>
            </div>
            <div className="mt-4">
              <Input
                label="Description"
                value={exp.description}
                onChange={(e) => updateExperience(index, 'description', e.target.value)}
                fullWidth
              />
            </div>
            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={(e) => updateExperience(index, 'current', e.target.checked)}
                  className="mr-2"
                />
                Current Position
              </label>
            </div>
            <div className="mt-4">
              <Button
                variant="ghost"
                leftIcon={<Trash2 className="h-5 w-5" />}
                onClick={() => deleteExperience(index)}
                className="text-red-600"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
        <Button
          variant="outline"
          leftIcon={<Plus className="h-5 w-5" />}
          onClick={addExperience}
          className="mb-6"
        >
          Add Experience
        </Button>

        {/* Skills */}
        <p className="text-gray-500 text-center py-1 mb-4">Skills</p>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Technical Skills</h3>
          {resume.content.skills.technical.map((skill: string, index: number) => (
            <div key={`technical-${index}`} className="flex gap-2 mb-2">
              <Input
                value={skill}
                onChange={(e) => updateSkill('technical', index, e.target.value)}
                fullWidth
              />
              <Button
                variant="ghost"
                leftIcon={<Trash2 className="h-5 w-5" />}
                onClick={() => deleteSkill('technical', index)}
                className="text-red-600"
              >
                Delete
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            leftIcon={<Plus className="h-5 w-5" />}
            onClick={() => addSkill('technical')}
            className="mt-2"
          >
            Add Technical Skill
          </Button>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Soft Skills</h3>
          {resume.content.skills.soft.map((skill: string, index: number) => (
            <div key={`soft-${index}`} className="flex gap-2 mb-2">
              <Input
                value={skill}
                onChange={(e) => updateSkill('soft', index, e.target.value)}
                fullWidth
              />
              <Button
                variant="ghost"
                leftIcon={<Trash2 className="h-5 w-5" />}
                onClick={() => deleteSkill('soft', index)}
                className="text-red-600"
              >
                Delete
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            leftIcon={<Plus className="h-5 w-5" />}
            onClick={() => addSkill('soft')}
            className="mt-2"
          >
            Add Soft Skill
          </Button>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Languages</h3>
          {resume.content.skills.languages.map((skill: string, index: number) => (
            <div key={`languages-${index}`} className="flex gap-2 mb-2">
              <Input
                value={skill}
                onChange={(e) => updateSkill('languages', index, e.target.value)}
                fullWidth
              />
              <Button
                variant="ghost"
                leftIcon={<Trash2 className="h-5 w-5" />}
                onClick={() => deleteSkill('languages', index)}
                className="text-red-600"
              >
                Delete
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            leftIcon={<Plus className="h-5 w-5" />}
            onClick={() => addSkill('languages')}
            className="mt-2"
          >
            Add Language
          </Button>
        </div>

        {/* Projects */}
        <p className="text-gray-500 text-center py-1 mb-4">Projects</p>
        {resume.content.projects.map((proj: any, index: number) => (
          <div key={proj._id.$oid} className="mb-6 border-b pb-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <Input
                  label="Project Name"
                  value={proj.name}
                  onChange={(e) => updateProject(index, 'name', e.target.value)}
                  fullWidth
                />
              </div>
              <div className="col-span-1">
                <Input
                  label="Link"
                  value={proj.link}
                  onChange={(e) => updateProject(index, 'link', e.target.value)}
                  fullWidth
                />
              </div>
            </div>
            <div className="mt-4">
              <Input
                label="Description"
                value={proj.description}
                onChange={(e) => updateProject(index, 'description', e.target.value)}
                fullWidth
              />
            </div>
            <div className="mt-4">
              <Input
                label="Technologies (comma-separated)"
                value={proj.technologies.join(', ')}
                onChange={(e) =>
                  updateProject(index, 'technologies', e.target.value.split(', ').filter(Boolean))
                }
                fullWidth
              />
            </div>
            <div className="mt-4">
              <Input
                label="Highlights (comma-separated)"
                value={proj.highlights.join(', ')}
                onChange={(e) =>
                  updateProject(index, 'highlights', e.target.value.split(', ').filter(Boolean))
                }
                fullWidth
              />
            </div>
            <div className="mt-4">
              <Button
                variant="ghost"
                leftIcon={<Trash2 className="h-5 w-5" />}
                onClick={() => deleteProject(index)}
                className="text-red-600"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
        <Button
          variant="outline"
          leftIcon={<Plus className="h-5 w-5" />}
          onClick={addProject}
          className="mb-6"
        >
          Add Project
        </Button>

        {/* Certifications */}
        <p className="text-gray-500 text-center py-1 mb-4">Certifications</p>
        {resume.content.certifications.map((cert: any, index: number) => (
          <div key={cert._id.$oid} className="mb-6 border-b pb-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <Input
                  label="Certification Name"
                  value={cert.name}
                  onChange={(e) => updateCertification(index, 'name', e.target.value)}
                  fullWidth
                />
              </div>
              <div className="col-span-1">
                <Input
                  label="Issuer"
                  value={cert.issuer}
                  onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                  fullWidth
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="col-span-1">
                <Input
                  label="Date"
                  type="date"
                  value={cert.date ? new Date(cert.date).toISOString().split('T')[0] : ''}
                  onChange={(e) => updateCertification(index, 'date', e.target.value)}
                  fullWidth
                />
              </div>
              <div className="col-span-1">
                <Input
                  label="Link"
                  value={cert.link}
                  onChange={(e) => updateCertification(index, 'link', e.target.value)}
                  fullWidth
                />
              </div>
            </div>
            <div className="mt-4">
              <Button
                variant="ghost"
                leftIcon={<Trash2 className="h-5 w-5" />}
                onClick={() => deleteCertification(index)}
                className="text-red-600"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
        <Button
          variant="outline"
          leftIcon={<Plus className="h-5 w-5" />}
          onClick={addCertification}
          className="mb-6"
        >
          Add Certification
        </Button>
      </div>
    </div>
  );
};

export default EditResume;
