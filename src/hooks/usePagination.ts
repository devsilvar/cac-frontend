/**
 * Custom usePagination Hook
 * Handles pagination logic
 */

import { useState, useMemo } from 'react'

interface UsePaginationOptions {
  initialPage?: number
  pageSize?: number
}

interface UsePaginationResult<T> {
  currentPage: number
  pageSize: number
  totalPages: number
  paginatedData: T[]
  goToPage: (page: number) => void
  nextPage: () => void
  previousPage: () => void
  canGoNext: boolean
  canGoPrevious: boolean
  setPageSize: (size: number) => void
}

export function usePagination<T>(
  data: T[],
  options: UsePaginationOptions = {}
): UsePaginationResult<T> {
  const { initialPage = 1, pageSize: initialPageSize = 10 } = options

  const [currentPage, setCurrentPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const totalPages = Math.ceil(data.length / pageSize)

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    const end = start + pageSize
    return data.slice(start, end)
  }, [data, currentPage, pageSize])

  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages))
    setCurrentPage(validPage)
  }

  const nextPage = () => {
    goToPage(currentPage + 1)
  }

  const previousPage = () => {
    goToPage(currentPage - 1)
  }

  const canGoNext = currentPage < totalPages
  const canGoPrevious = currentPage > 1

  // Reset to page 1 when data or pageSize changes
  useMemo(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1)
    }
  }, [data.length, pageSize, currentPage, totalPages])

  return {
    currentPage,
    pageSize,
    totalPages,
    paginatedData,
    goToPage,
    nextPage,
    previousPage,
    canGoNext,
    canGoPrevious,
    setPageSize
  }
}
