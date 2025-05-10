import React from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import Button from '../ui/Button';
import SearchBar from './SearchBar';
import '../../styles/select-options.css';

const HeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-blue-900 to-blue-950 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Buy and Sell Items <span className="text-orange-400">Exclusively</span> for IIT Patna Students
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-lg md:mx-0 mx-auto">
              A secure, trusted marketplace for campus transactions. Find great deals on books, electronics, furniture, and more!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/browse">
                <Button size="lg" variant="primary">
                  Browse Products
                </Button>
              </Link>
              <Link to="/upload">
                <Button size="lg" variant="outline">
                  Sell an Item
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 mb-2">
                  <SearchBar />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <select className="w-full p-3 rounded-lg border text-gray-500 border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none">
                    <option value="">All Categories</option>
                    <option value="Books">Books</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <select className="w-full p-3 rounded-lg border text-gray-500 border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none">
                    <option value="">Price Range</option>
                    <option value="0-500">₹0 - ₹500</option>
                    <option value="500-2000">₹500 - ₹2000</option>
                    <option value="2000-5000">₹2000 - ₹5000</option>
                    <option value="5000+">₹5000+</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <Button variant="primary" size="lg" fullWidth>
                    Search
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm text-gray-600">
                <span className="font-medium text-gray-700">Popular:</span>
                <Link to="/category/books?q=textbooks" className="hover:text-orange-500 transition-colors">
                  Textbooks
                </Link>
                <Link to="/category/electronics?q=laptop" className="hover:text-orange-500 transition-colors">
                  Laptops
                </Link>
                <Link to="/category/electronics?q=calculator" className="hover:text-orange-500 transition-colors">
                  Calculators
                </Link>
                <Link to="/category/others?q=cycle" className="hover:text-orange-500 transition-colors">
                  Cycles
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;