/**
 * API Endpoint Pricing Configuration
 * Pay-per-use pricing model - customers are charged per API call
 * All prices in Nigerian Naira (₦)
 */

export interface EndpointPrice {
  endpoint: string;
  name: string;
  description: string;
  pricePerCall: number;
  category: 'identity' | 'business' | 'utility';
  estimatedResponseTime?: string;
}

export const API_PRICING: EndpointPrice[] = [
  // Identity Verification APIs
  {
    endpoint: '/business/identity/bvn-basic/:bvnNumber',
    name: 'BVN Verification (Basic)',
    description: 'Verify Bank Verification Number with basic details',
    pricePerCall: 200,
    category: 'identity',
    estimatedResponseTime: '2-3 seconds'
  },
  {
    endpoint: '/business/identity/passport-face-verification',
    name: 'Passport + Face Verification',
    description: 'Verify Nigerian passport and match face photo',
    pricePerCall: 500,
    category: 'identity',
    estimatedResponseTime: '3-5 seconds'
  },
  {
    endpoint: '/business/identity/drivers-license-verification',
    name: 'Driver\'s License + Face Verification',
    description: 'Verify driver\'s license and match face photo',
    pricePerCall: 500,
    category: 'identity',
    estimatedResponseTime: '3-5 seconds'
  },
  {
    endpoint: '/business/identity/nin-verification',
    name: 'NIN Verification',
    description: 'Verify National Identification Number',
    pricePerCall: 300,
    category: 'identity',
    estimatedResponseTime: '2-4 seconds'
  },
  
  // Business Registration APIs
  {
    endpoint: '/business/name-search',
    name: 'Business Name Search',
    description: 'Check business name availability in CAC database',
    pricePerCall: 150,
    category: 'business',
    estimatedResponseTime: '2-3 seconds'
  },
  {
    endpoint: '/business/name-registration',
    name: 'Business Name Registration',
    description: 'Register a business name with CAC',
    pricePerCall: 40,
    category: 'business',
    estimatedResponseTime: '1-2 seconds'
  },
  {
    endpoint: '/business/company-registration',
    name: 'Company Registration',
    description: 'Submit company registration with witnesses',
    pricePerCall: 100,
    category: 'business',
    estimatedResponseTime: '2-3 seconds'
  },
  {
    endpoint: '/business/status/:referenceId',
    name: 'Registration Status Check',
    description: 'Check status of business/company registration',
    pricePerCall: 20,
    category: 'business',
    estimatedResponseTime: '<1 second'
  },
  
  // Utility APIs
  {
    endpoint: '/business/cac-store-products',
    name: 'CAC Store Products',
    description: 'Get available CAC registration products',
    pricePerCall: 10,
    category: 'utility',
    estimatedResponseTime: '<1 second'
  },
  {
    endpoint: '/business/ping',
    name: 'API Health Check',
    description: 'Check API availability and your authentication',
    pricePerCall: 0,
    category: 'utility',
    estimatedResponseTime: '<1 second'
  }
];

// Get pricing by category
export const getPricingByCategory = () => {
  const categories = {
    identity: API_PRICING.filter(p => p.category === 'identity'),
    business: API_PRICING.filter(p => p.category === 'business'),
    utility: API_PRICING.filter(p => p.category === 'utility')
  };
  return categories;
};

// Get price for specific endpoint
export const getEndpointPrice = (endpoint: string): number => {
  const pricing = API_PRICING.find(p => {
    // Normalize endpoint for comparison (remove path params)
    const normalizedEndpoint = endpoint.replace(/\/:[^\/]+/g, '/:id');
    const normalizedPricingEndpoint = p.endpoint.replace(/\/:[^\/]+/g, '/:id');
    return normalizedPricingEndpoint === normalizedEndpoint;
  });
  return pricing?.pricePerCall || 0;
};

// Calculate estimated cost for usage
export const calculateEstimatedCost = (usageByEndpoint: Record<string, number>): number => {
  let total = 0;
  for (const [endpoint, count] of Object.entries(usageByEndpoint)) {
    const price = getEndpointPrice(endpoint);
    total += price * count;
  }
  return total;
};

// Prepaid wallet tiers with bonus credits
export interface WalletTier {
  amount: number;
  bonus: number;
  totalCredits: number;
  popular?: boolean;
}

export const WALLET_TIERS: WalletTier[] = [
  {
    amount: 5000,
    bonus: 0,
    totalCredits: 5000
  },
  {
    amount: 10000,
    bonus: 500,
    totalCredits: 10500
  },
  {
    amount: 25000,
    bonus: 2000,
    totalCredits: 27000,
    popular: true
  },
  {
    amount: 50000,
    bonus: 5000,
    totalCredits: 55000
  },
  {
    amount: 100000,
    bonus: 15000,
    totalCredits: 115000
  },
  {
    amount: 250000,
    bonus: 50000,
    totalCredits: 300000
  }
];

export const formatNaira = (amount: number): string => {
  return `₦${amount.toLocaleString('en-NG')}`;
};
