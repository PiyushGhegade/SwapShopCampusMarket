// Product Types
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: Category;
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerRoll: string;
  createdAt: string;
  usageDuration: string;
  status: 'pending' | 'approved' | 'rejected' | 'sold';
}

export type Category = 'Books' | 'Electronics' | 'Furniture' | 'Others';

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  profilePicture?: string;
  role: 'user' | 'admin';
  createdAt: string;
}

// Auth Types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Cart Types
export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

// Order Types
export interface Order {
  id: string;
  userId: string;
  products: {
    productId: string;
    product: Product;
    quantity: number;
  }[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

// Chat Types
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
}