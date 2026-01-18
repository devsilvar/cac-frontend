/**
 * Optimized Auth Context
 * Improved version with better performance and memoization
 * Prevents unnecessary re-renders across the app
 */

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

interface User {
  id: string
  email: string
  role: string
  name?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const OptimizedAuthProvider: React.FC<{ children: ReactNode }> = React.memo(({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken')
        const storedUser = localStorage.getItem('user')
        
        if (token && storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Memoized login function
  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      const userData = data.user
      const token = data.token

      localStorage.setItem('authToken', token)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }, [])

  // Memoized logout function
  const logout = useCallback(() => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/login')
  }, [navigate])

  // Memoized update user function
  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null
      const updated = { ...prev, ...updates }
      localStorage.setItem('user', JSON.stringify(updated))
      return updated
    })
  }, [])

  // Memoize derived values
  const isAuthenticated = useMemo(() => !!user, [user])

  // Memoize the entire context value
  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      updateUser
    }),
    [user, isAuthenticated, isLoading, login, logout, updateUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
})

OptimizedAuthProvider.displayName = 'OptimizedAuthProvider'

export const useOptimizedAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useOptimizedAuth must be used within an OptimizedAuthProvider')
  }
  return context
}
