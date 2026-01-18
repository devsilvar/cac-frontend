/**
 * Admin Layout Component
 * Comprehensive sidebar navigation layout for admin pages
 */

import React, { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HomeIcon,
  UsersIcon,
  KeyIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  MagnifyingGlassIcon,
  DocumentChartBarIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline'
import { useAdminAuth } from '../hooks/useAdminAuth'
import { adminApi } from '../services/admin.service'

interface NavItem {
  name: string
  path: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

const AdminLayout: React.FC = () => {
  const { user, logout } = useAdminAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [verificationBadge, setVerificationBadge] = useState<number | undefined>(undefined)

  useEffect(() => {
    // Load pending verification count for sidebar badge
    ;(async () => {
      try {
        const res = await adminApi.verification.getStats()
        if (res.success) {
          setVerificationBadge(res.data.totalPending)
        }
      } catch {
        // ignore
      }
    })()
  }, [])

  const navigation: NavItem[] = useMemo(() => [
    { name: 'Dashboard', path: '/admin/dashboard', icon: HomeIcon },
    { name: 'Customers', path: '/admin/customers', icon: UsersIcon },
    { name: 'Verifications', path: '/admin/verification', icon: ShieldCheckIcon, badge: verificationBadge },
    { name: 'Revenue', path: '/admin/revenue', icon: BanknotesIcon },
    { name: 'Pricing', path: '/admin/pricing', icon: CurrencyDollarIcon },
    { name: 'Monitoring', path: '/admin/monitoring', icon: ChartBarIcon },
    { name: 'System', path: '/admin/system', icon: ShieldCheckIcon },
    { name: 'Profile', path: '/admin/profile', icon: UserCircleIcon },
    { name: 'Settings', path: '/admin/settings', icon: Cog6ToothIcon },
  ], [verificationBadge])

  const isActivePath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const handleLogout = () => {
    logout()
    window.location.href = '/admin/login'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar for mobile */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl lg:hidden"
          >
            <SidebarContent
              navigation={navigation}
              isActivePath={isActivePath}
              user={user}
              onLogout={handleLogout}
              onClose={() => setMobileMenuOpen(false)}
              isMobile
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar for desktop */}
      <div
        className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col transition-all duration-300 ${
          sidebarOpen ? 'lg:w-64' : 'lg:w-20'
        }`}
      >
        <SidebarContent
          navigation={navigation}
          isActivePath={isActivePath}
          user={user}
          onLogout={handleLogout}
          collapsed={!sidebarOpen}
        />
      </div>

      {/* Main content */}
      <div
        className={`lg:pl-64 transition-all duration-300 ${
          !sidebarOpen ? 'lg:pl-20' : ''
        }`}
      >
        {/* Top navigation bar */}
        <div className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          {/* Mobile menu button */}
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Desktop sidebar toggle */}
          <button
            type="button"
            className="hidden lg:block -m-2.5 p-2.5 text-gray-700"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <span className="sr-only">Toggle sidebar</span>
            {sidebarOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>

          {/* Separator */}
          <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            {/* Search bar */}
            <div className="relative flex flex-1 items-center">
              <MagnifyingGlassIcon
                className="pointer-events-none absolute left-3 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <input
                type="search"
                placeholder="Search customers, API keys..."
                className="block w-full rounded-lg border-0 bg-gray-50 py-2 pl-10 pr-3 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>

            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Notifications */}
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Separator */}
              <div
                className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
                aria-hidden="true"
              />

              {/* Profile dropdown */}
              <div className="flex items-center gap-x-3">
                <div className="hidden lg:block text-right text-sm leading-6">
                  <p className="font-semibold text-gray-900">{user?.email}</p>
                  <p className="text-gray-500 capitalize">{user?.role}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-8">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

// Sidebar content component
interface SidebarContentProps {
  navigation: NavItem[]
  isActivePath: (path: string) => boolean
  user: any
  onLogout: () => void
  onClose?: () => void
  collapsed?: boolean
  isMobile?: boolean
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  navigation,
  isActivePath,
  user,
  onLogout,
  onClose,
  collapsed = false,
  isMobile = false,
}) => {
  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6 pb-4">
      {/* Logo and close button */}
      <div className="flex h-16 shrink-0 items-center justify-between">
        {!collapsed && (
          <Link to="/admin/dashboard" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <DocumentChartBarIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Admin Panel
            </span>
          </Link>
        )}
        {collapsed && (
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mx-auto">
            <DocumentChartBarIcon className="h-5 w-5 text-white" />
          </div>
        )}
        {isMobile && onClose && (
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700"
            onClick={onClose}
          >
            <span className="sr-only">Close sidebar</span>
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = isActivePath(item.path)
                return (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      onClick={isMobile ? onClose : undefined}
                      className={`
                        group flex gap-x-3 rounded-lg p-3 text-sm font-semibold leading-6 transition-all
                        ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                        }
                        ${collapsed ? 'justify-center' : ''}
                      `}
                    >
                      <item.icon
                        className={`h-6 w-6 shrink-0 ${
                          isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'
                        }`}
                        aria-hidden="true"
                      />
                      {!collapsed && (
                        <>
                          <span>{item.name}</span>
                          {item.badge !== undefined && (
                            <span className="ml-auto inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </li>

          {/* Bottom section */}
          <li className="mt-auto">
            <button
              onClick={onLogout}
              className={`
                group -mx-2 flex w-full gap-x-3 rounded-lg p-3 text-sm font-semibold leading-6 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all
                ${collapsed ? 'justify-center' : ''}
              `}
            >
              <ArrowRightOnRectangleIcon
                className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-red-600"
                aria-hidden="true"
              />
              {!collapsed && <span>Sign Out</span>}
            </button>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default AdminLayout
