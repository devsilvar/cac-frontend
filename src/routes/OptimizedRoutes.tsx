/**
 * Optimized Routes with Code Splitting
 * All routes are lazy-loaded to reduce initial bundle size
 */

import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

// Loading fallback component
const LoadingFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 text-lg">Loading...</p>
    </div>
  </div>
)

// ============================================
// PUBLIC ROUTES (Lazy Loaded)
// ============================================
const HomePage = React.lazy(() => import('../pages/HomePage'))
const Pricing = React.lazy(() => import('../pages/Pricing'))
const Docs = React.lazy(() => import('../pages/Docs'))
const NotFound = React.lazy(() => import('../pages/NotFound'))

// ============================================
// CUSTOMER ROUTES (Lazy Loaded)
// ============================================
const CustomerLogin = React.lazy(() => import('../pages/customer/CustomerLogin'))
const CustomerSignup = React.lazy(() => import('../pages/customer/CustomerSignup'))
const CustomerDashboard = React.lazy(() => import('../pages/customer/CustomerDashboard'))
const CustomerProfile = React.lazy(() => import('../pages/customer/CustomerProfile'))
const CustomerUsage = React.lazy(() => import('../pages/customer/CustomerUsage'))
const CustomerWallet = React.lazy(() => import('../pages/customer/CustomerWallet'))
const CustomerApiKeys = React.lazy(() => import('../pages/customer/CustomerKeys'))

// ============================================
// ADMIN ROUTES (Lazy Loaded)
// ============================================
const AdminLogin = React.lazy(() => import('../pages/admin/AdminLogin'))
const AdminDashboard = React.lazy(() => import('../pages/admin/AdminDashboard'))
const AdminCustomers = React.lazy(() => import('../pages/admin/AdminCustomers'))
const AdminCustomerDetails = React.lazy(() => import('../pages/admin/AdminCustomerDetails'))
const AdminPricing = React.lazy(() => import('../pages/admin/AdminPricing'))
const AdminMonitoring = React.lazy(() => import('../pages/admin/AdminMonitoring'))

// ============================================
// ROUTE PRELOADING
// Preload routes on hover for instant navigation
// ============================================
export const preloadCustomerRoutes = () => {
  import('../pages/customer/CustomerDashboard')
  import('../pages/customer/CustomerProfile')
  import('../pages/customer/CustomerUsage')
}

export const preloadAdminRoutes = () => {
  import('../pages/admin/AdminDashboard')
  import('../pages/admin/AdminCustomers')
  import('../pages/admin/AdminMonitoring')
}

// ============================================
// OPTIMIZED ROUTES COMPONENT
// ============================================
const OptimizedRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/docs" element={<Docs />} />

        {/* Customer Routes */}
        <Route path="/customer/login" element={<CustomerLogin />} />
        <Route path="/customer/signup" element={<CustomerSignup />} />
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/customer/profile" element={<CustomerProfile />} />
        <Route path="/customer/usage" element={<CustomerUsage />} />
        <Route path="/customer/wallet" element={<CustomerWallet />} />
        <Route path="/customer/api-keys" element={<CustomerApiKeys />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/customers" element={<AdminCustomers />} />
        <Route path="/admin/customers/:id" element={<AdminCustomerDetails />} />
        <Route path="/admin/pricing" element={<AdminPricing />} />
        <Route path="/admin/monitoring" element={<AdminMonitoring />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default OptimizedRoutes
