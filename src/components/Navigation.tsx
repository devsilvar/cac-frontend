import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Sparkles,
  Code,
  Users,
  Zap,
  Home,
  LogOut,
  KeyRound,
  BarChart2,
  User2,
} from 'lucide-react';
import { useCustomerAuth } from '../context/CustomerAuthContext';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, customer, logout } = useCustomerAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/customer/login');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { to: '/', label: 'Home', icon: Home, type: 'route' as const },
    { to: '/docs', label: 'Docs', icon: Code, type: 'route' as const },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white border-b ${scrolled ? 'shadow-sm' : 'border-gray-200'}`}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-20'>
          {/* Premium Logo */}
          <motion.div
            className='flex items-center gap-3'
            whileHover={{ scale: 1.05 }}
          >
            <Link to='/' className='flex items-center gap-3'>
              <img src="/logo-wallx.png" alt="WallX" className="w-10 h-10 object-contain" />
              <span className='text-2xl font-bold text-[#473893]'>
                WallX
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className='hidden lg:flex items-center space-x-2'>
            {navItems.map((item, index) => (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'text-gray-900 bg-gray-100' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`
                  }
                >
                  <item.icon className='w-4 h-4' />
                  {item.label}
                </NavLink>
              </motion.div>
            ))}

            {/* Customer section */}
            {!isAuthenticated ? (
              <div className='flex items-center gap-2'>
                <Link
                  to='/customer/login'
                  className='px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900'
                >
                  Sign in
                </Link>
                <Link
                  to='/customer/signup'
                  className='px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800'
                >
                  Sign up
                </Link>
              </div>
            ) : (
              // When customer is logged in and browsing public pages, keep navbar minimal.
              // Detailed navigation lives inside the customer dashboard.
              <div className='flex items-center gap-2'>
                <div className='hidden xl:block px-3 py-2 text-sm text-gray-600'>
                  {customer?.email || 'Customer'}
                </div>
                <NavLink
                  to='/customer/dashboard'
                  className={({ isActive }) =>
                    `px-3 py-2 text-sm rounded-lg ${
                      isActive
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`
                  }
                >
                  <User2 className='w-4 h-4 inline mr-1' />
                  Dashboard
                </NavLink>
                <button
                  onClick={handleLogout}
                  className='px-3 py-2 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1'
                >
                  <LogOut className='w-4 h-4' />
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className='lg:hidden'>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className='p-2 text-white/80  hover:text-white transition-colors rounded-xl hover:bg-white/10'
            >
              {isMenuOpen ? (
                <X className='h-6 w-6 text-black' />
              ) : (
                <Menu className='h-6 w-6 text-black' />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className='lg:hidden py-6 border-t border-white/10'
            >
              <div className='flex flex-col space-y-4'>
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? 'text-gray-900 bg-gray-100' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`
                      }
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon className='w-5 h-5' />
                      {item.label}
                    </NavLink>
                  </motion.div>
                ))}

                <div className='h-px bg-white/10 my-4' />

                {!isAuthenticated ? (
                  <div className='flex flex-col gap-2 px-4'>
                    <Link
                      to='/customer/login'
                      className='px-4 py-3 text-center rounded-lg bg-gray-900 text-white'
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign in
                    </Link>
                    <Link
                      to='/customer/signup'
                      className='px-4 py-3 text-center rounded-lg bg-gray-100 text-gray-900'
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign up
                    </Link>
                  </div>
                ) : (
                  // Keep mobile menu minimal too; dashboard contains full customer navigation.
                  <div className='flex flex-col gap-2 px-4'>
                    <Link
                      to='/customer/dashboard'
                      className='px-4 py-3 rounded-lg bg-gray-100 text-gray-900'
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleLogout();
                      }}
                      className='px-4 py-3 rounded-lg bg-red-50 text-red-700'
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navigation;
