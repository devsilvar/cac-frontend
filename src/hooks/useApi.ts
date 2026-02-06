import { useState, useCallback } from 'react'

interface ApiError {
  success: false
  error: {
    code: string
    message: string
    details?: any
  }
}

interface ApiSuccess<T> {
  success: true
  data: T
}

type ApiResponse<T> = ApiSuccess<T> | ApiError

export interface UseApi {
  loading: boolean
  error: string | null
  get: <T>(url: string) => Promise<ApiResponse<T>>
  post: <T>(url: string, data?: any) => Promise<ApiResponse<T>>
  put: <T>(url: string, data?: any) => Promise<ApiResponse<T>>
  delete: <T>(url: string) => Promise<ApiResponse<T>>
  request: <T>(url: string, options?: RequestInit) => Promise<ApiResponse<T>>
}

export const useApi = (): UseApi => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const request = useCallback(async <T>(
    url: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem('adminToken')
      
      const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
      }

      if (token && !url.includes('/admin/auth/login')) {
        defaultHeaders['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1${url}`, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMessage = data.error?.message || `HTTP ${response.status}: ${response.statusText}`
        setError(errorMessage)
        return {
          success: false,
          error: {
            code: data.error?.code || 'HTTP_ERROR',
            message: errorMessage,
            details: data.error?.details
          }
        }
      }

      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error occurred'
      setError(errorMessage)
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: errorMessage
        }
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const get = useCallback(<T>(url: string) => request<T>(url, { method: 'GET' }), [request])
  const post = useCallback(<T>(url: string, data?: any) => 
    request<T>(url, { 
      method: 'POST', 
      body: data ? JSON.stringify(data) : undefined 
    }), [request])
  const put = useCallback(<T>(url: string, data?: any) => 
    request<T>(url, { 
      method: 'PUT', 
      body: data ? JSON.stringify(data) : undefined 
    }), [request])
  const deleteMethod = useCallback(<T>(url: string) => request<T>(url, { method: 'DELETE' }), [request])

  return { loading, error, request, get, post, put, delete: deleteMethod }
}