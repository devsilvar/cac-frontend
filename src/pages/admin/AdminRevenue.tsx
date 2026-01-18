/**
 * Admin Revenue & Transactions Page
 * Shows REAL wallet transactions and revenue data
 */

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CreditCardIcon,
  FunnelIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'
import { adminApi } from '../../services/admin.service'
import toast from 'react-hot-toast'

const AdminRevenue: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'credit' | 'debit'>('all')
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: '',
  })

  useEffect(() => {
    loadTransactions()
  }, [filter])

  const loadTransactions = async () => {
    setLoading(true)
    try {
      const params: any = { limit: 50, type: filter }
      if (dateRange.start) params.startDate = dateRange.start
      if (dateRange.end) params.endDate = dateRange.end

      const res = await adminApi.customers.getWalletTransactions(params)
      if (res.success) {
        setTransactions(res.data.transactions)
        setSummary(res.data.summary)
      } else {
        toast.error('error' in res ? res.error.message : 'Failed to load transactions')
      }
    } catch (error) {
      toast.error('Failed to load revenue data')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (kobo: number) => {
    return `₦${(kobo / 100).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      reversed: 'bg-gray-100 text-gray-800',
    }
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    )
  }

  const getTypeBadge = (type: string) => {
    return type === 'credit' ? (
      <span className="inline-flex items-center text-green-600 font-medium">
        <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
        Credit
      </span>
    ) : (
      <span className="inline-flex items-center text-red-600 font-medium">
        <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
        Debit
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-sm text-gray-500">Loading revenue data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Revenue & Transactions</h1>
          <p className="mt-1 text-sm text-gray-500">
            Real-time wallet transactions from all customers
          </p>
        </div>
        <button
          onClick={loadTransactions}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <ArrowPathIcon className="h-5 w-5 mr-2" />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard
            label="Total Credits"
            value={formatCurrency(summary.totalCredits)}
            icon={ArrowTrendingUpIcon}
            color="green"
            subtitle={`${transactions.filter(t => t.type === 'credit' && t.status === 'completed').length} completed`}
          />
          <SummaryCard
            label="Total Debits"
            value={formatCurrency(summary.totalDebits)}
            icon={ArrowTrendingDownIcon}
            color="red"
            subtitle={`${transactions.filter(t => t.type === 'debit' && t.status === 'completed').length} completed`}
          />
          <SummaryCard
            label="Total Revenue"
            value={formatCurrency(summary.netRevenue)}
            icon={BanknotesIcon}
            color="blue"
            subtitle="Customer payments only"
          />
          <SummaryCard
            label="Total Transactions"
            value={summary.transactionCount.toString()}
            icon={CreditCardIcon}
            color="purple"
            subtitle="All statuses"
          />
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filter:</span>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'all'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('credit')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'credit'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Credits Only
            </button>
            <button
              onClick={() => setFilter('debit')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'debit'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Debits Only
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((txn) => (
                <motion.tr
                  key={txn.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(txn.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {txn.customer?.company || txn.customer?.email || 'Unknown'}
                    </div>
                    <div className="text-xs text-gray-500">{txn.customer?.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {getTypeBadge(txn.type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-bold ${
                      txn.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {txn.type === 'credit' ? '+' : '-'}{formatCurrency(Math.abs(txn.amount))}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {txn.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {getStatusBadge(txn.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-mono">
                    {txn.reference}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {transactions.length === 0 && (
          <div className="text-center py-12">
            <BanknotesIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Transactions will appear here when customers top up their wallets or use APIs.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// Summary Card Component
const SummaryCard: React.FC<{
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  color: 'green' | 'red' | 'blue' | 'purple'
  subtitle?: string
}> = ({ label, value, icon: Icon, color, subtitle }) => {
  const colorClasses = {
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200"
    >
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`rounded-lg p-3 ${colorClasses[color]}`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1 min-w-0">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{label}</dt>
              <dd className="text-xl font-bold text-gray-900 break-words leading-tight" title={value}>{value}</dd>
              {subtitle && <dd className="text-xs text-gray-500 mt-1 truncate" title={subtitle}>{subtitle}</dd>}
            </dl>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default AdminRevenue
