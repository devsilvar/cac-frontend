import { useState, useCallback } from 'react'

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || ''
const baseUrl = API_BASE ? API_BASE.replace(/\/$/, '') : ''

export const useCustomerApi = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const request = useCallback(async <T,>(path: string, options: RequestInit = {}): Promise<T> => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('customerToken')
      const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(options.headers as any) }
      if (token) headers['Authorization'] = `Bearer ${token}`
      const url = `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`
      const res = await fetch(url, { ...options, headers })
      const text = await res.text()
      let data: any
      try { data = text ? JSON.parse(text) : {} } catch { data = { raw: text } }
      if (res.status === 401) {
        localStorage.removeItem('customerToken')
        // redirect to login with from param
        const from = encodeURIComponent(window.location.pathname + window.location.search)
        window.location.href = `/customer/login?auth=1&from=${from}`
        throw new Error('Unauthorized')
      }
      if (!res.ok || data?.success === false) throw new Error(data?.error?.message || res.statusText)
      return data
    } catch (e: any) {
      setError(e?.message || 'Request failed')
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading, error,
    get: <T,>(path: string) => request<T>(path, { method: 'GET' }),
    post: <T,>(path: string, body?: any) => request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
    del: <T,>(path: string) => request<T>(path, { method: 'DELETE' }),
    request,
  }
}
