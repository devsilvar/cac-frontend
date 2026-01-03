import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import { Copy, Check, Play, Terminal, Code2 } from 'lucide-react'

export default function CodeExample() {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('javascript')
  const [isRunning, setIsRunning] = useState(false)

  const codeExamples = {
    javascript: {
      title: 'JavaScript SDK',
      language: 'javascript',
      code: `// Initialize CAC API Client
import { CACClient } from '@cac-api/sdk'

const client = new CACClient({
  apiKey: process.env.CAC_API_KEY,
  environment: 'production'
})

// Register a new business with AI validation
const registration = await client.business.register({
  name: 'TechVenture Solutions Ltd',
  type: 'LIMITED_LIABILITY',
  address: {
    street: '123 Innovation Drive',
    city: 'Lagos',
    state: 'Lagos',
    country: 'Nigeria'
  },
  directors: [{
    name: 'Sarah Johnson',
    email: 'sarah@techventure.ng',
    phone: '+234-801-234-5678',
    nin: '12345678901'
  }],
  shareholders: [{
    name: 'TechVenture Holdings',
    shares: 1000000,
    percentage: 100
  }]
})

// Smart customer analytics
const analytics = await client.customers.getAnalytics({
  dateRange: 'last_30_days',
  metrics: ['engagement', 'conversion', 'lifetime_value'],
  aiInsights: true
})

console.log('Registration Status:', registration.status)
console.log('AI Insights:', analytics.insights)`
    },
    python: {
      title: 'Python SDK',
      language: 'python',
      code: `# CAC API Python SDK
from cac_api import CACClient
import asyncio

# Initialize client with advanced configuration
client = CACClient(
    api_key=os.environ['CAC_API_KEY'],
    timeout=30,
    retry_config={'max_retries': 3, 'backoff_factor': 2}
)

async def register_business():
    # Business registration with ML validation
    registration = await client.business.register(
        name="DataFlow Analytics Ltd",
        business_type="LIMITED_LIABILITY",
        industry="TECHNOLOGY",
        address={
            "street": "456 Data Center Blvd",
            "city": "Abuja",
            "state": "FCT",
            "postal_code": "900001"
        },
        directors=[{
            "name": "Dr. Amina Kanu",
            "email": "amina@dataflow.ng",
            "qualification": "PhD Computer Science"
        }],
        auto_validate=True,
        compliance_check=True
    )
    
    # Real-time document verification
    documents = await client.documents.verify_batch([
        registration.certificate,
        registration.memorandum
    ])
    
    return {
        'registration': registration,
        'documents': documents,
        'compliance_score': registration.compliance_score
    }

# Run async registration
result = asyncio.run(register_business())
print(f"Business registered: {result['registration'].rc_number}")`
    },
    curl: {
      title: 'REST API',
      language: 'bash',
      code: `# Business Registration API
curl -X POST "https://api.cac-platform.com/v1/business/register" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -H "X-Request-ID: req_$(uuidgen)" \\
  -d '{
    "name": "CloudScale Innovations Ltd",
    "type": "LIMITED_LIABILITY",
    "industry": "CLOUD_COMPUTING",
    "address": {
      "street": "789 Cloud Avenue",
      "city": "Port Harcourt",
      "state": "Rivers",
      "country": "NG"
    },
    "directors": [{
      "name": "Emmanuel Okafor",
      "email": "emmanuel@cloudscale.ng",
      "phone": "+234-802-345-6789",
      "address": "123 Executive Gardens, PH"
    }],
    "options": {
      "auto_validate": true,
      "priority_processing": true,
      "compliance_check": true,
      "document_generation": true
    }
  }'

# Advanced Customer Analytics
curl -X GET "https://api.cac-platform.com/v1/analytics/customers" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -G \\
  -d "timeframe=30d" \\
  -d "metrics=engagement,conversion,churn" \\
  -d "ai_insights=true" \\
  -d "export_format=json"`
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeExamples[activeTab as keyof typeof codeExamples].code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const simulateRun = async () => {
    setIsRunning(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsRunning(false)
  }

  const currentExample = codeExamples[activeTab as keyof typeof codeExamples]

  return (
    <Card gloss className="max-w-5xl mx-auto overflow-hidden">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
              <Terminal className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">Live API Demo</h3>
              <p className="text-white/70">Interactive code examples with real-time execution</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="text-white border-white/30 hover:bg-white/10"
              leftIcon={copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={simulateRun}
              isLoading={isRunning}
              leftIcon={<Play className="w-4 h-4" />}
            >
              {isRunning ? 'Running...' : 'Run Code'}
            </Button>
          </div>
        </div>

        {/* Language Tabs */}
        <div className="flex gap-1 mb-6 bg-black/20 p-1 rounded-xl">
          {Object.entries(codeExamples).map(([key, example]) => (
            <motion.button
              key={key}
              onClick={() => setActiveTab(key)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === key
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Code2 className="w-4 h-4" />
                {example.title}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Code Display */}
        <div className="relative">
          <div className="bg-gray-900/90 rounded-2xl overflow-hidden border border-white/10">
            {/* Code Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/20">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <span className="text-white/60 text-sm font-mono">
                  {currentExample.title} - Live Example
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/40">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Connected
                </div>
              </div>
            </div>
            
            {/* Code Content */}
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.pre
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 overflow-x-auto text-sm font-mono leading-relaxed"
                >
                  <code className="text-gray-100 whitespace-pre">
                    {currentExample.code}
                  </code>
                </motion.pre>
              </AnimatePresence>
              
              {/* Execution Overlay */}
              <AnimatePresence>
                {isRunning && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm"
                  >
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                        <div className="text-white">
                          <div className="font-semibold mb-1">Executing API Request...</div>
                          <div className="text-sm text-white/70">Processing registration with AI validation</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Features List */}
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {[
              { icon: '⚡', title: 'Lightning Fast', desc: 'Sub-100ms response times' },
              { icon: '🔒', title: 'Enterprise Security', desc: 'Bank-grade encryption' },
              { icon: '🤖', title: 'AI-Powered', desc: 'Smart validation & insights' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
              >
                <div className="text-2xl mb-2">{feature.icon}</div>
                <div className="font-semibold text-white mb-1">{feature.title}</div>
                <div className="text-sm text-white/70">{feature.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}