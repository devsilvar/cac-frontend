/**
 * Admin Settings Page
 * Placeholder for future system settings
 */

import React from 'react';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

const AdminSettings: React.FC = () => {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>Settings</h1>
        <p className='mt-1 text-sm text-gray-500'>
          System settings and configurations
        </p>
      </div>
      <div className='bg-white shadow-sm rounded-lg p-12 text-center'>
        <Cog6ToothIcon className='mx-auto h-12 w-12 text-gray-400' />
        <h3 className='mt-2 text-sm font-medium text-gray-900'>
          Settings Coming Soon
        </h3>
        <p className='mt-1 text-sm text-gray-500'>
          Advanced system settings will be available here
        </p>
      </div>
    </div>
  );
};

export default AdminSettings;
