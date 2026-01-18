import React from 'react'
import CustomerDashboardLayout from '../../layouts/CustomerDashboardLayout'
import { BarChart3, TrendingUp, Activity, CheckCircle, XCircle } from 'lucide-react'
import { UsageProvider, useUsage } from '../../context/UsageContext'

const UsageContent: React.FC = () => {
  const { usage, loading, error, refreshUsage } = useUsage()

  const requestsToday = usage?.requestsToday ?? 0
  const requestsThisMonth = usage?.requestsThisMonth ?? 0
  const totalRequests = usage?.totalCalls ?? 0
  const successfulCalls = usage?.successfulCalls ?? 0
  const failedCalls = usage?.failedCalls ?? 0
  const successRate = usage?.successRate ? (usage.successRate * 100).toFixed(1) : '0.0'
  const errorRate = usage?.errorRate ? (usage.errorRate * 100).toFixed(1) : '0.0'
  const popular = usage?.popularEndpoints ?? []

  console.log('Usage data:', usage) // Debug log

  const stats = [
    { 
      title: 'Today', 
      value: requestsToday, 
      icon: Activity,
      color: 'bg-blue-100 text-blue-600',
      description: 'Requests in last 24h'
    },
    { 
      title: 'This Month', 
      value: requestsThisMonth, 
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-600',
      description: 'Total this month'
    },
    { 
      title: 'All Time', 
      value: totalRequests || 0, 
      icon: BarChart3,
      color: 'bg-green-100 text-green-600',
      description: 'Lifetime requests'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading usage data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Usage Data</h3>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button
            onClick={refreshUsage}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Usage & Analytics</h1>
            <p className="text-gray-600 mt-1">Monitor your API consumption and performance</p>
          </div>
          <button
            onClick={refreshUsage}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-gray-900 mb-1">{stat.title}</div>
              <div className="text-xs text-gray-600">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Popular Endpoints */}
        {popular.length > 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Most Used Endpoints</h2>
            </div>
            <div className="space-y-3">
              {popular.map((endpoint: any, idx: number) => {
                const percentage = totalRequests > 0 ? ((endpoint.count / totalRequests) * 100).toFixed(1) : 0
                return (
                  <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-semibold text-blue-600">#{idx + 1}</span>
                        </div>
                        <code className="text-sm font-mono text-gray-900">{endpoint.endpoint}</code>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{endpoint.count || 0} calls</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Usage Data Yet</h3>
            <p className="text-gray-600 mb-4">Start making API requests to see your usage analytics</p>
            <a 
              href="/docs" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              View API Documentation
            </a>
          </div>
        )}

        {/* Success/Error Rates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Success Rate</h3>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">{successRate}%</div>
            <p className="text-sm text-gray-600">
              {successfulCalls} successful / {failedCalls} failed
            </p>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: `${successRate}%` }}></div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">Error Rate</h3>
            </div>
            <div className="text-3xl font-bold text-red-600 mb-2">{errorRate}%</div>
            <p className="text-sm text-gray-600">
              {totalRequests > 0 ? 'This month' : 'No requests yet'}
            </p>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-red-600 h-2 rounded-full" style={{ width: `${errorRate}%` }}></div>
            </div>
          </div>
        </div>

        {/* Raw Data (Debug) */}
        {usage && Object.keys(usage).length > 0 && (
          <details className="bg-white rounded-xl border border-gray-200 p-6">
            <summary className="cursor-pointer text-sm font-semibold text-gray-900 hover:text-blue-600">
              View Raw Data (Debug)
            </summary>
            <pre className="mt-4 bg-gray-50 border rounded-lg p-4 text-xs overflow-auto max-h-96">
              {JSON.stringify(usage, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}

const CustomerUsage: React.FC = () => {
  return (
    <CustomerDashboardLayout>
      <UsageProvider>
        <UsageContent />
      </UsageProvider>
    </CustomerDashboardLayout>
  )
}

export default CustomerUsage
