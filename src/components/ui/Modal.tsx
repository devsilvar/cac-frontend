/**
 * Modal Component - Reusable dialog/modal overlay
 * 
 * WHY: Custom modal implementations exist in:
 * - AdminPricing (PricingModal)
 * - CustomerKeys (API key creation)
 * - CustomerVerification (confirmation dialogs)
 * - AdminCustomers (edit customer)
 * 
 * BENEFITS:
 * - Consistent modal behavior (ESC key, backdrop click)
 * - Accessibility (focus trap, ARIA attributes)
 * - Animations built-in
 * - Reduces code duplication
 * 
 * USAGE:
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false)
 * 
 * <Modal
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Create API Key"
 * >
 *   <form>...</form>
 * </Modal>
 * ```
 */

import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

interface ModalProps {
  /** Whether the modal is open */
  open: boolean
  /** Called when modal should close (ESC key or backdrop click) */
  onClose: () => void
  /** Modal title */
  title?: string
  /** Modal content */
  children: React.ReactNode
  /** Footer content (typically action buttons) */
  footer?: React.ReactNode
  /** Size of the modal */
  size?: ModalSize
  /** Whether to show close button in top-right */
  showClose?: boolean
  /** Whether clicking backdrop closes modal */
  closeOnBackdrop?: boolean
  /** Whether ESC key closes modal */
  closeOnEscape?: boolean
  /** Custom className for modal content */
  className?: string
}

// Size classes for modal width
const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-4xl',
}

/**
 * Modal Component
 * 
 * Full-featured modal dialog with animations, accessibility, and keyboard support
 */
const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  showClose = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  className = '',
}) => {
  const modalRef = useRef<HTMLDivElement>(null)

  // Handle ESC key to close modal
  useEffect(() => {
    if (!open || !closeOnEscape) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, closeOnEscape, onClose])

  // Focus trap - keep focus inside modal
  useEffect(() => {
    if (!open) return

    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    if (focusableElements && focusableElements.length > 0) {
      const firstElement = focusableElements[0] as HTMLElement
      firstElement.focus()
    }
  }, [open])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={handleBackdropClick}
            aria-hidden="true"
          />

          {/* Modal */}
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={handleBackdropClick}
          >
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className={`
                relative bg-white rounded-lg shadow-xl w-full
                ${sizeClasses[size]}
                ${className}
              `}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? 'modal-title' : undefined}
            >
              {/* Header */}
              {(title || showClose) && (
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                  {title && (
                    <h2
                      id="modal-title"
                      className="text-xl font-bold text-gray-900"
                    >
                      {title}
                    </h2>
                  )}
                  {showClose && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                      aria-label="Close modal"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

/**
 * ConfirmModal - Quick confirmation dialog
 * 
 * USAGE:
 * ```tsx
 * <ConfirmModal
 *   open={showConfirm}
 *   onClose={() => setShowConfirm(false)}
 *   onConfirm={handleDelete}
 *   title="Delete Customer?"
 *   message="This action cannot be undone."
 *   confirmText="Delete"
 *   confirmVariant="danger"
 * />
 * ```
 */
export const ConfirmModal: React.FC<{
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmVariant?: 'primary' | 'danger'
  loading?: boolean
}> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary',
  loading = false,
}) => {
  const confirmButtonClass =
    confirmVariant === 'danger'
      ? 'bg-red-600 hover:bg-red-700 text-white'
      : 'bg-blue-600 hover:bg-blue-700 text-white'

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium
              ${confirmButtonClass}
              disabled:opacity-50
            `}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      }
    >
      <p className="text-gray-600">{message}</p>
    </Modal>
  )
}

export default Modal
