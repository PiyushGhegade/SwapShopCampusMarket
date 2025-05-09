// backend/src/routes/orderRoutes.ts
import express from 'express';
import { 
  createOrder, 
  getUserOrders, 
  getOrderById, 
  updateOrderStatus, 
  cancelOrder 
} from '../controllers/orderController';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

// All order routes require authentication
router.use(protect);

router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', protect, admin, updateOrderStatus); // Admin only
router.put('/:id/cancel', cancelOrder);

export default router;