// backend/src/routes/authRoutes.ts
import express, { Request, Response, NextFunction, Router } from 'express';
import { 
  register, 
  login, 
  getMe, 
  updateProfile 
} from '../controllers/authController';
import { protect } from '../middleware/auth';
import multer from 'multer';

const router: Router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Helper function for type compatibility
const asyncHandler = (fn: (req: Request, res: Response, next?: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Public routes
router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));

// Protected routes
router.get('/me', protect, asyncHandler(getMe));
router.put('/profile', protect, upload.single('profilePicture'), asyncHandler(updateProfile));

export default router;