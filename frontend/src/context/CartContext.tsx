import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cart, CartItem, Product } from '../types';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Cart;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });

  // Load cart from localStorage on initial render
  useEffect(() => {
    const loadCart = () => {
      if (user) {
        const savedCart = localStorage.getItem(`cart-${user.id}`);
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart);
            setCart(parsedCart);
          } catch (error) {
            console.error('Failed to parse cart', error);
            setCart({ items: [], total: 0 });
          }
        }
      } else {
        setCart({ items: [], total: 0 });
      }
    };

    loadCart();
  }, [user]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`cart-${user.id}`, JSON.stringify(cart));
    }
  }, [cart, user]);

  const calculateTotal = (items: CartItem[]): number => {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      // Check if product is already in cart
      const existingItemIndex = prevCart.items.findIndex(item => item.productId === product.id);
      
      let updatedItems;
      if (existingItemIndex >= 0) {
        // Increment quantity if item exists
        updatedItems = [...prevCart.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        };
      } else {
        // Add new item if it doesn't exist
        updatedItems = [
          ...prevCart.items,
          { productId: product.id, product, quantity: 1 },
        ];
      }
      
      // Calculate the new total
      const total = calculateTotal(updatedItems);
      
      return { items: updatedItems, total };
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => {
      const updatedItems = prevCart.items.filter(item => item.productId !== productId);
      const total = calculateTotal(updatedItems);
      
      return { items: updatedItems, total };
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => {
      const updatedItems = prevCart.items.map(item => 
        item.productId === productId ? { ...item, quantity } : item
      );
      const total = calculateTotal(updatedItems);
      
      return { items: updatedItems, total };
    });
  };

  const clearCart = () => {
    setCart({ items: [], total: 0 });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};