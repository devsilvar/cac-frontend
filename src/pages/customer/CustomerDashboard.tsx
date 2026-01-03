import React, { useEffect, useMemo, useState } from 'react'
import CustomerDashboardLayout from '../../layouts/CustomerDashboardLayout'
import { useCustomerApi } from '../../hooks/useCustomerApi'
import { Link } from 'react-router-dom'
import { TrendingUp, Activity, Zap, Key, ArrowRight, Code, CheckCircle, AlertCircle } from 'lucide-react'

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || ''
const baseUrl = API_BASE ? API_BASE.replace(/\/$/, '') : ''

const CustomerDashboard: React.FC = () => {
  const api = useCustomerApi()
  const [usage, setUsage] = useState<any>({})
  const [keys, setKeys] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const [usageRes, keysRes] = await Promise.all([
          api.get<any>('/api/v1/customer/usage').catch(() => ({ data: { usage: {} } })),
          api.get<any>('/api/v1/customer/api-keys').catch(() => ({ data: { keys: [] } }))
        ])
        setUsage(usageRes?.data?.usage || usageRes?.usage || {})
        setKeys(keysRes?.data?.keys || keysRes?.keys || [])
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const requestsToday = usage?.requestsToday ?? usage?.today ?? 0
  const requestsThisMonth = usage?.requestsThisMonth ?? usage?.month ?? 0
  const popular = usage?.popularEndpoints ?? []
  const activeKeys = keys.filter(k => k.status === 'active').length

  const curlExample = useMemo(() => {
    return `curl -X POST "${baseUrl}/api/v1/name-search" \\
  -H "Authorization: Token ck_YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  --data '{"SearchType":"ALL","searchTerm":"DANGOTE","maxResults":3}'`
  }, [])

  // Stats cards data
  const stats = [
    {
      title: 'Requests Today',
      value: requestsToday,
      icon: Activity,
      color: 'blue',
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'This Month',
      value: requestsThisMonth,
      icon: TrendingUp,
      color: 'purple',
      trend: '+23%',
      trendUp: true
    },
    {
      title: 'Active API Keys',
      value: activeKeys,
      icon: Key,
      color: 'green',
      trend: keys.length > 0 ? `${keys.length} total` : 'None yet',
      trendUp: null
    },
    {
      title: 'Success Rate',
      value: '99.2%',
      icon: Zap,
      color: 'orange',
      trend: 'Excellent',
      trendUp: true
    }
  ]

  const quickActions = [
    { label: 'Create API Key', to: '/customer/api-keys', icon: Key, color: 'blue' },
    { label: 'View Documentation', to: '/docs', icon: Code, color: 'purple' },
    { label: 'Check Usage', to: '/customer/usage', icon: Activity, color: 'green' }
  ]

  if (loading) {
    return (
      <CustomerDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </CustomerDashboardLayout>
    )
  }

  return (
    <CustomerDashboardLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Monitor your API usage and manage your integration</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                {stat.trendUp !== null && (
                  <span className={`text-xs font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.trend}
                  </span>
                )}
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600 mt-1">{stat.title}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, idx) => (
              <Link
                key={idx}
                to={action.to}
                className="bg-white rounded-lg p-4 flex items-center gap-3 hover:shadow-md transition-all duration-200 group"
              >
                <div className={`w-10 h-10 bg-${action.color}-100 rounded-lg flex items-center justify-center`}>
                  <action.icon className={`w-5 h-5 text-${action.color}-600`} />
                </div>
                <span className="flex-1 font-medium text-gray-900">{action.label}</span>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* API Keys Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Your API Keys</h2>
              <Link to="/customer/api-keys" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View all
              </Link>
            </div>
            
            {keys.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">No API keys yet</p>
                <Link
                  to="/customer/api-keys"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Key className="w-4 h-4" />
                  Create your first key
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {keys.slice(0, 3).map((k: any) => (
                    <div key={k.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${k.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{k.name || 'API Key'}</div>
                          <div className="text-xs text-gray-500">{k.keyPrefix || 'ck_'}****{k.lastFour || ''}</div>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        k.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {k.status}
                      </span>
                    </div>
                  ))}
                </div>
                <Link
                  to="/customer/api-keys"
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                >
                  Manage all keys
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>

          {/* API Example Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Code className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">Quick Start Example</h2>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Use your API key to make requests. Here's a name search example:
            </p>
            <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs overflow-x-auto">
              {curlExample}
            </pre>
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Replace <code className="bg-gray-100 px-1 rounded">ck_YOUR_API_KEY</code> with your actual key</span>
            </div>
            <Link
              to="/docs"
              className="mt-4 inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View full documentation
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Popular Endpoints */}
        {popular.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Most Used Endpoints</h2>
            <div className="space-y-3">
              {popular.slice(0, 5).map((endpoint: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-600">#{idx + 1}</span>
                    </div>
                    <code className="text-sm font-mono text-gray-900">{endpoint.endpoint}</code>
                  </div>
                  <span className="text-sm font-medium text-gray-600">{endpoint.count || 0} calls</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CustomerDashboardLayout>
  )
}

export default CustomerDashboard
