// backend/src/controllers/messageController.ts
import { Request, Response } from 'express';
import Message from '../models/Message';

// Handler to get all conversations for current user
export const getConversations = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: userId },
            { recipient: userId }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', userId] },
              '$recipient',
              '$sender'
            ]
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [
                  { $eq: ['$recipient', userId] },
                  { $eq: ['$isRead', false] }
                ]},
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'otherUser'
        }
      },
      {
        $unwind: '$otherUser'
      },
      {
        $project: {
          otherUser: {
            _id: 1,
            name: 1,
            email: 1,
            avatar: 1
          },
          lastMessage: {
            content: 1,
            createdAt: 1,
            isRead: 1
          },
          unreadCount: 1
        }
      }
    ]);

    res.json(conversations);
  } catch (error) {
    console.error('Error getting conversations:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Handler to get conversation between current user and another user
export const getConversation = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const otherUserId = req.params.conversationId;

    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: otherUserId },
        { sender: otherUserId, recipient: userId }
      ]
    })
    .sort({ createdAt: 1 })
    .populate('sender', 'name avatar')
    .populate('recipient', 'name avatar');

    // Mark all messages as read that were sent to current user
    await Message.updateMany(
      { sender: otherUserId, recipient: userId, isRead: false },
      { isRead: true }
    );

    res.json(messages);
  } catch (error) {
    console.error('Error getting conversation:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Handler to send a message to a user
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { content, recipientId } = req.body;
    const senderId = req.user?.id;
    
    // Get recipient ID either from URL params or request body
    const recipient = req.params.conversationId || recipientId;
    
    if (!content) {
      return res.status(400).json({ message: 'Message content is required' });
    }
    
    if (!recipient) {
      return res.status(400).json({ message: 'Recipient ID is required' });
    }

    const newMessage = new Message({
      sender: senderId,
      recipient: recipient,
      content,
      isRead: false
    });

    const savedMessage = await newMessage.save();
    
    // Populate sender and recipient information
    const populatedMessage = await Message.findById(savedMessage._id)
      .populate('sender', 'name avatar')
      .populate('recipient', 'name avatar');

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Handler to mark messages as read
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const otherUserId = req.params.conversationId;

    await Message.updateMany(
      { sender: otherUserId, recipient: userId, isRead: false },
      { isRead: true }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Handler to delete a conversation
export const deleteConversation = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const otherUserId = req.params.conversationId;

    await Message.deleteMany({
      $or: [
        { sender: userId, recipient: otherUserId },
        { sender: otherUserId, recipient: userId }
      ]
    });

    res.json({ message: 'Conversation deleted' });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({ message: 'Server error' });
  }
};