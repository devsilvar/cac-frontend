/**
 * Optimized Usage Context
 * Replaces the original UsageContext with better performance
 * Uses React.memo and useMemo to prevent unnecessary re-renders
 */

import React, { createContext, useContext, ReactNode, useMemo } from 'react'
import { useQuery } from '../hooks/useQuery'
import { useCustomerApi } from '../hooks/useCustomerApi'

export interface UsageStats {
  requestsThisMonth: number
  requestsToday: number
  totalCalls: number
  successfulCalls: number
  failedCalls: number
  successRate: number
  errorRate: number
  popularEndpoints: Array<{ endpoint: string; count: number }>
  lastCallAt?: string | Date
}

interface UsageContextType {
  usage: UsageStats | null
  loading: boolean
  error: string | null
  refreshUsage: () => Promise<void>
}

const UsageContext = createContext<UsageContextType | undefined>(undefined)

// Memoized provider to prevent unnecessary re-renders
export const OptimizedUsageProvider: React.FC<{ children: ReactNode }> = React.memo(({ children }) => {
  const customerApi = useCustomerApi()
  
  const { data: usage, loading, error, refetch } = useQuery<UsageStats>(
    'customer-usage-optimized',
    async () => {
      const token = localStorage.getItem('customerToken')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await customerApi.get<{ data: { usage: UsageStats } }>('/api/v1/customer/usage')
      return response?.data?.usage || response?.data || {
        requestsThisMonth: 0,
        requestsToday: 0,
        totalCalls: 0,
        successfulCalls: 0,
        failedCalls: 0,
        successRate: 0,
        errorRate: 0,
        popularEndpoints: []
      }
    },
    {
      refetchInterval: 60000, // Refetch every minute
      cacheTime: 5 * 60 * 1000 // Cache for 5 minutes
    }
  )

  // Memoize the context value to prevent re-renders when data doesn't change
  const value = useMemo<UsageContextType>(
    () => ({
      usage: usage || null,
      loading,
      error: error?.message || null,
      refreshUsage: refetch
    }),
    [usage, loading, error, refetch]
  )

  return <UsageContext.Provider value={value}>{children}</UsageContext.Provider>
})

OptimizedUsageProvider.displayName = 'OptimizedUsageProvider'

export const useOptimizedUsage = () => {
  const context = useContext(UsageContext)
  if (context === undefined) {
    throw new Error('useOptimizedUsage must be used within an OptimizedUsageProvider')
  }
  return context
}
