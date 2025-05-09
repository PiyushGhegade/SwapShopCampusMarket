import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, Bell, MessageSquare, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to search results page with query
    window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
  };

  return (
    <header className="bg-gradient-to-r from-blue-950 to-blue-900 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-orange-400">SWAP</span>
            <span className="text-2xl font-bold">SHOP</span>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:block flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full pl-10 pr-4 py-2 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
              <button
                type="submit"
                className="absolute right-2 top-1.5 bg-orange-500 text-white p-1 rounded-full hover:bg-orange-600 transition-colors"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="relative p-2 rounded-full hover:bg-blue-800 transition-colors">
                  <ShoppingCart className="h-6 w-6" />
                  {cart.items.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cart.items.length}
                    </span>
                  )}
                </Link>
                <Link to="/messages" className="p-2 rounded-full hover:bg-blue-800 transition-colors">
                  <MessageSquare className="h-6 w-6" />
                </Link>
                <Link to="/notifications" className="relative p-2 rounded-full hover:bg-blue-800 transition-colors">
                  <Bell className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    2
                  </span>
                </Link>
                <div className="relative">
                  <button
                    onClick={toggleProfileMenu}
                    className="flex items-center space-x-2 p-2 rounded-full hover:bg-blue-800 transition-colors"
                  >
                    {user?.profilePicture ? (
                      <img 
                        src={user.profilePicture} 
                        alt={user.name} 
                        className="h-8 w-8 rounded-full object-cover border-2 border-orange-400" 
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-orange-400 flex items-center justify-center">
                        <span className="text-blue-900 font-semibold">
                          {user?.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </button>
                  
                  {/* Profile Dropdown */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-gray-800 z-50">
                      <div className="px-4 py-2 border-b">
                        <p className="font-semibold">{user?.name}</p>
                        <p className="text-sm text-gray-500">{user?.rollNumber}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 hover:bg-gray-100 flex items-center"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        My Orders
                      </Link>
                      <Link
                        to="/my-listings"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        My Listings
                      </Link>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 hover:bg-gray-100"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 flex items-center"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
                <Link to="/upload">
                  <Button variant="primary" size="sm">
                    Sell Item
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-white hover:bg-blue-800 transition-colors"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full pl-10 pr-4 py-2 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
          <button
            type="submit"
            className="absolute right-2 top-1.5 bg-orange-500 text-white p-1 rounded-full hover:bg-orange-600 transition-colors"
          >
            <Search className="h-4 w-4" />
          </button>
        </form>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-900 border-t border-blue-800">
          <div className="px-4 py-3 space-y-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-3 border-b border-blue-800 pb-3">
                  {user?.profilePicture ? (
                    <img 
                      src={user.profilePicture} 
                      alt={user.name} 
                      className="h-10 w-10 rounded-full object-cover border-2 border-orange-400" 
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-orange-400 flex items-center justify-center">
                      <span className="text-blue-900 font-semibold">
                        {user?.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{user?.name}</p>
                    <p className="text-sm text-gray-300">{user?.rollNumber}</p>
                  </div>
                </div>
                
                <Link
                  to="/profile"
                  className="block py-2 hover:bg-blue-800 rounded px-2"
                  onClick={toggleMenu}
                >
                  Profile
                </Link>
                <Link
                  to="/my-listings"
                  className="block py-2 hover:bg-blue-800 rounded px-2"
                  onClick={toggleMenu}
                >
                  My Listings
                </Link>
                <Link
                  to="/orders"
                  className="block py-2 hover:bg-blue-800 rounded px-2"
                  onClick={toggleMenu}
                >
                  My Orders
                </Link>
                <Link
                  to="/cart"
                  className="block py-2 hover:bg-blue-800 rounded px-2"
                  onClick={toggleMenu}
                >
                  Cart ({cart.items.length})
                </Link>
                <Link
                  to="/messages"
                  className="block py-2 hover:bg-blue-800 rounded px-2"
                  onClick={toggleMenu}
                >
                  Messages
                </Link>
                <Link
                  to="/notifications"
                  className="block py-2 hover:bg-blue-800 rounded px-2"
                  onClick={toggleMenu}
                >
                  Notifications
                </Link>
                
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="block py-2 hover:bg-blue-800 rounded px-2"
                    onClick={toggleMenu}
                  >
                    Admin Dashboard
                  </Link>
                )}
                
                <div className="pt-2">
                  <Link to="/upload" onClick={toggleMenu}>
                    <Button variant="primary" fullWidth>
                      Sell Item
                    </Button>
                  </Link>
                </div>
                
                <div className="pt-2 border-t border-blue-800">
                  <Button 
                    variant="ghost" 
                    fullWidth 
                    className="justify-start text-red-400"
                    onClick={() => {
                      logout();
                      toggleMenu();
                    }}
                  >
                    <LogOut className="h-5 w-5 mr-2" /> Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <Link to="/login" onClick={toggleMenu}>
                  <Button variant="outline" fullWidth>
                    Login
                  </Button>
                </Link>
                <Link to="/signup" onClick={toggleMenu}>
                  <Button variant="primary" fullWidth>
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;