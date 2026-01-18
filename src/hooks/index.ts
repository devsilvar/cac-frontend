/**
 * Custom Hooks Index
 * Centralized export for all custom hooks
 */

export { useQuery, invalidateQuery, clearQueryCache } from './useQuery'
export { useMutation } from './useMutation'
export { usePagination } from './usePagination'
export { useDebounce } from './useDebounce'
export { useLocalStorage } from './useLocalStorage'

// Re-export existing hooks
export { useAdminAuth } from './useAdminAuth'
export { useApi } from './useApi'
export { useCustomerApi } from './useCustomerApi'
