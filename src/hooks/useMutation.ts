/**
 * Custom useMutation Hook
 * Handles API mutations (POST, PUT, DELETE)
 */

import { useState, useCallback } from 'react'
import { invalidateQuery } from './useQuery'

interface UseMutationOptions<T, V> {
  onSuccess?: (data: T, variables: V) => void
  onError?: (error: Error, variables: V) => void
  onSettled?: (data: T | null, error: Error | null, variables: V) => void
  invalidateQueries?: string[] // Query keys to invalidate on success
}

interface UseMutationResult<T, V> {
  mutate: (variables: V) => Promise<T>
  mutateAsync: (variables: V) => Promise<T>
  data: T | null
  loading: boolean
  error: Error | null
  reset: () => void
}

export function useMutation<T, V = void>(
  mutationFn: (variables: V) => Promise<T>,
  options: UseMutationOptions<T, V> = {}
): UseMutationResult<T, V> {
  const { onSuccess, onError, onSettled, invalidateQueries } = options

  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  const mutate = useCallback(
    async (variables: V) => {
      try {
        setLoading(true)
        setError(null)

        const result = await mutationFn(variables)
        setData(result)

        // Invalidate queries if specified
        if (invalidateQueries) {
          invalidateQueries.forEach(key => invalidateQuery(key))
        }

        if (onSuccess) onSuccess(result, variables)
        if (onSettled) onSettled(result, null, variables)

        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error')
        setError(error)

        if (onError) onError(error, variables)
        if (onSettled) onSettled(null, error, variables)

        throw error
      } finally {
        setLoading(false)
      }
    },
    [mutationFn, onSuccess, onError, onSettled, invalidateQueries]
  )

  return {
    mutate,
    mutateAsync: mutate, // Alias for consistency
    data,
    loading,
    error,
    reset
  }
}
