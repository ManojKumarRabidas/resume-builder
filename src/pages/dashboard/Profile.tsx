import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Mail,
  User,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  GraduationCap,
  Save,
} from "lucide-react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import api from "../../services/api";
import { useToast } from "../../contexts/ToastContext";
import { useAuth } from "../../contexts/AuthContext";

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
}

interface Skills {
  technical: string[];
  soft: string[];
  languages: string[];
}

interface ProfileData {
  basic: ProfileFormValues;
  education: Education[];
  experience: Experience[];
  skills: Skills;
}

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
    skills: {
      technical: [],
      soft: [],
      languages: [],
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    defaultValues: profileData.basic,
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  useEffect(() => {
    reset(profileData.basic);
  }, [profileData.basic, reset]);

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/api/users/profile");

      // Merge with default values to ensure all properties exist
      setProfileData({
        basic: {
          ...profileData.basic,
          ...response.data.basic,
        },
        education: response.data.education || [],
        experience: response.data.experience || [],
        skills: response.data.skills || {
          technical: [],
          soft: [],
          languages: [],
        },
      });
    } catch (error) {
      console.error("Error fetching profile data:", error);
      showToast("Failed to load profile data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setIsSaving(true);

      // Update only the basic information section
      const updatedProfileData = {
        ...profileData,
        basic: data,
      };

      await api.put("/api/users/profile", updatedProfileData);
      setProfileData(updatedProfileData);
      showToast("Profile updated successfully", "success");
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast("Failed to update profile", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    {
      id: "basic",
      label: "Basic Information",
      icon: <User className="h-5 w-5" />,
    },
    {
      id: "education",
      label: "Education",
      icon: <GraduationCap className="h-5 w-5" />,
    },
    {
      id: "experience",
      label: "Experience",
      icon: <Briefcase className="h-5 w-5" />,
    },
    { id: "skills", label: "Skills", icon: <Globe className="h-5 w-5" /> },
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
        <p className="text-gray-600 mt-1">
          Manage your personal information and resume details
        </p>
      </header>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`
                  flex items-center py-4 px-6 text-sm font-medium transition-colors whitespace-nowrap
                  ${
                    activeTab === tab.id
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  type="submit"
                  variant="primary"
                  leftIcon={<Save className="h-5 w-5" />}
                  isLoading={isSaving}
                  disabled={!isDirty}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          )}

          {activeTab === "education" && (
            <div className="text-center py-10">
              <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-medium text-gray-900 mb-2">
                Education section
              </h2>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                This section is under development. You'll be able to add your
                education history here soon.
              </p>
            </div>
          )}

          {activeTab === "experience" && (
            <div className="text-center py-10">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-medium text-gray-900 mb-2">
                Experience section
              </h2>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                This section is under development. You'll be able to add your
                work experience here soon.
              </p>
            </div>
          )}

          {activeTab === "skills" && (
            <div className="text-center py-10">
              <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-medium text-gray-900 mb-2">
                Skills section
              </h2>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                This section is under development. You'll be able to add your
                skills here soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
