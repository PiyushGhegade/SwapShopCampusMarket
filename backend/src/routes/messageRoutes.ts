// backend/src/routes/messageRoutes.ts
import express from 'express';
import * as controller from '../controllers/messageController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Get all conversations for the current user
router.get('/conversations', controller.getConversations);

// Get specific conversation messages
router.get('/conversations/:conversationId', controller.getConversation);

// Create a type-safe handler to wrap our controller function
function createHandler(handler: Function) {
  return (req: express.Request, res: express.Response) => {
    return handler(req, res);
  };
}

// Send a message to an existing conversation
router.post('/conversations/:conversationId', createHandler(controller.sendMessage));

// Mark messages as read
router.post('/conversations/:conversationId/read', createHandler(controller.markAsRead));

// Delete a conversation
router.delete('/conversations/:conversationId', createHandler(controller.deleteConversation));

export default router;