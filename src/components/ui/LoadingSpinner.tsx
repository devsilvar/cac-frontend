/**
 * LoadingSpinner Component - Reusable loading indicator
 * 
 * WHY: This same spinner code is duplicated 15+ times across the app.
 * A single reusable component makes it easier to maintain and update.
 * 
 * USAGE:
 * ```tsx
 * // Simple spinner
 * <LoadingSpinner />
 * 
 * // With custom text
 * <LoadingSpinner text="Loading customers..." />
 * 
 * // Different sizes
 * <LoadingSpinner size="sm" />
 * <LoadingSpinner size="lg" />
 * 
 * // Centered full screen
 * <LoadingSpinner fullScreen />
 * 
 * // Custom colors
 * <LoadingSpinner color="green" />
 * ```
 */

import React from 'react'

type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl'
type SpinnerColor = 'blue' | 'green' | 'purple' | 'gray' | 'white'

interface LoadingSpinnerProps {
  /** Size of the spinner */
  size?: SpinnerSize
  /** Text to display below spinner */
  text?: string
  /** Color theme */
  color?: SpinnerColor
  /** Center in full viewport height */
  fullScreen?: boolean
  /** Custom className for container */
  className?: string
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-[3px]',
  xl: 'h-16 w-16 border-4',
}

const colorClasses: Record<SpinnerColor, string> = {
  blue: 'border-blue-600',
  green: 'border-green-600',
  purple: 'border-purple-600',
  gray: 'border-gray-600',
  white: 'border-white',
}

const textSizeClasses: Record<SpinnerSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
}

/**
 * LoadingSpinner Component
 * 
 * Displays an animated circular spinner with optional text
 * Replaces 15+ duplicate implementations across the app
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  color = 'blue',
  fullScreen = false,
  className = '',
}) => {
  const containerClasses = fullScreen
    ? 'min-h-screen flex items-center justify-center'
    : 'flex items-center justify-center py-12'

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="flex flex-col items-center gap-3">
        {/* Spinning circle */}
        <div
          className={`
            inline-block animate-spin rounded-full
            ${sizeClasses[size]}
            ${colorClasses[color]}
            border-solid border-t-transparent
          `}
          role="status"
          aria-label="Loading"
        />
        
        {/* Optional text */}
        {text && (
          <p className={`${textSizeClasses[size]} text-gray-500 font-medium`}>
            {text}
          </p>
        )}
      </div>
    </div>
  )
}

/**
 * Inline variant - smaller, fits in buttons or cards
 */
export const InlineSpinner: React.FC<{
  size?: SpinnerSize
  color?: SpinnerColor
}> = ({ size = 'sm', color = 'blue' }) => {
  return (
    <div
      className={`
        inline-block animate-spin rounded-full
        ${sizeClasses[size]}
        ${colorClasses[color]}
        border-solid border-t-transparent
      `}
      role="status"
      aria-label="Loading"
    />
  )
}

/**
 * Button spinner - for loading states in buttons
 */
export const ButtonSpinner: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      className={`animate-spin h-5 w-5 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

/**
 * Page loading overlay - covers entire page
 */
export const PageLoadingOverlay: React.FC<{ show: boolean; text?: string }> = ({
  show,
  text = 'Loading...',
}) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-16 w-16 border-4 border-blue-600 border-solid border-t-transparent rounded-full animate-spin" />
        <p className="text-lg text-gray-700 font-medium">{text}</p>
      </div>
    </div>
  )
}

export default LoadingSpinner
