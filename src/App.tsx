import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import HomePage from './pages/HomePage'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminCustomers from './pages/admin/AdminCustomers'
import AdminApiKeys from './pages/admin/AdminApiKeys'
import AdminMonitoring from './pages/admin/AdminMonitoring'
import AdminProfile from './pages/admin/AdminProfile'
import AdminSystem from './pages/admin/AdminSystem'
import AdminSettings from './pages/admin/AdminSettings'
import AdminCustomerKeys from './pages/admin/AdminCustomerKeys'
import AdminCustomerDetails from './pages/admin/AdminCustomerDetails'
import AdminRevenue from './pages/admin/AdminRevenue'
import AdminLayout from './layouts/AdminLayout'
import Docs from './pages/Docs'
import NotFound from './pages/NotFound'
import CustomerLogin from './pages/customer/CustomerLogin'
import CustomerSignup from './pages/customer/CustomerSignup'
import CustomerProfile from './pages/customer/CustomerProfile'
import CustomerDashboard from './pages/customer/CustomerDashboard'
import CustomerKeys from './pages/customer/CustomerKeys'
import CustomerUsage from './pages/customer/CustomerUsage'
import { useCustomerAuth } from './context/CustomerAuthContext'
import { useAdminAuth } from './hooks/useAdminAuth'

function App() {
  const { isAuthenticated: isCustomerAuthed } = useCustomerAuth()
  const { isAuthenticated, loading } = useAdminAuth()
  
  // Force one-time auth initialization by reading localStorage once
  // This prevents re-render loops caused by race conditions
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _init = (localStorage.getItem('adminToken'), localStorage.getItem('adminUser'))

  // Hide loading screen when React app is ready
  useEffect(() => {
    const hideLoading = () => {
      const loadingEl = document.getElementById('loading')
      if (loadingEl) {
        loadingEl.classList.add('fade-out')
        setTimeout(() => loadingEl.remove(), 300)
      }
    }
    const timer = setTimeout(hideLoading, 100)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/customer/login" element={<CustomerLogin />} />
        <Route path="/customer/signup" element={<CustomerSignup />} />
        <Route path="/customer/me" element={isCustomerAuthed ? <CustomerProfile /> : <CustomerLogin />} />
        <Route path="/customer/dashboard" element={isCustomerAuthed ? <CustomerDashboard /> : <CustomerLogin />} />
        <Route path="/customer/api-keys" element={isCustomerAuthed ? <CustomerKeys /> : <CustomerLogin />} />
        <Route path="/customer/usage" element={isCustomerAuthed ? <CustomerUsage /> : <CustomerLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes with layout */}
        <Route element={isAuthenticated ? <AdminLayout /> : <Navigate to="/admin/login" replace /> }>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/customers" element={<AdminCustomers />} />
          <Route path="/admin/customers/:customerId" element={<AdminCustomerDetails />} />
          <Route path="/admin/customers/:customerId/keys" element={<AdminCustomerKeys />} />
          <Route path="/admin/revenue" element={<AdminRevenue />} />
          <Route path="/admin/monitoring" element={<AdminMonitoring />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/system" element={<AdminSystem />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>

        {/* Redirect admin root to dashboard or login */}
        <Route 
          path="/admin" 
          element={<Navigate to={isAuthenticated ? "/admin/dashboard" : "/admin/login"} replace />}
        />

        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App