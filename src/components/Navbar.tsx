import { useState } from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  transparent?: boolean;
}

const Navbar = ({ transparent = false }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinkClass = `transition-colors ${
    transparent
      ? 'text-white hover:text-blue-200'
      : 'text-gray-600 hover:text-gray-900'
  }`;

  // For transparent navbars, use a dark background for mobile menu to ensure visibility
  const mobileBgClass = transparent
    ? 'bg-gray-900/95 backdrop-blur-sm'
    : 'bg-white';

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all ${
        transparent ? 'bg-transparent' : 'bg-white shadow-sm'
      }`}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo - matches footer */}
          <Link to='/' className='flex items-center space-x-2'>
            <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center'>
              <svg
                className='w-5 h-5 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4'
                />
              </svg>
            </div>
            <span
              className={`text-xl font-semibold ${
                transparent ? 'text-white' : 'text-gray-900'
              }`}
            >
              BusinessAPI
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className='hidden md:flex items-center space-x-8'>
            {transparent && (
              <a href='#features' className={`${navLinkClass} cursor-pointer`}>
                Features
              </a>
            )}
            <Link to='/pricing' className={navLinkClass}>
              Pricing
            </Link>
            <Link to='/docs' className={navLinkClass}>
              Documentation
            </Link>
            <Link to='/customer/login' className={navLinkClass}>
              Sign In
            </Link>
            <Link
              to='/customer/signup'
              className='px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors'
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className='md:hidden'>
            <button
              type='button'
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`${transparent ? 'text-white' : 'text-black'} p-2`}
              aria-label='Toggle menu'
            >
              {mobileMenuOpen ? (
                <svg
                  className='w-6 h-6'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              ) : (
                <svg
                  className='w-6 h-6'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 6h16M4 12h16M4 18h16'
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className={`md:hidden pb-4 rounded-lg mt-2 ${mobileBgClass}`}>
            <div
              className={`flex flex-col space-y-4 pt-2 px-2 ${
                transparent ? 'text-white' : 'text-gray-900'
              }`}
            >
              {transparent && (
                <a
                  href='#features'
                  className={`${navLinkClass} cursor-pointer py-2 px-3 rounded-lg hover:bg-gray-800`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </a>
              )}
              <Link
                to='/pricing'
                className={`${navLinkClass} py-2 px-3 rounded-lg hover:bg-gray-100`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                to='/docs'
                className={`${navLinkClass} py-2 px-3 rounded-lg hover:bg-gray-100`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Documentation
              </Link>
              <Link
                to='/customer/login'
                className={`${navLinkClass} py-2 px-3 rounded-lg hover:bg-gray-100`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to='/customer/signup'
                className='px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-center w-full'
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
