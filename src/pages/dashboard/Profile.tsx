import React, { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
  Mail,
  User,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  GraduationCap,
  Save,
  X,
  Award,
  FolderGit2,
} from "lucide-react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import api from "../../services/api";
import { useToast } from "../../contexts/ToastContext";
import { useAuth } from "../../contexts/AuthContext";

// Define interfaces for all profile sections
interface ProfileFormValues {
  name: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  title: string;
  bio: string;
}

interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Experience {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  highlights: string[];
}

interface Skills {
  technical: string[];
  soft: string[];
  languages: string[];
}

interface SkillsFormProps {
  initialData: Skills;
  onSave: (skills: Skills) => void;
}

interface Project {
  name: string;
  description: string;
  link: string;
  technologies: string[];
  highlights: string[];
}

interface Certification {
  name: string;
  issuer: string;
  date: string;
  link: string;
}

interface ProfileData {
  basic: ProfileFormValues;
  education: Education[];
  experience: Experience[];
  skills: Skills;
  projects: Project[];
  certifications: Certification[];
}

// BasicInfoForm Component
const BasicInfoForm: React.FC<{
  data: ProfileFormValues;
  onSave: (data: ProfileFormValues) => void;
  isSaving: boolean;
}> = ({ data, onSave, isSaving }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    defaultValues: data,
  });

  useEffect(() => {
    reset(data);
  }, [data, reset]);

  const onSubmit = (formData: ProfileFormValues) => {
    onSave(formData);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name"
          leftIcon={<User className="h-5 w-5" />}
          error={errors.name?.message}
          {...register("name", { required: "Name is required" })}
        />
        <Input
          label="Email"
          type="email"
          leftIcon={<Mail className="h-5 w-5" />}
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
        />
        <Input
          label="Phone Number"
          leftIcon={<Phone className="h-5 w-5" />}
          error={errors.phone?.message}
          {...register("phone")}
        />
        <Input
          label="Location"
          leftIcon={<MapPin className="h-5 w-5" />}
          placeholder="City, State, Country"
          error={errors.location?.message}
          {...register("location")}
        />
        <Input
          label="Website"
          leftIcon={<Globe className="h-5 w-5" />}
          placeholder="https://yourwebsite.com"
          error={errors.website?.message}
          {...register("website")}
        />
        <Input
          label="Professional Title"
          leftIcon={<Briefcase className="h-5 w-5" />}
          placeholder="e.g. Senior Software Engineer"
          error={errors.title?.message}
          {...register("title")}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Professional Summary
        </label>
        <textarea
          className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={4}
          placeholder="A brief summary of your professional background and key strengths"
          {...register("bio")}
        ></textarea>
      </div>
      <div className="flex justify-end">
        <Button
          variant="primary"
          leftIcon={<Save className="h-5 w-5" />}
          onClick={handleSubmit(onSubmit)}
          isLoading={isSaving}
          disabled={!isDirty || isSaving}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

// EducationForm Component
const EducationForm: React.FC<{
  data: Education[];
  onSave: (education: Education[]) => void;
  isSaving: boolean;
}> = ({ data, onSave, isSaving }) => {
  const { control, handleSubmit, reset, register } = useForm<{ education: Education[] }>({
    defaultValues: { education: data },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  });

  useEffect(() => {
    reset({ education: data });
  }, [data, reset]);

  const onSubmit = (formData: { education: Education[] }) => {
    onSave(formData.education);
  };

  return (
    <div className="space-y-6">
      {fields.map((field, index) => (
        <div key={field.id} className="p-4 border rounded space-y-4">
          <Input
            label="Institution"
            {...register(`education.${index}.institution`, { required: "Institution is required" })}
          />
          <Input
            label="Degree"
            {...register(`education.${index}.degree`, { required: "Degree is required" })}
          />
          <Input
            label="Field of Study"
            {...register(`education.${index}.field`)}
          />
          <Input
            label="Start Date"
            type="date"
            {...register(`education.${index}.startDate`)}
          />
          <Input
            label="End Date"
            type="date"
            {...register(`education.${index}.endDate`)}
          />
          <textarea
            className="block w-full rounded-md border border-gray-300 py-2 px-3"
            rows={3}
            placeholder="Description"
            {...register(`education.${index}.description`)}
          ></textarea>
          <button
            type="button"
            onClick={() => remove(index)}
            className="text-red-600 hover:text-red-800"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          append({
            institution: "",
            degree: "",
            field: "",
            startDate: "",
            endDate: "",
            description: "",
          })
        }
        className="text-blue-600 hover:text-blue-800"
      >
        Add Education
      </button>
      <div className="flex justify-end">
        <Button
          variant="primary"
          leftIcon={<Save className="h-5 w-5" />}
          onClick={handleSubmit(onSubmit)}
          isLoading={isSaving}
          disabled={isSaving}
        >
          Save Education
        </Button>
      </div>
    </div>
  );
};

// ExperienceForm Component
const ExperienceForm: React.FC<{
  data: Experience[];
  onSave: (experience: Experience[]) => void;
  isSaving: boolean;
}> = ({ data, onSave, isSaving }) => {
  const { control, handleSubmit, reset, register } = useForm<{ experience: Experience[] }>({
    defaultValues: { experience: data },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience",
  });

  useEffect(() => {
    reset({ experience: data });
  }, [data, reset]);

  const onSubmit = (formData: { experience: Experience[] }) => {
    onSave(formData.experience);
  };

  return (
    <div className="space-y-6">
      {fields.map((field, index) => (
        <div key={field.id} className="p-4 border rounded space-y-4">
          <Input
            label="Company"
            {...register(`experience.${index}.company`, { required: "Company is required" })}
          />
          <Input
            label="Position"
            {...register(`experience.${index}.position`, { required: "Position is required" })}
          />
          <Input
            label="Location"
            {...register(`experience.${index}.location`)}
          />
          <Input
            label="Start Date"
            type="date"
            {...register(`experience.${index}.startDate`)}
          />
          <Input
            label="End Date"
            type="date"
            {...register(`experience.${index}.endDate`)}
            disabled={field.current}
          />
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              {...register(`experience.${index}.current`)}
            />
            Current Position
          </label>
          <textarea
            className="block w-full rounded-md border border-gray-300 py-2 px-3"
            rows={3}
            placeholder="Description"
            {...register(`experience.${index}.description`)}
          ></textarea>
          <Controller
            control={control}
            name={`experience.${index}.highlights`}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700">Highlights</label>
                {field.value.map((highlight, hIndex) => (
                  <div key={hIndex} className="flex items-center mb-2">
                    <Input
                      value={highlight}
                      onChange={(e) => {
                        const newHighlights = [...field.value];
                        newHighlights[hIndex] = e.target.value;
                        field.onChange(newHighlights);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        field.onChange(field.value.filter((_, i) => i !== hIndex));
                      }}
                      className="ml-2 text-red-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => field.onChange([...field.value, ""])}
                  className="text-blue-600"
                >
                  Add Highlight
                </button>
              </div>
            )}
          />
          <button
            type="button"
            onClick={() => remove(index)}
            className="text-red-600 hover:text-red-800"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          append({
            company: "",
            position: "",
            location: "",
            startDate: "",
            endDate: "",
            current: false,
            description: "",
            highlights: [],
          })
        }
        className="text-blue-600 hover:text-blue-800"
      >
        Add Experience
      </button>
      <div className="flex justify-end">
        <Button
          variant="primary"
          leftIcon={<Save className="h-5 w-5" />}
          onClick={handleSubmit(onSubmit)}
          isLoading={isSaving}
          disabled={isSaving}
        >
          Save Experience
        </Button>
      </div>
    </div>
  );
};

// SkillsForm Component
const SkillsForm: React.FC<SkillsFormProps> = ({ initialData, onSave }) => {
  const [technicalSkills, setTechnicalSkills] = useState<string[]>(initialData.technical || []);
  const [softSkills, setSoftSkills] = useState<string[]>(initialData.soft || []);
  const [languages, setLanguages] = useState<string[]>(initialData.languages || []);
  const [newSkill, setNewSkill] = useState({
    technical: "",
    soft: "",
    languages: "",
  });

  // Generic function to add skills to a category
  const addSkills = (category: keyof Skills) => {
    const skillsToAdd = newSkill[category]
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);
    if (skillsToAdd.length > 0) {
      if (category === "technical") {
        setTechnicalSkills([...technicalSkills, ...skillsToAdd]);
      } else if (category === "soft") {
        setSoftSkills([...softSkills, ...skillsToAdd]);
      } else if (category === "languages") {
        setLanguages([...languages, ...skillsToAdd]);
      }
      setNewSkill({ ...newSkill, [category]: "" });
    }
  };

  // Generic function to remove a skill from a category
  const removeSkill = (category: keyof Skills, index: number) => {
    if (category === "technical") {
      setTechnicalSkills(technicalSkills.filter((_, i) => i !== index));
    } else if (category === "soft") {
      setSoftSkills(softSkills.filter((_, i) => i !== index));
    } else if (category === "languages") {
      setLanguages(languages.filter((_, i) => i !== index));
    }
  };

  // Handle save action
  const handleSave = () => {
    onSave({
      technical: technicalSkills,
      soft: softSkills,
      languages: languages,
    });
  };

  // Render skill tags for a category
  const renderSkills = (category: keyof Skills, skills: string[]) => (
    <div className="flex flex-wrap gap-2 mb-2">
      {skills.map((skill, index) => (
        <div key={index} className="flex items-center bg-gray-100 p-2 rounded">
          <span>{skill}</span>
          <button
            type="button"
            onClick={() => removeSkill(category, index)}
            className="ml-2 text-red-600"
          >
            X
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Technical Skills */}
      <div>
        <h3 className="text-lg font-medium">Technical Skills</h3>
        {renderSkills("technical", technicalSkills)}
        <div className="flex gap-2">
          <Input
            value={newSkill.technical}
            onChange={(e) => setNewSkill({ ...newSkill, technical: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSkills("technical");
              }
            }}
            placeholder="Add technical skills, separated by commas"
          />
          <Button onClick={() => addSkills("technical")}>Add</Button>
        </div>
      </div>

      {/* Soft Skills */}
      <div>
        <h3 className="text-lg font-medium">Soft Skills</h3>
        {renderSkills("soft", softSkills)}
        <div className="flex gap-2">
          <Input
            value={newSkill.soft}
            onChange={(e) => setNewSkill({ ...newSkill, soft: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSkills("soft");
              }
            }}
            placeholder="Add soft skills, separated by commas"
          />
          <Button onClick={() => addSkills("soft")}>Add</Button>
        </div>
      </div>

      {/* Languages */}
      <div>
        <h3 className="text-lg font-medium">Languages</h3>
        {renderSkills("languages", languages)}
        <div className="flex gap-2">
          <Input
            value={newSkill.languages}
            onChange={(e) => setNewSkill({ ...newSkill, languages: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSkills("languages");
              }
            }}
            placeholder="Add languages, separated by commas"
          />
          <Button onClick={() => addSkills("languages")}>Add</Button>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Skills</Button>
      </div>
    </div>
  );
};

// ProjectsForm Component
const ProjectsForm: React.FC<{
  data: Project[];
  onSave: (projects: Project[]) => void;
  isSaving: boolean;
}> = ({ data, onSave, isSaving }) => {
  const { control, handleSubmit, reset, register } = useForm<{ projects: Project[] }>({
    defaultValues: { projects: data },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "projects",
  });

  useEffect(() => {
    reset({ projects: data });
  }, [data, reset]);

  const onSubmit = (formData: { projects: Project[] }) => {
    onSave(formData.projects);
  };

  return (
    <div className="space-y-6">
      {fields.map((field, index) => (
        <div key={field.id} className="p-4 border rounded space-y-4">
          <Input
            label="Project Name"
            {...register(`projects.${index}.name`, { required: "Project name is required" })}
          />
          <textarea
            className="block w-full rounded-md border border-gray-300 py-2 px-3"
            rows={3}
            placeholder="Description"
            {...register(`projects.${index}.description`)}
          ></textarea>
          <Input
            label="Link"
            {...register(`projects.${index}.link`)}
          />
          <Controller
            control={control}
            name={`projects.${index}.technologies`}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700">Technologies</label>
                {field.value.map((tech, tIndex) => (
                  <div key={tIndex} className="flex items-center mb-2">
                    <Input
                      value={tech}
                      onChange={(e) => {
                        const newTechs = [...field.value];
                        newTechs[tIndex] = e.target.value;
                        field.onChange(newTechs);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => field.onChange(field.value.filter((_, i) => i !== tIndex))}
                      className="ml-2 text-red-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => field.onChange([...field.value, ""])}
                  className="text-blue-600"
                >
                  Add Technology
                </button>
              </div>
            )}
          />
          <Controller
            control={control}
            name={`projects.${index}.highlights`}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700">Highlights</label>
                {field.value.map((highlight, hIndex) => (
                  <div key={hIndex} className="flex items-center mb-2">
                    <Input
                      value={highlight}
                      onChange={(e) => {
                        const newHighlights = [...field.value];
                        newHighlights[hIndex] = e.target.value;
                        field.onChange(newHighlights);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => field.onChange(field.value.filter((_, i) => i !== hIndex))}
                      className="ml-2 text-red-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => field.onChange([...field.value, ""])}
                  className="text-blue-600"
                >
                  Add Highlight
                </button>
              </div>
            )}
          />
          <button
            type="button"
            onClick={() => remove(index)}
            className="text-red-600 hover:text-red-800"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          append({
            name: "",
            description: "",
            link: "",
            technologies: [],
            highlights: [],
          })
        }
        className="text-blue-600 hover:text-blue-800"
      >
        Add Project
      </button>
      <div className="flex justify-end">
        <Button
          variant="primary"
          leftIcon={<Save className="h-5 w-5" />}
          onClick={handleSubmit(onSubmit)}
          isLoading={isSaving}
          disabled={isSaving}
        >
          Save Projects
        </Button>
      </div>
    </div>
  );
};

// CertificationsForm Component
const CertificationsForm: React.FC<{
  data: Certification[];
  onSave: (certifications: Certification[]) => void;
  isSaving: boolean;
}> = ({ data, onSave, isSaving }) => {
  const { control, handleSubmit, reset, register } = useForm<{ certifications: Certification[] }>({
    defaultValues: { certifications: data },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "certifications",
  });

  useEffect(() => {
    reset({ certifications: data });
  }, [data, reset]);

  const onSubmit = (formData: { certifications: Certification[] }) => {
    onSave(formData.certifications);
  };

  return (
    <div className="space-y-6">
      {fields.map((field, index) => (
        <div key={field.id} className="p-4 border rounded space-y-4">
          <Input
            label="Certification Name"
            {...register(`certifications.${index}.name`, { required: "Name is required" })}
          />
          <Input
            label="Issuer"
            {...register(`certifications.${index}.issuer`, { required: "Issuer is required" })}
          />
          <Input
            label="Date"
            type="date"
            {...register(`certifications.${index}.date`)}
          />
          <Input
            label="Link"
            {...register(`certifications.${index}.link`)}
          />
          <button
            type="button"
            onClick={() => remove(index)}
            className="text-red-600 hover:text-red-800"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          append({
            name: "",
            issuer: "",
            date: "",
            link: "",
          })
        }
        className="text-blue-600 hover:text-blue-800"
      >
        Add Certification
      </button>
      <div className="flex justify-end">
        <Button
          variant="primary"
          leftIcon={<Save className="h-5 w-5" />}
          onClick={handleSubmit(onSubmit)}
          isLoading={isSaving}
          disabled={isSaving}
        >
          Save Certifications
        </Button>
      </div>
    </div>
  );
};

// Main Profile Component
const Profile: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("basic");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    basic: {
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
      location: "",
      website: "",
      title: "",
      bio: "",
    },
    education: [],
    experience: [],
    skills: { technical: [], soft: [], languages: [] },
    projects: [],
    certifications: [],
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/api/users/profile");
      setProfileData({
        basic: { ...profileData.basic, ...response.data.basic },
        education: response.data.education || [],
        experience: response.data.experience || [],
        skills: response.data.skills || { technical: [], soft: [], languages: [] },
        projects: response.data.projects || [],
        certifications: response.data.certifications || [],
      });
    } catch (error) {
      console.error("Error fetching profile data:", error);
      showToast("Failed to load profile data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfileSection = async (sectionName: keyof ProfileData, sectionData: any) => {
    setIsSaving(true);
    try {
      const updatedProfileData = { ...profileData, [sectionName]: sectionData };
      await api.put("/api/users/profile", updatedProfileData);
      setProfileData(updatedProfileData);
      showToast(`${sectionName} updated successfully`, "success");
    } catch (error) {
      console.error(`Error updating ${sectionName}:`, error);
      showToast(`Failed to update ${sectionName}`, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: "basic", label: "Basic Information", icon: <User className="h-5 w-5" /> },
    { id: "education", label: "Education", icon: <GraduationCap className="h-5 w-5" /> },
    { id: "experience", label: "Experience", icon: <Briefcase className="h-5 w-5" /> },
    { id: "skills", label: "Skills", icon: <Globe className="h-5 w-5" /> },
    { id: "projects", label: "Projects", icon: <FolderGit2 className="h-5 w-5" /> },
    { id: "certifications", label: "Certifications", icon: <Award className="h-5 w-5" /> },
  ];

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
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">Manage your personal information and resume details</p>
      </header>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`
                  flex items-center py-4 px-6 text-sm font-medium transition-colors whitespace-nowrap
                  ${activeTab === tab.id ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}
                `}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-6">
          {activeTab === "basic" && (
            <BasicInfoForm
              data={profileData.basic}
              onSave={(data) => updateProfileSection("basic", data)}
              isSaving={isSaving}
            />
          )}
          {activeTab === "education" && (
            <EducationForm
              data={profileData.education}
              onSave={(education) => updateProfileSection("education", education)}
              isSaving={isSaving}
            />
          )}
          {activeTab === "experience" && (
            <ExperienceForm
              data={profileData.experience}
              onSave={(experience) => updateProfileSection("experience", experience)}
              isSaving={isSaving}
            />
          )}
          {activeTab === "skills" && (
            <SkillsForm
              initialData={profileData.skills}
              onSave={(skills) => updateProfileSection("skills", skills)}
            />
          )}
          {activeTab === "projects" && (
            <ProjectsForm
              data={profileData.projects}
              onSave={(projects) => updateProfileSection("projects", projects)}
              isSaving={isSaving}
            />
          )}
          {activeTab === "certifications" && (
            <CertificationsForm
              data={profileData.certifications}
              onSave={(certs) => updateProfileSection("certifications", certs)}
              isSaving={isSaving}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;