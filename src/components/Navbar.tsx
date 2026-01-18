import { Link } from 'react-router-dom';

interface NavbarProps {
  transparent?: boolean;
}

const Navbar = ({ transparent = false }: NavbarProps) => {
  return (
    <nav className={`fixed top-0 w-full z-50 transition-all ${
      transparent ? 'bg-transparent' : 'bg-white shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - matches footer */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <span className={`text-xl font-semibold ${
              transparent ? 'text-white' : 'text-gray-900'
            }`}>
              BusinessAPI
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {transparent && (
              <a
                href="#features"
                className="text-white hover:text-blue-200 transition-colors"
              >
                Features
              </a>
            )}
            <Link
              to="/pricing"
              className={`${
                transparent ? 'text-white hover:text-blue-200' : 'text-gray-600 hover:text-gray-900'
              } transition-colors`}
            >
              Pricing
            </Link>
            <Link
              to="/docs"
              className={`${
                transparent ? 'text-white hover:text-blue-200' : 'text-gray-600 hover:text-gray-900'
              } transition-colors`}
            >
              Documentation
            </Link>
            <Link
              to="/customer/login"
              className={`${
                transparent ? 'text-white hover:text-blue-200' : 'text-gray-600 hover:text-gray-900'
              } transition-colors`}
            >
              Sign In
            </Link>
            <Link
              to="/customer/signup"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className={`${
              transparent ? 'text-white' : 'text-gray-900'
            }`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
