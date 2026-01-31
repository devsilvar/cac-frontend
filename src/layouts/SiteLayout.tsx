import React from 'react'
import Navigation from '../components/Navigation'

const SiteLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />
      <main className="pt-20 flex-1">{children}</main>
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-between text-sm text-gray-600">
          <div>© {new Date().getFullYear()} WallX Business APIs</div>
          <div className="flex items-center gap-4">
            <a href="/docs" className="hover:text-gray-900">Docs</a>
            <a href="/admin/login" className="hover:text-gray-900">Admin Portal</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default SiteLayout