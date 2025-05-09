import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, BookOpen } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    rollNumber?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  
  const { signup, loading, error } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: {
      name?: string;
      email?: string;
      rollNumber?: string;
      password?: string;
      confirmPassword?: string;
    } = {};
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!email.endsWith('@iitp.ac.in')) {
      newErrors.email = 'Please use your IIT Patna email';
      isValid = false;
    }

    if (!rollNumber.trim()) {
      newErrors.rollNumber = 'Roll number is required';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await signup(name, email, rollNumber, password);
        navigate('/'); // Redirect to home page after successful signup
      } catch (error) {
        // Error is handled by the auth context
        console.error('Signup failed:', error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-6">
            <span className="text-3xl font-bold text-orange-500">SWAP</span>
            <span className="text-3xl font-bold text-blue-900">SHOP</span>
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-orange-600 hover:text-orange-500">
              sign in to existing account
            </Link>
          </p>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 mt-8">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              id="name"
              type="text"
              label="Full Name"
              placeholder="John Doe"
              fullWidth
              leftIcon={<User className="h-5 w-5" />}
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
            />
            
            <Input
              id="email"
              type="email"
              label="Email Address"
              placeholder="yourname@iitp.ac.in"
              fullWidth
              leftIcon={<Mail className="h-5 w-5" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              helperText="You must use your IIT Patna email"
            />
            
            <Input
              id="rollNumber"
              type="text"
              label="Roll Number"
              placeholder="2001CS01"
              fullWidth
              leftIcon={<BookOpen className="h-5 w-5" />}
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              error={errors.rollNumber}
            />
            
            <Input
              id="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              fullWidth
              leftIcon={<Lock className="h-5 w-5" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              helperText="At least 6 characters"
            />
            
            <Input
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="••••••••"
              fullWidth
              leftIcon={<Lock className="h-5 w-5" />}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
            />
            
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                I agree to the{' '}
                <Link to="/terms" className="font-medium text-orange-600 hover:text-orange-500">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="font-medium text-orange-600 hover:text-orange-500">
                  Privacy Policy
                </Link>
              </label>
            </div>
            
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={loading}
            >
              Create Account
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;