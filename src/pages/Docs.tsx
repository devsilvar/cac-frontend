/**
 * API Documentation Page
 * Customer-facing documentation for Business Verification APIs
 * 
 * Updated with accurate endpoints, pricing, and examples
 */

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  DocumentTextIcon,
  KeyIcon,
  ShieldCheckIcon,
  CodeBracketIcon,
  CheckCircleIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

const Docs: React.FC = () => {
  const [activeSection, setActiveSection] = useState('getting-started')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['getting-started', 'authentication', 'endpoints', 'errors']
      const scrollPosition = window.scrollY + 200

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded hover:bg-gray-100"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6 text-gray-600" />
                ) : (
                  <Bars3Icon className="h-6 w-6 text-gray-600" />
                )}
              </button>
              <div>
                <Link to="/" className="text-sm text-blue-600 hover:text-blue-700">
                  ← Back
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 mt-1">API Documentation</h1>
              </div>
            </div>
            <Link
              to="/customer/login"
              className="hidden sm:inline-flex items-center px-4 py-2 rounded text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Get API Key
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">
          {/* Sidebar Navigation - LEFT SIDE */}
          <nav className="lg:sticky lg:top-28 order-1 w-full lg:w-64 shrink-0">
            <div className="max-h-[calc(100vh-140px)] overflow-y-auto space-y-1 bg-white border border-gray-200 rounded-lg p-4">
              <div className="mb-3">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">
                  Navigation
                </h3>
              </div>
              <SidebarLink href="#getting-started" icon={DocumentTextIcon} isActive={activeSection === 'getting-started'}>
                Getting Started
              </SidebarLink>
              <SidebarLink href="#authentication" icon={KeyIcon} isActive={activeSection === 'authentication'}>
                Authentication
              </SidebarLink>
              <SidebarLink href="#endpoints" icon={CodeBracketIcon} isActive={activeSection === 'endpoints'}>
                API Endpoints
              </SidebarLink>
              <div className="ml-6 space-y-1 mt-2 border-l-2 border-gray-200 pl-3">
                <SubLink href="#bvn">
                  BVN Verification
                </SubLink>
                <SubLink href="#drivers-license">
                  Driver's License
                </SubLink>
                <SubLink href="#passport">
                  Passport
                </SubLink>
                <SubLink href="#voters-card">
                  Voter's Card
                </SubLink>
                <SubLink href="#name-search">
                  CAC Name Search
                </SubLink>
                <SubLink href="#company-reg">
                  Company Registration
                </SubLink>
              </div>
              <SidebarLink href="#errors" icon={ShieldCheckIcon} isActive={activeSection === 'errors'}>
                Errors
              </SidebarLink>
            </div>
          </nav>

          {/* Mobile Sidebar */}
          {isMobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
              <nav className="fixed left-0 top-0 bottom-0 w-80 bg-white shadow-xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 space-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Navigation</h3>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2 rounded hover:bg-gray-100"
                    >
                      <XMarkIcon className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                  <SidebarLink href="#getting-started" icon={DocumentTextIcon} isActive={activeSection === 'getting-started'} onClick={() => setIsMobileMenuOpen(false)}>
                    Getting Started
                  </SidebarLink>
                  <SidebarLink href="#authentication" icon={KeyIcon} isActive={activeSection === 'authentication'} onClick={() => setIsMobileMenuOpen(false)}>
                    Authentication
                  </SidebarLink>
                  <SidebarLink href="#endpoints" icon={CodeBracketIcon} isActive={activeSection === 'endpoints'} onClick={() => setIsMobileMenuOpen(false)}>
                    API Endpoints
                  </SidebarLink>
                  <div className="ml-4 space-y-1 mt-1 border-l border-gray-200 pl-2">
                    <SubLink href="#bvn" onClick={() => setIsMobileMenuOpen(false)}>
                      BVN Verification
                    </SubLink>
                    <SubLink href="#drivers-license" onClick={() => setIsMobileMenuOpen(false)}>
                      Driver's License
                    </SubLink>
                    <SubLink href="#passport" onClick={() => setIsMobileMenuOpen(false)}>
                      Passport
                    </SubLink>
                    <SubLink href="#voters-card" onClick={() => setIsMobileMenuOpen(false)}>
                      Voter's Card
                    </SubLink>
                    <SubLink href="#name-search" onClick={() => setIsMobileMenuOpen(false)}>
                      CAC Name Search
                    </SubLink>
                    <SubLink href="#company-reg" onClick={() => setIsMobileMenuOpen(false)}>
                      Company Registration
                    </SubLink>
                  </div>
                  <SidebarLink href="#errors" icon={ShieldCheckIcon} isActive={activeSection === 'errors'} onClick={() => setIsMobileMenuOpen(false)}>
                    Errors
                  </SidebarLink>
                </div>
              </nav>
            </div>
          )}

          {/* Main Content - RIGHT SIDE */}
          <main className="flex-1 min-w-0 space-y-12 order-2 w-full">
            {/* Getting Started Section */}
            <Section id="getting-started" title="Getting Started">
              <div className="prose max-w-none">
                <p className="text-gray-600 text-lg">
                  Welcome to our Business Verification API. Access Nigerian identity verification and 
                  business registration services with simple REST API calls.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <h3 className="text-sm font-semibold text-blue-900 mb-2">Base URL</h3>
                  <CodeBlock>
                    https://your-domain.com/api/v1
                  </CodeBlock>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FeatureCard
                    icon={<ShieldCheckIcon className="h-8 w-8 text-blue-600" />}
                    title="Secure"
                    description="API key authentication with encrypted connections"
                  />
                  <FeatureCard
                    icon={<CheckCircleIcon className="h-8 w-8 text-green-600" />}
                    title="Reliable"
                    description="99.9% uptime with real-time verification"
                  />
                  <FeatureCard
                    icon={<CodeBracketIcon className="h-8 w-8 text-purple-600" />}
                    title="Easy to Use"
                    description="Simple REST API with comprehensive documentation"
                  />
                </div>
              </div>
            </Section>

            {/* Authentication Section */}
            <Section id="authentication" title="Authentication">
              <div className="space-y-4">
                <p className="text-gray-600">
                  All API requests require an API key. Include it in the Authorization header:
                </p>

                <CodeBlock language="http">
{`Authorization: Token YOUR_API_KEY_HERE`}
                </CodeBlock>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Prerequisites</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>Create an account and complete business verification</li>
                    <li>Generate an API key from your dashboard</li>
                    <li>Maintain sufficient wallet balance</li>
                  </ul>
                </div>

                <h4 className="font-semibold text-gray-900 mt-6">Example Request</h4>
                <CodeBlock language="bash">
{`curl -X POST https://your-domain.com/api/v1/business/bvn-basic \\
  -H "Authorization: Token ck_fa80b8382479af..." \\
  -H "Content-Type: application/json" \\
  -d '{"bvn": "22234567890"}'`}
                </CodeBlock>
              </div>
            </Section>

            {/* API Endpoints Section */}
            <Section id="endpoints" title="API Endpoints">
              {/* BVN Verification */}
              <EndpointCard
                id="bvn"
                method="POST"
                endpoint="/api/v1/business/bvn-basic"
                title="BVN Basic Verification"
                description="Verify a Bank Verification Number (BVN) with NIBSS"
                price=""
              >
                <h4 className="font-semibold text-gray-900 mt-4 mb-2">Request Body</h4>
                <CodeBlock language="json">
{`{
  "bvn": "22234567890"
}`}
                </CodeBlock>

                <h4 className="font-semibold text-gray-900 mt-4 mb-2">Parameters</h4>
                <ParameterTable>
                  <ParameterRow name="bvn" type="string" required description="11-digit BVN number" />
                </ParameterTable>

                <h4 className="font-semibold text-gray-900 mt-4 mb-2">Success Response (200 OK)</h4>
                <CodeBlock language="json">
{`{
  "success": true,
  "data": {
    "bvn": "22234567890",
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1990-05-15",
    "phoneNumber": "080********",
    "verified": true
  },
  "cost": {
    "amount": 10000,
    "formatted": "₦100.00"
  }
}`}
                </CodeBlock>
              </EndpointCard>

              {/* Driver's License Verification */}
              <EndpointCard
                id="drivers-license"
                method="POST"
                endpoint="/api/v1/business/drivers-license-verification"
                title="Driver's License Verification"
                description="Verify a Nigerian Driver's License with FRSC"
                price=""
              >
                <h4 className="font-semibold text-gray-900 mt-4 mb-2">Request Body</h4>
                <CodeBlock language="json">
{`{
  "license_number": "FKJ1234567890",
  "date_of_birth": "1990-05-15"
}`}
                </CodeBlock>

                <h4 className="font-semibold text-gray-900 mt-4 mb-2">Parameters</h4>
                <ParameterTable>
                  <ParameterRow name="license_number" type="string" required description="Driver's license number" />
                  <ParameterRow name="date_of_birth" type="string" required description="Date of birth (YYYY-MM-DD)" />
                </ParameterTable>

                <h4 className="font-semibold text-gray-900 mt-4 mb-2">Success Response</h4>
                <CodeBlock language="json">
{`{
  "success": true,
  "data": {
    "licenseNumber": "FKJ1234567890",
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1990-05-15",
    "gender": "Male",
    "issueDate": "2018-03-15",
    "expiryDate": "2023-03-15",
    "status": "Valid",
    "verified": true
  }
}`}
                </CodeBlock>
              </EndpointCard>

              {/* Passport Verification */}
              <EndpointCard
                id="passport"
                method="POST"
                endpoint="/api/v1/business/passport-verification"
                title="Passport Verification"
                description="Verify a Nigerian International Passport with NIS"
                price=""
              >
                <h4 className="font-semibold text-gray-900 mt-4 mb-2">Request Body</h4>
                <CodeBlock language="json">
{`{
  "passport_number": "A50123456",
  "last_name": "Doe"
}`}
                </CodeBlock>

                <h4 className="font-semibold text-gray-900 mt-4 mb-2">Parameters</h4>
                <ParameterTable>
                  <ParameterRow name="passport_number" type="string" required description="9-character passport number" />
                  <ParameterRow name="last_name" type="string" required description="Last name as on passport" />
                </ParameterTable>

                <h4 className="font-semibold text-gray-900 mt-4 mb-2">Success Response</h4>
                <CodeBlock language="json">
{`{
  "success": true,
  "data": {
    "passportNumber": "A50123456",
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1990-05-15",
    "nationality": "Nigerian",
    "issueDate": "2020-01-10",
    "expiryDate": "2025-01-10",
    "verified": true
  }
}`}
                </CodeBlock>
              </EndpointCard>

              {/* Voter's Card Verification */}
              <EndpointCard
                id="voters-card"
                method="POST"
                endpoint="/api/v1/business/voters-card-verification"
                title="Voter's Card Verification"
                description="Verify a Nigerian Permanent Voter's Card (PVC) with INEC"
                price=""
              >
                <h4 className="font-semibold text-gray-900 mt-4 mb-2">Request Body</h4>
                <CodeBlock language="json">
{`{
  "vin": "90F5B123456789012",
  "last_name": "Doe"
}`}
                </CodeBlock>

                <h4 className="font-semibold text-gray-900 mt-4 mb-2">Parameters</h4>
                <ParameterTable>
                  <ParameterRow name="vin" type="string" required description="19-character Voter Identification Number" />
                  <ParameterRow name="last_name" type="string" required description="Last name as registered" />
                </ParameterTable>

                <h4 className="font-semibold text-gray-900 mt-4 mb-2">Success Response</h4>
                <CodeBlock language="json">
{`{
  "success": true,
  "data": {
    "vin": "90F5B123456789012",
    "firstName": "John",
    "lastName": "Doe",
    "state": "Lagos",
    "lga": "Ikeja",
    "pollingUnit": "Ikeja PU 001",
    "verified": true
  }
}`}
                </CodeBlock>
              </EndpointCard>

              {/* CAC Name Search */}
              <EndpointCard
                id="name-search"
                method="POST"
                endpoint="/api/v1/business/name-search"
                title="CAC Name Search"
                description="Search for business name availability in CAC registry"
                price=""
              >
                <h4 className="font-semibold text-gray-900 mt-4 mb-2">Request Body</h4>
                <CodeBlock language="json">
{`{
  "proposedName": "Tech Solutions Nigeria Limited",
  "lineOfBusiness": "Information Technology Services"
}`}
                </CodeBlock>

                <h4 className="font-semibold text-gray-900 mt-4 mb-2">Parameters</h4>
                <ParameterTable>
                  <ParameterRow name="proposedName" type="string" required description="Proposed business name (3-100 chars)" />
                  <ParameterRow name="lineOfBusiness" type="string" required description="Business activity description" />
                </ParameterTable>

                <h4 className="font-semibold text-gray-900 mt-4 mb-2">Success Response (Available)</h4>
                <CodeBlock language="json">
{`{
  "success": true,
  "canProceed": true,
  "message": "PROCEED_TO_FILING",
  "proposedName": "Tech Solutions Nigeria Limited",
  "data": {
    "availabilityStatus": "Available",
    "similarityScore": 15,
    "complianceScore": 95
  }
}`}
                </CodeBlock>
              </EndpointCard>

              {/* Company Registration */}
              <EndpointCard
                id="company-reg"
                method="POST"
                endpoint="/api/v1/company-registration"
                title="Company Registration"
                description="Submit company registration to CAC"
                price=""
              >
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-yellow-800">
                    ⚠️ <strong>Complex Endpoint:</strong> This requires many fields. 
                    Contact support for full integration guide.
                  </p>
                </div>

                <h4 className="font-semibold text-gray-900 mt-4 mb-2">Key Required Fields</h4>
                <CodeBlock language="json">
{`{
  "ref": "REF123456789",
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "business_category": "32",
  "classification_type": "LTD",
  "business_name": "Tech Solutions Nigeria Limited",
  "business_line": "IT Services",
  "registrationType": "company",
  "witnesses": [
    {
      "fullname": "Jane Smith",
      "address": "456 Ikeja, Lagos",
      "occupation": "Accountant",
      "phone_no": "08011112222",
      "email": "jane@example.com"
    }
  ]
  // ... more fields required
}`}
                </CodeBlock>
              </EndpointCard>
            </Section>

            {/* Error Handling Section */}
            <Section id="errors" title="Error Handling">
              <div className="space-y-4">
                <p className="text-gray-600">
                  All errors follow a standard format with appropriate HTTP status codes.
                </p>

                <h4 className="font-semibold text-gray-900 mt-4 mb-2">Error Response Format</h4>
                <CodeBlock language="json">
{`{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "bvn",
      "provided": "123"
    }
  },
  "requestId": "req_abc123xyz",
  "timestamp": "2026-01-17T14:30:00.000Z"
}`}
                </CodeBlock>

                <h4 className="font-semibold text-gray-900 mt-6 mb-3">Common Error Codes</h4>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Code</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Description</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-mono text-gray-900">UNAUTHORIZED</td>
                        <td className="px-4 py-3 text-sm"><span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold">401</span></td>
                        <td className="px-4 py-3 text-sm text-gray-600">Invalid or missing API key</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-mono text-gray-900">INSUFFICIENT_BALANCE</td>
                        <td className="px-4 py-3 text-sm"><span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-semibold">402</span></td>
                        <td className="px-4 py-3 text-sm text-gray-600">Not enough wallet balance</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-mono text-gray-900">VALIDATION_ERROR</td>
                        <td className="px-4 py-3 text-sm"><span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-semibold">400</span></td>
                        <td className="px-4 py-3 text-sm text-gray-600">Invalid request parameters</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-mono text-gray-900">RATE_LIMIT_EXCEEDED</td>
                        <td className="px-4 py-3 text-sm"><span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold">429</span></td>
                        <td className="px-4 py-3 text-sm text-gray-600">Too many requests (100/min limit)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Need Help?</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p><strong>Email:</strong> support@your-domain.com</p>
                    <p><strong>Dashboard:</strong> <Link to="/customer/dashboard" className="text-blue-600 hover:underline">Customer Portal</Link></p>
                    <p>View your API usage and transaction history in your dashboard</p>
                  </div>
                </div>
              </div>
            </Section>
          </main>
        </div>
      </div>
    </div>
  )
}

// Helper Components
const Section: React.FC<{ id: string; title: string; children: React.ReactNode }> = ({ id, title, children }) => (
  <section id={id} className="scroll-mt-24 bg-white rounded-lg p-6 border border-gray-200">
    <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
      {title}
    </h2>
    <div className="space-y-4">{children}</div>
  </section>
)

const SidebarLink: React.FC<{ href: string; icon: any; children: React.ReactNode; isActive?: boolean; onClick?: () => void }> = ({ href, icon: Icon, children, isActive = false, onClick }) => (
  <a
    href={href}
    onClick={onClick}
    className={`flex items-center px-3 py-2 text-sm font-medium rounded transition ${
      isActive 
        ? 'bg-blue-600 text-white' 
        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
    }`}
  >
    <Icon className="h-5 w-5 mr-2 flex-shrink-0" />
    <span className="truncate">{children}</span>
  </a>
)

const SubLink: React.FC<{ href: string; onClick?: () => void; children: React.ReactNode }> = ({ href, onClick, children }) => (
  <a
    href={href}
    onClick={onClick}
    className="block px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded transition"
  >
    {children}
  </a>
)

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="bg-white p-4 rounded-lg border border-gray-200">
    <div className="mb-3">{icon}</div>
    <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
)

const CodeBlock: React.FC<{ children: string; language?: string }> = ({ children, language }) => {
  const [copied, setCopied] = React.useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group">
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded-t-lg border-b border-gray-700">
        {language && (
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            {language}
          </span>
        )}
        <button
          onClick={copyToClipboard}
          className="ml-auto flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-md"
        >
          {copied ? (
            <>
              <CheckIcon className="h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <ClipboardDocumentIcon className="h-4 w-4" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-b-lg overflow-x-auto text-sm leading-relaxed">
        <code>{children}</code>
      </pre>
    </div>
  )
}


const EndpointCard: React.FC<{
  id: string
  method: string
  endpoint: string
  title: string
  description: string
  price: string
  children: React.ReactNode
}> = ({ id, method, endpoint, title, description, price, children }) => (
  <div id={id} className="bg-white border border-gray-200 rounded-lg p-6 mb-6 scroll-mt-24">
    <div className="mb-4">
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
    <div className="flex flex-wrap items-center gap-3 mb-6 p-3 bg-gray-50 rounded border border-gray-200">
      <span className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold uppercase">
        {method}
      </span>
      <code className="bg-white px-3 py-1 rounded text-sm font-mono text-gray-800 border border-gray-200 flex-1 min-w-0 overflow-x-auto">
        {endpoint}
      </code>
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </div>
)

const ParameterTable: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="overflow-x-auto rounded-lg border border-gray-200">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Field</th>
          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Required</th>
          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Description</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>
    </table>
  </div>
)

const ParameterRow: React.FC<{ name: string; type: string; required: boolean; description: string }> = ({
  name,
  type,
  required,
  description,
}) => (
  <tr className="hover:bg-gray-50">
    <td className="px-4 py-2 text-sm font-mono text-gray-900">{name}</td>
    <td className="px-4 py-2 text-sm">
      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">{type}</span>
    </td>
    <td className="px-4 py-2 text-sm">
      {required ? (
        <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold">Required</span>
      ) : (
        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">Optional</span>
      )}
    </td>
    <td className="px-4 py-2 text-sm text-gray-600">{description}</td>
  </tr>
)

export default Docs
