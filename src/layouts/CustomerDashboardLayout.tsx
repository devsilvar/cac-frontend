import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Key, 
  BarChart3, 
  User, 
  LogOut, 
  Menu, 
  X,
  Home,
  FileText,
  ChevronRight,
  Settings,
  Bell,
  CreditCard,
  Wallet,
  Plus
} from 'lucide-react'
import { useCustomerAuth } from '../context/CustomerAuthContext'
import { walletService, WalletBalance } from '../services/wallet.service'

interface CustomerDashboardLayoutProps {
  children: React.ReactNode
}

const CustomerDashboardLayout: React.FC<CustomerDashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [walletBalance, setWalletBalance] = useState<WalletBalance | null>(null)
  const { customer, logout } = useCustomerAuth()
  const navigate = useNavigate()

  // Fetch wallet balance
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const balance = await walletService.getBalance()
        setWalletBalance(balance)
      } catch (err) {
        console.error('Failed to fetch wallet balance:', err)
      }
    }
    fetchBalance()
    // Refresh balance every 30 seconds
    const interval = setInterval(fetchBalance, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/customer/login')
  }

  const navItems = [
    { to: '/customer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/customer/wallet', label: 'Wallet', icon: CreditCard },
    { to: '/customer/api-keys', label: 'API Keys', icon: Key },
    { to: '/customer/usage', label: 'Usage & Analytics', icon: BarChart3 },
    { to: '/customer/me', label: 'Profile', icon: User },
  ]

  const quickLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/docs', label: 'Documentation', icon: FileText },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
          )}
        </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">BusinessAPI</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* User Info */}
        <div className="px-4 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {customer?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {customer?.company || customer?.email || 'User'}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 capitalize">{customer?.plan || 'Basic'} Plan</span>
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
            Main Menu
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 text-blue-600" />}
                </>
              )}
            </NavLink>
          ))}

          <div className="pt-4 mt-4 border-t border-gray-200">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
              Quick Links
            </div>
            {quickLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all"
              >
                <item.icon className="w-5 h-5 text-gray-500" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-700 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Welcome back!</h2>
              <p className="text-xs text-gray-500">Manage your business API access</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Wallet Balance Display */}
            <Link 
              to="/customer/wallet"
              className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg hover:shadow-md transition-all"
            >
              <Wallet className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-gray-900">
                {walletBalance?.formatted || '₦0.00'}
              </span>
              <Plus className="w-3.5 h-3.5 text-blue-600" />
            </Link>
            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-8">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 px-4 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
            <div>© {new Date().getFullYear()} BusinessAPI. All rights reserved.</div>
            <div className="flex items-center gap-6">
              <a href="/docs" className="hover:text-gray-900 transition-colors">Documentation</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Support</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default CustomerDashboardLayout
