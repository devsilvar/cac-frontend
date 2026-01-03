import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

export interface AdminUser {
  id: string
  email: string
  role: string
  permissions: string[]
}

interface AuthContextValue {
  isAuthenticated: boolean
  user: AdminUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialize from localStorage once
  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    const storedUser = localStorage.getItem('adminUser')
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setIsAuthenticated(true)
      } catch {
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Don't use the global loading state for login - it's only for initial auth check
    try {
      const response = await fetch('http://localhost:3000/api/v1/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await response.json()
      if (response.ok && data.success) {
        const userData: AdminUser = {
          id: data.data.admin.id,
          email: data.data.admin.email,
          role: data.data.admin.role,
          permissions: data.data.admin.permissions
        }
        localStorage.setItem('adminToken', data.data.token)
        localStorage.setItem('adminUser', JSON.stringify(userData))
        setUser(userData)
        setIsAuthenticated(true)
        return true
      }
      return false
    } catch (err) {
      console.error('Login error:', err)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    setUser(null)
    setIsAuthenticated(false)
  }

  const value = useMemo(() => ({ isAuthenticated, user, loading, login, logout }), [isAuthenticated, user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
  return ctx
}
