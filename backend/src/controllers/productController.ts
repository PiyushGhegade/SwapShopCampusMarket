// backend/src/controllers/productController.ts
import { Request, Response } from 'express';
import Product, { IProduct } from '../models/Product';
import User from '../models/User';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      category, 
      minPrice, 
      maxPrice, 
      search, 
      sortBy = 'date-desc',
      status = 'approved' 
    } = req.query;

    // Build query
    const query: any = {};

    // Filter by status (default to approved for public access)
    if (req.user?.role === 'admin') {
      // Admin can see all products regardless of status if they want
      if (status !== 'all') {
        query.status = status;
      }
    } else {
      // Regular users can only see approved products
      query.status = 'approved';
    }

    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Filter by price range
    if (minPrice) {
      query.price = { $gte: Number(minPrice) };
    }
    
    if (maxPrice) {
      query.price = { ...query.price, $lte: Number(maxPrice) };
    }

    // Search by title or description
    if (search) {
      query.$text = { $search: search };
    }

    // Create sort option
    let sortOption = {};
    switch (sortBy) {
      case 'price-asc':
        sortOption = { price: 1 };
        break;
      case 'price-desc':
        sortOption = { price: -1 };
        break;
      case 'date-asc':
        sortOption = { createdAt: 1 };
        break;
      case 'date-desc':
      default:
        sortOption = { createdAt: -1 };
    }

    // Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Execute query
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    // Get total count
    const total = await Product.countDocuments(query);

    res.json({
      products,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    // If product is not approved and requester is not the seller or an admin
    if (
      product.status !== 'approved' &&
      (!req.user || 
       (req.user.role !== 'admin' && 
        req.user._id.toString() !== product.sellerId.toString()))
    ) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.json(product);
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, price, category, usageDuration } = req.body;

    // Get file paths if any
    const images = req.files ? 
      (req.files as Express.Multer.File[]).map(file => `/uploads/${file.filename}`) :
      [];

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const product = await Product.create({
      title,
      description,
      price: Number(price),
      category,
      images,
      sellerId: user._id,
      sellerName: user.name,
      sellerRoll: user.rollNumber,
      usageDuration,
      status: 'pending', // Default status is pending, admin must approve
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    // Check if user is owner or admin
    if (
      product.sellerId.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    // Update fields
    const { title, description, price, category, usageDuration, status } = req.body;

    if (title) product.title = title;
    if (description) product.description = description;
    if (price) product.price = Number(price);
    if (category) product.category = category;
    if (usageDuration) product.usageDuration = usageDuration;
    
    // Only admin can update status
    if (status && req.user.role === 'admin') {
      product.status = status;
    }

    // Add new images if any
    if (req.files && (req.files as Express.Multer.File[]).length > 0) {
      const newImages = (req.files as Express.Multer.File[]).map(
        file => `/uploads/${file.filename}`
      );
      product.images = [...product.images, ...newImages];
    }

    // Remove images if specified
    if (req.body.removeImages) {
      const removeImages = Array.isArray(req.body.removeImages)
        ? req.body.removeImages
        : [req.body.removeImages];
      
      product.images = product.images.filter(img => !removeImages.includes(img));
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    // Check if user is owner or admin
    if (
      product.sellerId.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    // Use findByIdAndDelete instead of remove() which is deprecated
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product removed' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};