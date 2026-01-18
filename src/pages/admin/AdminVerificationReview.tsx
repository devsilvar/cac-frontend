import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  BuildingOfficeIcon,
  UserIcon,
  DocumentTextIcon,
  ArrowTopRightOnSquareIcon,
  ShieldCheckIcon,
  ClockIcon,
  ExclamationCircleIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { adminApi } from '../../services/admin.service'
import toast from 'react-hot-toast'

type VerificationDetails = {
  customer: {
    id: string
    email: string
    company?: string
    createdAt?: string
    verificationStatus?: string
  }
  verificationData: {
    submittedAt?: string
    businessInfo?: any
    complianceQuestions?: any
    contactPerson?: any
    cacVerification?: any
    documents?: any
    reviewedAt?: string
    reviewedBy?: string
    adminNotes?: string
    rejectionReason?: string
  }
}

const Modal: React.FC<{
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  )
}

export default function AdminVerificationReview() {
  const { customerId } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [details, setDetails] = useState<VerificationDetails | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [showApprove, setShowApprove] = useState(false)
  const [showReject, setShowReject] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const [adminNotes, setAdminNotes] = useState('')
  const [rejectReason, setRejectReason] = useState('')

  useEffect(() => {
    if (!customerId) return

    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await adminApi.verification.getDetails(customerId)
        if (!res.success) {
          setError((res as any).error?.message || 'Failed to load verification')
          return
        }
        setDetails(res.data)
      } catch (e: any) {
        setError(e.message || 'Failed to load verification')
      } finally {
        setLoading(false)
      }
    })()
  }, [customerId])

  const cac = details?.verificationData?.cacVerification
  const businessInfo = details?.verificationData?.businessInfo
  const compliance = details?.verificationData?.complianceQuestions
  const contact = details?.verificationData?.contactPerson
  const documents = details?.verificationData?.documents

  const canApprove = Boolean(cac?.verified) && details?.customer?.verificationStatus !== 'verified'

  const complianceList = useMemo(() => {
    if (!compliance) return []
    const map: Array<{ label: string; value: any }> = [
      { label: 'License required', value: compliance.requiresLicense },
      { label: 'AML compliance', value: compliance.amlCompliance },
      { label: 'AML sanctions for breaches', value: compliance.amlSanctions },
      { label: 'Data protection policies', value: compliance.dataProtectionPolicies },
      { label: 'Data security measures', value: compliance.dataSecurityMeasures },
      { label: 'International data transfer', value: compliance.internationalDataTransfer },
      { label: 'Alternate database of reports', value: compliance.alternateDatabase },
      { label: 'Regulated by authority', value: compliance.regulatedByAuthority },
      { label: 'Fraud prevention policies', value: compliance.fraudPreventionPolicies },
      { label: 'NDA with employees/contractors', value: compliance.ndaWithEmployees },
      { label: 'Sanctions for data breach', value: compliance.dataBreachSanctions },
      { label: 'Other purpose usage', value: compliance.otherPurposeUsage },
      { label: 'Regulatory sanctions in last 2 years', value: compliance.regulatorySanctions },
    ]
    return map
  }, [compliance])

  const handleApprove = async () => {
    if (!customerId) return
    setActionLoading(true)
    try {
      const res = await adminApi.verification.approve(customerId, adminNotes.trim() || undefined)
      if (!res.success) {
        toast.error((res as any).error?.message || 'Failed to approve')
        return
      }
      toast.success('Verification approved. Customer is now verified.')
      navigate('/admin/verification')
    } finally {
      setActionLoading(false)
      setShowApprove(false)
    }
  }

  const handleReject = async () => {
    if (!customerId) return
    if (!rejectReason.trim()) {
      alert('Rejection reason is required')
      return
    }
    setActionLoading(true)
    try {
      const res = await adminApi.verification.reject(customerId, rejectReason.trim(), adminNotes.trim() || undefined)
      if (!res.success) {
        toast.error((res as any).error?.message || 'Failed to reject')
        return
      }
      toast.success('Verification rejected. Customer can resubmit.')
      navigate('/admin/verification')
    } finally {
      setActionLoading(false)
      setShowReject(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-sm text-gray-500">Loading verification details...</p>
      </div>
    )
  }

  if (error || !details) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="text-center py-8">
          <XCircleIcon className="h-12 w-12 text-red-600 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to load verification</h2>
          <p className="text-gray-600 mb-6">{error || 'Not found'}</p>
          <Link to="/admin/verification" className="text-blue-600 hover:text-blue-700 font-medium">
            Back to queue
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <Link to="/admin/verification" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-2">
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Verifications
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Verification Review</h1>
          <p className="mt-1 text-sm text-gray-500">Review customer submission and CAC verification results</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowReject(true)}
            className="inline-flex items-center px-4 py-2 border border-red-300 rounded-lg shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50"
          >
            <XCircleIcon className="h-5 w-5 mr-2" />
            Reject
          </button>
          <button
            onClick={() => setShowApprove(true)}
            disabled={!canApprove}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
              canApprove ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            Approve
          </button>
        </div>
      </div>

      {/* Alert if cannot approve */}
      {!canApprove && details.customer.verificationStatus !== 'verified' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg p-4 bg-yellow-50 border border-yellow-200"
        >
          <div className="flex">
            <ExclamationCircleIcon className="h-5 w-5 text-yellow-400" />
            <p className="ml-3 text-sm font-medium text-yellow-800">
              Cannot approve: CAC verification must pass before approval
            </p>
          </div>
        </motion.div>
      )}

      {/* Timeline */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Verification Timeline</h3>
        <Timeline
          submittedAt={details.verificationData.submittedAt}
          cacVerifiedAt={details.verificationData.cacVerification?.verifiedAt}
          status={details.customer.verificationStatus}
          reviewedAt={details.verificationData.reviewedAt}
        />
      </div>

      {/* CAC Result */}
      <div className={`bg-white shadow-sm rounded-lg p-6 ${cac?.verified ? 'border-2 border-green-200' : 'border-2 border-red-200'}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">CAC Verification Result</h2>
            <p className="text-gray-600 text-sm">This is the only externally verified data (via QoreID).</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${cac?.verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {cac?.verified ? 'VERIFIED' : 'FAILED'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-xs text-gray-500">Customer RC / BN</div>
            <div className="font-semibold text-gray-900">{businessInfo?.rcNumber || '—'}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-xs text-gray-500">QoreID RC</div>
            <div className="font-semibold text-gray-900">{cac?.qoreidRcNumber || '—'}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-xs text-gray-500">Customer Company Name</div>
            <div className="font-semibold text-gray-900">{businessInfo?.companyName || '—'}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-xs text-gray-500">QoreID Company Name</div>
            <div className="font-semibold text-gray-900">{cac?.qoreidCompanyName || '—'}</div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="text-gray-700">
            Status: <span className="font-medium">{cac?.qoreidStatus || '—'}</span>
          </div>
          <div className={`font-medium ${cac?.nameMatch ? 'text-green-700' : 'text-orange-700'}`}>
            {cac?.nameMatch ? 'Name match' : 'Name mismatch'}
          </div>
        </div>

        {cac?.errorMessage && (
          <div className="mt-4 text-sm text-red-700 bg-red-100 rounded-lg p-3">
            {cac.errorMessage}
          </div>
        )}
      </div>

      {/* Review Meta */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Review Metadata</h3>
            <p className="text-sm text-gray-500">Submission and review timeline audit trail</p>
          </div>
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            details.customer.verificationStatus === 'verified'
              ? 'bg-green-100 text-green-800'
              : details.customer.verificationStatus === 'rejected'
              ? 'bg-red-100 text-red-800'
              : 'bg-blue-100 text-blue-800'
          }`}>
            {details.customer.verificationStatus || 'Pending'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Meta label="Customer" value={details.customer.email} />
          <Meta label="Customer ID" value={details.customer.id} />
          <Meta label="Submitted At" value={details.verificationData.submittedAt ? new Date(details.verificationData.submittedAt).toLocaleString() : '—'} />
          <Meta label="Reviewed At" value={details.verificationData.reviewedAt ? new Date(details.verificationData.reviewedAt).toLocaleString() : '—'} />
          <Meta label="Reviewed By" value={details.verificationData.reviewedBy || '—'} />
          <Meta label="Rejection Reason" value={details.verificationData.rejectionReason || '—'} />
        </div>

        {details.verificationData.adminNotes && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-sm font-medium text-gray-900 mb-1">Admin Notes</div>
            <div className="text-sm text-gray-700 whitespace-pre-wrap">{details.verificationData.adminNotes}</div>
          </div>
        )}
      </div>

      {/* Business info + contact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <BuildingOfficeIcon className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-medium text-gray-900">Business Information</h3>
          </div>
          <div className="space-y-3 text-sm">
            <Row label="RC / BN" value={businessInfo?.rcNumber} />
            <Row label="Company" value={businessInfo?.companyName} />
            <Row label="Address" value={businessInfo?.businessAddress} />
            <Row label="Business Email" value={businessInfo?.businessEmail} />
            <Row label="Business Phone" value={businessInfo?.businessPhone} />
            <Row label="Director/Owner" value={businessInfo?.directorName} />
            <Row label="Year" value={businessInfo?.yearOfIncorporation} />
            <Row label="Nature of Business" value={businessInfo?.natureOfBusiness} />
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <UserIcon className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-medium text-gray-900">Contact Person</h3>
          </div>
          <div className="space-y-3 text-sm">
            <Row label="Name" value={contact?.fullName} />
            <Row label="Email" value={contact?.email} />
            <Row label="Phone" value={contact?.phone} />
            <Row label="Job Title" value={contact?.jobTitle} />
            <Row label="Website" value={contact?.website} />
          </div>
        </div>
      </div>

      {/* Compliance */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <DocumentTextIcon className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-medium text-gray-900">Compliance Answers</h3>
        </div>

        {!compliance ? (
          <div className="text-sm text-gray-500">No compliance data submitted.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {complianceList.map((q) => (
              <div key={q.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-700">{q.label}</div>
                <div className={`text-sm font-medium ${q.value ? 'text-green-700' : 'text-gray-600'}`}>
                  {q.value ? 'Yes' : 'No'}
                </div>
              </div>
            ))}
            <div className="md:col-span-2 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-700">Countries of operation</div>
              <div className="font-medium text-gray-900 mt-1">{compliance.countriesOfOperation || '—'}</div>
            </div>
          </div>
        )}
      </div>

      {/* Documents */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Supporting Documents (Optional)</h3>
            <p className="text-sm text-gray-500">If customer uploaded documents, you can open them in a new tab.</p>
          </div>
        </div>

        {!documents?.cacCertificate && !(documents?.supportingDocs?.length > 0) ? (
          <div className="text-sm text-gray-500">No documents uploaded.</div>
        ) : (
          <div className="space-y-3">
            {documents?.cacCertificate && (
              <a
                href={documents.cacCertificate}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <span className="text-sm font-medium text-gray-900">CAC Certificate</span>
                <span className="text-blue-600 text-sm font-medium inline-flex items-center">
                  Open <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
                </span>
              </a>
            )}
            {(documents?.supportingDocs || []).map((url: string, idx: number) => (
              <a
                key={idx}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <span className="text-sm font-medium text-gray-900">Supporting Document {idx + 1}</span>
                <span className="text-blue-600 text-sm font-medium inline-flex items-center">
                  Open <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
                </span>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Approve Modal */}
      <Modal isOpen={showApprove} onClose={() => setShowApprove(false)} title="Approve Verification">
        <div className="space-y-4">
          {!canApprove && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
              Cannot approve: CAC verification did not pass.
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes (optional)</label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Notes for audit trail..."
            />
          </div>
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => setShowApprove(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleApprove}
              disabled={!canApprove || actionLoading}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
                !canApprove || actionLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {actionLoading ? 'Approving...' : 'Approve'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal isOpen={showReject} onClose={() => setShowReject(false)} title="Reject Verification">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rejection Reason *</label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Explain why this verification is rejected..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes (optional)</label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Internal notes..."
            />
          </div>
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => setShowReject(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              disabled={actionLoading}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
                actionLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {actionLoading ? 'Rejecting...' : 'Reject'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function Timeline({
  submittedAt,
  cacVerifiedAt,
  status,
  reviewedAt,
}: {
  submittedAt?: string
  cacVerifiedAt?: string
  status?: string
  reviewedAt?: string
}) {
  const steps = [
    {
      label: 'Submitted',
      time: submittedAt,
      done: Boolean(submittedAt),
    },
    {
      label: 'CAC Verified (QoreID)',
      time: cacVerifiedAt,
      done: Boolean(cacVerifiedAt),
    },
    {
      label: 'Admin Review',
      time: status === 'admin_review' || status === 'verified' || status === 'rejected' ? reviewedAt || 'Pending' : 'Pending',
      done: status === 'verified' || status === 'rejected',
    },
    {
      label: status === 'verified' ? 'Approved' : status === 'rejected' ? 'Rejected' : 'Decision Pending',
      time: status === 'verified' || status === 'rejected' ? reviewedAt : undefined,
      done: status === 'verified' || status === 'rejected',
    },
  ]

  return (
    <div className="space-y-3">
      {steps.map((s, idx) => (
        <div key={idx} className="flex items-start gap-3">
          <div className={`mt-0.5 w-3 h-3 rounded-full ${s.done ? 'bg-green-600' : 'bg-gray-300'}`} />
          <div className="flex-1">
            <div className="flex items-center justify-between gap-4">
              <div className="font-medium text-gray-900">{s.label}</div>
              <div className="text-xs text-gray-500">
                {s.time ? (typeof s.time === 'string' && s.time !== 'Pending' ? new Date(s.time).toLocaleString() : s.time) : '—'}
              </div>
            </div>
            {idx < steps.length - 1 && (
              <div className="ml-[5px] mt-2 h-5 w-px bg-gray-200" />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function Meta({ label, value }: { label: string; value?: any }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="font-semibold text-gray-900 mt-1 break-words">{value || '—'}</div>
    </div>
  )
}

function Row({ label, value }: { label: string; value?: any }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="text-gray-500">{label}</div>
      <div className="text-gray-900 font-medium text-right break-words max-w-[60%]">{value || '—'}</div>
    </div>
  )
}
