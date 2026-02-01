/**
 * Admin API Service
 * Comprehensive service layer for all admin API operations
 */

import type {
  Admin,
  AdminProfile,
  Customer,
  CustomerDetails,
  CustomerListItem,
  ApiKey,
  ApiKeyWithCustomer,
  DashboardOverview,
  UsageOverview,
  BusinessMetrics,
  SystemStatus,
  SystemInfo,
  ApiStatistics,
  AuditLog,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CreateAdminRequest,
  UpdateAdminProfileRequest,
  ChangePasswordRequest,
  CustomerFilters,
  ApiKeyFilters,
  PaginatedResponse,
  RateLimitStats,
  ApiResponse,
  ApiError,
} from '../types/admin.types'

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL 
  ? `${(import.meta as any).env.VITE_API_BASE_URL}/api/v1` 
  : 'http://localhost:3000/api/v1'

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('adminToken')
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T> | ApiError> {
  const data = await response.json()
  
  if (!response.ok) {
    return {
      success: false,
      error: {
        code: data.error?.code || 'HTTP_ERROR',
        message: data.error?.message || `HTTP ${response.status}: ${response.statusText}`,
        details: data.error?.details,
      },
    }
  }
  
  return data
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T> | ApiError> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    })
    return handleResponse<T>(response)
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Network error occurred',
      },
    }
  }
}

// ============================================================================
// AUTHENTICATION SERVICES
// ============================================================================

export const authService = {
  /**
   * Admin login
   */
  async login(email: string, password: string): Promise<ApiResponse<{ admin: Admin; token: string }> | ApiError> {
    return apiRequest<{ admin: Admin; token: string }>('/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  /**
   * Get admin profile
   */
  async getProfile(): Promise<ApiResponse<{ admin: AdminProfile }> | ApiError> {
    return apiRequest<{ admin: AdminProfile }>('/admin/profile')
  },

  /**
   * Update admin profile
   */
  async updateProfile(data: UpdateAdminProfileRequest): Promise<ApiResponse<{ admin: AdminProfile }> | ApiError> {
    return apiRequest<{ admin: AdminProfile }>('/admin/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  /**
   * Change password
   */
  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<{ message: string }> | ApiError> {
    return apiRequest<{ message: string }>('/admin/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}

// ============================================================================
// DASHBOARD SERVICES
// ============================================================================

export const dashboardService = {
  /**
   * Get dashboard overview
   */
  async getOverview(): Promise<ApiResponse<{ overview: DashboardOverview }> | ApiError> {
    return apiRequest<{ overview: DashboardOverview }>('/admin/overview')
  },

  /**
   * Get usage overview
   */
  async getUsageOverview(): Promise<ApiResponse<{ usage: UsageOverview }> | ApiError> {
    return apiRequest<{ usage: UsageOverview }>('/admin/usage/overview')
  },

  /**
   * Get system status
   */
  async getSystemStatus(): Promise<ApiResponse<{ status: SystemStatus }> | ApiError> {
    return apiRequest<{ status: SystemStatus }>('/admin/system-status')
  },

  /**
   * Get business metrics
   */
  async getMetrics(): Promise<ApiResponse<{ metrics: BusinessMetrics }> | ApiError> {
    return apiRequest<{ metrics: BusinessMetrics }>('/admin/metrics')
  },
}

// ============================================================================
// CUSTOMER MANAGEMENT SERVICES
// ============================================================================

export const customerService = {
  /**
   * Get all customers with optional filters
   */
  async getCustomers(filters?: CustomerFilters): Promise<ApiResponse<{ customers: CustomerListItem[] }> | ApiError> {
    const params = new URLSearchParams()
    if (filters?.status) params.append('status', filters.status)
    if (filters?.plan) params.append('plan', filters.plan)
    if (filters?.search) params.append('search', filters.search)
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())
    
    const queryString = params.toString()
    return apiRequest<{ customers: CustomerListItem[] }>(
      `/admin/customers${queryString ? `?${queryString}` : ''}`
    )
  },

  /**
   * Get customer by ID
   */
  async getCustomer(customerId: string): Promise<ApiResponse<{ customer: CustomerDetails }> | ApiError> {
    return apiRequest<{ customer: CustomerDetails }>(`/admin/customers/${customerId}`)
  },

  /**
   * Create new customer
   */
  async createCustomer(data: CreateCustomerRequest): Promise<ApiResponse<{ customer: Customer }> | ApiError> {
    return apiRequest<{ customer: Customer }>('/admin/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  /**
   * Update customer
   */
  async updateCustomer(
    customerId: string,
    data: UpdateCustomerRequest
  ): Promise<ApiResponse<{ customer: Customer }> | ApiError> {
    return apiRequest<{ customer: Customer }>(`/admin/customers/${customerId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  /**
   * Suspend customer
   */
  async suspendCustomer(customerId: string): Promise<ApiResponse<{ customer: Customer; message: string }> | ApiError> {
    return apiRequest<{ customer: Customer; message: string }>(`/admin/customers/${customerId}/suspend`, {
      method: 'POST',
    })
  },

  /**
   * Activate customer
   */
  async activateCustomer(customerId: string): Promise<ApiResponse<{ customer: Customer; message: string }> | ApiError> {
    return apiRequest<{ customer: Customer; message: string }>(`/admin/customers/${customerId}/activate`, {
      method: 'POST',
    })
  },

  /**
   * Delete customer
   */
  async deleteCustomer(customerId: string): Promise<ApiResponse<{ message: string }> | ApiError> {
    return apiRequest<{ message: string }>(`/admin/customers/${customerId}`, {
      method: 'DELETE',
    })
  },

  /**
   * Get customer usage statistics
   */
  async getCustomerUsage(customerId: string): Promise<ApiResponse<{ usage: any }> | ApiError> {
    return apiRequest<{ usage: any }>(`/admin/customers/${customerId}/usage`)
  },

  /**
   * Get customer API keys
   */
  async getCustomerApiKeys(customerId: string): Promise<ApiResponse<{ apiKeys: ApiKey[] }> | ApiError> {
    return apiRequest<{ apiKeys: ApiKey[] }>(`/admin/customers/${customerId}/keys`)
  },

  /**
   * Get all wallet transactions (for revenue tracking)
   */
  async getWalletTransactions(params?: {
    limit?: number
    offset?: number
    type?: 'all' | 'credit' | 'debit'
    startDate?: string
    endDate?: string
  }): Promise<ApiResponse<{
    transactions: any[]
    pagination: any
    summary: {
      totalCredits: number
      totalDebits: number
      netRevenue: number
      transactionCount: number
    }
  }> | ApiError> {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.offset) queryParams.append('offset', params.offset.toString())
    if (params?.type) queryParams.append('type', params.type)
    if (params?.startDate) queryParams.append('startDate', params.startDate)
    if (params?.endDate) queryParams.append('endDate', params.endDate)
    
    const queryString = queryParams.toString()
    return apiRequest(`/admin/customers/wallet/transactions${queryString ? `?${queryString}` : ''}`)
  },
}

// ============================================================================
// API KEY MANAGEMENT SERVICES
// ============================================================================

export const apiKeyService = {
  /**
   * Get all API keys
   */
  async getAllApiKeys(filters?: ApiKeyFilters): Promise<ApiResponse<{ apiKeys: ApiKeyWithCustomer[] }> | ApiError> {
    const params = new URLSearchParams()
    if (filters?.status) params.append('status', filters.status)
    if (filters?.customerId) params.append('customerId', filters.customerId)
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())
    
    const queryString = params.toString()
    return apiRequest<{ apiKeys: ApiKeyWithCustomer[] }>(
      `/admin/customers/api-keys${queryString ? `?${queryString}` : ''}`
    )
  },

  /**
   * Revoke API key
   */
  async revokeApiKey(keyId: string): Promise<ApiResponse<{ message: string }> | ApiError> {
    return apiRequest<{ message: string }>(`/admin/customers/api-keys/${keyId}/revoke`, {
      method: 'POST',
    })
  },
}

// ============================================================================
// MONITORING SERVICES
// ============================================================================

export const monitoringService = {
  /**
   * Get API statistics
   */
  async getStats(): Promise<ApiResponse<{ system: SystemInfo; api: ApiStatistics }> | ApiError> {
    return apiRequest<{ system: SystemInfo; api: ApiStatistics }>('/admin/monitoring/stats')
  },

  /**
   * Get rate limit information
   */
  async getRateLimitStats(): Promise<ApiResponse<RateLimitStats> | ApiError> {
    return apiRequest<RateLimitStats>('/admin/monitoring/rate-limit')
  },

  /**
   * Get audit logs
   */
  async getAuditLogs(params?: {
    limit?: number
    offset?: number
  }): Promise<ApiResponse<{ logs: AuditLog[]; pagination: any }> | ApiError> {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.offset) queryParams.append('offset', params.offset.toString())
    
    const queryString = queryParams.toString()
    return apiRequest<{ logs: AuditLog[]; pagination: any }>(
      `/admin/audit/logs${queryString ? `?${queryString}` : ''}`
    )
  },
}

// ============================================================================
// SYSTEM ADMIN SERVICES
// ============================================================================

export const systemService = {
  /**
   * Create new admin
   */
  async createAdmin(data: CreateAdminRequest): Promise<ApiResponse<{ admin: Admin; message: string }> | ApiError> {
    return apiRequest<{ admin: Admin; message: string }>('/admin/management', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  /**
   * Get all admins (Super Admin only)
   */
  async listAdmins(): Promise<ApiResponse<{ admins: Admin[] }> | ApiError> {
    return apiRequest<{ admins: Admin[] }>('/admin/management')
  },

  /**
   * Get specific admin details
   */
  async getAdmin(adminId: string): Promise<ApiResponse<{ admin: Admin }> | ApiError> {
    return apiRequest<{ admin: Admin }>(`/admin/management/${adminId}`)
  },

  /**
   * Update admin details
   */
  async updateAdmin(adminId: string, data: UpdateAdminProfileRequest): Promise<ApiResponse<{ admin: Admin; message: string }> | ApiError> {
    return apiRequest<{ admin: Admin; message: string }>(`/admin/management/${adminId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  /**
   * Delete admin
   */
  async deleteAdmin(adminId: string): Promise<ApiResponse<{ message: string }> | ApiError> {
    return apiRequest<{ message: string }>(`/admin/management/${adminId}`, {
      method: 'DELETE',
    })
  },

  /**
   * Get admin audit log (self)
   */
  async getAuditLog(): Promise<ApiResponse<{ logs: AuditLog[] }> | ApiError> {
    return apiRequest<{ logs: AuditLog[] }>('/admin/audit/self')
  },
}

// ============================================================================
// VERIFICATION SERVICES
// ============================================================================

export const verificationService = {
  /**
   * Get verification queue (customers in admin_review)
   */
  async getQueue(): Promise<ApiResponse<{ customers: any[]; total: number }> | ApiError> {
    return apiRequest<{ customers: any[]; total: number }>('/admin/verification/queue')
  },

  /**
   * List verifications by status (admin_review|verified|rejected|cac_pending|inactive|all)
   */
  async list(status: string = 'all'): Promise<ApiResponse<{ customers: any[]; total: number }> | ApiError> {
    const qs = new URLSearchParams({ status }).toString()
    return apiRequest<{ customers: any[]; total: number }>(`/admin/verification/list?${qs}`)
  },

  /**
   * Get full verification details for a customer
   */
  async getDetails(customerId: string): Promise<ApiResponse<any> | ApiError> {
    return apiRequest<any>(`/admin/verification/${customerId}`)
  },

  /**
   * Approve verification
   */
  async approve(customerId: string, adminNotes?: string): Promise<ApiResponse<any> | ApiError> {
    return apiRequest<any>(`/admin/verification/${customerId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ adminNotes }),
    })
  },

  /**
   * Reject verification
   */
  async reject(customerId: string, reason: string, adminNotes?: string): Promise<ApiResponse<any> | ApiError> {
    return apiRequest<any>(`/admin/verification/${customerId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason, adminNotes }),
    })
  },

  /**
   * Get verification stats
   */
  async getStats(): Promise<ApiResponse<any> | ApiError> {
    return apiRequest<any>('/admin/verification/stats')
  },
}

// ============================================================================
// PRICING MANAGEMENT SERVICES
// ============================================================================

export const pricingService = {
  /**
   * Get all service pricing
   */
  async getAll(activeOnly?: boolean): Promise<ApiResponse<{ pricing: any[] }> | ApiError> {
    const params = new URLSearchParams()
    if (activeOnly) params.append('activeOnly', 'true')
    const queryString = params.toString()
    return apiRequest<{ pricing: any[] }>(`/admin/pricing${queryString ? `?${queryString}` : ''}`)
  },

  /**
   * Get pricing for specific service
   */
  async get(serviceCode: string): Promise<ApiResponse<{ pricing: any }> | ApiError> {
    return apiRequest<{ pricing: any }>(`/admin/pricing/${serviceCode}`)
  },

  /**
   * Create new service pricing
   */
  async create(data: {
    serviceCode: string
    serviceName: string
    priceKobo: number
    description?: string
    category?: string
    isActive?: boolean
  }): Promise<ApiResponse<{ pricing: any; message: string }> | ApiError> {
    return apiRequest<{ pricing: any; message: string }>('/admin/pricing', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  /**
   * Update service pricing
   */
  async update(
    serviceCode: string,
    data: {
      serviceName?: string
      priceKobo?: number
      description?: string
      category?: string
      isActive?: boolean
    }
  ): Promise<ApiResponse<{ pricing: any; message: string }> | ApiError> {
    return apiRequest<{ pricing: any; message: string }>(`/admin/pricing/${serviceCode}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  /**
   * Delete service pricing
   */
  async delete(serviceCode: string): Promise<ApiResponse<{ message: string }> | ApiError> {
    return apiRequest<{ message: string }>(`/admin/pricing/${serviceCode}`, {
      method: 'DELETE',
    })
  },

  /**
   * Seed default pricing (for initial setup)
   */
  async seed(): Promise<ApiResponse<{ created: number; skipped: number; total: number; message: string }> | ApiError> {
    return apiRequest<{ created: number; skipped: number; total: number; message: string }>('/admin/pricing/seed', {
      method: 'POST',
    })
  },
}

// Export all services as a single object
export const adminApi = {
  auth: authService,
  dashboard: dashboardService,
  customers: customerService,
  apiKeys: apiKeyService,
  monitoring: monitoringService,
  system: systemService,
  verification: verificationService,
  pricing: pricingService,
}

export default adminApi
