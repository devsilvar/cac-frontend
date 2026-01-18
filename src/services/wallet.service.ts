/**
 * Wallet Service
 * Handles all wallet-related API calls
 */

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || ''
const baseUrl = API_BASE ? API_BASE.replace(/\/$/, '') : ''

// Get auth token from localStorage
const getAuthToken = () => localStorage.getItem('customerToken')

// Helper for authenticated requests
async function authFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as any)
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const url = `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`
  const res = await fetch(url, { ...options, headers })
  const data = await res.json()

  if (!res.ok || data?.success === false) {
    throw new Error(data?.error?.message || data?.message || `Request failed (${res.status})`)
  }

  return data
}

// Types
export interface WalletBalance {
  kobo: number
  naira: number
  formatted: string
}

export interface WalletTransaction {
  id: string
  type: 'credit' | 'debit'
  amount: {
    kobo: number
    naira: number
    formatted: string
  }
  balanceBefore: {
    kobo: number
    naira: number
  }
  balanceAfter: {
    kobo: number
    naira: number
  }
  description: string
  reference: string
  status: 'pending' | 'completed' | 'failed' | 'reversed'
  paymentMethod: string
  createdAt: string
  completedAt: string | null
}

export interface TransactionHistory {
  transactions: WalletTransaction[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
  summary: {
    totalCredits: { kobo: number; naira: number; formatted: string }
    totalDebits: { kobo: number; naira: number; formatted: string }
    netChange: { kobo: number; naira: number; formatted: string }
  }
}

export interface TopUpInitResponse {
  reference: string
  amount: {
    kobo: number
    naira: number
    formatted: string
  }
  payment: {
    url: string
    accessCode: string
    reference: string
  }
  publicKey: string
  customerEmail: string
  expiresIn: string
}

export interface TopUpStatus {
  transaction: {
    id: string
    type: string
    amount: { kobo: number; naira: number; formatted: string }
    status: string
    reference: string
    description: string
    paymentMethod: string
    createdAt: string
    completedAt: string | null
  }
  paystackStatus?: {
    status: string
    paidAt: string | null
    channel: string | null
    gatewayResponse: string | null
  } | null
}

// Wallet Service
export const walletService = {
  /**
   * Get current wallet balance
   */
  async getBalance(): Promise<WalletBalance> {
    const response = await authFetch<{ data: { balance: WalletBalance } }>('/api/v1/customer/wallet/balance')
    return response.data.balance
  },

  /**
   * Get transaction history
   */
  async getTransactions(limit = 20, offset = 0): Promise<TransactionHistory> {
    const response = await authFetch<{ data: TransactionHistory }>(
      `/api/v1/customer/wallet/transactions?limit=${limit}&offset=${offset}`
    )
    return response.data
  },

  /**
   * Initiate wallet top-up via Paystack
   */
  async initiateTopUp(amountNaira: number, callbackUrl?: string): Promise<TopUpInitResponse> {
    const body: any = { amount: amountNaira }
    if (callbackUrl) body.callbackUrl = callbackUrl

    const response = await authFetch<{ data: TopUpInitResponse }>('/api/v1/customer/wallet/topup', {
      method: 'POST',
      body: JSON.stringify(body)
    })
    return response.data
  },

  /**
   * Check top-up status
   */
  async checkTopUpStatus(reference: string): Promise<TopUpStatus> {
    const response = await authFetch<{ data: TopUpStatus }>(`/api/v1/customer/wallet/topup/${reference}`)
    return response.data
  },

  /**
   * Verify a top-up payment (used after Paystack callback redirect)
   * Uses public endpoint that doesn't require authentication
   */
  async verifyTopUp(reference: string): Promise<{
    verified: boolean
    status: 'success' | 'failed' | 'pending' | 'abandoned'
    message: string
    amount?: { kobo: number; naira: number; formatted: string }
    transaction?: WalletTransaction
  }> {
    try {
      // Use public verification endpoint (doesn't require auth)
      const response = await fetch(`${API_BASE}/api/v1/customer/wallet/topup/verify/${reference}`)
      const data = await response.json()
      
      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || data.message || 'Verification failed')
      }
      
      const transaction = data.data.transaction
      const paystackStatus = data.data.paystackStatus
      
      const status = paystackStatus?.status || transaction.status
      const isSuccess = status === 'success' || transaction.status === 'completed'
      const isPending = status === 'pending'
      
      return {
        verified: isSuccess,
        status: isSuccess ? 'success' : isPending ? 'pending' : 'failed',
        message: isSuccess 
          ? 'Payment verified successfully' 
          : isPending 
          ? 'Payment is being processed'
          : paystackStatus?.gatewayResponse || 'Payment verification failed',
        amount: transaction.amount,
        transaction: transaction as WalletTransaction
      }
    } catch (error: any) {
      console.error('[WalletService] verifyTopUp error:', error)
      return {
        verified: false,
        status: 'failed',
        message: error.message || 'Failed to verify payment'
      }
    }
  }
}

// Format helpers
export const formatNaira = (amount: number): string => {
  return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export const formatKoboToNaira = (kobo: number): string => {
  return formatNaira(kobo / 100)
}
