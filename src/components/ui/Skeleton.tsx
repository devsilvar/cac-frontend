import React from 'react'
import { clsx } from 'clsx'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'rectangular' | 'circular'
  width?: string | number
  height?: string | number
  lines?: number
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  width,
  height,
  lines = 1
}) => {
  const baseClasses = 'animate-pulse bg-gray-200 rounded'

  if (variant === 'text') {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={clsx(
              baseClasses,
              'h-4',
              width ? (typeof width === 'number' ? `w-${width}` : width) : 'w-full',
              className
            )}
            style={{
              width: typeof width === 'number' ? `${width}px` : width,
              height: typeof height === 'number' ? `${height}px` : height
            }}
          />
        ))}
      </div>
    )
  }

  if (variant === 'circular') {
    return (
      <div
        className={clsx(
          baseClasses,
          'rounded-full',
          width ? (typeof width === 'number' ? `w-${width} h-${width}` : `${width} ${height || width}`) : 'w-10 h-10',
          className
        )}
        style={{
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height || (typeof width === 'number' ? `${width}px` : width)
        }}
      />
    )
  }

  return (
    <div
      className={clsx(
        baseClasses,
        width ? (typeof width === 'number' ? `w-${width}` : width) : 'w-full',
        height ? (typeof height === 'number' ? `h-${height}` : height) : 'h-4',
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height
      }}
    />
  )
}

export const SkeletonText: React.FC<{ className?: string; lines?: number; width?: string | number }> = ({
  className,
  lines = 1,
  width
}) => <Skeleton variant="text" className={className} lines={lines} width={width} />

export const SkeletonCard: React.FC<{ className?: string; height?: string | number }> = ({
  className,
  height = 200
}) => (
  <div className={clsx('bg-white p-6 rounded-xl border shadow-sm', className)}>
    <Skeleton variant="text" lines={1} width="60%" className="mb-4" />
    <Skeleton variant="rectangular" height={height} className="w-full" />
  </div>
)

export const SkeletonButton: React.FC<{ className?: string; width?: string | number }> = ({
  className,
  width = 100
}) => <Skeleton variant="rectangular" height={40} width={width} className={clsx('rounded-lg', className)} />