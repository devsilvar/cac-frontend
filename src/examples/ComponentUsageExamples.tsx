/**
 * EXAMPLE FILE - DO NOT USE IN PRODUCTION
 * This file demonstrates how to use the new reusable components and hooks
 * Delete this file after reviewing examples
 */

import React from 'react'
import { 
  DataTable, 
  StatsCard, 
  EmptyState, 
  PageHeader, 
  Badge,
  InputField,
  Column
} from '../components/shared'
import { useQuery, useMutation, usePagination, useDebounce } from '../hooks'
import { Users, TrendingUp, Plus, Inbox } from 'lucide-react'

// ============================================
// EXAMPLE 1: Using DataTable Component
// ============================================
interface User {
  id: string
  name: string
  email: string
  status: 'active' | 'inactive'
  usage: number
}

function UsersTableExample() {
  const { data: users, loading } = useQuery<User[]>(
    'users',
    async () => {
      const res = await fetch('/api/v1/admin/customers')
      return res.json()
    }
  )

  const columns: Column<User>[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <Badge variant={value === 'active' ? 'success' : 'default'}>
          {value}
        </Badge>
      )
    },
    {
      key: 'usage',
      label: 'API Calls',
      sortable: true,
      render: (value) => `${value} calls`
    }
  ]

  if (loading) return <div>Loading...</div>

  return (
    <DataTable
      columns={columns}
      data={users || []}
      keyExtractor={(user) => user.id}
      searchable
      searchPlaceholder="Search users..."
      emptyMessage="No users found"
    />
  )
}

// ============================================
// EXAMPLE 2: Using StatsCard Component
// ============================================
function DashboardStatsExample() {
  const { data: stats } = useQuery('dashboard-stats', async () => {
    const res = await fetch('/api/v1/admin/dashboard/stats')
    return res.json()
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatsCard
        title="Total Users"
        value={stats?.totalUsers || 0}
        icon={Users}
        iconColor="text-blue-600"
        iconBgColor="bg-blue-100"
        description="Active customers"
        trend={{ value: 12.5, isPositive: true }}
      />
      <StatsCard
        title="API Calls Today"
        value={stats?.apiCallsToday || 0}
        icon={TrendingUp}
        iconColor="text-green-600"
        iconBgColor="bg-green-100"
        description="Requests processed"
      />
    </div>
  )
}

// ============================================
// EXAMPLE 3: Using useMutation Hook
// ============================================
function CreateUserExample() {
  const { mutate, loading, error } = useMutation(
    async (userData: { email: string; password: string }) => {
      const res = await fetch('/api/v1/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })
      return res.json()
    },
    {
      onSuccess: (data) => {
        alert('User created successfully!')
      },
      invalidateQueries: ['users'] // Refetch users list
    }
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    
    await mutate({
      email: formData.get('email') as string,
      password: formData.get('password') as string
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField
        name="email"
        type="email"
        label="Email"
        placeholder="user@example.com"
        required
      />
      <InputField
        name="password"
        type="password"
        label="Password"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create User'}
      </button>
      {error && <p className="text-red-600">{error.message}</p>}
    </form>
  )
}

// ============================================
// EXAMPLE 4: Using PageHeader Component
// ============================================
function PageWithHeaderExample() {
  return (
    <div>
      <PageHeader
        title="Users"
        description="Manage all customer accounts"
        icon={Users}
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Users' }
        ]}
        actions={
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add User
          </button>
        }
      />
      {/* Page content */}
    </div>
  )
}

// ============================================
// EXAMPLE 5: Using EmptyState Component
// ============================================
function EmptyListExample() {
  const { data: items } = useQuery('items', async () => [])

  if (!items || items.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="No items found"
        description="Get started by creating your first item"
        action={{
          label: 'Create Item',
          onClick: () => alert('Create item clicked')
        }}
      />
    )
  }

  return <div>{/* Render items */}</div>
}

// ============================================
// EXAMPLE 6: Using usePagination Hook
// ============================================
function PaginatedListExample() {
  const { data: allItems } = useQuery<any[]>('items', async () => {
    // Fetch data
    return []
  })

  const {
    paginatedData,
    currentPage,
    totalPages,
    nextPage,
    previousPage,
    canGoNext,
    canGoPrevious
  } = usePagination(allItems || [], { pageSize: 10 })

  return (
    <div>
      {/* Render paginatedData */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={previousPage}
          disabled={!canGoPrevious}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={nextPage}
          disabled={!canGoNext}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}

// ============================================
// EXAMPLE 7: Using useDebounce Hook
// ============================================
function SearchExample() {
  const [searchTerm, setSearchTerm] = React.useState('')
  const debouncedSearch = useDebounce(searchTerm, 500)

  // This only runs when user stops typing for 500ms
  const { data: results } = useQuery(
    `search-${debouncedSearch}`,
    async () => {
      if (!debouncedSearch) return []
      const res = await fetch(`/api/v1/search?q=${debouncedSearch}`)
      return res.json()
    },
    { enabled: debouncedSearch.length > 0 }
  )

  return (
    <InputField
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  )
}

export default function ComponentUsageExamples() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Component Usage Examples</h1>
      <p className="text-gray-600">See examples above in the code</p>
    </div>
  )
}
