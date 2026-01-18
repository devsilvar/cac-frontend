/**
 * REFACTORED AdminCustomers Page
 * Demonstrates using new reusable components and hooks
 * 
 * BEFORE: ~670 lines with manual state management
 * AFTER: ~150 lines using reusable components
 * 
 * Compare this with AdminCustomers.tsx to see the improvements
 */

import React from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../layouts/AdminLayout'
import { 
  DataTable, 
  PageHeader, 
  StatsCard, 
  Badge, 
  EmptyState,
  Column 
} from '../../components/shared'
import { useQuery } from '../../hooks'
import { Users, UserCheck, UserX, Activity, Plus } from 'lucide-react'
import { useAdminAuth } from '../../hooks/useAdminAuth'

interface Customer {
  id: string
  email: string
  businessName: string
  isVerified: boolean
  status: 'active' | 'suspended' | 'pending'
  usage: number
  walletBalance: number
  createdAt: string
}

const AdminCustomersRefactored: React.FC = () => {
  const navigate = useNavigate()
  const { adminApi } = useAdminAuth()

  // Fetch customers with caching and auto-refetch
  const { data: customers, loading, error, refetch } = useQuery<Customer[]>(
    'admin-customers',
    async () => {
      const response = await adminApi.get('/api/v1/admin/customers')
      return response.data || []
    },
    {
      refetchInterval: 30000 // Auto-refetch every 30 seconds
    }
  )

  // Calculate stats from customers data
  const stats = React.useMemo(() => {
    if (!customers) return { total: 0, verified: 0, pending: 0, active: 0 }
    
    return {
      total: customers.length,
      verified: customers.filter(c => c.isVerified).length,
      pending: customers.filter(c => c.status === 'pending').length,
      active: customers.filter(c => c.status === 'active').length
    }
  }, [customers])

  // Define table columns
  const columns: Column<Customer>[] = [
    {
      key: 'businessName',
      label: 'Business Name',
      sortable: true,
      render: (value, customer) => (
        <div>
          <p className="font-medium text-gray-900">{value || 'N/A'}</p>
          <p className="text-sm text-gray-500">{customer.email}</p>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => {
        const variants = {
          active: 'success' as const,
          suspended: 'error' as const,
          pending: 'warning' as const
        }
        return (
          <Badge variant={variants[value as keyof typeof variants]}>
            {value}
          </Badge>
        )
      }
    },
    {
      key: 'isVerified',
      label: 'Verified',
      sortable: true,
      render: (value) => (
        <Badge variant={value ? 'success' : 'warning'}>
          {value ? 'Verified' : 'Unverified'}
        </Badge>
      )
    },
    {
      key: 'usage',
      label: 'API Calls',
      sortable: true,
      render: (value) => (
        <span className="text-gray-900 font-medium">{value || 0}</span>
      )
    },
    {
      key: 'walletBalance',
      label: 'Balance',
      sortable: true,
      render: (value) => (
        <span className="text-gray-900">₦{(value || 0).toLocaleString()}</span>
      )
    },
    {
      key: 'createdAt',
      label: 'Joined',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString()
    },
    {
      key: 'id',
      label: 'Actions',
      render: (value) => (
        <button
          onClick={() => navigate(`/admin/customers/${value}`)}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          View Details
        </button>
      )
    }
  ]

  // Loading state
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      </AdminLayout>
    )
  }

  // Error state
  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error.message}</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Customers"
          description="Manage customer accounts and monitor their activity"
          icon={Users}
          breadcrumbs={[
            { label: 'Dashboard', href: '/admin' },
            { label: 'Customers' }
          ]}
          actions={
            <>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Refresh
              </button>
              <button
                onClick={() => navigate('/admin/customers/new')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Customer
              </button>
            </>
          }
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard
            title="Total Customers"
            value={stats.total}
            icon={Users}
            iconColor="text-blue-600"
            iconBgColor="bg-blue-100"
            description="All registered customers"
          />
          <StatsCard
            title="Verified"
            value={stats.verified}
            icon={UserCheck}
            iconColor="text-green-600"
            iconBgColor="bg-green-100"
            description="Business verified"
          />
          <StatsCard
            title="Pending"
            value={stats.pending}
            icon={UserX}
            iconColor="text-yellow-600"
            iconBgColor="bg-yellow-100"
            description="Awaiting verification"
          />
          <StatsCard
            title="Active"
            value={stats.active}
            icon={Activity}
            iconColor="text-purple-600"
            iconBgColor="bg-purple-100"
            description="Currently active"
          />
        </div>

        {/* Data Table */}
        {customers && customers.length > 0 ? (
          <DataTable
            columns={columns}
            data={customers}
            keyExtractor={(customer) => customer.id}
            searchable
            searchPlaceholder="Search by name or email..."
            emptyMessage="No customers found"
          />
        ) : (
          <EmptyState
            icon={Users}
            title="No customers yet"
            description="Customer accounts will appear here once they sign up"
            action={{
              label: 'Invite Customer',
              onClick: () => navigate('/admin/customers/invite')
            }}
          />
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminCustomersRefactored
