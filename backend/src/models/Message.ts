// backend/src/models/Message.ts
import mongoose from 'mongoose';

export interface IMessage extends mongoose.Document {
  senderId: mongoose.Schema.Types.ObjectId;
  receiverId: mongoose.Schema.Types.ObjectId;
  content: string;
  read: boolean;
  conversationId: string;
  timestamp: Date;
}

const MessageSchema = new mongoose.Schema<IMessage>({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    maxlength: [1000, 'Message cannot be more than 1000 characters'],
  },
  read: {
    type: Boolean,
    default: false,
  },
  conversationId: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Helper function to generate consistent conversation ID from two user IDs
MessageSchema.pre('save', function(next) {
  // Sort IDs to ensure consistent conversation ID regardless of who is sender/receiver
  const ids = [this.senderId.toString(), this.receiverId.toString()].sort();
  this.conversationId = ids.join('-');
  next();
});

export default mongoose.model<IMessage>('Message', MessageSchema);