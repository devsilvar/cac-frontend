/**
 * Global State Usage Examples
 * Demonstrates how to use the new context providers
 * DELETE THIS FILE AFTER REVIEWING
 */

import React from 'react'
import {
  useCustomerData,
  useAdminData,
  useNotification,
  useOptimizedUsage
} from '../context'

// ============================================
// EXAMPLE 1: Using CustomerDataContext
// ============================================
function CustomerDashboardExample() {
  const { profile, wallet, usage, apiKeys, refreshAll } = useCustomerData()

  // All data is automatically cached and shared across components
  // No need for manual useEffect or useState!

  return (
    <div>
      <h2>Customer Dashboard</h2>
      
      {/* Profile Section */}
      <div>
        <h3>Profile</h3>
        <p>Email: {profile?.email}</p>
        <p>Business: {profile?.businessName}</p>
        <p>Verified: {profile?.isVerified ? 'Yes' : 'No'}</p>
      </div>

      {/* Wallet Section */}
      <div>
        <h3>Wallet</h3>
        <p>Balance: ₦{wallet?.balance.toLocaleString()}</p>
      </div>

      {/* Usage Section */}
      <div>
        <h3>Usage</h3>
        <p>Today: {usage?.requestsToday}</p>
        <p>This Month: {usage?.requestsThisMonth}</p>
        <p>Total: {usage?.totalCalls}</p>
      </div>

      {/* API Keys Section */}
      <div>
        <h3>API Keys</h3>
        <p>Keys: {apiKeys?.length || 0}</p>
      </div>

      <button onClick={refreshAll}>
        Refresh All Data
      </button>
    </div>
  )
}

// ============================================
// EXAMPLE 2: Using AdminDataContext
// ============================================
function AdminDashboardExample() {
  const { stats, customers, metrics, refreshAll } = useAdminData()

  return (
    <div>
      <h2>Admin Dashboard</h2>
      
      {/* Stats */}
      <div>
        <p>Total Customers: {stats?.totalCustomers}</p>
        <p>Total Revenue: ₦{stats?.totalRevenue.toLocaleString()}</p>
        <p>API Calls: {stats?.totalApiCalls}</p>
      </div>

      {/* Customers List */}
      <div>
        <h3>Recent Customers</h3>
        {customers?.slice(0, 5).map(customer => (
          <div key={customer.id}>
            {customer.email} - {customer.usage} calls
          </div>
        ))}
      </div>

      {/* System Metrics */}
      <div>
        <h3>System Health</h3>
        <p>CPU: {metrics?.cpuUsage}%</p>
        <p>Memory: {metrics?.memoryUsage}%</p>
        <p>Error Rate: {metrics?.errorRate}%</p>
      </div>

      <button onClick={refreshAll}>
        Refresh Dashboard
      </button>
    </div>
  )
}

// ============================================
// EXAMPLE 3: Using NotificationContext
// ============================================
function NotificationExample() {
  const { success, error, warning, info } = useNotification()

  const handleSave = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      success('Data saved successfully!', 'Success')
    } catch (err) {
      error('Failed to save data', 'Error')
    }
  }

  return (
    <div>
      <h2>Notifications</h2>
      
      <button onClick={() => success('Operation completed!')}>
        Show Success
      </button>
      
      <button onClick={() => error('Something went wrong')}>
        Show Error
      </button>
      
      <button onClick={() => warning('Please review your data')}>
        Show Warning
      </button>
      
      <button onClick={() => info('New feature available')}>
        Show Info
      </button>

      <button onClick={handleSave}>
        Save with Notification
      </button>
    </div>
  )
}

// ============================================
// EXAMPLE 4: Using Multiple Contexts Together
// ============================================
function CompleteExample() {
  const { profile, wallet } = useCustomerData()
  const { usage } = useOptimizedUsage()
  const { success, error } = useNotification()

  const handleTopUp = async () => {
    try {
      // API call to top up wallet
      success(`Wallet topped up! New balance: ₦${wallet?.balance}`)
    } catch (err) {
      error('Failed to top up wallet')
    }
  }

  return (
    <div>
      <h2>Complete Dashboard</h2>
      
      {/* Using CustomerDataContext */}
      <div>
        <p>Welcome, {profile?.businessName}</p>
        <p>Balance: ₦{wallet?.balance.toLocaleString()}</p>
        <button onClick={handleTopUp}>Top Up</button>
      </div>

      {/* Using OptimizedUsageContext */}
      <div>
        <p>API Calls Today: {usage?.requestsToday}</p>
        <p>Success Rate: {(usage?.successRate || 0) * 100}%</p>
      </div>
    </div>
  )
}

// ============================================
// EXAMPLE 5: Provider Setup in App.tsx
// ============================================
/*
import { CustomerDataProvider, AdminDataProvider, NotificationProvider } from './context'

function App() {
  return (
    <NotificationProvider>
      <CustomerAuthProvider>
        <CustomerDataProvider>
          <Routes>
            <Route path="/customer/*" element={<CustomerRoutes />} />
          </Routes>
        </CustomerDataProvider>
      </CustomerAuthProvider>

      <AuthProvider>
        <AdminDataProvider>
          <Routes>
            <Route path="/admin/*" element={<AdminRoutes />} />
          </Routes>
        </AdminDataProvider>
      </AuthProvider>
    </NotificationProvider>
  )
}
*/

export default function GlobalStateExamples() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Global State Examples</h1>
      <p className="text-gray-600">See examples above in the code</p>
    </div>
  )
}
