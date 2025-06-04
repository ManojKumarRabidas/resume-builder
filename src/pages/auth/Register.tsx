import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const { register: registerField, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });
  
  const password = watch('password');
  
  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      await register(data.name, data.email, data.password);
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white p-8 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create an account</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Full Name"
          leftIcon={<User className="h-5 w-5" />}
          fullWidth
          error={errors.name?.message}
          {...registerField('name', { 
            required: 'Name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters'
            }
          })}
        />
        
        <Input
          label="Email"
          type="email"
          leftIcon={<Mail className="h-5 w-5" />}
          fullWidth
          error={errors.email?.message}
          {...registerField('email', { 
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
        />
        
        <Input
          label="Password"
          type="password"
          leftIcon={<Lock className="h-5 w-5" />}
          fullWidth
          error={errors.password?.message}
          {...registerField('password', { 
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters'
            }
          })}
        />
        
        <Input
          label="Confirm Password"
          type="password"
          leftIcon={<Lock className="h-5 w-5" />}
          fullWidth
          error={errors.confirmPassword?.message}
          {...registerField('confirmPassword', { 
            required: 'Please confirm your password',
            validate: value => value === password || 'Passwords do not match'
          })}
        />
        
        <Button
          type="submit"
          variant="primary"
          fullWidth
          size="lg"
          isLoading={isLoading}
        >
          Sign up
        </Button>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Log in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;