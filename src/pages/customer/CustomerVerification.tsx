import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CustomerDashboardLayout from '../../layouts/CustomerDashboardLayout';
import { useCustomerApi } from '../../hooks/useCustomerApi';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useVerification } from '../../context/VerificationContext';
import {
  Building2,
  FileText,
  Users,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Upload,
  Loader2,
  Clock,
  Shield,
} from 'lucide-react';

interface BusinessInfo {
  rcNumber: string;
  companyName: string;
  businessAddress: string;
  businessEmail: string;
  businessPhone: string;
  directorName: string;
  yearOfIncorporation: string;
  natureOfBusiness: string;
}

interface ComplianceQuestions {
  requiresLicense: boolean;
  amlCompliance: boolean;
  amlSanctions: boolean;
  dataProtectionPolicies: boolean;
  dataSecurityMeasures: boolean;
  internationalDataTransfer: boolean;
  alternateDatabase: boolean;
  regulatedByAuthority: boolean;
  fraudPreventionPolicies: boolean;
  ndaWithEmployees: boolean;
  dataBreachSanctions: boolean;
  countriesOfOperation: string;
  otherPurposeUsage: boolean;
  regulatorySanctions: boolean;
}

interface ContactPerson {
  fullName: string;
  email: string;
  phone: string;
  jobTitle: string;
  website?: string;
}

const STEPS = [
  { id: 1, title: 'Business Information', icon: Building2 },
  { id: 2, title: 'Compliance Questions', icon: FileText },
  { id: 3, title: 'Contact Person', icon: Users },
  { id: 4, title: 'Review & Submit', icon: CheckCircle },
];

export default function CustomerVerification() {
  const navigate = useNavigate();
  const api = useCustomerApi();
  const { customer, loadMe } = useCustomerAuth();
  const {
    status: verificationStatus,
    data: verificationData,
    refresh: refreshVerification,
    loading: verificationLoading,
  } = useVerification();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    rcNumber: '',
    companyName: '',
    businessAddress: '',
    businessEmail: '',
    businessPhone: '',
    directorName: '',
    yearOfIncorporation: '',
    natureOfBusiness: '',
  });

  const [compliance, setCompliance] = useState<ComplianceQuestions>({
    requiresLicense: false,
    amlCompliance: false,
    amlSanctions: false,
    dataProtectionPolicies: false,
    dataSecurityMeasures: false,
    internationalDataTransfer: false,
    alternateDatabase: false,
    regulatedByAuthority: false,
    fraudPreventionPolicies: false,
    ndaWithEmployees: false,
    dataBreachSanctions: false,
    countriesOfOperation: '',
    otherPurposeUsage: false,
    regulatorySanctions: false,
  });

  const [contactPerson, setContactPerson] = useState<ContactPerson>({
    fullName: '',
    email: '',
    phone: '',
    jobTitle: '',
    website: '',
  });

  // Load verification status from context on mount
  useEffect(() => {
    refreshVerification();
    loadMe();
  }, []);

  const handleNextStep = async () => {
    try {
      if (currentStep === 1) {
        await api.post(
          '/api/v1/customer/verification/submit-business-info',
          businessInfo,
        );
        setCurrentStep(2);
      } else if (currentStep === 2) {
        await api.post(
          '/api/v1/customer/verification/submit-compliance',
          compliance,
        );
        setCurrentStep(3);
      } else if (currentStep === 3) {
        await api.post(
          '/api/v1/customer/verification/submit-contact-person',
          contactPerson,
        );
        setCurrentStep(4);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to save data');
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const result = await api.post<any>(
        '/api/v1/customer/verification/complete',
      );
      // Refresh verification status in context after successful submission
      await refreshVerification();
      alert(
        result.data?.message ||
          result.message ||
          'Verification submitted successfully!',
      );
      navigate('/customer/dashboard');
    } catch (err: any) {
      alert(err.message || 'Failed to submit verification');
    } finally {
      setSubmitting(false);
    }
  };

  const isStep1Valid = () => {
    return (
      businessInfo.rcNumber &&
      businessInfo.companyName &&
      businessInfo.businessAddress &&
      businessInfo.businessEmail &&
      businessInfo.businessPhone &&
      businessInfo.directorName &&
      businessInfo.yearOfIncorporation &&
      businessInfo.natureOfBusiness
    );
  };

  const isStep2Valid = () => {
    return compliance.countriesOfOperation.trim().length > 0;
  };

  const isStep3Valid = () => {
    return (
      contactPerson.fullName &&
      contactPerson.email &&
      contactPerson.phone &&
      contactPerson.jobTitle
    );
  };

  // If verification is already in progress or complete, show status page
  if (verificationStatus !== 'inactive' && verificationStatus !== 'rejected') {
    return (
      <CustomerDashboardLayout>
        <div className='max-w-2xl mx-auto'>
          <div className='bg-white rounded-xl border border-gray-200 p-8 shadow-sm'>
            <div className='text-center py-8'>
              {verificationStatus === 'verified' && (
                <>
                  <CheckCircle className='w-16 h-16 text-green-600 mx-auto mb-4' />
                  <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                    Already Verified
                  </h2>
                  <p className='text-gray-600'>
                    Your business is already verified and active.
                  </p>
                </>
              )}
              {verificationStatus === 'pending' && (
                <>
                  <Clock className='w-16 h-16 text-yellow-600 mx-auto mb-4 animate-pulse' />
                  <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                    Verification Submitted
                  </h2>
                  <p className='text-gray-600'>
                    Your verification has been submitted and is being processed.
                  </p>
                </>
              )}
              {verificationStatus === 'admin_review' && (
                <>
                  <Clock className='w-16 h-16 text-purple-600 mx-auto mb-4 animate-pulse' />
                  <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                    Under Review
                  </h2>
                  <p className='text-gray-600 mb-2'>
                    Your verification is being reviewed by our team.
                  </p>
                  <div className='flex items-center justify-center text-sm text-purple-700 mt-4'>
                    <CheckCircle className='w-4 h-4 mr-2' />
                    CAC Verified • Average review time: 24-48 hours
                  </div>
                </>
              )}
              {verificationStatus === 'cac_pending' && (
                <>
                  <Loader2 className='w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin' />
                  <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                    CAC Verification in Progress
                  </h2>
                  <p className='text-gray-600'>
                    We're verifying your CAC registration. This usually takes a
                    few minutes.
                  </p>
                </>
              )}
              <button
                onClick={() => navigate('/customer/dashboard')}
                className='mt-6 inline-flex items-center px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors'
              >
                Go to Dashboard
                <ArrowRight className='w-5 h-5 ml-2' />
              </button>
            </div>
          </div>
        </div>
      </CustomerDashboardLayout>
    );
  }

  return (
    <CustomerDashboardLayout>
      <div className='max-w-4xl mx-auto space-y-6'>
        {/* Header */}
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>
            Business Verification
          </h1>
          <p className='text-gray-600 mt-1'>
            Complete your business verification to access all features
          </p>
        </div>

        {/* Progress Steps */}
        <div className='bg-white rounded-xl border border-gray-200 p-6'>
          <div className='flex items-center justify-between'>
            {STEPS.map((step, idx) => (
              <React.Fragment key={step.id}>
                <div className='flex flex-col items-center flex-1'>
                  <motion.div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center mb-2 ${
                      currentStep >= step.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                    animate={{ scale: currentStep === step.id ? 1.05 : 1 }}
                  >
                    <step.icon className='w-6 h-6' />
                  </motion.div>
                  <span
                    className={`text-xs font-medium text-center ${
                      currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 w-full mx-2 ${
                      currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className='bg-white rounded-xl border border-gray-200 p-8 shadow-sm'>
              {/* Step 1: Business Information */}
              {currentStep === 1 && (
                <div className='space-y-6'>
                  <div>
                    <h3 className='text-2xl font-bold text-gray-900 mb-6'>
                      Business Information
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          CAC Registration Number (RC Number) *
                        </label>
                        <input
                          type='text'
                          value={businessInfo.rcNumber}
                          onChange={(e) =>
                            setBusinessInfo({
                              ...businessInfo,
                              rcNumber: e.target.value,
                            })
                          }
                          placeholder='RC123456 or BN200002'
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Company Name *
                        </label>
                        <input
                          type='text'
                          value={businessInfo.companyName}
                          onChange={(e) =>
                            setBusinessInfo({
                              ...businessInfo,
                              companyName: e.target.value,
                            })
                          }
                          placeholder='Company Limited'
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        />
                      </div>
                      <div className='md:col-span-2'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Business Address *
                        </label>
                        <input
                          type='text'
                          value={businessInfo.businessAddress}
                          onChange={(e) =>
                            setBusinessInfo({
                              ...businessInfo,
                              businessAddress: e.target.value,
                            })
                          }
                          placeholder='123 Business Street, Lagos, Nigeria'
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Business Email *
                        </label>
                        <input
                          type='email'
                          value={businessInfo.businessEmail}
                          onChange={(e) =>
                            setBusinessInfo({
                              ...businessInfo,
                              businessEmail: e.target.value,
                            })
                          }
                          placeholder='info@company.com'
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Business Phone *
                        </label>
                        <input
                          type='tel'
                          value={businessInfo.businessPhone}
                          onChange={(e) =>
                            setBusinessInfo({
                              ...businessInfo,
                              businessPhone: e.target.value,
                            })
                          }
                          placeholder='+234 800 000 0000'
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Director/Owner Name *
                        </label>
                        <input
                          type='text'
                          value={businessInfo.directorName}
                          onChange={(e) =>
                            setBusinessInfo({
                              ...businessInfo,
                              directorName: e.target.value,
                            })
                          }
                          placeholder='John Doe'
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Year of Incorporation *
                        </label>
                        <input
                          type='text'
                          value={businessInfo.yearOfIncorporation}
                          onChange={(e) =>
                            setBusinessInfo({
                              ...businessInfo,
                              yearOfIncorporation: e.target.value,
                            })
                          }
                          placeholder='2020'
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        />
                      </div>
                      <div className='md:col-span-2'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Nature of Business *
                        </label>
                        <textarea
                          value={businessInfo.natureOfBusiness}
                          onChange={(e) =>
                            setBusinessInfo({
                              ...businessInfo,
                              natureOfBusiness: e.target.value,
                            })
                          }
                          placeholder='Describe your business activities...'
                          rows={3}
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        />
                      </div>
                    </div>
                  </div>
                  <div className='flex justify-end'>
                    <button
                      onClick={handleNextStep}
                      disabled={!isStep1Valid() || api.loading}
                      className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                        !isStep1Valid() || api.loading
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {api.loading ? (
                        <>
                          <Loader2 className='w-5 h-5 animate-spin mr-2' />
                          Saving...
                        </>
                      ) : (
                        <>
                          Next Step
                          <ArrowRight className='w-5 h-5 ml-2' />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Compliance Questions */}
              {currentStep === 2 && (
                <div className='space-y-6'>
                  <div>
                    <h3 className='text-2xl font-bold text-gray-900 mb-6'>
                      Compliance Questions
                    </h3>
                    <div className='space-y-4'>
                      {[
                        {
                          key: 'requiresLicense',
                          label:
                            'Do you require a license to conduct your business?',
                        },
                        {
                          key: 'amlCompliance',
                          label:
                            'Does your organization comply with anti-money laundering and anti-corruption laws?',
                        },
                        {
                          key: 'amlSanctions',
                          label:
                            'Are there sanctions for staff who breach AML/anti-corruption laws?',
                        },
                        {
                          key: 'dataProtectionPolicies',
                          label:
                            'Has your organization established data protection policies?',
                        },
                        {
                          key: 'dataSecurityMeasures',
                          label:
                            'Do you adopt security measures to reduce data breach risks?',
                        },
                        {
                          key: 'internationalDataTransfer',
                          label:
                            'Will you transfer personal data to other countries?',
                        },
                        {
                          key: 'alternateDatabase',
                          label:
                            'Do you intend to create an alternate database of verification reports?',
                        },
                        {
                          key: 'regulatedByAuthority',
                          label:
                            'Are you/your services regulated by any authority?',
                        },
                        {
                          key: 'fraudPreventionPolicies',
                          label:
                            'Do you have fraud prevention policies and procedures?',
                        },
                        {
                          key: 'ndaWithEmployees',
                          label:
                            'Do you have non-disclosure agreements with employees and contractors?',
                        },
                        {
                          key: 'dataBreachSanctions',
                          label:
                            'Are there sanctions for staff who breach data protection obligations?',
                        },
                        {
                          key: 'otherPurposeUsage',
                          label:
                            'Will you use data for purposes other than KYC verification?',
                        },
                        {
                          key: 'regulatorySanctions',
                          label:
                            'Have you been sanctioned for data breach in the last 2 years?',
                        },
                      ].map((q) => (
                        <div
                          key={q.key}
                          className='p-4 bg-gray-50 rounded-lg border border-gray-200'
                        >
                          <label className='block text-sm font-medium text-gray-700 mb-3'>
                            {q.label}
                          </label>
                          <div className='flex items-center space-x-6'>
                            <label className='flex items-center cursor-pointer'>
                              <input
                                type='radio'
                                name={q.key}
                                checked={
                                  compliance[
                                    q.key as keyof ComplianceQuestions
                                  ] === true
                                }
                                onChange={() =>
                                  setCompliance({
                                    ...compliance,
                                    [q.key]: true,
                                  })
                                }
                                className='w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500'
                              />
                              <span className='ml-2 text-sm font-medium text-gray-900'>
                                Yes
                              </span>
                            </label>
                            <label className='flex items-center cursor-pointer'>
                              <input
                                type='radio'
                                name={q.key}
                                checked={
                                  compliance[
                                    q.key as keyof ComplianceQuestions
                                  ] === false
                                }
                                onChange={() =>
                                  setCompliance({
                                    ...compliance,
                                    [q.key]: false,
                                  })
                                }
                                className='w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500'
                              />
                              <span className='ml-2 text-sm font-medium text-gray-900'>
                                No
                              </span>
                            </label>
                          </div>
                        </div>
                      ))}
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Countries where you operate * (comma-separated)
                        </label>
                        <input
                          type='text'
                          value={compliance.countriesOfOperation}
                          onChange={(e) =>
                            setCompliance({
                              ...compliance,
                              countriesOfOperation: e.target.value,
                            })
                          }
                          placeholder='Nigeria, Ghana, Kenya'
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        />
                      </div>
                    </div>
                  </div>
                  <div className='flex justify-between'>
                    <button
                      onClick={() => setCurrentStep(1)}
                      className='inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors'
                    >
                      <ArrowLeft className='w-5 h-5 mr-2' />
                      Back
                    </button>
                    <button
                      onClick={handleNextStep}
                      disabled={!isStep2Valid() || api.loading}
                      className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                        !isStep2Valid() || api.loading
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {api.loading ? (
                        <>
                          <Loader2 className='w-5 h-5 animate-spin mr-2' />
                          Saving...
                        </>
                      ) : (
                        <>
                          Next Step
                          <ArrowRight className='w-5 h-5 ml-2' />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Contact Person */}
              {currentStep === 3 && (
                <div className='space-y-6'>
                  <div>
                    <h3 className='text-2xl font-bold text-gray-900 mb-6'>
                      Contact Person
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Full Name *
                        </label>
                        <input
                          type='text'
                          value={contactPerson.fullName}
                          onChange={(e) =>
                            setContactPerson({
                              ...contactPerson,
                              fullName: e.target.value,
                            })
                          }
                          placeholder='Jane Doe'
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Email Address *
                        </label>
                        <input
                          type='email'
                          value={contactPerson.email}
                          onChange={(e) =>
                            setContactPerson({
                              ...contactPerson,
                              email: e.target.value,
                            })
                          }
                          placeholder='jane@company.com'
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Phone Number *
                        </label>
                        <input
                          type='tel'
                          value={contactPerson.phone}
                          onChange={(e) =>
                            setContactPerson({
                              ...contactPerson,
                              phone: e.target.value,
                            })
                          }
                          placeholder='+234 800 111 2222'
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Job Title/Designation *
                        </label>
                        <input
                          type='text'
                          value={contactPerson.jobTitle}
                          onChange={(e) =>
                            setContactPerson({
                              ...contactPerson,
                              jobTitle: e.target.value,
                            })
                          }
                          placeholder='CEO'
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        />
                      </div>
                      <div className='md:col-span-2'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Website Address (Optional)
                        </label>
                        <input
                          type='url'
                          value={contactPerson.website}
                          onChange={(e) =>
                            setContactPerson({
                              ...contactPerson,
                              website: e.target.value,
                            })
                          }
                          placeholder='https://company.com'
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        />
                      </div>
                    </div>
                  </div>
                  <div className='flex justify-between'>
                    <button
                      onClick={() => setCurrentStep(2)}
                      className='inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors'
                    >
                      <ArrowLeft className='w-5 h-5 mr-2' />
                      Back
                    </button>
                    <button
                      onClick={handleNextStep}
                      disabled={!isStep3Valid() || api.loading}
                      className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                        !isStep3Valid() || api.loading
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {api.loading ? (
                        <>
                          <Loader2 className='w-5 h-5 animate-spin mr-2' />
                          Saving...
                        </>
                      ) : (
                        <>
                          Review
                          <ArrowRight className='w-5 h-5 ml-2' />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Review & Submit */}
              {currentStep === 4 && (
                <div className='space-y-6'>
                  <div>
                    <h3 className='text-2xl font-bold text-gray-900 mb-6'>
                      Review & Submit
                    </h3>

                    <div className='space-y-6'>
                      {/* Business Info Summary */}
                      <div className='bg-gray-50 rounded-lg p-6'>
                        <h4 className='font-semibold text-gray-900 mb-4 flex items-center'>
                          <Building2 className='w-5 h-5 mr-2' />
                          Business Information
                        </h4>
                        <dl className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                          <div>
                            <dt className='text-sm text-gray-600'>RC Number</dt>
                            <dd className='font-medium'>
                              {businessInfo.rcNumber}
                            </dd>
                          </div>
                          <div>
                            <dt className='text-sm text-gray-600'>
                              Company Name
                            </dt>
                            <dd className='font-medium'>
                              {businessInfo.companyName}
                            </dd>
                          </div>
                          <div className='md:col-span-2'>
                            <dt className='text-sm text-gray-600'>
                              Director/Owner
                            </dt>
                            <dd className='font-medium'>
                              {businessInfo.directorName}
                            </dd>
                          </div>
                        </dl>
                      </div>

                      {/* Contact Person Summary */}
                      <div className='bg-gray-50 rounded-lg p-6'>
                        <h4 className='font-semibold text-gray-900 mb-4 flex items-center'>
                          <Users className='w-5 h-5 mr-2' />
                          Contact Person
                        </h4>
                        <dl className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                          <div>
                            <dt className='text-sm text-gray-600'>Name</dt>
                            <dd className='font-medium'>
                              {contactPerson.fullName}
                            </dd>
                          </div>
                          <div>
                            <dt className='text-sm text-gray-600'>Email</dt>
                            <dd className='font-medium'>
                              {contactPerson.email}
                            </dd>
                          </div>
                        </dl>
                      </div>

                      {/* Info Box */}
                      <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                        <div className='flex items-start'>
                          <AlertCircle className='w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0' />
                          <div className='text-sm text-blue-800'>
                            <p className='font-medium mb-1'>
                              What happens next?
                            </p>
                            <p>
                              We'll verify your CAC registration with the
                              Corporate Affairs Commission. Once verified, our
                              team will review your information and approve your
                              account within 24-48 hours.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='flex justify-between'>
                    <button
                      onClick={() => setCurrentStep(3)}
                      className='inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors'
                    >
                      <ArrowLeft className='w-5 h-5 mr-2' />
                      Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                        submitting
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className='w-5 h-5 animate-spin mr-2' />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className='w-5 h-5 mr-2' />
                          Submit for Verification
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </CustomerDashboardLayout>
  );
}
