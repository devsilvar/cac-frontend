/**
 * Admin TypeScript Type Definitions
 * Comprehensive type definitions for admin domain models
 */

// ============================================================================
// ADMIN USER TYPES
// ============================================================================

export interface Admin {
  id: string
  email: string
  role: 'super_admin' | 'admin' | 'support'
  permissions: string[]
  createdAt: string
  updatedAt?: string
  lastLoginAt?: string
}

export interface AdminProfile {
  id: string
  email: string
  role: string
  permissions: string[]
  createdAt: string
  lastLoginAt?: string
}

// ============================================================================
// CUSTOMER TYPES
// ============================================================================

export interface Customer {
  id: string
  email: string
  nin?: string
  bvn?: string
  company?: string
  phone?: string
  address?: string
  plan: 'free' | 'basic' | 'pro' | 'enterprise'
  status: 'active' | 'suspended' | 'inactive'
  verificationStatus?: 'inactive' | 'cac_pending' | 'admin_review' | 'verified' | 'rejected'
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  createdAt: string
  updatedAt?: string
  lastLoginAt?: string
}

export interface CustomerDetails extends Customer {
  apiKeys: ApiKey[]
  usage: UsageStats
  subscriptionInfo?: SubscriptionInfo
}

export interface CustomerListItem {
  id: string
  email: string
  company?: string
  plan: string
  status: 'active' | 'suspended' | 'inactive'
  verificationStatus?: 'inactive' | 'cac_pending' | 'admin_review' | 'verified' | 'rejected'
  createdAt: string
  usage?: number
  revenue?: number
}

// ============================================================================
// API KEY TYPES
// ============================================================================

export interface ApiKey {
  id: string
  customerId: string
  key?: string // Only returned on creation
  keyPrefix: string
  name?: string
  description?: string
  status: 'active' | 'revoked'
  lastUsedAt?: string
  createdAt: string
  expiresAt?: string
}

export interface ApiKeyWithCustomer extends ApiKey {
  customer: {
    id: string
    email: string
    company?: string
  }
}

// ============================================================================
// USAGE & STATISTICS TYPES
// ============================================================================

export interface UsageStats {
  totalCalls: number
  successfulCalls: number
  failedCalls: number
  successRate: number
  lastCallAt?: string
  callsByEndpoint?: Record<string, number>
  callsByDate?: Array<{
    date: string
    count: number
  }>
}

export interface DashboardOverview {
  totalCustomers: number
  activeCustomers: number
  suspendedCustomers: number
  totalApiKeys: number
  activeApiKeys: number
  totalApiCalls: number
  apiCallsToday: number
  apiCallsThisMonth: number
  revenue: number
  revenueThisMonth: number
}

export interface UsageOverview {
  totalCalls: number
  callsToday: number
  callsThisWeek: number
  callsThisMonth: number
  avgResponseTime: number
  successRate: number
  topEndpoints: Array<{
    endpoint: string
    count: number
    avgResponseTime: number
  }>
  topCustomers: Array<{
    customerId: string
    email: string
    company?: string
    calls: number
  }>
}

export interface BusinessMetrics {
  mrr: number // Monthly Recurring Revenue
  arr: number // Annual Recurring Revenue
  churnRate: number
  customerLifetimeValue: number
  arpu: number // Average Revenue Per User
  growthRate: number
  revenueByPlan: Record<string, number>
  customersByPlan: Record<string, number>
}

// ============================================================================
// SYSTEM TYPES
// ============================================================================

export interface SystemStatus {
  status: 'healthy' | 'degraded' | 'down'
  uptime: number
  version: string
  environment: string
  timestamp: string
  checks: {
    database: {
      status: 'up' | 'down'
      responseTime?: number
    }
    externalApis: {
      documentsApi: {
        status: 'up' | 'down'
        responseTime?: number
      }
      cacApi: {
        status: 'up' | 'down'
        responseTime?: number
      }
    }
  }
}

export interface SystemInfo {
  uptime: number
  memory: {
    used: number
    total: number
    percentage: number
  }
  cpu: {
    usage: number
    cores: number
  }
  requests: {
    total: number
    active: number
  }
}

export interface ApiStatistics {
  totalCalls: number
  successfulCalls: number
  failedCalls: number
  successRate: number
  avgResponseTime: number
  endpointStats: Array<{
    endpoint: string
    method: string
    calls: number
    avgResponseTime: number
    errorRate: number
  }>
}

// ============================================================================
// AUDIT LOG TYPES
// ============================================================================

export interface AuditLog {
  id: string
  adminId: string
  adminEmail: string
  action: string
  resource: string
  resourceId?: string
  details?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  timestamp: string
}

export interface AuditLogEntry {
  id: string
  timestamp: string
  adminId: string
  adminEmail: string
  action: 'create' | 'update' | 'delete' | 'suspend' | 'activate' | 'revoke' | 'login' | 'logout'
  resource: 'customer' | 'api_key' | 'admin' | 'system'
  resourceId?: string
  details?: string
  ipAddress?: string
}

// ============================================================================
// SUBSCRIPTION TYPES
// ============================================================================

export interface SubscriptionInfo {
  id: string
  customerId: string
  plan: string
  status: 'active' | 'canceled' | 'past_due' | 'trialing'
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAt?: string
  canceledAt?: string
  trialEnd?: string
  amount: number
  currency: string
}

// ============================================================================
// FORM & REQUEST TYPES
// ============================================================================

export interface CreateCustomerRequest {
  email: string
  password?: string
  company?: string
  phone?: string
  plan?: string
  nin?: string
  bvn?: string
}

export interface UpdateCustomerRequest {
  email?: string
  company?: string
  phone?: string
  address?: string
  plan?: string
}

export interface CreateAdminRequest {
  email: string
  password: string
  role: 'admin' | 'support'
  permissions?: string[]
}

export interface UpdateAdminProfileRequest {
  email?: string
  currentPassword?: string
  newPassword?: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

// ============================================================================
// PAGINATION & FILTER TYPES
// ============================================================================

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface CustomerFilters extends PaginationParams {
  status?: 'active' | 'suspended' | 'inactive'
  plan?: string
  search?: string
}

export interface ApiKeyFilters extends PaginationParams {
  status?: 'active' | 'revoked'
  customerId?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasMore: boolean
  }
}

// ============================================================================
// RATE LIMIT TYPES
// ============================================================================

export interface RateLimitInfo {
  endpoint: string
  limit: number
  remaining: number
  reset: string
  violations: number
}

export interface RateLimitStats {
  totalRequests: number
  blockedRequests: number
  topViolators: Array<{
    customerId: string
    email: string
    violations: number
  }>
  limitsConfig: Record<string, {
    windowMs: number
    max: number
  }>
}

// ============================================================================
// CHART & VISUALIZATION TYPES
// ============================================================================

export interface TimeSeriesData {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    borderColor?: string
    backgroundColor?: string
  }>
}

export interface PieChartData {
  labels: string[]
  data: number[]
  backgroundColor?: string[]
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  timestamp?: string
}

export interface ApiError {
  success: false
  error: {
    code: string
    message: string
    details?: any
  }
}

export type ApiResult<T> = ApiResponse<T> | ApiError
