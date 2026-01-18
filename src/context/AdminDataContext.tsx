/**
 * Admin Data Context
 * Manages admin dashboard data, customers, and system stats globally
 * Reduces duplicate API calls and provides centralized state
 */

import React, { createContext, useContext, ReactNode } from 'react'
import { useQuery, invalidateQuery } from '../hooks/useQuery'
import { useAdminAuth } from '../hooks/useAdminAuth'

interface DashboardStats {
  totalCustomers: number
  totalRevenue: number
  totalApiCalls: number
  activeCustomers: number
  pendingVerifications: number
  systemHealth: 'healthy' | 'warning' | 'critical'
}

interface Customer {
  id: string
  email: string
  businessName: string
  isVerified: boolean
  status: 'active' | 'suspended' | 'pending'
  usage: number
  walletBalance: number
  createdAt: string
}

interface SystemMetrics {
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  apiResponseTime: number
  errorRate: number
  uptime: number
}

interface AdminDataContextType {
  // Dashboard Stats
  stats: DashboardStats | null
  statsLoading: boolean
  statsError: Error | null
  refreshStats: () => Promise<void>

  // Customers
  customers: Customer[] | null
  customersLoading: boolean
  customersError: Error | null
  refreshCustomers: () => Promise<void>

  // System Metrics
  metrics: SystemMetrics | null
  metricsLoading: boolean
  metricsError: Error | null
  refreshMetrics: () => Promise<void>

  // Helper to refresh all data
  refreshAll: () => Promise<void>
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined)

export const AdminDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { adminApi } = useAdminAuth()

  // Fetch dashboard stats
  const {
    data: stats,
    loading: statsLoading,
    error: statsError,
    refetch: refreshStats
  } = useQuery<DashboardStats>(
    'admin-dashboard-stats',
    async () => {
      const response = await adminApi.get('/api/v1/admin/dashboard/stats')
      return response.data || response
    },
    {
      refetchInterval: 60000 // Refresh every minute
    }
  )

  // Fetch customers
  const {
    data: customers,
    loading: customersLoading,
    error: customersError,
    refetch: refreshCustomers
  } = useQuery<Customer[]>(
    'admin-customers',
    async () => {
      const response = await adminApi.get('/api/v1/admin/customers')
      return response.data || response
    }
  )

  // Fetch system metrics
  const {
    data: metrics,
    loading: metricsLoading,
    error: metricsError,
    refetch: refreshMetrics
  } = useQuery<SystemMetrics>(
    'admin-system-metrics',
    async () => {
      const response = await adminApi.get('/api/v1/admin/system/metrics')
      return response.data || response
    },
    {
      refetchInterval: 30000 // Refresh every 30 seconds
    }
  )

  // Refresh all data
  const refreshAll = async () => {
    await Promise.all([
      refreshStats(),
      refreshCustomers(),
      refreshMetrics()
    ])
  }

  const value: AdminDataContextType = {
    stats,
    statsLoading,
    statsError,
    refreshStats,
    customers,
    customersLoading,
    customersError,
    refreshCustomers,
    metrics,
    metricsLoading,
    metricsError,
    refreshMetrics,
    refreshAll
  }

  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  )
}

// Hook to use admin data
export const useAdminData = () => {
  const context = useContext(AdminDataContext)
  if (context === undefined) {
    throw new Error('useAdminData must be used within an AdminDataProvider')
  }
  return context
}

// Helper function to invalidate all admin data queries
export const invalidateAdminData = () => {
  invalidateQuery('admin-dashboard-stats')
  invalidateQuery('admin-customers')
  invalidateQuery('admin-system-metrics')
}
