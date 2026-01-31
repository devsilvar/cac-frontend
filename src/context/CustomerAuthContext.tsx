import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

export interface CustomerUser {
  id: string
  email: string
  company?: string
  fullName?: string | null
  phoneNumber?: string | null
  walletBalance?: number
  status: string
  verificationStatus?: string
  createdAt?: string
  plan?: 'basic' | 'pro' | 'enterprise'
}

export interface AuthResult {
  ok: boolean
  message?: string
}

interface CustomerAuthContextValue {
  isAuthenticated: boolean
  customer: CustomerUser | null
  loading: boolean
  token: string | null
  signup: (payload: { email: string; password: string; company?: string; plan?: 'basic'|'pro'; full_name?: string; nin_bvn?: string; phone_number?: string; id_document?: string }) => Promise<AuthResult>
  login: (email: string, password: string) => Promise<AuthResult>
  updateProfile: (payload: { company?: string; phoneNumber?: string }) => Promise<AuthResult>
  logout: () => void
  loadMe: () => Promise<void>
}

const CustomerAuthContext = createContext<CustomerAuthContextValue | undefined>(undefined)

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || ''
const baseUrl = API_BASE ? API_BASE.replace(/\/$/, '') : ''

export const CustomerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null)
  const [customer, setCustomer] = useState<CustomerUser | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = localStorage.getItem('customerToken')
    if (t) {
      setToken(t)
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const loadMe = async (overrideToken?: string) => {
    const t = overrideToken || token || localStorage.getItem('customerToken')
    if (!t) return
    try {
      const res = await fetch(`${baseUrl}/api/v1/customer/me`, {
        headers: { Authorization: `Bearer ${t}` }
      })
      if (!res.ok) return
      const data = await res.json()
      const customerData = data?.data ?? data
      console.log('[CustomerAuth] loadMe response:', {
        verificationStatus: customerData?.verificationStatus,
        email: customerData?.email,
        id: customerData?.id
      })
      setCustomer(customerData)
    } catch (e) {
      console.error('[CustomerAuth] loadMe error:', e)
    }
  }

  const signup: CustomerAuthContextValue['signup'] = async (payload) => {
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/api/v1/customer/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const j = await res.json().catch(() => null)

      // Extract best-effort message from backend
      const message =
        j?.error?.message ||
        j?.message ||
        j?.data?.message ||
        (typeof j === 'string' ? j : undefined) ||
        (!res.ok ? `Signup failed (HTTP ${res.status})` : undefined)

      if (!res.ok || j?.success === false) return { ok: false, message }

      // Signup successful - DO NOT auto-login
      // User should be redirected to login page to sign in manually
      return { ok: true, message: 'Account created successfully. Please log in.' }
    } catch (e) {
      return { ok: false, message: e instanceof Error ? e.message : 'Signup failed' }
    } finally {
      setLoading(false)
    }
  }

  const login: CustomerAuthContextValue['login'] = async (email, password) => {
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/api/v1/customer/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const j = await res.json().catch(() => null)

      const message =
        j?.error?.message ||
        j?.message ||
        j?.data?.message ||
        (!res.ok ? `Login failed (HTTP ${res.status})` : undefined)

      if (!res.ok || j?.success === false) return { ok: false, message }

      const t = j?.token || j?.data?.token
      if (!t) return { ok: false, message: message || 'Login succeeded but no token returned' }

      setToken(t)
      localStorage.setItem('customerToken', t)
      setIsAuthenticated(true)
      await loadMe(t)
      return { ok: true }
    } catch (e) {
      return { ok: false, message: e instanceof Error ? e.message : 'Login failed' }
    } finally {
      setLoading(false)
    }
  }

  const updateProfile: CustomerAuthContextValue['updateProfile'] = async (payload) => {
    setLoading(true)
    try {
      const t = token || localStorage.getItem('customerToken')
      if (!t) return { ok: false, message: 'Not authenticated' }

      const res = await fetch(`${baseUrl}/api/v1/customer/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${t}`
        },
        body: JSON.stringify(payload)
      })

      const j = await res.json().catch(() => null)
      const message = j?.error?.message || j?.message || j?.data?.message

      if (!res.ok || j?.success === false) return { ok: false, message: message || `Update failed (HTTP ${res.status})` }

      // Refresh local customer state
      await loadMe(t)
      return { ok: true }
    } catch (e) {
      return { ok: false, message: e instanceof Error ? e.message : 'Update failed' }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('customerToken')
    setToken(null)
    setCustomer(null)
    setIsAuthenticated(false)
  }

  const value = useMemo(
    () => ({ isAuthenticated, customer, loading, token, signup, login, updateProfile, logout, loadMe }),
    [isAuthenticated, customer, loading, token]
  )
  return <CustomerAuthContext.Provider value={value}>{children}</CustomerAuthContext.Provider>
}

export const useCustomerAuth = () => {
  const ctx = useContext(CustomerAuthContext)
  if (!ctx) throw new Error('useCustomerAuth must be used within CustomerAuthProvider')
  return ctx
}
