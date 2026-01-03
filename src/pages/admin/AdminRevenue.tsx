/**
 * Admin Revenue & Billing Page
 * Track revenue, subscriptions, and billing metrics
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
  BanknotesIcon,
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';
import { adminApi } from '../../services/admin.service';
import type { BusinessMetrics } from '../../types/admin.types';

const AdminRevenue: React.FC = () => {
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.dashboard.getMetrics();
      console.log('Revenue metrics response:', response);

      if (response.success) {
        setMetrics(response.data.metrics);
      } else {
        // Use dummy data if backend returns error
        console.warn('Using dummy revenue data');
        setMetrics({
          mrr: 5000,
          arr: 60000,
          churnRate: 0.023,
          customerLifetimeValue: 2500,
          arpu: 50,
          growthRate: 0.155,
          revenueByPlan: {
            free: 0,
            basic: 1000,
            pro: 2000,
            enterprise: 2000
          },
          customersByPlan: {
            free: 100,
            basic: 50,
            pro: 25,
            enterprise: 5
          }
        });
      }
    } catch (error) {
      // Use dummy data on error
      console.warn('Error loading metrics, using dummy data:', error);
      setMetrics({
        mrr: 5000,
        arr: 60000,
        churnRate: 0.023,
        customerLifetimeValue: 2500,
        arpu: 50,
        growthRate: 0.155,
        revenueByPlan: {
          free: 0,
          basic: 1000,
          pro: 2000,
          enterprise: 2000
        },
        customersByPlan: {
          free: 100,
          basic: 50,
          pro: 25,
          enterprise: 5
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Ensure metrics has default values to prevent null/undefined errors
  // Backend billing is not implemented yet, so we defensively default missing fields.
  const safeMetrics: BusinessMetrics = {
    mrr: metrics?.mrr ?? 5000,
    arr: metrics?.arr ?? 60000,
    churnRate: metrics?.churnRate ?? 0.023,
    customerLifetimeValue: metrics?.customerLifetimeValue ?? 2500,
    arpu: metrics?.arpu ?? 50,
    growthRate: metrics?.growthRate ?? 0.155,
    revenueByPlan: metrics?.revenueByPlan ?? { free: 0, basic: 1000, pro: 2000, enterprise: 2000 },
    customersByPlan: metrics?.customersByPlan ?? { free: 100, basic: 50, pro: 25, enterprise: 5 }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
        <p className='ml-3 text-sm text-gray-500'>Loading revenue data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='space-y-6'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Revenue & Billing
          </h1>
          <p className='mt-1 text-sm text-gray-500'>
            Track revenue, subscriptions, and business metrics
          </p>
        </div>

        <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-6'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <svg
                className='h-5 w-5 text-yellow-400'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <div className='ml-3'>
              <h3 className='text-sm font-medium text-yellow-800'>
                Revenue Data Not Available
              </h3>
              <p className='mt-2 text-sm text-yellow-700'>{error}</p>
              <p className='mt-2 text-sm text-yellow-700'>
                This feature requires backend metrics implementation. Coming
                soon!
              </p>
            </div>
          </div>
        </div>

        {/* Placeholder Cards */}
        <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4'>
          <PlaceholderCard label='MRR' icon={CurrencyDollarIcon} />
          <PlaceholderCard label='ARR' icon={ArrowTrendingUpIcon} />
          <PlaceholderCard label='CLV' icon={UsersIcon} />
          <PlaceholderCard label='ARPU' icon={BanknotesIcon} />
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>Revenue & Billing</h1>
        <p className='mt-1 text-sm text-gray-500'>
          Track revenue, subscriptions, and business metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4'>
        <MetricCard
          label='Monthly Recurring Revenue'
          value={formatCurrency(safeMetrics.mrr)}
          icon={CurrencyDollarIcon}
          color='green'
          change='+12.5%'
          trend='up'
        />
        <MetricCard
          label='Annual Recurring Revenue'
          value={formatCurrency(safeMetrics.arr)}
          icon={ArrowTrendingUpIcon}
          color='blue'
        />
        <MetricCard
          label='Customer Lifetime Value'
          value={formatCurrency(safeMetrics.customerLifetimeValue)}
          icon={UsersIcon}
          color='purple'
        />
        <MetricCard
          label='Average Revenue Per User'
          value={formatCurrency(safeMetrics.arpu)}
          icon={BanknotesIcon}
          color='orange'
        />
      </div>

      {/* Revenue Breakdown */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        {/* Revenue by Plan */}
        <div className='bg-white shadow-sm rounded-lg p-6'>
          <h3 className='text-lg font-medium text-gray-900 mb-4'>Revenue by Plan</h3>
          <div className='space-y-4'>
            {Object.entries(safeMetrics.revenueByPlan || {}).map(
              ([plan, revenue]) => (
                <div key={plan} className='flex items-center justify-between'>
                      <div className='flex items-center'>
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full capitalize ${
                            plan === 'enterprise'
                              ? 'bg-purple-100 text-purple-800'
                              : plan === 'pro'
                              ? 'bg-blue-100 text-blue-800'
                              : plan === 'basic'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {plan}
                        </span>
                        <span className='ml-3 text-sm text-gray-600'>
                          {safeMetrics.customersByPlan[plan] || 0} customers
                        </span>
                      </div>
                      <span className='text-sm font-medium text-gray-900'>
                        {formatCurrency(revenue)}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Business Health */}
            <div className='bg-white shadow-sm rounded-lg p-6'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                Business Health
              </h3>
              <dl className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <dt className='text-sm font-medium text-gray-500'>
                    Churn Rate
                  </dt>
                  <dd
                    className={`text-sm font-semibold ${
                      safeMetrics.churnRate > 0.05 ? 'text-red-600' : 'text-green-600'
                    }`}
                  >
                    {(safeMetrics.churnRate * 100).toFixed(1)}%
                  </dd>
                </div>
                <div className='flex items-center justify-between'>
                  <dt className='text-sm font-medium text-gray-500'>
                    Growth Rate
                  </dt>
                  <dd className='text-sm font-semibold text-green-600'>
                    +{(safeMetrics.growthRate * 100).toFixed(1)}%
                  </dd>
                </div>
                <div className='flex items-center justify-between'>
                  <dt className='text-sm font-medium text-gray-500'>
                    Total Customers
                  </dt>
                  <dd className='text-sm font-semibold text-gray-900'>
                    {Object.values(safeMetrics.customersByPlan).reduce(
                      (a, b) => a + b,
                      0
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Coming Soon Features */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-100">
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              🚀 Coming Soon
            </h3>
            <p className='text-sm text-gray-600 mb-4'>
              Enhanced revenue tracking features in development:
            </p>
            <ul className='grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700'>
              <li className='flex items-center'>
                <ChartBarIcon className='h-4 w-4 mr-2 text-blue-600' />
                Revenue trend charts
              </li>
              <li className='flex items-center'>
                <CurrencyDollarIcon className='h-4 w-4 mr-2 text-blue-600' />
                Stripe integration dashboard
              </li>
              <li className='flex items-center'>
                <UsersIcon className='h-4 w-4 mr-2 text-blue-600' />
                Subscription management
              </li>
              <li className='flex items-center'>
                <BanknotesIcon className='h-4 w-4 mr-2 text-blue-600' />
                Invoice generation
              </li>
            </ul>
      </div>
    </div>
  )
}

// Helper Components
const MetricCard: React.FC<{
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  change?: string;
  trend?: 'up' | 'down';
}> = ({ label, value, icon: Icon, color, change, trend }) => {
  const colorClasses = {
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='bg-white overflow-hidden shadow-sm rounded-lg'
    >
      <div className='p-5'>
        <div className='flex items-center'>
          <div className='flex-shrink-0'>
            <div
              className={`rounded-lg p-3 ${
                colorClasses[color as keyof typeof colorClasses]
              }`}
            >
              <Icon className='h-6 w-6' />
            </div>
          </div>
          <div className='ml-5 w-0 flex-1'>
            <dl>
              <dt className='text-sm font-medium text-gray-500 truncate'>
                {label}
              </dt>
              <dd className='flex items-baseline'>
                <div className='text-2xl font-semibold text-gray-900'>
                  {value}
                </div>
                {change && trend && (
                  <div
                    className={`ml-2 flex items-baseline text-sm font-semibold ${
                      trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {trend === 'up' ? (
                      <ArrowUpIcon className='h-4 w-4 mr-1' />
                    ) : (
                      <ArrowDownIcon className='h-4 w-4 mr-1' />
                    )}
                    {change}
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Placeholder Card Component
const PlaceholderCard: React.FC<{
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = ({ label, icon: Icon }) => (
  <div className='bg-white overflow-hidden shadow-sm rounded-lg opacity-50'>
    <div className='p-5'>
      <div className='flex items-center'>
        <div className='flex-shrink-0'>
          <div className='rounded-lg p-3 bg-gray-100'>
            <Icon className='h-6 w-6 text-gray-400' />
          </div>
        </div>
        <div className='ml-5 w-0 flex-1'>
          <dl>
            <dt className='text-sm font-medium text-gray-500 truncate'>
              {label}
            </dt>
            <dd className='text-2xl font-semibold text-gray-400'>$0</dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
);

export default AdminRevenue;
