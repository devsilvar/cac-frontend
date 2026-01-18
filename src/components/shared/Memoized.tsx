/**
 * Memoized versions of shared components
 * Use these for better performance when props don't change often
 */

import React from 'react'
import { 
  StatsCard as StatsCardBase, 
  Badge as BadgeBase,
  EmptyState as EmptyStateBase,
  PageHeader as PageHeaderBase
} from './index'

// Memoized StatsCard - prevents re-render when props unchanged
export const StatsCard = React.memo(StatsCardBase, (prevProps, nextProps) => {
  // Custom comparison function
  return (
    prevProps.title === nextProps.title &&
    prevProps.value === nextProps.value &&
    prevProps.description === nextProps.description &&
    prevProps.trend?.value === nextProps.trend?.value
  )
})

StatsCard.displayName = 'MemoizedStatsCard'

// Memoized Badge - very lightweight but used frequently
export const Badge = React.memo(BadgeBase)
Badge.displayName = 'MemoizedBadge'

// Memoized EmptyState - rarely changes
export const EmptyState = React.memo(EmptyStateBase)
EmptyState.displayName = 'MemoizedEmptyState'

// Memoized PageHeader - static content
export const PageHeader = React.memo(PageHeaderBase, (prevProps, nextProps) => {
  return (
    prevProps.title === nextProps.title &&
    prevProps.description === nextProps.description
    // Don't compare actions - they might be new functions each render
  )
})

PageHeader.displayName = 'MemoizedPageHeader'

// Export all memoized components
export default {
  StatsCard,
  Badge,
  EmptyState,
  PageHeader
}
