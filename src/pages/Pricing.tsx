import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_PRICING, formatNaira } from '../config/apiPricing';
import Navigation from '../components/Navigation';

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen bg-white'>
      {/* Global Navigation */}
      <Navigation />

      {/* Hero Section */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        <div className='text-center'>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            API Pricing
          </h1>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
            Pay only for what you use. No subscriptions, no monthly fees.
          </p>
        </div>
      </div>

      {/* API Pricing Table */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-gray-900 mb-2'>
            All API Endpoints
          </h2>
          <p className='text-gray-600'>
            Transparent per-call pricing for every service
          </p>
        </div>

        {/* Identity Verification APIs */}
        <div className='mb-12'>
          <h3 className='text-xl font-semibold text-gray-900 mb-6'>
            Identity Verification
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            <div className='bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200'>
              <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4'>
                <svg
                  className='w-6 h-6 text-blue-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
                  />
                </svg>
              </div>
              <h4 className='font-semibold text-gray-900 text-lg mb-2'>
                BVN Verification (Basic)
              </h4>
              <p className='text-sm text-gray-600 mb-4'>
                Verify Bank Verification Number with basic details
              </p>
              <div className='border-t border-gray-200 pt-4 mt-4'>
                <div className='flex items-baseline justify-between'>
                  <span className='text-3xl font-bold text-gray-900'>₦200</span>
                  <span className='text-sm text-gray-500'>per call</span>
                </div>
                <p className='text-xs text-gray-500 mt-2'>⚡ 2-3 seconds</p>
              </div>
            </div>

            <div className='bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200'>
              <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4'>
                <svg
                  className='w-6 h-6 text-purple-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2'
                  />
                </svg>
              </div>
              <h4 className='font-semibold text-gray-900 text-lg mb-2'>
                Passport + Face Verification
              </h4>
              <p className='text-sm text-gray-600 mb-4'>
                Verify Nigerian passport and match face photo
              </p>
              <div className='border-t border-gray-200 pt-4 mt-4'>
                <div className='flex items-baseline justify-between'>
                  <span className='text-3xl font-bold text-gray-900'>₦500</span>
                  <span className='text-sm text-gray-500'>per call</span>
                </div>
                <p className='text-xs text-gray-500 mt-2'>⚡ 3-5 seconds</p>
              </div>
            </div>

            <div className='bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200'>
              <div className='w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4'>
                <svg
                  className='w-6 h-6 text-indigo-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                  />
                </svg>
              </div>
              <h4 className='font-semibold text-gray-900 text-lg mb-2'>
                Driver's License + Face
              </h4>
              <p className='text-sm text-gray-600 mb-4'>
                Verify driver's license and match face photo
              </p>
              <div className='border-t border-gray-200 pt-4 mt-4'>
                <div className='flex items-baseline justify-between'>
                  <span className='text-3xl font-bold text-gray-900'>₦500</span>
                  <span className='text-sm text-gray-500'>per call</span>
                </div>
                <p className='text-xs text-gray-500 mt-2'>⚡ 3-5 seconds</p>
              </div>
            </div>

            <div className='bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200'>
              <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4'>
                <svg
                  className='w-6 h-6 text-blue-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                  />
                </svg>
              </div>
              <h4 className='font-semibold text-gray-900 text-lg mb-2'>
                NIN Verification
              </h4>
              <p className='text-sm text-gray-600 mb-4'>
                Verify National Identification Number
              </p>
              <div className='border-t border-gray-200 pt-4 mt-4'>
                <div className='flex items-baseline justify-between'>
                  <span className='text-3xl font-bold text-gray-900'>₦300</span>
                  <span className='text-sm text-gray-500'>per call</span>
                </div>
                <p className='text-xs text-gray-500 mt-2'>⚡ 2-4 seconds</p>
              </div>
            </div>
          </div>
        </div>

        {/* Business Registration APIs */}
        <div className='mb-12'>
          <h3 className='text-xl font-semibold text-gray-900 mb-6'>
            Business Registration
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            <div className='bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200'>
              <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4'>
                <svg
                  className='w-6 h-6 text-green-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                  />
                </svg>
              </div>
              <h4 className='font-semibold text-gray-900 text-lg mb-2'>
                Business Name Search
              </h4>
              <p className='text-sm text-gray-600 mb-4'>
                Check business name availability in CAC database
              </p>
              <div className='border-t border-gray-200 pt-4 mt-4'>
                <div className='flex items-baseline justify-between'>
                  <span className='text-3xl font-bold text-gray-900'>₦150</span>
                  <span className='text-sm text-gray-500'>per call</span>
                </div>
                <p className='text-xs text-gray-500 mt-2'>⚡ 2-3 seconds</p>
              </div>
            </div>

            <div className='bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200'>
              <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4'>
                <svg
                  className='w-6 h-6 text-green-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                  />
                </svg>
              </div>
              <h4 className='font-semibold text-gray-900 text-lg mb-2'>
                Business Name Registration
              </h4>
              <p className='text-sm text-gray-600 mb-4'>
                Register a business name with CAC
              </p>
              <div className='border-t border-gray-200 pt-4 mt-4'>
                <div className='flex items-baseline justify-between'>
                  <span className='text-3xl font-bold text-gray-900'>₦40</span>
                  <span className='text-sm text-gray-500'>per call</span>
                </div>
                <p className='text-xs text-gray-500 mt-2'>⚡ 1-2 seconds</p>
              </div>
            </div>

            <div className='bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200'>
              <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4'>
                <svg
                  className='w-6 h-6 text-green-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
                  />
                </svg>
              </div>
              <h4 className='font-semibold text-gray-900 text-lg mb-2'>
                Company Registration
              </h4>
              <p className='text-sm text-gray-600 mb-4'>
                Submit company registration with witnesses
              </p>
              <div className='border-t border-gray-200 pt-4 mt-4'>
                <div className='flex items-baseline justify-between'>
                  <span className='text-3xl font-bold text-gray-900'>₦100</span>
                  <span className='text-sm text-gray-500'>per call</span>
                </div>
                <p className='text-xs text-gray-500 mt-2'>⚡ 2-3 seconds</p>
              </div>
            </div>

            <div className='bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200'>
              <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4'>
                <svg
                  className='w-6 h-6 text-green-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'
                  />
                </svg>
              </div>
              <h4 className='font-semibold text-gray-900 text-lg mb-2'>
                Registration Status Check
              </h4>
              <p className='text-sm text-gray-600 mb-4'>
                Check status of business/company registration
              </p>
              <div className='border-t border-gray-200 pt-4 mt-4'>
                <div className='flex items-baseline justify-between'>
                  <span className='text-3xl font-bold text-gray-900'>₦20</span>
                  <span className='text-sm text-gray-500'>per call</span>
                </div>
                <p className='text-xs text-gray-500 mt-2'>⚡ &lt;1 second</p>
              </div>
            </div>
          </div>
        </div>

        {/* Utility APIs */}
        <div>
          <h3 className='text-xl font-semibold text-gray-900 mb-6'>
            Utilities
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            <div className='bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200'>
              <div className='w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4'>
                <svg
                  className='w-6 h-6 text-gray-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
                  />
                </svg>
              </div>
              <h4 className='font-semibold text-gray-900 text-lg mb-2'>
                CAC Store Products
              </h4>
              <p className='text-sm text-gray-600 mb-4'>
                Get available CAC registration products
              </p>
              <div className='border-t border-gray-200 pt-4 mt-4'>
                <div className='flex items-baseline justify-between'>
                  <span className='text-3xl font-bold text-gray-900'>₦10</span>
                  <span className='text-sm text-gray-500'>per call</span>
                </div>
                <p className='text-xs text-gray-500 mt-2'>⚡ &lt;1 second</p>
              </div>
            </div>

            <div className='bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200'>
              <div className='w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4'>
                <svg
                  className='w-6 h-6 text-gray-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
              <h4 className='font-semibold text-gray-900 text-lg mb-2'>
                API Health Check
              </h4>
              <p className='text-sm text-gray-600 mb-4'>
                Check API availability and your authentication
              </p>
              <div className='border-t border-gray-200 pt-4 mt-4'>
                <div className='flex items-baseline justify-between'>
                  <span className='text-3xl font-bold text-green-600'>
                    Free
                  </span>
                  <span className='text-sm text-gray-500'>unlimited</span>
                </div>
                <p className='text-xs text-gray-500 mt-2'>⚡ &lt;1 second</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        <div className='bg-[#473893] rounded-xl p-12 text-center text-white'>
          <h2 className='text-3xl font-bold mb-4'>
            Get started with ₦10,000 free credits
          </h2>
          <p className='text-purple-200 mb-8'>
            No credit card required. Start testing instantly.
          </p>
          <button
            onClick={() => navigate('/customer/signup')}
            className='px-8 py-3 bg-white text-[#473893] font-semibold rounded-lg hover:bg-gray-100 transition-colors'
          >
            Create Free Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
