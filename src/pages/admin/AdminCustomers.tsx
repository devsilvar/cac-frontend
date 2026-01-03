/**
 * Admin Customers Management Page
 * Full CRUD operations for customer management
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  UsersIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  NoSymbolIcon,
  CheckCircleIcon,
  XMarkIcon,
  EyeIcon,
  KeyIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'
import { adminApi } from '../../services/admin.service'
import type { CustomerListItem, CreateCustomerRequest, UpdateCustomerRequest } from '../../types/admin.types'

const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'suspended' | 'inactive'>('all')
  const [filterPlan, setFilterPlan] = useState<'all' | 'free' | 'basic' | 'pro' | 'enterprise'>('all')
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerListItem | null>(null)
  
  // Form state
  const [newCustomer, setNewCustomer] = useState<CreateCustomerRequest>({
    email: '',
    company: '',
    phone: '',
    plan: 'basic',
  })
  
  const [editCustomer, setEditCustomer] = useState<UpdateCustomerRequest>({})

  useEffect(() => {
    loadCustomers()
  }, [filterStatus, filterPlan])

  const loadCustomers = async () => {
    setLoading(true)
    try {
      const filters: any = {}
      if (filterStatus !== 'all') filters.status = filterStatus
      if (filterPlan !== 'all') filters.plan = filterPlan
      
      const response = await adminApi.customers.getCustomers(filters)
      if (response.success) {
        setCustomers(response.data.customers || [])
      }
    } catch (error) {
      console.error('Failed to load customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await adminApi.customers.createCustomer(newCustomer)
      if (response.success) {
        setCustomers([response.data.customer as any, ...customers])
        setShowCreateModal(false)
        setNewCustomer({ email: '', company: '', phone: '', plan: 'basic' })
      }
    } catch (error) {
      console.error('Failed to create customer:', error)
    }
  }

  const handleUpdateCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCustomer) return
    
    try {
      const response = await adminApi.customers.updateCustomer(selectedCustomer.id, editCustomer)
      if (response.success) {
        setCustomers(customers.map(c => 
          c.id === selectedCustomer.id ? { ...c, ...response.data.customer } : c
        ))
        setShowEditModal(false)
        setSelectedCustomer(null)
        setEditCustomer({})
      }
    } catch (error) {
      console.error('Failed to update customer:', error)
    }
  }

  const handleSuspendCustomer = async (customer: CustomerListItem) => {
    try {
      const response = await adminApi.customers.suspendCustomer(customer.id)
      if (response.success) {
        setCustomers(customers.map(c => 
          c.id === customer.id ? { ...c, status: 'suspended' as const } : c
        ))
      }
    } catch (error) {
      console.error('Failed to suspend customer:', error)
    }
  }

  const handleActivateCustomer = async (customer: CustomerListItem) => {
    try {
      const response = await adminApi.customers.activateCustomer(customer.id)
      if (response.success) {
        setCustomers(customers.map(c => 
          c.id === customer.id ? { ...c, status: 'active' as const } : c
        ))
      }
    } catch (error) {
      console.error('Failed to activate customer:', error)
    }
  }

  const handleDeleteCustomer = async () => {
    if (!selectedCustomer) return
    
    try {
      const response = await adminApi.customers.deleteCustomer(selectedCustomer.id)
      if (response.success) {
        setCustomers(customers.filter(c => c.id !== selectedCustomer.id))
        setShowDeleteModal(false)
        setSelectedCustomer(null)
      }
    } catch (error) {
      console.error('Failed to delete customer:', error)
    }
  }

  const openEditModal = (customer: CustomerListItem) => {
    setSelectedCustomer(customer)
    setEditCustomer({
      email: customer.email,
      company: customer.company,
      plan: customer.plan,
    })
    setShowEditModal(true)
  }

  const filteredCustomers = customers.filter(customer =>
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.company?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  )

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    suspended: customers.filter(c => c.status === 'suspended').length,
    inactive: customers.filter(c => c.status === 'inactive').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all API customers and their access
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Customer
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <StatsCard label="Total" value={stats.total} color="blue" />
        <StatsCard label="Active" value={stats.active} color="green" />
        <StatsCard label="Suspended" value={stats.suspended} color="orange" />
        <StatsCard label="Inactive" value={stats.inactive} color="gray" />
      </div>

      {/* Filters */}
      <div className="bg-white shadow-sm rounded-lg p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="inactive">Inactive</option>
          </select>
          
          <select
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value as any)}
            className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="all">All Plans</option>
            <option value="free">Free</option>
            <option value="basic">Basic</option>
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No customers found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchTerm ? 'Try adjusting your search' : 'Get started by adding a new customer'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <CustomerRow
                    key={customer.id}
                    customer={customer}
                    onEdit={openEditModal}
                    onSuspend={handleSuspendCustomer}
                    onActivate={handleActivateCustomer}
                    onDelete={(c) => {
                      setSelectedCustomer(c)
                      setShowDeleteModal(true)
                    }}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Add New Customer"
      >
        <form onSubmit={handleCreateCustomer} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              value={newCustomer.email}
              onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Company</label>
            <input
              type="text"
              value={newCustomer.company}
              onChange={(e) => setNewCustomer({ ...newCustomer, company: e.target.value })}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              value={newCustomer.phone}
              onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Plan</label>
            <select
              value={newCustomer.plan}
              onChange={(e) => setNewCustomer({ ...newCustomer, plan: e.target.value })}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="free">Free</option>
              <option value="basic">Basic</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Create Customer
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Customer"
      >
        <form onSubmit={handleUpdateCustomer} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={editCustomer.email || ''}
              onChange={(e) => setEditCustomer({ ...editCustomer, email: e.target.value })}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Company</label>
            <input
              type="text"
              value={editCustomer.company || ''}
              onChange={(e) => setEditCustomer({ ...editCustomer, company: e.target.value })}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Plan</label>
            <select
              value={editCustomer.plan || 'basic'}
              onChange={(e) => setEditCustomer({ ...editCustomer, plan: e.target.value })}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="free">Free</option>
              <option value="basic">Basic</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Customer"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete {selectedCustomer?.email}? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteCustomer}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

// Helper Components
const StatsCard: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    gray: 'bg-gray-100 text-gray-600',
  }
  
  return (
    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`rounded-lg p-3 ${colorClasses[color as keyof typeof colorClasses]}`}>
              <UsersIcon className="h-6 w-6" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{label}</dt>
              <dd className="text-2xl font-semibold text-gray-900">{value}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}

const CustomerRow: React.FC<{
  customer: CustomerListItem
  onEdit: (customer: CustomerListItem) => void
  onSuspend: (customer: CustomerListItem) => void
  onActivate: (customer: CustomerListItem) => void
  onDelete: (customer: CustomerListItem) => void
}> = ({ customer, onEdit, onSuspend, onActivate, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false)
  
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    suspended: 'bg-orange-100 text-orange-800',
    inactive: 'bg-gray-100 text-gray-800',
  }
  
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="text-sm font-medium text-gray-900">{customer.company || 'N/A'}</div>
          <div className="text-sm text-gray-500">{customer.email}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
          {customer.plan}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[customer.status]} capitalize`}>
          {customer.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {customer.usage || 0} calls
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(customer.createdAt).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="text-gray-400 hover:text-gray-600"
        >
          <EllipsisVerticalIcon className="h-5 w-5" />
        </button>
        
        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-0 z-20 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                <Link
                  to={`/admin/customers/${customer.id}`}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowMenu(false)}
                >
                  <EyeIcon className="h-4 w-4 mr-2" />
                  View Details
                </Link>
                <Link
                  to={`/admin/customers/${customer.id}/keys`}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowMenu(false)}
                >
                  <KeyIcon className="h-4 w-4 mr-2" />
                  View API Keys
                </Link>
                <button
                  onClick={() => { onEdit(customer); setShowMenu(false) }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit
                </button>
                {customer.status === 'active' ? (
                  <button
                    onClick={() => { onSuspend(customer); setShowMenu(false) }}
                    className="flex items-center w-full px-4 py-2 text-sm text-orange-700 hover:bg-orange-50"
                  >
                    <NoSymbolIcon className="h-4 w-4 mr-2" />
                    Suspend
                  </button>
                ) : (
                  <button
                    onClick={() => { onActivate(customer); setShowMenu(false) }}
                    className="flex items-center w-full px-4 py-2 text-sm text-green-700 hover:bg-green-50"
                  >
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Activate
                  </button>
                )}
                <button
                  onClick={() => { onDelete(customer); setShowMenu(false) }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </>
        )}
      </td>
    </tr>
  )
}

const Modal: React.FC<{
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null
  
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  )
}

export default AdminCustomers
