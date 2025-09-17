import { useState, useMemo, useEffect } from 'react'
import { type Lead, type LeadStatus } from '../types.tsx'

interface LeadsListProps {
  leads: Lead[]
  onLeadSelect: (lead: Lead) => void
}

const LeadsList = ({ leads, onLeadSelect }: LeadsListProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'All'>('All')
  const [sortBy, setSortBy] = useState<'score' | 'name' | 'company'>('score')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isPageLoading, setIsPageLoading] = useState(false)

  // Load saved filters from localStorage on mount
  useState(() => {
    const savedSearch = localStorage.getItem('leads-search')
    const savedStatus = localStorage.getItem('leads-status-filter')
    const savedSortBy = localStorage.getItem('leads-sort-by')
    const savedSortOrder = localStorage.getItem('leads-sort-order')
    const savedPageSize = localStorage.getItem('leads-page-size')
    
    if (savedSearch) setSearchTerm(savedSearch)
    if (savedStatus && ['New', 'Contacted', 'Qualified', 'All'].includes(savedStatus)) {
      setStatusFilter(savedStatus as LeadStatus | 'All')
    }
    if (savedSortBy && ['score', 'name', 'company'].includes(savedSortBy)) {
      setSortBy(savedSortBy as 'score' | 'name' | 'company')
    }
    if (savedSortOrder && ['asc', 'desc'].includes(savedSortOrder)) {
      setSortOrder(savedSortOrder as 'asc' | 'desc')
    }
    if (savedPageSize && ['5', '10', '20', '50'].includes(savedPageSize)) {
      setPageSize(parseInt(savedPageSize))
    }
  })

  // Save filters to localStorage
  const saveFilters = (search: string, status: LeadStatus | 'All', sort: string, order: string, pageSize?: number) => {
    localStorage.setItem('leads-search', search)
    localStorage.setItem('leads-status-filter', status)
    localStorage.setItem('leads-sort-by', sort)
    localStorage.setItem('leads-sort-order', order)
    if (pageSize) {
      localStorage.setItem('leads-page-size', pageSize.toString())
    }
  }

  const filteredAndSortedLeads = useMemo(() => {
    let filtered = leads.filter(lead => {
      const matchesSearch = 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'All' || lead.status === statusFilter
      
      return matchesSearch && matchesStatus
    })

    filtered.sort((a, b) => {
      let aValue: string | number
      let bValue: string | number

      switch (sortBy) {
        case 'score':
          aValue = a.score
          bValue = b.score
          break
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'company':
          aValue = a.company.toLowerCase()
          bValue = b.company.toLowerCase()
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [leads, searchTerm, statusFilter, sortBy, sortOrder])

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedLeads.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedLeads = filteredAndSortedLeads.slice(startIndex, endIndex)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter, sortBy, sortOrder])

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    saveFilters(value, statusFilter, sortBy, sortOrder)
  }

  const handleStatusFilterChange = (value: LeadStatus | 'All') => {
    setStatusFilter(value)
    saveFilters(searchTerm, value, sortBy, sortOrder)
  }

  const handleSortChange = (field: 'score' | 'name' | 'company') => {
    const newOrder = sortBy === field && sortOrder === 'desc' ? 'asc' : 'desc'
    setSortBy(field)
    setSortOrder(newOrder)
    saveFilters(searchTerm, statusFilter, field, newOrder)
  }

  const handlePageSizeChange = (value: number) => {
    setPageSize(value)
    setCurrentPage(1)
    saveFilters(searchTerm, statusFilter, sortBy, sortOrder, value)
  }

  const handlePageChange = async (page: number) => {
    setIsPageLoading(true)
    await new Promise(resolve => setTimeout(resolve, 300))
    setCurrentPage(page)
    setIsPageLoading(false)
  }

  const goToFirstPage = async () => {
    setIsPageLoading(true)
    await new Promise(resolve => setTimeout(resolve, 300))
    setCurrentPage(1)
    setIsPageLoading(false)
  }
  
  const goToLastPage = async () => {
    setIsPageLoading(true)
    await new Promise(resolve => setTimeout(resolve, 300))
    setCurrentPage(totalPages)
    setIsPageLoading(false)
  }
  
  const goToPreviousPage = async () => {
    setIsPageLoading(true)
    await new Promise(resolve => setTimeout(resolve, 300))
    setCurrentPage(prev => Math.max(1, prev - 1))
    setIsPageLoading(false)
  }
  
  const goToNextPage = async () => {
    setIsPageLoading(true)
    await new Promise(resolve => setTimeout(resolve, 300))
    setCurrentPage(prev => Math.min(totalPages, prev + 1))
    setIsPageLoading(false)
  }

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800'
      case 'Contacted':
        return 'bg-yellow-100 text-yellow-800'
      case 'Qualified':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 font-semibold'
    if (score >= 80) return 'text-yellow-600 font-semibold'
    return 'text-red-600 font-semibold'
  }

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 text-center">
          <div className="text-gray-400 text-4xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Leads Found</h3>
          <p className="text-gray-500">No leads are available to display.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Leads ({filteredAndSortedLeads.length})
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">Show:</label>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
                className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedLeads.length)} of {filteredAndSortedLeads.length}
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="px-6 py-4 border-b border-gray-200 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search with icon */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or company..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Search leads by name or company"
              />
              {/* Search icon */}
              <svg
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7"></circle>
                <path d="M21 21l-4.35-4.35"></path>
              </svg>
            </div>
          </div>

          {/* Status Filter with icon + chevron */}
          <div className="sm:w-56">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value as LeadStatus | 'All')}
                className="w-full appearance-none pl-9 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Filter by status"
              >
                <option value="All">All Status</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
              </select>

              {/* Funnel icon (left) */}
              <svg
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 5h18l-7 9v4.5a1 1 0 0 1-1.53.85l-3-2A1 1 0 0 1 9 16.5V14L3 5z" />
              </svg>

              {/* Chevron down (right) */}
              <svg
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="relative overflow-x-auto">
        {isPageLoading && (
          <div className="absolute inset-0 bg-white/75 flex items-center justify-center z-10">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-600">Loading...</span>
            </div>
          </div>
        )}
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSortChange('name')}
                  className="flex items-center space-x-1 hover:text-gray-700"
                >
                  <span>Name</span>
                  {sortBy === 'name' && (
                    <span className="text-blue-600">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              </th>
              <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSortChange('company')}
                  className="flex items-center space-x-1 hover:text-gray-700"
                >
                  <span>Company</span>
                  {sortBy === 'company' && (
                    <span className="text-blue-600">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              </th>
              <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Source
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSortChange('score')}
                  className="flex items-center space-x-1 hover:text-gray-700"
                >
                  <span>Score</span>
                  {sortBy === 'score' && (
                    <span className="text-blue-600">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedLeads.map((lead) => (
              <tr
                key={lead.id}
                onClick={() => onLeadSelect(lead)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                  <div className="sm:hidden text-xs text-gray-500 mt-1">{lead.company}</div>
                </td>
                <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{lead.company}</div>
                </td>
                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{lead.email}</div>
                </td>
                <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{lead.source}</div>
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm ${getScoreColor(lead.score)}`}>
                    {lead.score}
                  </div>
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAndSortedLeads.length === 0 && (
        <div className="px-6 py-8 text-center">
          <div className="text-gray-400 text-2xl mb-2">🔍</div>
          <p className="text-gray-500">No leads match your search criteria.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              {/* First Page */}
              <button
                onClick={goToFirstPage}
                disabled={currentPage === 1}
                className="px-2 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                ««
              </button>
              
              {/* Previous Page */}
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="px-2 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                ‹
              </button>

              {/* Page Numbers */}
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 text-sm border rounded ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>

              {/* Next Page */}
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="px-2 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                ›
              </button>
              
              {/* Last Page */}
              <button
                onClick={goToLastPage}
                disabled={currentPage === totalPages}
                className="px-2 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                »»
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LeadsList
