import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MessageSquare, 
  Calendar, 
  Tag, 
  ChevronLeft, 
  ChevronRight,
  Share2,
  BookmarkPlus
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Product } from '../../types';
import { getMockProducts } from '../../utils/mockData';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [showAddedToCart, setShowAddedToCart] = useState(false);

  useEffect(() => {
    // Simulate API call to get product details
    setLoading(true);
    setTimeout(() => {
      const products = getMockProducts();
      const foundProduct = products.find(p => p.id === id);
      setProduct(foundProduct || null);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? (product?.images.length || 1) - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => 
      prev === (product?.images.length || 1) - 1 ? 0 : prev + 1
    );
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      setShowAddedToCart(true);
      setTimeout(() => setShowAddedToCart(false), 3000);
    }
  };

  const handleContactSeller = () => {
    // In a real app, this would navigate to chat with the seller
    window.location.href = `/messages?seller=${product?.sellerId}`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="md:flex gap-8">
            <div className="md:w-1/2">
              <div className="h-96 bg-gray-200 rounded-lg mb-4"></div>
              <div className="flex gap-2 mb-4">
                <div className="h-20 w-20 bg-gray-200 rounded"></div>
                <div className="h-20 w-20 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="h-8 w-3/4 bg-gray-200 rounded mb-4"></div>
              <div className="h-6 w-1/4 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded mb-6"></div>
              <div className="h-10 w-full bg-gray-200 rounded mb-4"></div>
              <div className="h-10 w-full bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mb-6">
          <span className="inline-block p-3 rounded-full bg-red-100 text-red-600">
            <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            </svg>
          </span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-8">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/browse">
          <Button variant="primary">
            Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(product.createdAt).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(product.price);

  const isOwnProduct = user?.id === product.sellerId;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link to="/browse" className="flex items-center hover:text-orange-500 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Browse
        </Link>
        <span>/</span>
        <Link to={`/browse?category=${product.category}`} className="hover:text-orange-500 transition-colors">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-gray-400 truncate">{product.title}</span>
      </div>

      <div className="md:flex md:gap-8">
        {/* Product Images */}
        <div className="md:w-1/2 mb-6 md:mb-0">
          <div className="relative rounded-lg overflow-hidden bg-gray-100 h-96 flex items-center justify-center mb-4">
            {product.images.length > 0 ? (
              <>
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.title}
                  className="w-full h-full object-contain"
                />
                
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-700" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                    >
                      <ChevronRight className="h-5 w-5 text-gray-700" />
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="text-gray-400">No images available</div>
            )}
            
            {product.status === 'sold' && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                <span className="text-white font-bold text-3xl rotate-[-25deg] border-4 border-white py-2 px-6 rounded-md">
                  SOLD
                </span>
              </div>
            )}
          </div>
          
          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 ${
                    currentImageIndex === index ? 'border-orange-500' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="md:w-1/2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-4">
              <Badge variant="info" size="md">
                {product.category}
              </Badge>
              {product.status === 'pending' && (
                <Badge variant="warning" size="md" className="ml-2">
                  Pending Approval
                </Badge>
              )}
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {product.title}
            </h1>
            
            <p className="text-2xl md:text-3xl font-bold text-orange-600 mb-4">
              {formattedPrice}
            </p>
            
            <div className="flex flex-wrap gap-y-2 mb-6 text-gray-700 text-sm">
              <div className="w-full sm:w-1/2 flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                Posted on {formattedDate}
              </div>
              <div className="w-full sm:w-1/2 flex items-center">
                <Tag className="h-4 w-4 mr-2 text-gray-500" />
                Used for {product.usageDuration}
              </div>
            </div>
            
            <div className="border-t border-b py-4 mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-line">
                {product.description}
              </p>
            </div>
            
            <div className="border-b pb-6 mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Seller Information</h3>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
                  {product.sellerName.charAt(0)}
                </div>
                <div className="ml-3">
                  <p className="font-medium">{product.sellerName}</p>
                  <p className="text-sm text-gray-500">{product.sellerRoll}</p>
                </div>
              </div>
            </div>
            
            {showAddedToCart && (
              <div className="bg-green-100 text-green-800 p-3 rounded-md mb-4 flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Product added to cart!
              </div>
            )}
            
            <div className="flex flex-col space-y-3">
              {isOwnProduct ? (
                <p className="text-orange-600 mb-2">This is your own listing</p>
              ) : (
                <>
                  {product.status !== 'sold' && (
                    <Button
                      variant="primary"
                      fullWidth
                      onClick={handleAddToCart}
                    >
                      Add to Cart
                    </Button>
                  )}
                  <Button
                    variant={product.status === 'sold' ? 'primary' : 'outline'}
                    fullWidth
                    leftIcon={<MessageSquare className="h-5 w-5" />}
                    onClick={handleContactSeller}
                  >
                    Contact Seller
                  </Button>
                </>
              )}
              
              <div className="flex space-x-3">
                <Button
                  variant="ghost"
                  className="flex-1"
                  leftIcon={<BookmarkPlus className="h-5 w-5" />}
                >
                  Save
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1"
                  leftIcon={<Share2 className="h-5 w-5" />}
                >
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;