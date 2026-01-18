import React from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, CheckCircle, Shield, Clock, ArrowRight } from 'lucide-react'
import { useVerification, VerificationStatus } from '../context/VerificationContext'

interface VerificationBannerProps {
  /** Optional context message for where API keys are mentioned */
  context?: 'dashboard' | 'api-keys' | 'general'
  /** Whether to show the banner while loading */
  showWhileLoading?: boolean
  /** Custom class name for the container */
  className?: string
}

/**
 * Reusable verification status banner component
 * Displays appropriate messaging based on the user's verification status
 * Uses the centralized VerificationContext for consistent state
 */
const VerificationBanner: React.FC<VerificationBannerProps> = ({ 
  context = 'general',
  showWhileLoading = false,
  className = ''
}) => {
  const { status, data, loading, isVerified } = useVerification()

  // Don't show banner if verified or loading (unless showWhileLoading is true)
  if (isVerified) return null
  if (loading && !showWhileLoading) return null

  // Loading state
  if (loading) {
    return (
      <div className={`bg-blue-50 border border-blue-200 rounded-xl p-6 ${className}`}>
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
          <p className="text-blue-800">Loading verification status...</p>
        </div>
      </div>
    )
  }

  // Get context-specific messages
  const getInactiveMessage = () => {
    switch (context) {
      case 'api-keys':
        return 'You must complete business verification before creating API keys. This ensures secure access to our services.'
      case 'dashboard':
        return 'Your account is inactive. Complete business verification to access Business APIs.'
      default:
        return 'Complete business verification to access all features.'
    }
  }

  const getPendingMessage = () => {
    switch (context) {
      case 'api-keys':
        return 'Your verification has been submitted and is being processed. API key creation will be available once verified.'
      default:
        return 'Your verification has been submitted and is being processed. We\'ll notify you once it\'s complete.'
    }
  }

  const getCacPendingMessage = () => {
    switch (context) {
      case 'api-keys':
        return 'We\'re verifying your CAC registration. API key creation will be available once verified.'
      default:
        return 'We\'re verifying your CAC registration. This usually takes a few minutes. Please check back shortly.'
    }
  }

  const getAdminReviewMessage = () => {
    switch (context) {
      case 'api-keys':
        return 'Your CAC registration has been verified. Our team is reviewing your information.'
      default:
        return 'Your CAC registration has been verified successfully. Our team is reviewing your information.'
    }
  }

  const getRejectedMessage = () => {
    const reason = data?.rejectionReason
    if (reason) return reason
    switch (context) {
      case 'api-keys':
        return 'Your verification was rejected. Please review and resubmit with correct information to create API keys.'
      default:
        return 'Your verification was rejected. Please review and resubmit with correct information.'
    }
  }

  // Banner configuration based on status
  const bannerConfig: Record<VerificationStatus, {
    bgColor: string
    borderColor: string
    iconColor: string
    titleColor: string
    textColor: string
    badgeColor?: string
    icon: React.ReactNode
    title: string
    message: string
    showCta: boolean
    ctaText?: string
    ctaColor?: string
  }> = {
    inactive: {
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      iconColor: 'text-orange-600',
      titleColor: 'text-orange-900',
      textColor: 'text-orange-800',
      icon: <AlertCircle className="w-6 h-6" />,
      title: context === 'api-keys' ? 'Verification Required' : 'Complete Business Verification',
      message: getInactiveMessage(),
      showCta: true,
      ctaText: 'Start Verification',
      ctaColor: 'bg-orange-600 hover:bg-orange-700'
    },
    pending: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-600',
      titleColor: 'text-yellow-900',
      textColor: 'text-yellow-800',
      icon: <Clock className="w-6 h-6 animate-pulse" />,
      title: 'Verification Submitted',
      message: getPendingMessage(),
      showCta: false
    },
    cac_pending: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-900',
      textColor: 'text-blue-800',
      icon: <Clock className="w-6 h-6 animate-pulse" />,
      title: 'CAC Verification in Progress',
      message: getCacPendingMessage(),
      showCta: false
    },
    admin_review: {
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      iconColor: 'text-purple-600',
      titleColor: 'text-purple-900',
      textColor: 'text-purple-800',
      badgeColor: 'text-purple-700',
      icon: <Clock className="w-6 h-6 animate-pulse" />,
      title: 'Verification Under Review',
      message: getAdminReviewMessage(),
      showCta: false
    },
    verified: {
      bgColor: '',
      borderColor: '',
      iconColor: '',
      titleColor: '',
      textColor: '',
      icon: null,
      title: '',
      message: '',
      showCta: false
    },
    rejected: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-600',
      titleColor: 'text-red-900',
      textColor: 'text-red-800',
      icon: <AlertCircle className="w-6 h-6" />,
      title: 'Verification Rejected',
      message: getRejectedMessage(),
      showCta: true,
      ctaText: 'Resubmit Verification',
      ctaColor: 'bg-red-600 hover:bg-red-700'
    }
  }

  const config = bannerConfig[status]
  if (!config || !config.title) return null

  return (
    <div className={`rounded-xl p-6 border ${config.bgColor} ${config.borderColor} ${className}`}>
      <div className="flex items-start">
        <div className={`mt-1 mr-4 flex-shrink-0 ${config.iconColor}`}>
          {config.icon}
        </div>
        <div className="flex-1">
          <h3 className={`text-lg font-semibold mb-1 ${config.titleColor}`}>
            {config.title}
          </h3>
          <p className={`${config.textColor} ${config.showCta ? 'mb-4' : ''}`}>
            {config.message}
          </p>
          
          {/* CAC Verified Badge for admin_review status */}
          {status === 'admin_review' && (
            <div className={`flex items-center text-sm mt-2 ${config.badgeColor}`}>
              <CheckCircle className="w-4 h-4 mr-2" />
              CAC Verified • Average review time: 24-48 hours
            </div>
          )}

          {/* CTA Button */}
          {config.showCta && (
            <Link
              to="/customer/verification"
              className={`inline-flex items-center px-6 py-3 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg ${config.ctaColor}`}
            >
              <Shield className="w-5 h-5 mr-2" />
              {config.ctaText}
              {status === 'inactive' && <ArrowRight className="w-5 h-5 ml-2" />}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default VerificationBanner
