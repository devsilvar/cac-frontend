import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { adminApi } from '../../services/admin.service'
import toast from 'react-hot-toast'

interface ServicePricing {
  id: string
  serviceCode: string
  serviceName: string
  priceKobo: number
  description?: string
  category?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

const AdminPricing: React.FC = () => {
  const [pricing, setPricing] = useState<ServicePricing[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<ServicePricing | null>(null)
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all')

  useEffect(() => {
    loadPricing()
  }, [])

  const loadPricing = async () => {
    setLoading(true)
    try {
      const res = await adminApi.pricing.getAll()
      if (res.success) {
        setPricing(res.data.pricing)
      } else {
        toast.error('error' in res ? res.error.message : 'Failed to load pricing')
      }
    } catch (error) {
      toast.error('Failed to load pricing')
    } finally {
      setLoading(false)
    }
  }

  const handleSeedDefault = async () => {
    if (!confirm('Seed default pricing? This will create standard prices for all services.')) return
    
    try {
      const res = await adminApi.pricing.seed()
      if (res.success) {
        toast.success(`Seeded ${res.data.created} prices, skipped ${res.data.skipped} existing`)
        loadPricing()
      } else {
        toast.error('error' in res ? res.error.message : 'Failed to seed pricing')
      }
    } catch (error) {
      toast.error('Failed to seed pricing')
    }
  }

  const handleDelete = async (serviceCode: string) => {
    if (!confirm('Delete this pricing? This cannot be undone.')) return

    try {
      const res = await adminApi.pricing.delete(serviceCode)
      if (res.success) {
        toast.success('Pricing deleted')
        loadPricing()
      } else {
        toast.error('error' in res ? res.error.message : 'Failed to delete')
      }
    } catch (error) {
      toast.error('Failed to delete')
    }
  }

  const filteredPricing = pricing.filter(item => {
    if (filterActive === 'active') return item.isActive
    if (filterActive === 'inactive') return !item.isActive
    return true
  })

  const formatPrice = (kobo: number) => {
    return `₦${(kobo / 100).toFixed(2)}`
  }

  const groupedByCategory = filteredPricing.reduce((acc, item) => {
    const cat = item.category || 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {} as Record<string, ServicePricing[]>)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-sm text-gray-500">Loading pricing...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Service Pricing</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage pricing for all API services. Prices are charged from customer wallets.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSeedDefault}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowPathIcon className="h-5 w-5 mr-2" />
            Seed Defaults
          </button>
          <button
            onClick={() => {
              setEditingItem(null)
              setShowModal(true)
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Service
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilterActive('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            filterActive === 'all'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All ({pricing.length})
        </button>
        <button
          onClick={() => setFilterActive('active')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            filterActive === 'active'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Active ({pricing.filter(p => p.isActive).length})
        </button>
        <button
          onClick={() => setFilterActive('inactive')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            filterActive === 'inactive'
              ? 'bg-gray-100 text-gray-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Inactive ({pricing.filter(p => !p.isActive).length})
        </button>
      </div>

      {/* Pricing Cards by Category */}
      <div className="space-y-6">
        {Object.entries(groupedByCategory).map(([category, items]) => (
          <div key={category}>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">{category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <PricingCard
                  key={item.id}
                  item={item}
                  onEdit={() => {
                    setEditingItem(item)
                    setShowModal(true)
                  }}
                  onDelete={() => handleDelete(item.serviceCode)}
                  formatPrice={formatPrice}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredPricing.length === 0 && (
        <div className="text-center py-12">
          <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No pricing found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by seeding default prices or adding a new service.</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <PricingModal
          item={editingItem}
          onClose={() => {
            setShowModal(false)
            setEditingItem(null)
          }}
          onSave={() => {
            setShowModal(false)
            setEditingItem(null)
            loadPricing()
          }}
        />
      )}
    </div>
  )
}

// Pricing Card Component
const PricingCard: React.FC<{
  item: ServicePricing
  onEdit: () => void
  onDelete: () => void
  formatPrice: (kobo: number) => string
}> = ({ item, onEdit, onDelete, formatPrice }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-lg font-semibold text-gray-900">{item.serviceName}</h4>
            {item.isActive ? (
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
            ) : (
              <XCircleIcon className="h-5 w-5 text-gray-400" />
            )}
          </div>
          <p className="text-xs text-gray-500 font-mono">{item.serviceCode}</p>
        </div>
      </div>

      {item.description && (
        <p className="text-sm text-gray-600 mb-3">{item.description}</p>
      )}

      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-blue-600">{formatPrice(item.priceKobo)}</p>
          <p className="text-xs text-gray-500">per request</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// Pricing Modal Component
const PricingModal: React.FC<{
  item: ServicePricing | null
  onClose: () => void
  onSave: () => void
}> = ({ item, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    serviceCode: item?.serviceCode || '',
    serviceName: item?.serviceName || '',
    priceKobo: item?.priceKobo || 0,
    description: item?.description || '',
    category: item?.category || '',
    isActive: item?.isActive ?? true,
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = item
        ? await adminApi.pricing.update(item.serviceCode, {
            serviceName: formData.serviceName,
            priceKobo: formData.priceKobo,
            description: formData.description,
            category: formData.category,
            isActive: formData.isActive,
          })
        : await adminApi.pricing.create(formData)

      if (res.success) {
        toast.success(item ? 'Pricing updated' : 'Pricing created')
        onSave()
      } else {
        toast.error('error' in res ? res.error.message : 'Failed to save')
      }
    } catch (error) {
      toast.error('Failed to save pricing')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {item ? 'Edit Service Pricing' : 'Add Service Pricing'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Code *
            </label>
            <input
              type="text"
              value={formData.serviceCode}
              onChange={(e) => setFormData({ ...formData, serviceCode: e.target.value })}
              disabled={!!item}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Name *
            </label>
            <input
              type="text"
              value={formData.serviceName}
              onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (₦) *
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.priceKobo / 100}
              onChange={(e) => setFormData({ ...formData, priceKobo: Math.round(parseFloat(e.target.value) * 100) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">₦{(formData.priceKobo / 100).toFixed(2)} per request</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Identity, Document"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
              Active (customers can use this service)
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : item ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default AdminPricing
