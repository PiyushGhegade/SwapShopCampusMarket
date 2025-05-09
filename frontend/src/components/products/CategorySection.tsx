import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Laptop, Sofa, Package } from 'lucide-react';
import { Category } from '../../types';
import { getMockProducts } from '../../utils/mockData';

interface CategorySectionProps {
  categories: { category: Category; count: number }[];
}

const CategorySection: React.FC<CategorySectionProps> = () => {
  // Get actual product counts from mock data
  const products = getMockProducts();
  const categories = [
    {
      category: 'Books' as Category,
      count: products.filter(p => p.category === 'Books').length,
      icon: <BookOpen className="h-10 w-10 text-blue-600" />,
    },
    {
      category: 'Electronics' as Category,
      count: products.filter(p => p.category === 'Electronics').length,
      icon: <Laptop className="h-10 w-10 text-orange-500" />,
    },
    {
      category: 'Furniture' as Category,
      count: products.filter(p => p.category === 'Furniture').length,
      icon: <Sofa className="h-10 w-10 text-green-600" />,
    },
    {
      category: 'Others' as Category,
      count: products.filter(p => p.category === 'Others').length,
      icon: <Package className="h-10 w-10 text-purple-500" />,
    },
  ];

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Trending Categories</h2>
          <Link 
            to="/browse" 
            className="text-orange-500 hover:text-orange-600 transition-colors font-medium flex items-center"
          >
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(({ category, count, icon }) => (
            <Link
              key={category}
              to={`/category/${category.toLowerCase()}`}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow flex flex-col items-center justify-center text-center group"
            >
              <div className="p-4 rounded-full bg-gray-100 mb-4 group-hover:scale-110 transition-transform">
                {icon}
              </div>
              <h3 className="font-semibold text-lg mb-1">{category}</h3>
              <p className="text-gray-600 text-sm">{count} items</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;