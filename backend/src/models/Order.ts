// backend/src/models/Order.ts
import mongoose from 'mongoose';

interface OrderProduct {
  productId: mongoose.Schema.Types.ObjectId;
  quantity: number;
}

export interface IOrder extends mongoose.Document {
  userId: mongoose.Schema.Types.ObjectId;
  products: OrderProduct[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
}

const OrderSchema = new mongoose.Schema<IOrder>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1'],
      },
    },
  ],
  total: {
    type: Number,
    required: true,
    min: [0, 'Total must be a positive number'],
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IOrder>('Order', OrderSchema);