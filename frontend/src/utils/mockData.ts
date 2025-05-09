import { Product, User, Category, Order, Message, Conversation } from '../types';

// Mock Users
export const getMockUsers = (): User[] => [
  {
    id: 'user1',
    name: 'Aditya Kumar',
    email: 'aditya@iitp.ac.in',
    rollNumber: '2001CS01',
    profilePicture: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    role: 'user',
    createdAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 'user2',
    name: 'Priya Singh',
    email: 'priya@iitp.ac.in',
    rollNumber: '2001EE42',
    profilePicture: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    role: 'user',
    createdAt: '2023-01-02T00:00:00Z',
  },
  {
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@iitp.ac.in',
    rollNumber: 'ADMIN001',
    profilePicture: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    role: 'admin',
    createdAt: '2022-12-01T00:00:00Z',
  },
];

// Mock Categories
export const categories: Category[] = ['Books', 'Electronics', 'Furniture', 'Others'];

// Mock Products
export const getMockProducts = (): Product[] => [
  {
    id: 'prod1',
    title: 'Data Structures and Algorithms Textbook',
    description: 'Excellent condition, barely used. Perfect for CS students.',
    price: 250,
    category: 'Books',
    images: [
      'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
      'https://images.pexels.com/photos/1370298/pexels-photo-1370298.jpeg',
    ],
    sellerId: 'user1',
    sellerName: 'Aditya Kumar',
    sellerRoll: '2001CS01',
    createdAt: '2023-03-15T10:00:00Z',
    usageDuration: '1 year',
    status: 'approved',
  },
  {
    id: 'prod2',
    title: 'HP Laptop - Core i5 10th Gen',
    description: 'Great performance, 8GB RAM, 512GB SSD. Minor scratches on the lid.',
    price: 32000,
    category: 'Electronics',
    images: [
      'https://images.pexels.com/photos/18105/pexels-photo.jpg',
      'https://images.pexels.com/photos/129208/pexels-photo-129208.jpeg',
    ],
    sellerId: 'user2',
    sellerName: 'Priya Singh',
    sellerRoll: '2001EE42',
    createdAt: '2023-02-28T14:30:00Z',
    usageDuration: '2 years',
    status: 'approved',
  },
  {
    id: 'prod3',
    title: 'Study Table with Chair',
    description: 'Comfortable study setup. Table has some scratches but is sturdy.',
    price: 1800,
    category: 'Furniture',
    images: [
      'https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg',
      'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg',
    ],
    sellerId: 'user1',
    sellerName: 'Aditya Kumar',
    sellerRoll: '2001CS01',
    createdAt: '2023-03-10T09:15:00Z',
    usageDuration: '1.5 years',
    status: 'approved',
  },
  {
    id: 'prod4',
    title: 'Scientific Calculator - Casio fx-991EX',
    description: 'All functions working perfectly. No scratches.',
    price: 1200,
    category: 'Electronics',
    images: [
      'https://images.pexels.com/photos/9254030/pexels-photo-9254030.jpeg',
    ],
    sellerId: 'user2',
    sellerName: 'Priya Singh',
    sellerRoll: '2001EE42',
    createdAt: '2023-03-01T11:45:00Z',
    usageDuration: '6 months',
    status: 'approved',
  },
  {
    id: 'prod5',
    title: 'Engineering Drawing Kit',
    description: 'Complete set with all tools. Lightly used.',
    price: 350,
    category: 'Others',
    images: [
      'https://images.pexels.com/photos/4458554/pexels-photo-4458554.jpeg',
    ],
    sellerId: 'user1',
    sellerName: 'Aditya Kumar',
    sellerRoll: '2001CS01',
    createdAt: '2023-03-20T16:20:00Z',
    usageDuration: '1 semester',
    status: 'pending',
  },
  {
    id: 'prod6',
    title: 'Computer Networks Textbook',
    description: 'Latest edition, perfect condition. Includes practice problems.',
    price: 300,
    category: 'Books',
    images: [
      'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg',
    ],
    sellerId: 'user2',
    sellerName: 'Priya Singh',
    sellerRoll: '2001EE42',
    createdAt: '2023-03-18T13:10:00Z',
    usageDuration: '1 semester',
    status: 'approved',
  },
];

// Mock Orders
export const getMockOrders = (): Order[] => [
  {
    id: 'order1',
    userId: 'user1',
    products: [
      {
        productId: 'prod2',
        product: getMockProducts().find(p => p.id === 'prod2')!,
        quantity: 1,
      },
    ],
    total: 32000,
    status: 'completed',
    createdAt: '2023-03-05T15:30:00Z',
  },
  {
    id: 'order2',
    userId: 'user2',
    products: [
      {
        productId: 'prod1',
        product: getMockProducts().find(p => p.id === 'prod1')!,
        quantity: 1,
      },
      {
        productId: 'prod3',
        product: getMockProducts().find(p => p.id === 'prod3')!,
        quantity: 1,
      },
    ],
    total: 2050,
    status: 'pending',
    createdAt: '2023-03-22T10:15:00Z',
  },
];

// Mock Messages and Conversations
export const getMockMessages = (): Message[] => [
  {
    id: 'msg1',
    senderId: 'user1',
    receiverId: 'user2',
    content: 'Hi, is the laptop still available?',
    timestamp: '2023-03-20T09:30:00Z',
    read: true,
  },
  {
    id: 'msg2',
    senderId: 'user2',
    receiverId: 'user1',
    content: 'Yes, it is! When would you like to meet?',
    timestamp: '2023-03-20T09:35:00Z',
    read: true,
  },
  {
    id: 'msg3',
    senderId: 'user1',
    receiverId: 'user2',
    content: 'Great! How about tomorrow at 3PM near the library?',
    timestamp: '2023-03-20T09:40:00Z',
    read: true,
  },
  {
    id: 'msg4',
    senderId: 'user2',
    receiverId: 'user1',
    content: 'That works for me. See you then!',
    timestamp: '2023-03-20T09:45:00Z',
    read: false,
  },
];

export const getMockConversations = (): Conversation[] => {
  const mockMessages = getMockMessages();
  
  return [
    {
      id: 'conv1',
      participants: ['user1', 'user2'],
      lastMessage: mockMessages[mockMessages.length - 1],
      unreadCount: 1,
    },
  ];
};

// Helper function to get trending categories
export const getTrendingCategories = (): { category: Category; count: number }[] => {
  return [
    { category: 'Books', count: 15 },
    { category: 'Electronics', count: 12 },
    { category: 'Furniture', count: 8 },
    { category: 'Others', count: 5 },
  ];
};

// Helper function to filter products
export interface FilterOptions {
  category?: Category;
  minPrice?: number;
  maxPrice?: number;
  searchTerm?: string;
  sortBy?: 'price-asc' | 'price-desc' | 'date-asc' | 'date-desc';
}

export const filterProducts = (products: Product[], options: FilterOptions): Product[] => {
  let filtered = [...products];
  
  // Filter by category
  if (options.category) {
    filtered = filtered.filter(product => product.category === options.category);
  }
  
  // Filter by price range
  if (options.minPrice !== undefined) {
    filtered = filtered.filter(product => product.price >= options.minPrice!);
  }
  
  if (options.maxPrice !== undefined) {
    filtered = filtered.filter(product => product.price <= options.maxPrice!);
  }
  
  // Filter by search term
  if (options.searchTerm) {
    const term = options.searchTerm.toLowerCase();
    filtered = filtered.filter(product => 
      product.title.toLowerCase().includes(term) || 
      product.description.toLowerCase().includes(term)
    );
  }
  
  // Sort products
  if (options.sortBy) {
    switch (options.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'date-asc':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'date-desc':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }
  }
  
  return filtered;
};