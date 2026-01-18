import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  UsersIcon,
  KeyIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline'
import { adminApi } from '../../services/admin.service'
import type { DashboardOverview, UsageOverview } from '../../types/admin.types'

const AdminDashboard: React.FC = () => {
  const [overview, setOverview] = useState<DashboardOverview | null>(null)
  const [usage, setUsage] = useState<UsageOverview | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const [overviewRes, usageRes] = await Promise.all([
        adminApi.dashboard.getOverview(),
        adminApi.dashboard.getUsageOverview(),
      ])
      
      if (overviewRes.success) {
        setOverview(overviewRes.data.overview)
      }
      
      if (usageRes.success) {
        setUsage(usageRes.data.usage)
      }
    } catch (error) {
      console.error('Failed to load dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-sm text-gray-500">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor your platform performance and metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Customers"
          value={overview?.totalCustomers || 0}
          change="+12%"
          trend="up"
          icon={UsersIcon}
          color="blue"
        />
        <StatCard
          label="Active Customers"
          value={overview?.activeCustomers || 0}
          subtitle={`${overview?.suspendedCustomers || 0} suspended`}
          icon={ChartBarIcon}
          color="green"
        />
        <StatCard
          label="API Calls (Month)"
          value={overview?.apiCallsThisMonth || 0}
          subtitle={`${overview?.apiCallsToday || 0} today`}
          icon={ArrowTrendingUpIcon}
          color="purple"
        />
        <StatCard
          label="Revenue"
          value={`₦${((overview?.revenue || 0) / 100).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtitle={`₦${((overview?.revenueThisMonth || 0) / 100).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} this month`}
          icon={KeyIcon}
          color="orange"
        />
      </div>

      {/* Usage Overview */}
      {usage && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Top Endpoints</h3>
            <div className="space-y-3">
              {usage.topEndpoints.slice(0, 5).map((endpoint, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{endpoint.endpoint}</p>
                    <p className="text-xs text-gray-500">{endpoint.count} calls</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{endpoint.avgResponseTime}ms</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white shadow-sm rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Top Customers</h3>
            <div className="space-y-3">
              {usage.topCustomers.slice(0, 5).map((customer, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{customer.company || customer.email}</p>
                    <p className="text-xs text-gray-500">{customer.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{customer.calls} calls</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/customers"
          className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UsersIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Manage Customers</h3>
              <p className="text-sm text-gray-500">View and manage all customers</p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/revenue"
          className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Revenue & Billing</h3>
              <p className="text-sm text-gray-500">Track revenue and subscriptions</p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/monitoring"
          className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">System Monitoring</h3>
              <p className="text-sm text-gray-500">View system stats and logs</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

// Helper Components
const StatCard: React.FC<{
  label: string
  value: number | string
  change?: string
  trend?: 'up' | 'down'
  subtitle?: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}> = ({ label, value, change, trend, subtitle, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  }

  // Format large numbers to prevent overflow
  const formatValue = (val: number | string): string => {
    if (typeof val === 'string') return val
    
    // For numbers >= 1 million, show in compact format
    if (val >= 1000000) {
      return `${(val / 1000000).toFixed(1)}M`
    }
    // For numbers >= 10,000, show in compact format
    if (val >= 10000) {
      return `${(val / 1000).toFixed(1)}K`
    }
    return val.toLocaleString()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white overflow-hidden shadow-sm rounded-lg"
    >
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`rounded-lg p-3 ${colorClasses[color as keyof typeof colorClasses]}`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1 min-w-0">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{label}</dt>
              <dd className="flex items-baseline flex-wrap gap-1">
                <div className="text-2xl font-semibold text-gray-900 break-words">
                  {typeof value === 'number' ? formatValue(value) : value}
                </div>
                {change && trend && (
                  <div className={`flex items-baseline text-sm font-semibold whitespace-nowrap ${
                    trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {trend === 'up' ? (
                      <ArrowUpIcon className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4 mr-1" />
                    )}
                    {change}
                  </div>
                )}
              </dd>
              {subtitle && (
                <dd className="text-xs text-gray-500 mt-1 truncate" title={subtitle}>{subtitle}</dd>
              )}
            </dl>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default AdminDashboard