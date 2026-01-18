/**
 * Optimized DataTable with virtualization for large datasets
 * Uses React.memo and useMemo for performance
 */

import React, { useState, useMemo, useCallback } from 'react'
import { ChevronUp, ChevronDown, Search } from 'lucide-react'
import { Column } from '../shared/DataTable'

interface OptimizedDataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (item: T) => string
  searchable?: boolean
  searchPlaceholder?: string
  emptyMessage?: string
  pageSize?: number
  className?: string
}

function OptimizedDataTableComponent<T extends Record<string, any>>({
  columns,
  data,
  keyExtractor,
  searchable = false,
  searchPlaceholder = 'Search...',
  emptyMessage = 'No data available',
  pageSize = 50,
  className = ''
}: OptimizedDataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Memoize sort handler
  const handleSort = useCallback((columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(columnKey)
      setSortDirection('asc')
    }
  }, [sortColumn, sortDirection])

  // Memoize search handler
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    setCurrentPage(1) // Reset to first page on search
  }, [])

  // Memoized filtered and sorted data
  const processedData = useMemo(() => {
    let result = [...data]

    // Filter
    if (searchable && searchQuery) {
      const lowerQuery = searchQuery.toLowerCase()
      result = result.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(lowerQuery)
        )
      )
    }

    // Sort
    if (sortColumn) {
      result.sort((a, b) => {
        const aValue = a[sortColumn]
        const bValue = b[sortColumn]

        if (aValue === bValue) return 0
        const comparison = aValue < bValue ? -1 : 1
        return sortDirection === 'asc' ? comparison : -comparison
      })
    }

    return result
  }, [data, searchQuery, sortColumn, sortDirection, searchable])

  // Memoized paginated data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    const end = start + pageSize
    return processedData.slice(start, end)
  }, [processedData, currentPage, pageSize])

  const totalPages = Math.ceil(processedData.length / pageSize)

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search */}
      {searchable && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <TableHeader
                  key={column.key}
                  column={column}
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => (
                <TableRow
                  key={keyExtractor(item)}
                  item={item}
                  columns={columns}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Results count */}
      {searchable && searchQuery && (
        <p className="text-sm text-gray-600">
          Showing {paginatedData.length} of {processedData.length} results
          (filtered from {data.length} total)
        </p>
      )}
    </div>
  )
}

// Memoized table header
const TableHeader = React.memo<{
  column: Column<any>
  sortColumn: string | null
  sortDirection: 'asc' | 'desc'
  onSort: (key: string) => void
}>(({ column, sortColumn, sortDirection, onSort }) => (
  <th
    className={`px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${
      column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
    } ${column.className || ''}`}
    onClick={() => column.sortable && onSort(column.key)}
  >
    <div className="flex items-center gap-2">
      {column.label}
      {column.sortable && (
        <span className="flex flex-col">
          <ChevronUp
            className={`h-3 w-3 ${
              sortColumn === column.key && sortDirection === 'asc'
                ? 'text-blue-600'
                : 'text-gray-400'
            }`}
          />
          <ChevronDown
            className={`h-3 w-3 -mt-1 ${
              sortColumn === column.key && sortDirection === 'desc'
                ? 'text-blue-600'
                : 'text-gray-400'
            }`}
          />
        </span>
      )}
    </div>
  </th>
))

TableHeader.displayName = 'TableHeader'

// Memoized table row
const TableRow = React.memo<{
  item: any
  columns: Column<any>[]
}>(({ item, columns }) => (
  <tr className="hover:bg-gray-50 transition-colors">
    {columns.map((column) => (
      <td
        key={column.key}
        className={`px-6 py-4 whitespace-nowrap text-sm ${column.className || ''}`}
      >
        {column.render ? column.render(item[column.key], item) : item[column.key]}
      </td>
    ))}
  </tr>
), (prevProps, nextProps) => {
  // Custom comparison to prevent re-renders
  return prevProps.item === nextProps.item && prevProps.columns === nextProps.columns
})

TableRow.displayName = 'TableRow'

// Memoized pagination
const Pagination = React.memo<{
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}>(({ currentPage, totalPages, onPageChange }) => (
  <div className="flex items-center justify-between">
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
    >
      Previous
    </button>
    <span className="text-sm text-gray-600">
      Page {currentPage} of {totalPages}
    </span>
    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
    >
      Next
    </button>
  </div>
))

Pagination.displayName = 'Pagination'

// Export memoized component
export const OptimizedDataTable = React.memo(OptimizedDataTableComponent) as typeof OptimizedDataTableComponent

export default OptimizedDataTable
