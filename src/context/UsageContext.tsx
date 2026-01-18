/**
 * Global Usage Context
 * Provides usage tracking data across customer and admin dashboards
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import axios from 'axios'

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

export const UsageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [usage, setUsage] = useState<UsageStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsage = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Get token from localStorage
      const token = localStorage.getItem('customerToken')
      if (!token) {
        throw new Error('No authentication token found')
      }

      console.log('[UsageContext] Fetching usage from API...') // DEBUG
      const response = await axios.get('/api/v1/customer/usage', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      console.log('[UsageContext] API Response:', response.data) // DEBUG
      
      if (response?.data?.data?.usage || response?.data?.usage) {
        const usageData = response?.data?.data?.usage || response?.data?.usage || null
        console.log('[UsageContext] Setting usage data:', usageData) // DEBUG
        setUsage(usageData)
      } else {
        // Set default empty stats
        console.log('[UsageContext] No usage data in response, setting defaults') // DEBUG
        setUsage({
          requestsThisMonth: 0,
          requestsToday: 0,
          totalCalls: 0,
          successfulCalls: 0,
          failedCalls: 0,
          successRate: 0,
          errorRate: 0,
          popularEndpoints: []
        })
      }
    } catch (err: any) {
      console.error('[UsageContext] Failed to fetch usage:', err)
      setError(err?.response?.data?.message || err.message || 'Failed to load usage data')
      // Set default empty stats on error
      setUsage({
        requestsThisMonth: 0,
        requestsToday: 0,
        totalCalls: 0,
        successfulCalls: 0,
        failedCalls: 0,
        successRate: 0,
        errorRate: 0,
        popularEndpoints: []
      })
    } finally {
      setLoading(false)
    }
  }

  const refreshUsage = async () => {
    await fetchUsage()
  }

  useEffect(() => {
    fetchUsage()
  }, [])

  return (
    <UsageContext.Provider value={{ usage, loading, error, refreshUsage }}>
      {children}
    </UsageContext.Provider>
  )
}

export const useUsage = () => {
  const context = useContext(UsageContext)
  if (context === undefined) {
    throw new Error('useUsage must be used within a UsageProvider')
  }
  return context
}
