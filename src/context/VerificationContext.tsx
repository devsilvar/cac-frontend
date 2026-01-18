import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { useCustomerAuth } from './CustomerAuthContext'

/**
 * Verification Status Types
 * - 'inactive': User hasn't started verification
 * - 'pending': User has submitted verification, awaiting review
 * - 'cac_pending': CAC verification in progress
 * - 'admin_review': CAC verified, awaiting admin review
 * - 'verified': Fully verified
 * - 'rejected': Verification rejected
 */
export type VerificationStatus = 
  | 'inactive' 
  | 'pending' 
  | 'cac_pending' 
  | 'admin_review' 
  | 'verified' 
  | 'rejected'

export interface VerificationData {
  status: VerificationStatus
  submittedAt?: string
  reviewedAt?: string
  rejectionReason?: string
  cacVerification?: {
    verified: boolean
    companyName?: string
    rcNumber?: string
    verifiedAt?: string
  }
}

interface VerificationContextValue {
  /** Current verification status */
  status: VerificationStatus
  /** Full verification data from backend */
  data: VerificationData | null
  /** Whether verification data is being loaded */
  loading: boolean
  /** Error message if fetch failed */
  error: string | null
  /** Refresh verification status from backend */
  refresh: () => Promise<void>
  /** Check if user is fully verified */
  isVerified: boolean
  /** Check if verification is pending (any pending state) */
  isPending: boolean
  /** Check if user needs to start verification */
  needsVerification: boolean
  /** Check if verification was rejected */
  isRejected: boolean
}

const VerificationContext = createContext<VerificationContextValue | undefined>(undefined)

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || ''
const baseUrl = API_BASE ? API_BASE.replace(/\/$/, '') : ''

export const VerificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, token } = useCustomerAuth()
  const [data, setData] = useState<VerificationData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchVerificationStatus = useCallback(async () => {
    const authToken = token || localStorage.getItem('customerToken')
    if (!authToken) {
      setData(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${baseUrl}/api/v1/customer/verification/status`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!res.ok) {
        if (res.status === 401) {
          // Token expired or invalid - clear data
          setData(null)
          return
        }
        throw new Error(`Failed to fetch verification status (HTTP ${res.status})`)
      }

      const json = await res.json()
      const verificationData = json?.data || json

      setData({
        status: verificationData.status || 'inactive',
        submittedAt: verificationData.submittedAt,
        reviewedAt: verificationData.reviewedAt,
        rejectionReason: verificationData.rejectionReason,
        cacVerification: verificationData.cacVerification
      })
    } catch (err) {
      console.error('[VerificationContext] Error fetching status:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch verification status')
      // Set default inactive status on error
      setData({ status: 'inactive' })
    } finally {
      setLoading(false)
    }
  }, [token])

  // Auto-fetch verification status when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchVerificationStatus()
    } else {
      // Clear data when logged out
      setData(null)
      setError(null)
    }
  }, [isAuthenticated, fetchVerificationStatus])

  // Derived state
  const status = data?.status || 'inactive'
  const isVerified = status === 'verified'
  const isPending = ['pending', 'cac_pending', 'admin_review'].includes(status)
  const needsVerification = status === 'inactive'
  const isRejected = status === 'rejected'

  const value = useMemo<VerificationContextValue>(
    () => ({
      status,
      data,
      loading,
      error,
      refresh: fetchVerificationStatus,
      isVerified,
      isPending,
      needsVerification,
      isRejected
    }),
    [status, data, loading, error, fetchVerificationStatus, isVerified, isPending, needsVerification, isRejected]
  )

  return (
    <VerificationContext.Provider value={value}>
      {children}
    </VerificationContext.Provider>
  )
}

/**
 * Hook to access verification context
 * Must be used within VerificationProvider
 */
export const useVerification = (): VerificationContextValue => {
  const ctx = useContext(VerificationContext)
  if (!ctx) {
    throw new Error('useVerification must be used within VerificationProvider')
  }
  return ctx
}

/**
 * Hook that returns verification status without throwing if outside provider
 * Useful for components that may or may not be within the provider
 */
export const useVerificationSafe = (): VerificationContextValue | null => {
  return useContext(VerificationContext) || null
}
