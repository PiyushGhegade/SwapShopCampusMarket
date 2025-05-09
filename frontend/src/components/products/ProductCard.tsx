import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Tag } from 'lucide-react';
import { Product } from '../../types';
import Badge from '../ui/Badge';
import Card from '../ui/Card';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };
  
  // Format the creation date
  const formattedDate = new Date(product.createdAt).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  
  // Format the price
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(product.price);

  return (
    <Card 
      hoverable 
      className="transition-all duration-300 h-full flex flex-col"
      onClick={handleClick}
    >
      {/* Product Image */}
      <div className="relative h-48 overflow-hidden bg-gray-200">
        {product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
            No Image
          </div>
        )}
        <div className="absolute top-2 left-2">
          <Badge variant="info" size="sm">{product.category}</Badge>
        </div>
        {product.status === 'pending' && (
          <div className="absolute top-2 right-2">
            <Badge variant="warning" size="sm">Pending</Badge>
          </div>
        )}
        {product.status === 'sold' && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold text-xl rotate-[-25deg] border-2 border-white py-1 px-3 rounded-md">
              SOLD
            </span>
          </div>
        )}
      </div>
      
      {/* Product Details */}
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-semibold text-lg mb-1 line-clamp-2">{product.title}</h3>
        
        <div className="mt-1 mb-2">
          <p className="text-xl font-bold text-orange-600">{formattedPrice}</p>
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{product.description}</p>
        
        <div className="mt-auto space-y-1 text-xs text-gray-600">
          <div className="flex items-center">
            <Tag className="h-3.5 w-3.5 mr-1" />
            <span>Used for {product.usageDuration}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>Listed on {formattedDate}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;