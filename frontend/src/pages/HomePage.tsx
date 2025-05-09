import React, { useState, useEffect } from 'react';
import HeroSection from '../components/home/HeroSection';
import ProductGrid from '../components/products/ProductGrid';
import CategorySection from '../components/products/CategorySection';
import HowItWorks from '../components/home/HowItWorks';
import { getMockProducts, getTrendingCategories } from '../utils/mockData';
import { Product } from '../types';

const HomePage: React.FC = () => {
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [trendingCategories, setTrendingCategories] = useState(getTrendingCategories());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading products
    setLoading(true);
    setTimeout(() => {
      const products = getMockProducts();
      // Sort by creation date (newest first)
      const sorted = [...products].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      // Filter out pending items
      const approved = sorted.filter(p => p.status === 'approved');
      setRecentProducts(approved.slice(0, 8));
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div>
      <HeroSection />
      
      <section className="py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recently Added</h2>
          <ProductGrid 
            products={recentProducts} 
            loading={loading} 
            emptyMessage="No products available yet. Be the first to list an item!"
          />
        </div>
      </section>
      
      <CategorySection categories={trendingCategories} />
      
      <HowItWorks />
      
      <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Buy or Sell?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join our exclusive marketplace for IIT Patna students and start buying and selling today!
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="/signup"
              className="bg-white text-orange-600 font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
            >
              Sign Up Now
            </a>
            <a
              href="/browse"
              className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-orange-600 transition-colors"
            >
              Browse Products
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;