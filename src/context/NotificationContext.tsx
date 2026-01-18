/**
 * Notification/Toast Context
 * Provides app-wide notifications and toast messages
 * Replaces react-hot-toast with more control
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { X, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'

type NotificationType = 'success' | 'error' | 'warning' | 'info'

interface Notification {
  id: string
  type: NotificationType
  title?: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface NotificationContextType {
  notifications: Notification[]
  success: (message: string, title?: string, duration?: number) => void
  error: (message: string, title?: string, duration?: number) => void
  warning: (message: string, title?: string, duration?: number) => void
  info: (message: string, title?: string, duration?: number) => void
  custom: (notification: Omit<Notification, 'id'>) => void
  dismiss: (id: string) => void
  dismissAll: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newNotification: Notification = { ...notification, id }
    
    setNotifications((prev) => [...prev, newNotification])

    // Auto-dismiss after duration (default 5 seconds)
    const duration = notification.duration ?? 5000
    if (duration > 0) {
      setTimeout(() => {
        dismiss(id)
      }, duration)
    }

    return id
  }, [])

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const dismissAll = useCallback(() => {
    setNotifications([])
  }, [])

  const success = useCallback((message: string, title?: string, duration?: number) => {
    addNotification({ type: 'success', message, title, duration })
  }, [addNotification])

  const error = useCallback((message: string, title?: string, duration?: number) => {
    addNotification({ type: 'error', message, title, duration })
  }, [addNotification])

  const warning = useCallback((message: string, title?: string, duration?: number) => {
    addNotification({ type: 'warning', message, title, duration })
  }, [addNotification])

  const info = useCallback((message: string, title?: string, duration?: number) => {
    addNotification({ type: 'info', message, title, duration })
  }, [addNotification])

  const custom = useCallback((notification: Omit<Notification, 'id'>) => {
    addNotification(notification)
  }, [addNotification])

  const value: NotificationContextType = {
    notifications,
    success,
    error,
    warning,
    info,
    custom,
    dismiss,
    dismissAll
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer notifications={notifications} dismiss={dismiss} />
    </NotificationContext.Provider>
  )
}

// Notification Container Component
const NotificationContainer: React.FC<{
  notifications: Notification[]
  dismiss: (id: string) => void
}> = ({ notifications, dismiss }) => {
  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-md">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onDismiss={() => dismiss(notification.id)}
        />
      ))}
    </div>
  )
}

// Individual Notification Item
const NotificationItem: React.FC<{
  notification: Notification
  onDismiss: () => void
}> = ({ notification, onDismiss }) => {
  const config = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600',
      textColor: 'text-green-900'
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-600',
      textColor: 'text-red-900'
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-600',
      textColor: 'text-yellow-900'
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-900'
    }
  }

  const { icon: Icon, bgColor, borderColor, iconColor, textColor } = config[notification.type]

  return (
    <div
      className={`${bgColor} ${borderColor} border rounded-lg shadow-lg p-4 flex items-start gap-3 animate-slide-in`}
    >
      <Icon className={`${iconColor} w-5 h-5 flex-shrink-0 mt-0.5`} />
      
      <div className="flex-1 min-w-0">
        {notification.title && (
          <h4 className={`font-semibold ${textColor} mb-1`}>
            {notification.title}
          </h4>
        )}
        <p className={`text-sm ${textColor}`}>{notification.message}</p>
        
        {notification.action && (
          <button
            onClick={notification.action.onClick}
            className={`mt-2 text-sm font-medium ${iconColor} hover:underline`}
          >
            {notification.action.label}
          </button>
        )}
      </div>

      <button
        onClick={onDismiss}
        className={`${textColor} hover:bg-white/50 rounded p-1 transition-colors`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

// Hook to use notifications
export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}

// Add animation to globals.css or index.css:
/*
@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}
*/
