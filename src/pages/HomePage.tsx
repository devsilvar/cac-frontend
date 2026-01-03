import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  ArrowRightIcon, 
  CodeBracketIcon, 
  ShieldCheckIcon, 
  RocketLaunchIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { useApi } from '../hooks/useApi'
import Navigation from '../components/Navigation'

const HomePage: React.FC = () => {
  const [email, setEmail] = useState('')
  const { loading } = useApi()

  const features = [
    {
      icon: CodeBracketIcon,
      title: "Developer First",
      description: "RESTful API with comprehensive documentation and SDKs"
    },
    {
      icon: ShieldCheckIcon,
      title: "Enterprise Security",
      description: "Bank-grade security with API key management and rate limiting"
    },
    {
      icon: RocketLaunchIcon,
      title: "Lightning Fast",
      description: "99.9% uptime with global CDN and optimized infrastructure"
    }
  ]

  const useCases = [
    "Company Registration",
    "Business Name Search", 
    "Document Verification",
    "Compliance Checking"
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Global Navigation */}
      <Navigation />

      {/* Hero Section */}
      {/* Increased top padding because navbar is fixed and tall (h-20) */}
      <section className="pt-28 md:pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Business APIs
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Made Simple
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Streamline your business operations with our comprehensive API suite. 
                From company registration to document verification - all in one place.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Get API Key
                </button>
                <Link to="/docs" className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:border-gray-400 transition-colors font-medium">
                  View Documentation
                </Link>
              </div>
            </motion.div>

            {/* Code Preview */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-16 max-w-4xl mx-auto"
            >
              <div className="bg-gray-900 rounded-lg p-6 text-left">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <pre className="text-sm text-gray-300 overflow-x-auto">
{`curl -X POST "https://api.businessapi.com/v1/business/name-registration" \\
  -H "Authorization: Token YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "business_name": "TechCorp Ltd",
    "full_name": "John Doe",
    "email": "john@example.com"
  }'`}
                </pre>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed for modern businesses and developers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Built for your business needs
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our APIs power everything from startup validation to enterprise compliance. 
                Join thousands of companies streamlining their operations.
              </p>
              
              <div className="space-y-4">
                {useCases.map((useCase, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircleIcon className="w-6 h-6 text-green-500" />
                    <span className="text-gray-700 font-medium">{useCase}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Response</h3>
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <pre className="text-sm text-green-800">
{`{
  "success": true,
  "data": {
    "registration_id": "REG_001",
    "status": "approved",
    "business_name": "TechCorp Ltd",
    "certificate_url": "https://..."
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section (moved from /pricing) */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h2>
            <p className="text-xl text-gray-600">Choose the plan that fits your needs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900">Basic</h3>
              <p className="mt-4"><span className="text-4xl font-bold text-gray-900">$0</span><span className="text-gray-500">/mo</span></p>
              <ul className="mt-6 space-y-2 text-gray-600">
                <li>• 100 API calls/day</li>
                <li>• Email support</li>
                <li>• Community access</li>
              </ul>
              <a href="/customer/login" className="mt-6 inline-block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Get started</a>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900">Pro</h3>
              <p className="mt-4"><span className="text-4xl font-bold text-gray-900">$49</span><span className="text-gray-500">/mo</span></p>
              <ul className="mt-6 space-y-2 text-gray-600">
                <li>• 50k API calls/month</li>
                <li>• Priority support</li>
                <li>• Rate limiting controls</li>
              </ul>
              <a href="/customer/login" className="mt-6 inline-block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Start Pro</a>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900">Enterprise</h3>
              <p className="mt-4"><span className="text-4xl font-bold text-gray-900">$199</span><span className="text-gray-500">/mo</span></p>
              <ul className="mt-6 space-y-2 text-gray-600">
                <li>• Unlimited API calls</li>
                <li>• 24/7 support</li>
                <li>• Custom SLAs</li>
              </ul>
              <a href="/customer/login" className="mt-6 inline-block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Contact Sales</a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of developers building the future of business operations
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Start Free Trial
            </button>
            <button className="border border-blue-400 text-white px-8 py-3 rounded-lg hover:border-blue-300 transition-colors font-medium">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <CodeBracketIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold text-gray-900">BusinessAPI</span>
              </div>
              <p className="text-gray-600">
                Streamlining business operations with powerful APIs
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Features</a></li>
                <li><a href="#" className="hover:text-gray-900">Pricing</a></li>
                <li><a href="#" className="hover:text-gray-900">Documentation</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-gray-900">About</a></li>
                <li><a href="#" className="hover:text-gray-900">Contact</a></li>
                <li><a href="#" className="hover:text-gray-900">Privacy</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Help Center</a></li>
                <li><a href="#" className="hover:text-gray-900">Status</a></li>
                <li><Link to="/admin/login" className="hover:text-gray-900">Admin Portal</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <div className="flex items-center justify-center gap-6 mb-3">
              <Link to="/docs" className="hover:text-gray-900">Docs</Link>
              <Link to="/pricing" className="hover:text-gray-900">Pricing</Link>
              <Link to="/customer/login" className="hover:text-gray-900">Customer Portal</Link>
            </div>
            <p>&copy; 2024 BusinessAPI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage