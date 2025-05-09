import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-950 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <span className="text-2xl font-bold text-orange-400">SWAP</span>
              <span className="text-2xl font-bold">SHOP</span>
            </Link>
            <p className="text-gray-300 mb-4">
              The premier marketplace exclusively for IIT Patna students to buy and sell second-hand items safely and conveniently.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-blue-800 pb-2">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/browse" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Browse Products
                </Link>
              </li>
              <li>
                <Link to="/upload" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Sell Your Item
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-300 hover:text-orange-400 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-gray-300 hover:text-orange-400 transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-blue-800 pb-2">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/browse?category=Books" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Books
                </Link>
              </li>
              <li>
                <Link to="/browse?category=Electronics" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/browse?category=Furniture" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Furniture
                </Link>
              </li>
              <li>
                <Link to="/browse?category=Others" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Others
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-blue-800 pb-2">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-orange-400 mt-0.5" />
                <span className="text-gray-300">IIT Patna, Bihta, Patna, Bihar - 801106</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-orange-400" />
                <a href="mailto:support@swapshop.com" className="text-gray-300 hover:text-orange-400 transition-colors">
                  support@swapshop.com
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-orange-400" />
                <a href="tel:+91-1234567890" className="text-gray-300 hover:text-orange-400 transition-colors">
                  +91-1234567890
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-blue-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} SWAPSHOP. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-4 text-sm">
              <Link to="/privacy-policy" className="text-gray-400 hover:text-orange-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-gray-400 hover:text-orange-400 transition-colors">
                Terms of Service
              </Link>
              <Link to="/community-guidelines" className="text-gray-400 hover:text-orange-400 transition-colors">
                Community Guidelines
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;