// backend/src/controllers/cartController.ts
import { Request, Response } from 'express';
import User from '../models/User';
import { ICartItem } from '../models/User';

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req: Request, res: Response): Promise<void> => {
  try {
    // TypeScript fix: Add explicit id type from request
    const userId = req.user?.id;
    
    const user = await User.findById(userId).populate('cart.product');
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    res.json(user.cart || []);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
export const addToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    if (!productId) {
      res.status(400).json({ message: 'Product ID is required' });
      return;
    }
    
    const user = await User.findById(req.user?.id);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    // Check if item is already in cart
    const existingItemIndex = user.cart.findIndex(
      (item: ICartItem) => item.product.toString() === productId
    );
    
    if (existingItemIndex !== undefined && existingItemIndex >= 0) {
      // Update quantity if item exists
      user.cart[existingItemIndex].quantity += Number(quantity);
    } else {
      // Add new item if it doesn't exist
      user.cart.push({
        product: productId,
        quantity: Number(quantity),
      });
    }
    
    await user.save();
    
    // Populate product details
    await user.populate('cart.product');
    
    res.status(201).json(user.cart);
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/items/:itemId
// @access  Private
export const updateCartItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    
    if (!quantity || quantity < 1) {
      res.status(400).json({ message: 'Quantity must be at least 1' });
      return;
    }
    
    const user = await User.findById(req.user?.id);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    // Find the item in the cart
    const cartItem = user.cart.find((item: ICartItem) => item._id?.toString() === itemId);
    
    if (!cartItem) {
      res.status(404).json({ message: 'Item not found in cart' });
      return;
    }
    
    // Update quantity
    cartItem.quantity = Number(quantity);
    
    await user.save();
    
    // Populate product details
    await user.populate('cart.product');
    
    res.json(user.cart);
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:itemId
// @access  Private
export const removeFromCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { itemId } = req.params;
    
    const user = await User.findById(req.user?.id);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    // Filter out the item to remove
    user.cart = user.cart.filter((item: ICartItem) => item._id?.toString() !== itemId);
    
    await user.save();
    
    res.json(user.cart);
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    // Clear cart
    user.cart = [];
    
    await user.save();
    
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};