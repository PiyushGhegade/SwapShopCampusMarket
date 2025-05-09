// backend/src/models/Product.ts
import mongoose from 'mongoose';

export interface IProduct extends mongoose.Document {
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  sellerId: mongoose.Schema.Types.ObjectId;
  sellerName: string;
  sellerRoll: string;
  usageDuration: string;
  status: 'pending' | 'approved' | 'rejected' | 'sold';
  createdAt: Date;
}

const ProductSchema = new mongoose.Schema<IProduct>({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price must be a positive number'],
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Books', 'Electronics', 'Furniture', 'Others'],
  },
  images: {
    type: [String],
    default: [],
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sellerName: {
    type: String,
    required: true,
  },
  sellerRoll: {
    type: String,
    required: true,
  },
  usageDuration: {
    type: String,
    required: [true, 'Please specify usage duration'],
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'sold'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create index for search functionality
ProductSchema.index({ title: 'text', description: 'text' });

export default mongoose.model<IProduct>('Product', ProductSchema);