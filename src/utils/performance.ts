/**
 * Performance Utilities
 * Helper functions for optimizing React performance
 */

import React, { useEffect, useRef, DependencyList } from 'react'

/**
 * Throttle function calls
 * Useful for scroll, resize, input events
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null
  let previous = 0

  return function executedFunction(...args: Parameters<T>) {
    const now = Date.now()
    const remaining = wait - (now - previous)

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      func(...args)
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now()
        timeout = null
        func(...args)
      }, remaining)
    }
  }
}

/**
 * Debounce function calls
 * Useful for search inputs, API calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return function executedFunction(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout)
    
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

/**
 * Custom hook to track component re-renders (dev only)
 */
export function useRenderCount(componentName: string) {
  const renders = useRef(0)
  
  useEffect(() => {
    renders.current += 1
    if (import.meta.env.DEV) {
      console.log(`[Render Count] ${componentName}: ${renders.current}`)
    }
  })

  return renders.current
}

/**
 * Custom hook to detect why component re-rendered (dev only)
 */
export function useWhyDidYouUpdate(componentName: string, props: Record<string, any>) {
  const previousProps = useRef<Record<string, any> | undefined>(undefined)

  useEffect(() => {
    if (previousProps.current && import.meta.env.DEV) {
      const allKeys = Object.keys({ ...previousProps.current, ...props })
      const changedProps: Record<string, { from: any; to: any }> = {}

      allKeys.forEach((key) => {
        if (previousProps.current![key] !== props[key]) {
          changedProps[key] = {
            from: previousProps.current![key],
            to: props[key]
          }
        }
      })

      if (Object.keys(changedProps).length > 0) {
        console.log(`[Why Re-render] ${componentName}:`, changedProps)
      }
    }

    previousProps.current = props
  })
}

/**
 * Lazy load component with delay
 * Useful for animations
 */
export function lazyWithDelay(
  importFunc: () => Promise<{ default: React.ComponentType<any> }>,
  delay: number = 300
) {
  return React.lazy(() =>
    Promise.all([
      importFunc(),
      new Promise<void>((resolve) => setTimeout(resolve, delay))
    ]).then(([module]) => module)
  )
}

/**
 * Check if value is deeply equal (for useMemo dependencies)
 */
export function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true

  if (typeof obj1 !== 'object' || obj1 === null ||
      typeof obj2 !== 'object' || obj2 === null) {
    return false
  }

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) return false

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false
    }
  }

  return true
}

/**
 * Measure component render time (dev only)
 */
export function measureRenderTime(componentName: string, callback: () => void) {
  if (import.meta.env.DEV) {
    const start = performance.now()
    callback()
    const end = performance.now()
    console.log(`[Render Time] ${componentName}: ${(end - start).toFixed(2)}ms`)
  } else {
    callback()
  }
}

/**
 * Preload route/component
 * Call this on hover or when user is likely to navigate
 */
export function preloadRoute(importFunc: () => Promise<any>) {
  return () => {
    importFunc()
  }
}

