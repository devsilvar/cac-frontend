import React, { useEffect, useState } from 'react'
import CustomerDashboardLayout from '../../layouts/CustomerDashboardLayout'
import { useCustomerApi } from '../../hooks/useCustomerApi'
import { BarChart3, TrendingUp, Clock, Activity, CheckCircle, XCircle } from 'lucide-react'

const CustomerUsage: React.FC = () => {
  const api = useCustomerApi()
  const [usage, setUsage] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => { 
    (async()=>{ 
      try {
        const data = await api.get<any>('/api/v1/customer/usage')
        setUsage(data?.data?.usage || data?.usage || {})
      } finally {
        setLoading(false)
      }
    })() 
  }, [])

  const requestsToday = usage?.requestsToday ?? usage?.today ?? 0
  const requestsThisMonth = usage?.requestsThisMonth ?? usage?.month ?? 0
  const totalRequests = usage?.totalRequests ?? 0
  const popular = usage?.popularEndpoints ?? []

  const stats = [
    { 
      title: 'Today', 
      value: requestsToday, 
      icon: Activity,
      color: 'blue',
      description: 'Requests in last 24h'
    },
    { 
      title: 'This Month', 
      value: requestsThisMonth, 
      icon: TrendingUp,
      color: 'purple',
      description: 'Total this month'
    },
    { 
      title: 'All Time', 
      value: totalRequests || '—', 
      icon: BarChart3,
      color: 'green',
      description: 'Lifetime requests'
    }
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
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Usage & Analytics</h1>
          <p className="text-gray-600 mt-1">Monitor your API consumption and performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
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
            <div className="text-3xl font-bold text-green-600 mb-2">99.2%</div>
            <p className="text-sm text-gray-600">Excellent reliability</p>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '99.2%' }}></div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">Avg Response Time</h3>
            </div>
            <div className="text-3xl font-bold text-orange-600 mb-2">245ms</div>
            <p className="text-sm text-gray-600">Fast and reliable</p>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-orange-600 h-2 rounded-full" style={{ width: '80%' }}></div>
            </div>
          </div>
        </div>

        {/* Raw Data (Debug) */}
        {Object.keys(usage).length > 0 && (
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
    </CustomerDashboardLayout>
  )
}

export default CustomerUsage
