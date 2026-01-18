import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ShieldCheckIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  BuildingOfficeIcon,
  FunnelIcon,
  ArrowPathIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'
import { adminApi } from '../../services/admin.service'

interface QueueItem {
  id: string
  email: string
  company?: string
  verificationStatus?: string
  submittedAt?: string
  businessInfo?: {
    rcNumber?: string
    companyName?: string
  }
  cacVerification?: {
    verified?: boolean
    qoreidCompanyName?: string
    qoreidStatus?: string
    nameMatch?: boolean
  }
}

function StatusBadge({ status }: { status?: string }) {
  const s = status || 'verified'

  const cfg: Record<string, { label: string; cls: string }> = {
    inactive: { label: 'Inactive', cls: 'bg-orange-100 text-orange-800' },
    cac_pending: { label: 'CAC Pending', cls: 'bg-blue-100 text-blue-800' },
    cac_verified: { label: 'CAC Verified', cls: 'bg-indigo-100 text-indigo-800' },
    admin_review: { label: 'Admin Review', cls: 'bg-purple-100 text-purple-800' },
    verified: { label: 'Verified', cls: 'bg-green-100 text-green-800' },
    rejected: { label: 'Rejected', cls: 'bg-red-100 text-red-800' },
  }

  const meta = cfg[s] || { label: s, cls: 'bg-gray-100 text-gray-800' }

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${meta.cls}`}>
      {meta.label}
    </span>
  )
}

export default function AdminVerificationQueue() {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<QueueItem[]>([])
  const [query, setQuery] = useState('')
  const [nameMatchFilter, setNameMatchFilter] = useState<'all' | 'match' | 'mismatch'>('all')
  const [sortOrder, setSortOrder] = useState<'oldest' | 'newest'>('oldest')
  const [view, setView] = useState<'queue' | 'history'>('queue')
  const [statusFilter, setStatusFilter] = useState<'admin_review' | 'verified' | 'rejected' | 'cac_pending' | 'inactive' | 'all'>('admin_review')

  const load = async (status: string) => {
    setLoading(true)
    try {
      // For queue: default admin_review
      // For history: allow all/verified/rejected/etc
      const res = await adminApi.verification.list(status)
      if (res.success) {
        setItems(res.data.customers || [])
      } else {
        setItems([])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(statusFilter)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    let result = items

    // Name match filter
    if (nameMatchFilter !== 'all') {
      result = result.filter(i => {
        const match = Boolean(i.cacVerification?.nameMatch)
        return nameMatchFilter === 'match' ? match : !match
      })
    }

    // Search filter
    if (q) {
      result = result.filter(i =>
        (i.email || '').toLowerCase().includes(q) ||
        (i.company || '').toLowerCase().includes(q) ||
        (i.businessInfo?.rcNumber || '').toLowerCase().includes(q) ||
        (i.businessInfo?.companyName || '').toLowerCase().includes(q) ||
        (i.cacVerification?.qoreidCompanyName || '').toLowerCase().includes(q)
      )
    }

    // Sort
    result = [...result].sort((a, b) => {
      const at = a.submittedAt ? new Date(a.submittedAt).getTime() : 0
      const bt = b.submittedAt ? new Date(b.submittedAt).getTime() : 0
      return sortOrder === 'oldest' ? at - bt : bt - at
    })

    return result
  }, [items, query, nameMatchFilter, sortOrder])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-sm text-gray-500">Loading verifications...</p>
      </div>
    )
  }

  // Calculate stats
  const stats = {
    pending: items.filter(i => i.verificationStatus === 'admin_review').length,
    verified: items.filter(i => i.verificationStatus === 'verified').length,
    rejected: items.filter(i => i.verificationStatus === 'rejected').length,
    cacPending: items.filter(i => i.verificationStatus === 'cac_pending').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Verifications</h1>
          <p className="mt-1 text-sm text-gray-500">
            Review and manage customer verification requests
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => load(statusFilter)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowPathIcon className="h-5 w-5 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          label="Pending Review"
          value={stats.pending}
          icon={ClockIcon}
          color="purple"
        />
        <StatsCard
          label="Verified"
          value={stats.verified}
          icon={CheckCircleIcon}
          color="green"
        />
        <StatsCard
          label="Rejected"
          value={stats.rejected}
          icon={XCircleIcon}
          color="red"
        />
        <StatsCard
          label="CAC Pending"
          value={stats.cacPending}
          icon={ShieldCheckIcon}
          color="blue"
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => {
              setView('queue')
              setStatusFilter('admin_review')
            }}
            className={`${
              view === 'queue'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Review Queue
          </button>
          <button
            onClick={() => {
              setView('history')
              setStatusFilter('all')
            }}
            className={`${
              view === 'history'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            History
          </button>
        </nav>
      </div>

      {/* Filters and Search */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by email, company, RC number..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center">
              <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {view === 'queue' ? (
                  <option value="admin_review">Admin Review</option>
                ) : (
                  <>
                    <option value="all">All Statuses</option>
                    <option value="verified">Verified</option>
                    <option value="rejected">Rejected</option>
                    <option value="cac_pending">CAC Pending</option>
                    <option value="inactive">Inactive</option>
                    <option value="admin_review">Admin Review</option>
                  </>
                )}
              </select>
            </div>

            <select
              value={nameMatchFilter}
              onChange={(e) => setNameMatchFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Name Matches</option>
              <option value="match">Name Match</option>
              <option value="mismatch">Name Mismatch</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="oldest">Oldest First</option>
              <option value="newest">Newest First</option>
            </select>

            <button
              onClick={() => {
                setQuery('')
                setNameMatchFilter('all')
                setSortOrder('oldest')
                setStatusFilter(view === 'queue' ? 'admin_review' : 'all')
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Verifications Found</h3>
            <p className="text-sm text-gray-500">No verification records matched your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    RC Number
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CAC Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                            <BuildingOfficeIcon className="h-6 w-6 text-purple-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {item.businessInfo?.companyName || item.company || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">{item.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.businessInfo?.rcNumber || 'N/A'}</div>
                      {item.cacVerification?.qoreidCompanyName && (
                        <div className="text-xs text-gray-500">
                          QoreID: {item.cacVerification.qoreidCompanyName}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={item.verificationStatus || (view === 'queue' ? 'admin_review' : 'verified')} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.cacVerification?.verified ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                          <XCircleIcon className="h-4 w-4 mr-1" />
                          Failed
                        </span>
                      )}
                      {item.cacVerification?.nameMatch !== undefined && (
                        <div className={`text-xs mt-1 ${item.cacVerification.nameMatch ? 'text-green-600' : 'text-orange-600'}`}>
                          {item.cacVerification.nameMatch ? '✓ Name match' : '⚠ Name mismatch'}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.submittedAt ? new Date(item.submittedAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/admin/verification/${item.id}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-900"
                      >
                        Review
                        <ChevronRightIcon className="h-4 w-4 ml-1" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// Stats Card Component
const StatsCard: React.FC<{
  label: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red'
}> = ({ label, value, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
  }

  return (
    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`rounded-lg p-3 ${colorClasses[color]}`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{label}</dt>
              <dd className="text-2xl font-semibold text-gray-900">{value}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
