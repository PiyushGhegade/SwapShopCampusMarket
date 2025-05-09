// backend/src/models/User.ts
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/config';

// Define cart item interface
export interface ICartItem {
  _id?: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId | string;
  quantity: number;
}

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  rollNumber: string;
  password: string;
  profilePicture?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  cart: ICartItem[];  // Add cart property to IUser interface
  matchPassword: (enteredPassword: string) => Promise<boolean>;
  getSignedJwtToken: () => string;
}

// Cart item schema
const CartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  }
});

const UserSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@iitp\.ac\.in$/,
      'Please use a valid IIT Patna email address',
    ],
  },
  rollNumber: {
    type: String,
    required: [true, 'Please add a roll number'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  profilePicture: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  cart: [CartItemSchema], // Add cart field to UserSchema
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function (): string {
  // Convert mongoose ObjectId to string to avoid type issues
  const payload = { id: this._id.toString() };
  
  // Use direct jwt.sign call with inline cast to avoid type issues
  return jwt.sign(
    payload, 
    config.jwtSecret, 
    { expiresIn: config.jwtExpire as any }
  );
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);