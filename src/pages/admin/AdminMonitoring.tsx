/**
 * Admin Monitoring Page
 * System monitoring, API stats, rate limits, and audit logs
 */

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ChartBarIcon,
  ClockIcon,
  ServerIcon,
  CpuChipIcon,
  CircleStackIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'
import { adminApi } from '../../services/admin.service'
import type { SystemInfo, ApiStatistics, AuditLog } from '../../types/admin.types'

const AdminMonitoring: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stats' | 'audit'>('stats')
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null)
  const [apiStats, setApiStats] = useState<ApiStatistics | null>(null)
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (activeTab === 'stats') {
      loadStats()
    } else {
      loadAuditLogs()
    }
  }, [activeTab])

  const loadStats = async () => {
    setLoading(true)
    try {
      const response = await adminApi.monitoring.getStats()
      if (response.success) {
        setSystemInfo(response.data.system)
        setApiStats(response.data.api)
      }
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAuditLogs = async () => {
    setLoading(true)
    try {
      const response = await adminApi.monitoring.getAuditLogs({ limit: 50 })
      if (response.success) {
        setAuditLogs(response.data.logs || [])
      }
    } catch (error) {
      console.error('Failed to load audit logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    return `${days}d ${hours}h ${mins}m`
  }

  const formatBytes = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024)
    return `${gb.toFixed(2)} GB`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Monitoring</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor system health, API statistics, and audit logs
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('stats')}
            className={`${
              activeTab === 'stats'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors`}
          >
            <ChartBarIcon className="inline-block h-5 w-5 mr-2" />
            Statistics
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`${
              activeTab === 'audit'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors`}
          >
            <DocumentTextIcon className="inline-block h-5 w-5 mr-2" />
            Audit Logs
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'stats' ? (
        <div className="space-y-6">
          {/* System Info */}
          {systemInfo && (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <SystemMetricCard
                  label="Uptime"
                  value={formatUptime(systemInfo.uptime)}
                  icon={ClockIcon}
                  color="blue"
                />
                <SystemMetricCard
                  label="Memory Usage"
                  value={`${systemInfo.memory.percentage.toFixed(1)}%`}
                  subtitle={`${formatBytes(systemInfo.memory.used)} / ${formatBytes(systemInfo.memory.total)}`}
                  icon={CircleStackIcon}
                  color={systemInfo.memory.percentage > 80 ? 'red' : 'green'}
                />
                <SystemMetricCard
                  label="CPU Usage"
                  value={`${systemInfo.cpu.usage.toFixed(1)}%`}
                  subtitle={`${systemInfo.cpu.cores} cores`}
                  icon={CpuChipIcon}
                  color={systemInfo.cpu.usage > 80 ? 'red' : 'green'}
                />
                <SystemMetricCard
                  label="Active Requests"
                  value={systemInfo.requests.active.toString()}
                  subtitle={`${systemInfo.requests.total} total`}
                  icon={ServerIcon}
                  color="purple"
                />
              </div>

              {/* API Statistics */}
              {apiStats && (
                <div className="bg-white shadow-sm rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">API Statistics</h3>
                  
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                    <StatItem
                      label="Total Calls"
                      value={apiStats.totalCalls.toLocaleString()}
                    />
                    <StatItem
                      label="Success Rate"
                      value={`${(apiStats.successRate * 100).toFixed(1)}%`}
                    />
                    <StatItem
                      label="Avg Response Time"
                      value={`${apiStats.avgResponseTime.toFixed(0)}ms`}
                    />
                    <StatItem
                      label="Failed Calls"
                      value={apiStats.failedCalls.toLocaleString()}
                    />
                  </div>

                  {/* Endpoint Stats */}
                  {apiStats.endpointStats && apiStats.endpointStats.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Top Endpoints</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Endpoint
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Method
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Calls
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Avg Time
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Error Rate
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {apiStats.endpointStats.map((stat, idx) => (
                              <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-4 py-2 text-sm text-gray-900 font-mono">
                                  {stat.endpoint}
                                </td>
                                <td className="px-4 py-2 text-sm">
                                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">
                                    {stat.method}
                                  </span>
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-900">
                                  {stat.calls.toLocaleString()}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-900">
                                  {stat.avgResponseTime.toFixed(0)}ms
                                </td>
                                <td className="px-4 py-2 text-sm">
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${
                                    stat.errorRate > 0.1 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                  }`}>
                                    {(stat.errorRate * 100).toFixed(1)}%
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-sm text-gray-500">Loading statistics...</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Audit Logs</h3>
            <p className="mt-1 text-sm text-gray-500">
              Recent admin actions and system events
            </p>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-sm text-gray-500">Loading audit logs...</p>
            </div>
          ) : auditLogs.length === 0 ? (
            <div className="text-center py-12">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No audit logs</h3>
              <p className="mt-1 text-sm text-gray-500">
                Audit logs will appear here once actions are performed
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Admin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Resource
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.adminEmail}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800 capitalize">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                        {log.resource}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {log.details && typeof log.details === 'object' 
                          ? JSON.stringify(log.details)
                          : log.details || '-'
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Helper Components
const SystemMetricCard: React.FC<{
  label: string
  value: string
  subtitle?: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}> = ({ label, value, subtitle, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
  }

  return (
    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`rounded-lg p-3 ${colorClasses[color as keyof typeof colorClasses]}`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{label}</dt>
              <dd className="text-lg font-semibold text-gray-900">{value}</dd>
              {subtitle && (
                <dd className="text-xs text-gray-500">{subtitle}</dd>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}

const StatItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-2xl font-semibold text-gray-900">{value}</dd>
  </div>
)

export default AdminMonitoring
