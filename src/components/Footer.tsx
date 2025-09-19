import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Aspire Football Management Group</h3>
            <p className="text-gray-300 mb-4">
              Nurturing football talent and creating pathways to professional success.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-red-400" />
                <a 
                  href="mailto:info@aspirefootballgroup.co.uk"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  info@aspirefootballgroup.co.uk
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <a href="/" className="block text-gray-300 hover:text-white transition-colors">
                Home
              </a>
              <a href="/about" className="block text-gray-300 hover:text-white transition-colors">
                About
              </a>
              <a href="/players" className="block text-gray-300 hover:text-white transition-colors">
                Players
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Aspire Football Management Group. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;