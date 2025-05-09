import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ProductGrid from '../components/products/ProductGrid';
import { Product, Category } from '../types';
import { getMockProducts, filterProducts } from '../utils/mockData';

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const allProducts = getMockProducts();
      const filteredProducts = filterProducts(allProducts, {
        category: category as Category,
      });
      setProducts(filteredProducts);
      setLoading(false);
    }, 1000);
  }, [category]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link to="/" className="flex items-center hover:text-orange-500 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Home
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {category} ({products.length} items)
      </h1>

      <ProductGrid
        products={products}
        loading={loading}
        emptyMessage={`No ${category?.toLowerCase()} available at the moment.`}
      />
    </div>
  );
};

export default CategoryPage;