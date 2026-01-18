import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { walletService } from '../../services/wallet.service'

/**
 * Handles Paystack redirect callback after payment
 * URL: /customer/wallet/callback?reference=xxx&trxref=xxx
 */
const WalletCallback: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [amount, setAmount] = useState<string>('')

  useEffect(() => {
    const verifyPayment = async () => {
      // Get reference from URL params (Paystack sends both 'reference' and 'trxref')
      const reference = searchParams.get('reference') || searchParams.get('trxref')

      if (!reference) {
        setStatus('error')
        setMessage('Invalid payment reference. Please try again.')
        return
      }

      try {
        // Verify the payment with the backend
        const result = await walletService.verifyTopUp(reference)
        
        if (result.verified && result.status === 'success') {
          setStatus('success')
          setAmount(result.amount?.formatted || '')
          setMessage('Your wallet has been credited successfully!')
        } else if (result.status === 'pending') {
          setStatus('loading')
          setMessage('Payment is being processed. Please wait...')
          // Retry after a few seconds
          setTimeout(() => verifyPayment(), 3000)
        } else {
          setStatus('error')
          setMessage(result.message || 'Payment verification failed. Please contact support if amount was debited.')
        }
      } catch (err: any) {
        console.error('[WalletCallback] Verification error:', err)
        setStatus('error')
        setMessage(err.message || 'Failed to verify payment. Please check your wallet or contact support.')
      }
    }

    verifyPayment()
  }, [searchParams])

  const handleContinue = () => {
    navigate('/customer/wallet')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {/* Loading State */}
        {status === 'loading' && (
          <>
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment</h1>
            <p className="text-gray-600 mb-6">{message || 'Please wait while we confirm your payment...'}</p>
          </>
        )}

        {/* Success State */}
        {status === 'success' && (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            {amount && (
              <p className="text-3xl font-bold text-green-600 mb-2">{amount}</p>
            )}
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              onClick={handleContinue}
              className="w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors"
            >
              Go to Wallet
            </button>
          </>
        )}

        {/* Error State */}
        {status === 'error' && (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Issue</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <button
                onClick={handleContinue}
                className="w-full bg-gray-900 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Go to Wallet
              </button>
              <button
                onClick={() => navigate('/customer/dashboard')}
                className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default WalletCallback
