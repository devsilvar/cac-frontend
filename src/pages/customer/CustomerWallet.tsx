import React, { useEffect, useState, useCallback } from 'react'
import CustomerDashboardLayout from '../../layouts/CustomerDashboardLayout'
import { 
  Wallet, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Clock, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  CreditCard,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  AlertCircle,
  Loader2,
  Plus,
  History,
  Banknote
} from 'lucide-react'
import { walletService, WalletBalance, WalletTransaction, TransactionHistory, formatNaira } from '../../services/wallet.service'
import { WALLET_TIERS } from '../../config/apiPricing'

// Paystack types - inline.js v1 and v2 support
declare global {
  interface Window {
    PaystackPop?: {
      setup: (config: any) => { openIframe: () => void }
    }
  }
}

// Helper to create Paystack handler with proper callback
const createPaystackHandler = (config: {
  key: string
  email: string
  amount: number
  ref: string
  onSuccess: (response: any) => void
  onClose: () => void
}) => {
  const PaystackPop = (window as any).PaystackPop
  if (!PaystackPop) return null
  
  return PaystackPop.setup({
    key: config.key,
    email: config.email,
    amount: config.amount,
    ref: config.ref,
    onSuccess: config.onSuccess,
    onClose: config.onClose,
    // Also include callback for v1 compatibility
    callback: config.onSuccess
  })
}

const CustomerWallet: React.FC = () => {
  const [balance, setBalance] = useState<WalletBalance | null>(null)
  const [transactions, setTransactions] = useState<TransactionHistory | null>(null)
  const [loading, setLoading] = useState(true)
  const [topUpLoading, setTopUpLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [showTopUpModal, setShowTopUpModal] = useState(false)
  const [customAmount, setCustomAmount] = useState('')
  const [selectedTier, setSelectedTier] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Load wallet data
  const loadWalletData = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true)
    setError(null)
    
    try {
      const [balanceData, transactionData] = await Promise.all([
        walletService.getBalance(),
        walletService.getTransactions(10, 0)
      ])
      setBalance(balanceData)
      setTransactions(transactionData)
    } catch (err: any) {
      setError(err.message || 'Failed to load wallet data')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    loadWalletData()
  }, [loadWalletData])

  // Handle Paystack payment
  const handleTopUp = async (amountNaira: number) => {
    setTopUpLoading(true)
    setError(null)

    try {
      const topUpData = await walletService.initiateTopUp(amountNaira)
      
      // Store topUpData for use in callbacks
      const reference = topUpData.payment.reference
      const formattedAmount = topUpData.amount.formatted
      
      // Use Paystack redirect flow (more reliable than popup)
      // The callback page will handle verification after payment
      window.location.href = topUpData.payment.url
    } catch (err: any) {
      setError(err.message || 'Failed to initiate payment')
      setTopUpLoading(false)
    }
  }

  // Handle custom amount submit
  const handleCustomTopUp = () => {
    const amount = parseFloat(customAmount)
    if (isNaN(amount) || amount < 100) {
      setError('Minimum top-up amount is ₦100')
      return
    }
    if (amount > 1000000) {
      setError('Maximum top-up amount is ₦1,000,000')
      return
    }
    handleTopUp(amount)
  }

  // Handle tier selection
  const handleTierTopUp = (amount: number) => {
    setSelectedTier(amount)
    handleTopUp(amount)
  }

  // Get status icon and color
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'completed':
        return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Completed' }
      case 'pending':
        return { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Pending' }
      case 'failed':
        return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Failed' }
      case 'reversed':
        return { icon: RefreshCw, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Reversed' }
      default:
        return { icon: Clock, color: 'text-gray-600', bg: 'bg-gray-100', label: status }
    }
  }

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-NG', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <CustomerDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </CustomerDashboardLayout>
    )
  }

  return (
    <CustomerDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Wallet</h1>
            <p className="text-gray-600 mt-1">Manage your wallet balance and transactions</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => loadWalletData(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => setShowTopUpModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              <Plus className="w-4 h-4" />
              Top Up Wallet
            </button>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto text-red-600 hover:text-red-800">
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-green-700">{successMessage}</p>
            <button onClick={() => setSuccessMessage(null)} className="ml-auto text-green-600 hover:text-green-800">
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-6 md:p-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Wallet className="w-6 h-6" />
                </div>
                <span className="text-white/80 text-sm font-medium">Available Balance</span>
              </div>
              <div className="text-4xl md:text-5xl font-bold tracking-tight break-words">
                {balance?.formatted || '₦0.00'}
              </div>
              <p className="text-white/70 text-sm mt-2 truncate">
                {balance ? `${balance.kobo.toLocaleString()} kobo` : 'No balance data'}
              </p>
            </div>
            
            <div className="flex flex-col gap-3 flex-shrink-0">
              <button
                onClick={() => setShowTopUpModal(true)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-purple-600 font-semibold rounded-xl hover:bg-white/90 transition-all shadow-lg whitespace-nowrap"
              >
                <CreditCard className="w-5 h-5" />
                Add Money
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        {transactions?.summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-600 truncate">Total Credits</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 break-words">{transactions.summary.totalCredits.formatted}</div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-sm font-medium text-gray-600 truncate">Total Debits</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 break-words">{transactions.summary.totalDebits.formatted}</div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Banknote className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-600 truncate">Net Change</span>
              </div>
              <div className={`text-2xl font-bold break-words ${transactions.summary.netChange.kobo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {transactions.summary.netChange.kobo >= 0 ? '+' : ''}{transactions.summary.netChange.formatted}
              </div>
            </div>
          </div>
        )}

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
            </div>
            <span className="text-sm text-gray-500">
              {transactions?.pagination.total || 0} total
            </span>
          </div>

          {transactions?.transactions && transactions.transactions.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {transactions.transactions.map((txn) => {
                const status = getStatusDisplay(txn.status)
                const StatusIcon = status.icon
                const isCredit = txn.type === 'credit'

                return (
                  <div key={txn.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      {/* Transaction Type Icon */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCredit ? 'bg-green-100' : 'bg-red-100'}`}>
                        {isCredit ? (
                          <ArrowDownCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <ArrowUpCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 truncate">{txn.description}</span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {status.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                          <span>{formatDate(txn.createdAt)}</span>
                          <span>•</span>
                          <span className="font-mono text-xs">{txn.reference}</span>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className={`text-right flex-shrink-0 ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
                        <div className="font-semibold whitespace-nowrap">
                          {isCredit ? '+' : '-'}{txn.amount.formatted}
                        </div>
                        <div className="text-xs text-gray-500 whitespace-nowrap">
                          Bal: {formatNaira(txn.balanceAfter.naira)}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Transactions Yet</h3>
              <p className="text-gray-600 mb-4">Top up your wallet to get started with API calls</p>
              <button
                onClick={() => setShowTopUpModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Money
              </button>
            </div>
          )}

          {transactions?.pagination.hasMore && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All Transactions
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Top Up Modal - Simple & Clean */}
      {showTopUpModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowTopUpModal(false)
          }}
        >
          <div 
            className="bg-white rounded-xl w-full max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Top Up Wallet</h2>
              <button
                onClick={() => setShowTopUpModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Current Balance */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-xs text-gray-600 mb-1">Current Balance</div>
                <div className="text-2xl font-bold text-gray-900">{balance?.formatted || '₦0.00'}</div>
              </div>

              {/* Quick Amount Selection - Only 2 options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Quick Select</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleTierTopUp(5000)}
                    disabled={topUpLoading}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="text-lg font-bold text-gray-900">₦5,000</div>
                    <div className="text-xs text-gray-500 mt-1">Recommended</div>
                    {selectedTier === 5000 && topUpLoading && (
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600 mx-auto mt-2" />
                    )}
                  </button>
                  <button
                    onClick={() => handleTierTopUp(10000)}
                    disabled={topUpLoading}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="text-lg font-bold text-gray-900">₦10,000</div>
                    <div className="text-xs text-gray-500 mt-1">Best value</div>
                    {selectedTier === 10000 && topUpLoading && (
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600 mx-auto mt-2" />
                    )}
                  </button>
                </div>
              </div>

              {/* Custom Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Custom Amount</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₦</span>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="Enter amount"
                      min="100"
                      max="1000000"
                      className="w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <button
                    onClick={handleCustomTopUp}
                    disabled={topUpLoading || !customAmount}
                    className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {topUpLoading && selectedTier === null ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Pay'
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1.5">Min: ₦100 • Max: ₦1,000,000</p>
              </div>

              {/* Payment Info */}
              <div className="bg-blue-50 rounded-lg p-3 flex items-start gap-2">
                <CreditCard className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800">
                  Secure payment via Paystack. Your wallet will be credited instantly.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </CustomerDashboardLayout>
  )
}

export default CustomerWallet
