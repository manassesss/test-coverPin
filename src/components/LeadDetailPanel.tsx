import { useState, useEffect } from 'react'
import { type Lead, type LeadStatus } from '../types.tsx'

interface LeadDetailPanelProps {
  lead: Lead
  onUpdate: (lead: Lead) => void
  onConvert: (lead: Lead) => void
  onClose: () => void
  isLoading?: boolean
}

const LeadDetailPanel = ({ lead, onUpdate, onConvert, onClose, isLoading = false }: LeadDetailPanelProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedLead, setEditedLead] = useState<Lead>(lead)
  const [errors, setErrors] = useState<{ email?: string }>({})
  const [isSaving, setIsSaving] = useState(false)
  const [isModalLoading, setIsModalLoading] = useState(isLoading)

  useEffect(() => {
    setEditedLead(lead)
    setErrors({})
    setIsEditing(false)
  }, [lead])

  useEffect(() => {
    if (isLoading) {
      // Clear loading state after a short delay when modal opens
      const timer = setTimeout(() => {
        setIsModalLoading(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleFieldChange = (field: keyof Lead, value: string) => {
    setEditedLead(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (field === 'email' && errors.email) {
      setErrors(prev => ({ ...prev, email: undefined }))
    }
  }

  const handleSave = async () => {
    // Validate email
    if (!validateEmail(editedLead.email)) {
      setErrors({ email: 'Please enter a valid email address' })
      return
    }

    setIsSaving(true)
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Simulate occasional failure for error handling demo
      if (Math.random() < 0.1) {
        throw new Error('Failed to save changes')
      }
      
      onUpdate(editedLead)
      setIsEditing(false)
      setErrors({})
    } catch (error) {
      setErrors({ email: 'Failed to save changes. Please try again.' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditedLead(lead)
    setErrors({})
    setIsEditing(false)
  }

  const handleConvert = () => {
    onConvert(lead)
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
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl">
          {isModalLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-20 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-sm text-gray-600">Loading...</span>
              </div>
            </div>
          )}
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Lead Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

      {/* Content */}
      <div className="px-6 py-4 space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <div className="text-sm text-gray-900">{lead.name}</div>
        </div>

        {/* Company */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company
          </label>
          <div className="text-sm text-gray-900">{lead.company}</div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          {isEditing ? (
            <div>
              <input
                type="email"
                value={editedLead.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-900">{lead.email}</div>
          )}
        </div>

        {/* Source */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Source
          </label>
          <div className="text-sm text-gray-900">{lead.source}</div>
        </div>

        {/* Score */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Score
          </label>
          <div className={`text-sm font-semibold ${getScoreColor(lead.score)}`}>
            {lead.score}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          {isEditing ? (
            <select
              value={editedLead.status}
              onChange={(e) => handleFieldChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
            </select>
          ) : (
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status)}`}>
              {lead.status}
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 space-y-3">
        {isEditing ? (
          <div className="flex space-x-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex space-x-3">
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Edit Lead
            </button>
            <button
              onClick={handleConvert}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Convert to Opportunity
            </button>
          </div>
        )}
      </div>
        </div>
      </div>
    </div>
  )
}

export default LeadDetailPanel
