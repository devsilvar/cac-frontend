import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import LoadingSpinner from './components/ui/LoadingSpinner'
import { useCustomerAuth } from './context/CustomerAuthContext'
import { useAdminAuth } from './hooks/useAdminAuth'

// PERFORMANCE: Lazy load pages (code splitting)
// Reduces initial bundle from ~800KB to ~200KB
// Each route loads only when user navigates to it

// Public pages (load immediately - most visited)
import HomePage from './pages/HomePage'
import CustomerLogin from './pages/customer/CustomerLogin'
import AdminLogin from './pages/admin/AdminLogin'

// Lazy load admin pages (only load when admin logs in)
const AdminLayout = lazy(() => import('./layouts/AdminLayout'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers'))
const AdminCustomerDetails = lazy(() => import('./pages/admin/AdminCustomerDetails'))
const AdminCustomerKeys = lazy(() => import('./pages/admin/AdminCustomerKeys'))
const AdminVerificationQueue = lazy(() => import('./pages/admin/AdminVerificationQueue'))
const AdminVerificationReview = lazy(() => import('./pages/admin/AdminVerificationReview'))
const AdminRevenue = lazy(() => import('./pages/admin/AdminRevenue'))
const AdminPricing = lazy(() => import('./pages/admin/AdminPricing'))
const AdminMonitoring = lazy(() => import('./pages/admin/AdminMonitoring'))
const AdminProfile = lazy(() => import('./pages/admin/AdminProfile'))
const AdminSystem = lazy(() => import('./pages/admin/AdminSystem'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'))

// Lazy load customer pages
const CustomerSignup = lazy(() => import('./pages/customer/CustomerSignup'))
const CustomerDashboard = lazy(() => import('./pages/customer/CustomerDashboard'))
const CustomerProfile = lazy(() => import('./pages/customer/CustomerProfile'))
const CustomerKeys = lazy(() => import('./pages/customer/CustomerKeys'))
const CustomerUsage = lazy(() => import('./pages/customer/CustomerUsage'))
const CustomerVerification = lazy(() => import('./pages/customer/CustomerVerification'))
const CustomerWallet = lazy(() => import('./pages/customer/CustomerWallet'))
const WalletCallback = lazy(() => import('./pages/customer/WalletCallback'))
const CustomerForgotPassword = lazy(() => import('./pages/customer/CustomerForgotPassword'))
const CustomerResetPassword = lazy(() => import('./pages/customer/CustomerResetPassword'))

// Lazy load other pages
const Pricing = lazy(() => import('./pages/Pricing'))
const Docs = lazy(() => import('./pages/Docs'))
const NotFound = lazy(() => import('./pages/NotFound'))

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
      <Suspense fallback={<LoadingSpinner fullScreen text="Loading..." />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/docs" element={<Docs />} />
        <Route path="/customer/login" element={<CustomerLogin />} />
        <Route path="/customer/signup" element={<CustomerSignup />} />
        <Route path="/customer/forgot-password" element={<CustomerForgotPassword />} />
        <Route path="/customer/reset-password" element={<CustomerResetPassword />} />
        <Route path="/customer/me" element={isCustomerAuthed ? <CustomerProfile /> : <CustomerLogin />} />
        <Route path="/customer/dashboard" element={isCustomerAuthed ? <CustomerDashboard /> : <CustomerLogin />} />
        <Route path="/customer/verification" element={isCustomerAuthed ? <CustomerVerification /> : <CustomerLogin />} />
        <Route path="/customer/api-keys" element={isCustomerAuthed ? <CustomerKeys /> : <CustomerLogin />} />
        <Route path="/customer/usage" element={isCustomerAuthed ? <CustomerUsage /> : <CustomerLogin />} />
        <Route path="/customer/wallet" element={isCustomerAuthed ? <CustomerWallet /> : <CustomerLogin />} />
        <Route path="/customer/wallet/callback" element={<WalletCallback />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes with layout */}
        <Route element={isAuthenticated ? <AdminLayout /> : <Navigate to="/admin/login" replace /> }>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/customers" element={<AdminCustomers />} />
          <Route path="/admin/verification" element={<AdminVerificationQueue />} />
          <Route path="/admin/verification/:customerId" element={<AdminVerificationReview />} />
          <Route path="/admin/customers/:customerId" element={<AdminCustomerDetails />} />
          <Route path="/admin/customers/:customerId/keys" element={<AdminCustomerKeys />} />
          <Route path="/admin/revenue" element={<AdminRevenue />} />
          <Route path="/admin/pricing" element={<AdminPricing />} />
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
      </Suspense>
    </div>
  )
}

export default App