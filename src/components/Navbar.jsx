import { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiLogOut, FiMenu, FiX } from 'react-icons/fi';

function Navbar() {
  const { logout } = useContext(AuthContext);
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (['/login', '/register'].includes(location.pathname)) return null;

  const isActive = (path) => location.pathname === path;
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navLinks = ['/dashboard', '/customers', '/items', '/orders'];

  return (
    <nav className="bg-purple-200 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/dashboard">
              <h1 className="text-2xl font-bold text-purple-700 hover:text-purple-900 transition-colors duration-300">
                BusinessHub
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((path) => (
              <Link
                key={path}
                to={path}
                className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                  isActive(path)
                    ? 'bg-purple-700 text-white shadow-lg'
                    : 'text-purple-700 hover:bg-purple-100 hover:text-purple-800'
                }`}
              >
                {path.replace('/', '').charAt(0).toUpperCase() + path.replace('/', '').slice(1) || 'Dashboard'}
              </Link>
            ))}

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-purple-700 text-white px-4 py-2 rounded-full font-medium text-sm hover:bg-purple-800 transition-all duration-300 shadow-md"
            >
              <FiLogOut size={16} />
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-full text-purple-700 hover:bg-purple-100 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
            >
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 flex flex-col space-y-3 pb-4">
            {navLinks.map((path) => (
              <Link
                key={path}
                to={path}
                onClick={toggleMobileMenu}
                className={`px-4 py-3 rounded-full font-medium text-sm transition-all duration-300 ${
                  isActive(path)
                    ? 'bg-purple-700 text-white shadow-md'
                    : 'text-purple-700 hover:bg-purple-100 hover:text-purple-800'
                }`}
              >
                {path.replace('/', '').charAt(0).toUpperCase() + path.replace('/', '').slice(1) || 'Dashboard'}
              </Link>
            ))}

            <button
              onClick={() => {
                logout();
                toggleMobileMenu();
              }}
              className="flex items-center gap-2 bg-purple-700 text-white px-4 py-3 rounded-full font-medium text-sm hover:bg-purple-800 transition-all duration-300 shadow-md"
            >
              <FiLogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
