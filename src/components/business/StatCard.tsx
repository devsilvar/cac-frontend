/**
 * StatCard Component - Reusable dashboard statistics card
 * 
 * WHY: This exact card layout is duplicated in:
 * - AdminDashboard (4 instances)
 * - CustomerDashboard (3 instances)
 * - AdminRevenue (4 instances)
 * - AdminMonitoring (5+ instances)
 * 
 * BENEFITS:
 * - Single source of truth for stat card design
 * - Consistent styling across all dashboards
 * - Easy to update design system-wide
 * - Reduces code by ~200 lines
 * 
 * USAGE:
 * ```tsx
 * <StatCard
 *   label="Total Customers"
 *   value={4250}
 *   icon={UsersIcon}
 *   color="blue"
 *   change="+12%"
 *   trend="up"
 * />
 * ```
 */

import React from 'react'
import { motion } from 'framer-motion'
import {
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline'

type StatColor = 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'yellow'
type Trend = 'up' | 'down' | 'neutral'

interface StatCardProps {
  /** Label/title of the stat */
  label: string
  /** Main value to display (can be number or string like "$1,234") */
  value: number | string
  /** Optional change percentage (e.g., "+12%" or "-5%") */
  change?: string
  /** Trend direction (determines color) */
  trend?: Trend
  /** Optional subtitle text */
  subtitle?: string
  /** Icon component from Heroicons */
  icon: React.ComponentType<{ className?: string }>
  /** Color theme for icon background */
  color: StatColor
  /** Optional click handler */
  onClick?: () => void
  /** Loading state */
  loading?: boolean
  /** Custom className */
  className?: string
}

// Color mappings for icon backgrounds
const colorClasses: Record<StatColor, string> = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  purple: 'bg-purple-100 text-purple-600',
  orange: 'bg-orange-100 text-orange-600',
  red: 'bg-red-100 text-red-600',
  yellow: 'bg-yellow-100 text-yellow-600',
}

// Trend color mappings
const trendClasses: Record<Trend, string> = {
  up: 'text-green-600',
  down: 'text-red-600',
  neutral: 'text-gray-600',
}

/**
 * StatCard - Dashboard statistics card component
 * 
 * Displays a key metric with icon, value, and optional trend indicator
 * Includes smooth animations and hover effects
 */
const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  change,
  trend,
  subtitle,
  icon: Icon,
  color,
  onClick,
  loading = false,
  className = '',
}) => {
  // Format numeric values with commas
  const formattedValue = typeof value === 'number' 
    ? value.toLocaleString() 
    : value

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className={`
        bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200
        ${onClick ? 'cursor-pointer hover:shadow-md' : ''}
        transition-shadow duration-200
        ${className}
      `}
    >
      <div className="p-5">
        <div className="flex items-center">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className={`rounded-lg p-3 ${colorClasses[color]}`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>

          {/* Content */}
          <div className="ml-5 w-0 flex-1">
            <dl>
              {/* Label */}
              <dt className="text-sm font-medium text-gray-500 truncate">
                {label}
              </dt>

              {/* Value and Change */}
              <dd className="flex items-baseline">
                {loading ? (
                  // Loading skeleton
                  <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
                ) : (
                  <>
                    {/* Main value */}
                    <div className="text-2xl font-semibold text-gray-900">
                      {formattedValue}
                    </div>

                    {/* Change indicator */}
                    {change && trend && (
                      <div
                        className={`
                          ml-2 flex items-baseline text-sm font-semibold
                          ${trendClasses[trend]}
                        `}
                      >
                        {trend === 'up' && (
                          <ArrowUpIcon className="h-4 w-4 mr-0.5 flex-shrink-0" />
                        )}
                        {trend === 'down' && (
                          <ArrowDownIcon className="h-4 w-4 mr-0.5 flex-shrink-0" />
                        )}
                        <span>{change}</span>
                      </div>
                    )}
                  </>
                )}
              </dd>

              {/* Subtitle */}
              {subtitle && !loading && (
                <dd className="text-xs text-gray-500 mt-1 truncate">
                  {subtitle}
                </dd>
              )}
            </dl>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/**
 * StatGrid - Layout wrapper for multiple stat cards
 * 
 * USAGE:
 * ```tsx
 * <StatGrid>
 *   <StatCard {...} />
 *   <StatCard {...} />
 *   <StatCard {...} />
 * </StatGrid>
 * ```
 */
export const StatGrid: React.FC<{
  children: React.ReactNode
  columns?: 2 | 3 | 4
  className?: string
}> = ({ children, columns = 4, className = '' }) => {
  const gridCols = {
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 ${gridCols[columns]} gap-6 ${className}`}>
      {children}
    </div>
  )
}

/**
 * Skeleton loader for StatCard
 */
export const StatCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="rounded-lg p-3 bg-gray-200 animate-pulse">
              <div className="h-6 w-6" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1 space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatCard
