/**
 * Reusable StatsCard Component
 * Used for displaying metrics across dashboards
 */

import React from 'react'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  iconColor?: string
  iconBgColor?: string
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  onClick?: () => void
  className?: string
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  iconColor = 'text-blue-600',
  iconBgColor = 'bg-blue-100',
  description,
  trend,
  onClick,
  className = ''
}) => {
  const Component = onClick ? 'button' : 'div'

  return (
    <Component
      onClick={onClick}
      className={`
        bg-white rounded-lg border border-gray-200 p-6
        ${onClick ? 'cursor-pointer hover:shadow-md hover:border-blue-300 transition-all' : ''}
        ${className}
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        {trend && (
          <span
            className={`text-sm font-semibold ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>

      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      {description && <p className="text-xs text-gray-500">{description}</p>}
    </Component>
  )
}

export default StatsCard
