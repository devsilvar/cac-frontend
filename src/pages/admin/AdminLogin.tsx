import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  EyeIcon,
  EyeSlashIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import { useAdminAuth } from '../../hooks/useAdminAuth';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoggingIn(true);
    try {
      const success = await login(email, password);
      if (success) {
        // Navigation will happen via useEffect when isAuthenticated changes
        // But we can also navigate here for immediate feedback
        navigate('/admin/dashboard', { replace: true });
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        {/* Back to Home */}
        <Link
          to='/'
          className='inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors'
        >
          <ArrowLeftIcon className='w-4 h-4 mr-2' />
          Back to Home
        </Link>

        {/* Logo and Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='text-center'
        >
          <div className='mx-auto mb-6 flex justify-center'>
            <img 
              src='/logo-wallx.png' 
              alt='WallX Logo' 
              className='h-20 w-auto'
            />
          </div>
          <h2 className='text-3xl font-bold text-gray-900'>Admin Portal</h2>
          <p className='mt-2 text-gray-600'>
            Sign in to manage your business API
          </p>
        </motion.div>
      </div>

      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='bg-white py-8 px-4 shadow-lg sm:rounded-2xl sm:px-10'
        >
          <form className='space-y-6' onSubmit={handleSubmit}>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm'
              >
                {error}
              </motion.div>
            )}

            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Email address
              </label>
              <input
                id='email'
                name='email'
                type='email'
                autoComplete='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors'
                placeholder='admin@yourcompany.com'
              />
            </div>

            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Password
              </label>
              <div className='relative'>
                <input
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  autoComplete='current-password'
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='appearance-none block w-full px-3 py-3 pr-10 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors'
                  placeholder='Your secure password'
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-0 pr-3 flex items-center'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className='h-5 w-5 text-gray-400 hover:text-gray-600' />
                  ) : (
                    <EyeIcon className='h-5 w-5 text-gray-400 hover:text-gray-600' />
                  )}
                </button>
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <input
                  id='remember-me'
                  name='remember-me'
                  type='checkbox'
                  className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                />
                <label
                  htmlFor='remember-me'
                  className='ml-2 block text-sm text-gray-700'
                >
                  Remember me
                </label>
              </div>

              <div className='text-sm'>
                <a
                  href='#'
                  className='font-medium text-blue-600 hover:text-blue-500'
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <motion.button
                whileHover={!isLoggingIn ? { scale: 1.02 } : {}}
                whileTap={!isLoggingIn ? { scale: 0.98 } : {}}
                type='submit'
                disabled={isLoggingIn}
                className='group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
              >
                {isLoggingIn ? (
                  <div className='flex items-center'>
                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2'></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </motion.button>
            </div>
          </form>

          {/* Demo Credentials */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className='mt-6 p-4 bg-gray-50 rounded-lg'
          >
            {/* <h3 className='text-sm font-medium text-gray-700 mb-2'>
              Demo Credentials:
            </h3> */}
            {/* <div className="text-xs text-gray-600 space-y-1">
              <p><strong>Email:</strong> admin@yourcompany.com</p>
              <p><strong>Password:</strong> YourSecurePassword123!</p>
            </div> */}
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className='mt-6 text-center'
        >
          <p className='text-sm text-gray-600'>
            Need help?{' '}
            <a
              href='#'
              className='font-medium text-primary-600 hover:text-primary-500'
            >
              Contact Support
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
