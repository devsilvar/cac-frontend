/**
 * Custom useQuery Hook
 * Simplified data fetching with loading, error, and caching
 * Similar to React Query but lighter
 */

import { useState, useEffect, useCallback, useRef } from 'react'

interface UseQueryOptions<T> {
  enabled?: boolean
  refetchOnMount?: boolean
  refetchInterval?: number
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  cacheTime?: number // in milliseconds
}

interface UseQueryResult<T> {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
  isRefetching: boolean
}

// Simple in-memory cache
const queryCache = new Map<string, { data: any; timestamp: number }>()

export function useQuery<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: UseQueryOptions<T> = {}
): UseQueryResult<T> {
  const {
    enabled = true,
    refetchOnMount = true,
    refetchInterval,
    onSuccess,
    onError,
    cacheTime = 5 * 60 * 1000 // 5 minutes default
  } = options

  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [isRefetching, setIsRefetching] = useState(false)
  
  const isMountedRef = useRef(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchData = useCallback(async (isInitial = false) => {
    // Check cache first
    const cached = queryCache.get(key)
    if (cached && Date.now() - cached.timestamp < cacheTime) {
      setData(cached.data)
      setLoading(false)
      if (onSuccess) onSuccess(cached.data)
      return
    }

    try {
      if (isInitial) {
        setLoading(true)
      } else {
        setIsRefetching(true)
      }
      setError(null)

      const result = await fetcher()
      
      if (!isMountedRef.current) return

      // Update cache
      queryCache.set(key, { data: result, timestamp: Date.now() })
      
      setData(result)
      if (onSuccess) onSuccess(result)
    } catch (err) {
      if (!isMountedRef.current) return
      
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      if (onError) onError(error)
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
        setIsRefetching(false)
      }
    }
  }, [key, fetcher, cacheTime, onSuccess, onError])

  const refetch = useCallback(async () => {
    await fetchData(false)
  }, [fetchData])

  useEffect(() => {
    isMountedRef.current = true

    if (!enabled) {
      setLoading(false)
      return
    }

    if (refetchOnMount) {
      fetchData(true)
    }

    // Set up refetch interval if specified
    if (refetchInterval) {
      intervalRef.current = setInterval(() => {
        fetchData(false)
      }, refetchInterval)
    }

    return () => {
      isMountedRef.current = false
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [enabled, refetchOnMount, refetchInterval, fetchData])

  return { data, loading, error, refetch, isRefetching }
}

// Invalidate cache for a specific key
export function invalidateQuery(key: string) {
  queryCache.delete(key)
}

// Clear all cache
export function clearQueryCache() {
  queryCache.clear()
}
