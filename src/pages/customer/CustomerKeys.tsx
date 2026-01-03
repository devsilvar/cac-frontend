import React, { useEffect, useState } from 'react'
import CustomerDashboardLayout from '../../layouts/CustomerDashboardLayout'
import { useCustomerApi } from '../../hooks/useCustomerApi'
import { Copy, Trash2, Plus, Key, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react'

interface ApiKeyItem { id: string; name: string; status: string; createdAt?: string; lastFour?: string; keyPrefix?: string }

const fmt = (d?: string) => {
  if (!d) return ''
  const dt = new Date(d)
  return isNaN(dt.getTime()) ? d : dt.toLocaleString()
}

const copyToClipboard = async (text: string) => {
  try { await navigator.clipboard.writeText(text) } catch {}
}

const CustomerKeys: React.FC = () => {
  const api = useCustomerApi()
  const [keys, setKeys] = useState<ApiKeyItem[]>([])
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [plainToken, setPlainToken] = useState('')
  const [copied, setCopied] = useState('')

  const [error, setError] = useState('')
  
  const curlExample = `curl -X POST "${window.location.origin}/api/v1/name-search" \\
  -H "Authorization: Token ck_YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  --data '{"SearchType":"ALL","searchTerm":"DANGOTE","maxResults":3}'`

  const load = async () => {
    setError('')
    try {
      const data = await api.get<any>('/api/v1/customer/api-keys')
      const arr = data?.data?.keys || data?.keys || data?.data?.items || []
      setKeys(arr)
    } catch (e: any) {
      setError(e?.message || 'Failed to load keys')
    }
  }

  useEffect(() => { load() }, [])

  const createKey = async () => {
    setCreating(true)
    try {
      const data = await api.post<any>('/api/v1/customer/api-keys', newName ? { name: newName } : undefined)
      const token = data?.data?.token || data?.token
      setPlainToken(token || '')
      await load()
      setNewName('')
    } finally {
      setCreating(false)
    }
  }

  const deleteKey = async (id: string) => {
    await api.del(`/api/v1/customer/api-keys/${id}`)
    await load()
  }

  return (
    <CustomerDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">API Keys</h1>
          <p className="text-gray-600 mt-1">Create and manage your API authentication keys</p>
        </div>

        {/* Create New Key Card */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Create New API Key</h2>
              <p className="text-sm text-gray-600">Generate a new key for your application</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <input 
              value={newName} 
              onChange={e=>setNewName(e.target.value)} 
              placeholder="Key name (e.g., Production Server, Mobile App)" 
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
            <button 
              onClick={createKey} 
              disabled={creating} 
              className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center whitespace-nowrap"
            >
              <Key className="w-4 h-4" />
              {creating ? 'Creating...' : 'Create Key'}
            </button>
          </div>

          {plainToken && (
            <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-yellow-700" />
                <div className="font-semibold text-yellow-800">⚠️ Save Your API Key Now!</div>
              </div>
              <div className="flex gap-2 mb-3">
                <input 
                  readOnly 
                  value={plainToken} 
                  className="flex-1 border-2 border-yellow-300 rounded-lg px-4 py-3 bg-white font-mono text-sm"
                />
                <button 
                  onClick={async()=>{await copyToClipboard(plainToken); setCopied('token')}} 
                  className="px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  {copied === 'token' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied === 'token' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-sm text-yellow-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>This is the only time you'll see this key. Store it securely - you won't be able to retrieve it again.</span>
              </p>
            </div>
          )}
        </div>

        {/* Keys List */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Key className="w-5 h-5 text-gray-600" />
              Your API Keys
            </h2>
            <p className="text-sm text-gray-600 mt-1">Manage and revoke your existing keys</p>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {keys.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Key className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No API Keys Yet</h3>
                <p className="text-gray-600 mb-4">Create your first API key to start making requests</p>
              </div>
            ) : (
              <div className="space-y-3">
                {keys.map(k => {
                  const masked = `${k.keyPrefix || 'ck_'}****${k.lastFour || ''}`
                  const isActive = k.status === 'active'
                  const statusColor = isActive ? 'bg-green-100 text-green-700' : k.status === 'revoked' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  
                  return (
                    <div key={k.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-gray-900">{k.name || 'Unnamed Key'}</span>
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor}`}>
                                {k.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <code className="bg-gray-100 px-2 py-0.5 rounded font-mono text-xs">{masked}</code>
                              <span>•</span>
                              <span className="text-xs">{fmt(k.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button 
                            onClick={async()=>{await copyToClipboard(masked); setCopied(k.id)}} 
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                            title="Copy masked key"
                          >
                            {copied === k.id ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-600 group-hover:text-gray-900" />
                            )}
                          </button>
                          <button 
                            onClick={()=>deleteKey(k.id)} 
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                            title="Revoke key"
                          >
                            <Trash2 className="w-4 h-4 text-gray-600 group-hover:text-red-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Usage Guide */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">How to Use Your API Key</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Include your API key in the Authorization header of every request:</p>
              <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-sm overflow-x-auto">Authorization: Token ck_YOUR_API_KEY</pre>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">Example: Business Name Search</span>
                <button 
                  onClick={async()=>{await copyToClipboard(curlExample); setCopied('curl')}}
                  className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  {copied === 'curl' ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied === 'curl' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs overflow-x-auto">{curlExample}</pre>
            </div>

            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Need help integrating?</p>
                <p>Check out our <a href="/docs" className="underline hover:text-blue-700">comprehensive API documentation</a> for code examples in multiple languages.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomerDashboardLayout>
  )
}

export default CustomerKeys
