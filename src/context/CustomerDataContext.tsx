/**
 * Customer Data Context
 * Manages customer profile, wallet, and usage data globally
 * Reduces prop drilling and duplicate API calls
 */

import React, { createContext, useContext, ReactNode } from 'react'
import { useQuery, invalidateQuery } from '../hooks/useQuery'
import { useCustomerApi } from '../hooks/useCustomerApi'

interface CustomerProfile {
  id: string
  email: string
  businessName: string
  isVerified: boolean
  verificationStatus: string
  phoneNumber?: string
  address?: string
  createdAt: string
}

interface WalletData {
  balance: number
  currency: string
  pendingBalance?: number
  lastTransaction?: {
    amount: number
    type: string
    timestamp: string
  }
}

interface UsageData {
  requestsToday: number
  requestsThisMonth: number
  totalCalls: number
  successfulCalls: number
  failedCalls: number
  successRate: number
  errorRate: number
  popularEndpoints: Array<{ endpoint: string; count: number }>
  lastCallAt?: string
}

interface ApiKey {
  id: string
  name: string
  key: string
  permissions: string[]
  isActive: boolean
  createdAt: string
  lastUsed?: string
}

interface CustomerDataContextType {
  // Profile
  profile: CustomerProfile | null
  profileLoading: boolean
  profileError: Error | null
  refreshProfile: () => Promise<void>

  // Wallet
  wallet: WalletData | null
  walletLoading: boolean
  walletError: Error | null
  refreshWallet: () => Promise<void>

  // Usage
  usage: UsageData | null
  usageLoading: boolean
  usageError: Error | null
  refreshUsage: () => Promise<void>

  // API Keys
  apiKeys: ApiKey[] | null
  apiKeysLoading: boolean
  apiKeysError: Error | null
  refreshApiKeys: () => Promise<void>

  // Helper to refresh all data
  refreshAll: () => Promise<void>
}

const CustomerDataContext = createContext<CustomerDataContextType | undefined>(undefined)

export const CustomerDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const api = useCustomerApi()

  // Fetch customer profile
  const {
    data: profile,
    loading: profileLoading,
    error: profileError,
    refetch: refreshProfile
  } = useQuery<CustomerProfile>(
    'customer-profile',
    async () => {
      const response = await api.get('/api/v1/customer/profile')
      return response.data || response
    }
  )

  // Fetch wallet data
  const {
    data: wallet,
    loading: walletLoading,
    error: walletError,
    refetch: refreshWallet
  } = useQuery<WalletData>(
    'customer-wallet',
    async () => {
      const response = await api.get('/api/v1/customer/wallet')
      return response.data || response
    }
  )

  // Fetch usage data
  const {
    data: usage,
    loading: usageLoading,
    error: usageError,
    refetch: refreshUsage
  } = useQuery<UsageData>(
    'customer-usage',
    async () => {
      const response = await api.get('/api/v1/customer/usage')
      return response.data?.usage || response.usage || null
    }
  )

  // Fetch API keys
  const {
    data: apiKeys,
    loading: apiKeysLoading,
    error: apiKeysError,
    refetch: refreshApiKeys
  } = useQuery<ApiKey[]>(
    'customer-api-keys',
    async () => {
      const response = await api.get('/api/v1/customer/api-keys')
      return response.data || response
    }
  )

  // Refresh all data
  const refreshAll = async () => {
    await Promise.all([
      refreshProfile(),
      refreshWallet(),
      refreshUsage(),
      refreshApiKeys()
    ])
  }

  const value: CustomerDataContextType = {
    profile,
    profileLoading,
    profileError,
    refreshProfile,
    wallet,
    walletLoading,
    walletError,
    refreshWallet,
    usage,
    usageLoading,
    usageError,
    refreshUsage,
    apiKeys,
    apiKeysLoading,
    apiKeysError,
    refreshApiKeys,
    refreshAll
  }

  return (
    <CustomerDataContext.Provider value={value}>
      {children}
    </CustomerDataContext.Provider>
  )
}

// Hook to use customer data
export const useCustomerData = () => {
  const context = useContext(CustomerDataContext)
  if (context === undefined) {
    throw new Error('useCustomerData must be used within a CustomerDataProvider')
  }
  return context
}

// Helper function to invalidate all customer data queries
export const invalidateCustomerData = () => {
  invalidateQuery('customer-profile')
  invalidateQuery('customer-wallet')
  invalidateQuery('customer-usage')
  invalidateQuery('customer-api-keys')
}
