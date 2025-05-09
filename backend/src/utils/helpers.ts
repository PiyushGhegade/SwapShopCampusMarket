import { Response } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';

/**
 * Standard API response format
 */
export const sendResponse = (
  res: Response,
  status: number,
  success: boolean,
  message: string,
  data?: any
) => {
  return res.status(status).json({
    success,
    message,
    data: data || null,
  });
};

/**
 * Handle errors with proper response format
 */
export const handleError = (res: Response, error: any) => {
  console.error('Error:', error);
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';
  return sendResponse(res, statusCode, false, message);
};

/**
 * Generate JWT token
 */
export const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiration,
  });
};

/**
 * Generate random token (for password reset, etc.)
 */
export const generateRandomToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Hash password reset token
 */
export const hashToken = (token: string): string => {
  return crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
};

/**
 * Pagination helper
 */
export const getPaginationOptions = (
  page: number = 1, 
  limit: number = 10
) => {
  const skip = (page - 1) * limit;
  return {
    skip,
    limit
  };
};

/**
 * Format price to standard format
 */
export const formatPrice = (price: number): string => {
  return (price / 100).toFixed(2);
};

/**
 * Parse price from string to cents (integer)
 */
export const parsePriceToInt = (price: string): number => {
  return Math.round(parseFloat(price) * 100);
};

/**
 * Generate slug from title
 */
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

/**
 * Calculate discount percentage
 */
export const calculateDiscountPercentage = (
  originalPrice: number, 
  discountedPrice: number
): number => {
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};