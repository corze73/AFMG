import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, LogIn, LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './LoginModal';
import ProfileModal from './ProfileModal';

const Header: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="bg-white shadow-lg border-b-4 border-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            {/* Logo Section */}
            <div className="flex items-center space-x-3">
              <img 
                src="/Academy Badge.png" 
                alt="Aspire Football Academy Logo" 
                className="w-12 h-12 rounded-full border-2 border-yellow-400"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ASPIRE</h1>
                <p className="text-sm text-gray-600">Football Management Group</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'bg-red-600 text-white' 
                    : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                }`}
              >
                Home
              </Link>
              <Link
                to="/about"  
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/about')
                    ? 'bg-red-600 text-white'
                    : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                }`}
              >
                About
              </Link>
              <a
                href="/#players"
                className="px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-700 hover:text-red-600 hover:bg-red-50"
                onClick={(e) => {
                  if (location.pathname === '/') {
                    e.preventDefault();
                    document.getElementById('players')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Players
              </a>
              <a
                href="/#contact-form"
                className="px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-700 hover:text-red-600 hover:bg-red-50"
                onClick={(e) => {
                  if (location.pathname === '/') {
                    e.preventDefault();
                    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Contact Us
              </a>
              {user && (
                <Link
                  to="/players"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/players')
                      ? 'bg-red-600 text-white'
                      : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                  }`}
                >
                  Manage Players
                </Link>
              )}
            </nav>

            {/* Auth Section */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors" onClick={() => setShowProfileModal(true)}>
                    {user.profile_image_url ? (
                      <img
                        src={user.profile_image_url}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 hover:border-red-300 transition-colors"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-200 hover:border-red-300 transition-colors">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                    )}
                    <span className="text-sm text-gray-700">{user.name}</span>
                    <Settings className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" />
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </button>
              )
              }
            </div>
          </div>
        </div>
      </header>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
      <ProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
      />
    </>
  );
};

export default Header;