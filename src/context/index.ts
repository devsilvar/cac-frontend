/**
 * Context Index
 * Centralized export for all context providers and hooks
 */

// Original contexts (kept for backwards compatibility)
export { AuthProvider, useAuth } from './AuthContext'
export { CustomerAuthProvider, useCustomerAuth } from './CustomerAuthContext'
export { VerificationProvider, useVerification } from './VerificationContext'
export { UsageProvider, useUsage } from './UsageContext'

// New optimized contexts
export { OptimizedAuthProvider, useOptimizedAuth } from './OptimizedAuthContext'
export { OptimizedUsageProvider, useOptimizedUsage } from './OptimizedUsageContext'

// New data contexts
export { CustomerDataProvider, useCustomerData, invalidateCustomerData } from './CustomerDataContext'
export { AdminDataProvider, useAdminData, invalidateAdminData } from './AdminDataContext'

// Notification context
export { NotificationProvider, useNotification } from './NotificationContext'

// Type exports
export type { UsageStats } from './UsageContext'
