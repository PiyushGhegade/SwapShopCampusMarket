import { users, type User, type InsertUser, categories, type Category, type InsertCategory, listings, type Listing, type InsertListing, messages, type Message, type InsertMessage, conversations, type Conversation, type InsertConversation } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Sample categories to populate our app
const defaultCategories = [
  { name: "Textbooks", icon: "book-open" },
  { name: "Electronics", icon: "computer" },
  { name: "Furniture", icon: "sofa" },
  { name: "Clothing", icon: "t-shirt" },
  { name: "Transportation", icon: "bike" },
  { name: "Other", icon: "more-2" }
];

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Category methods
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Listing methods
  getListings(): Promise<Listing[]>;
  getListing(id: number): Promise<Listing | undefined>;
  getListingsByUser(userId: number): Promise<Listing[]>;
  getListingsByCategory(categoryId: number): Promise<Listing[]>;
  createListing(listing: InsertListing): Promise<Listing>;
  updateListing(id: number, listing: Partial<Listing>): Promise<Listing | undefined>;
  deleteListing(id: number): Promise<boolean>;
  searchListings(query: string): Promise<Listing[]>;
  
  // Message methods
  getMessages(conversationId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessagesAsRead(conversationId: number, userId: number): Promise<boolean>;
  getUnreadMessageCount(userId: number): Promise<number>;
  
  // Conversation methods
  getConversations(userId: number): Promise<Conversation[]>;
  getConversation(id: number): Promise<Conversation | undefined>;
  getConversationByUsers(user1Id: number, user2Id: number, listingId: number): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;

  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private listings: Map<number, Listing>;
  private messages: Map<number, Message>;
  private conversations: Map<number, Conversation>;
  sessionStore: session.SessionStore;
  
  private userIdCounter: number;
  private categoryIdCounter: number;
  private listingIdCounter: number;
  private messageIdCounter: number;
  private conversationIdCounter: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.listings = new Map();
    this.messages = new Map();
    this.conversations = new Map();
    
    this.userIdCounter = 1;
    this.categoryIdCounter = 1;
    this.listingIdCounter = 1;
    this.messageIdCounter = 1;
    this.conversationIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
    
    // Initialize default categories
    this.initializeCategories();
  }

  private initializeCategories() {
    defaultCategories.forEach(cat => {
      this.createCategory({
        name: cat.name,
        icon: cat.icon
      });
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updatedFields: Partial<User>): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    if (!existingUser) {
      return undefined;
    }
    
    const updatedUser = {
      ...existingUser,
      ...updatedFields
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const now = new Date();
    const newCategory: Category = {
      ...category,
      id,
      createdAt: now
    };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  // Listing methods
  async getListings(): Promise<Listing[]> {
    return Array.from(this.listings.values());
  }

  async getListing(id: number): Promise<Listing | undefined> {
    return this.listings.get(id);
  }

  async getListingsByUser(userId: number): Promise<Listing[]> {
    return Array.from(this.listings.values()).filter(
      (listing) => listing.userId === userId
    );
  }

  async getListingsByCategory(categoryId: number): Promise<Listing[]> {
    return Array.from(this.listings.values()).filter(
      (listing) => listing.categoryId === categoryId
    );
  }

  async createListing(listing: InsertListing): Promise<Listing> {
    const id = this.listingIdCounter++;
    const now = new Date();
    const newListing: Listing = {
      ...listing,
      id,
      status: "active",
      createdAt: now
    };
    this.listings.set(id, newListing);
    return newListing;
  }

  async updateListing(id: number, updatedFields: Partial<Listing>): Promise<Listing | undefined> {
    const existingListing = this.listings.get(id);
    if (!existingListing) {
      return undefined;
    }
    
    const updatedListing = {
      ...existingListing,
      ...updatedFields
    };
    
    this.listings.set(id, updatedListing);
    return updatedListing;
  }

  async deleteListing(id: number): Promise<boolean> {
    return this.listings.delete(id);
  }

  async searchListings(query: string): Promise<Listing[]> {
    const searchTerms = query.toLowerCase().split(' ');
    return Array.from(this.listings.values()).filter(listing => {
      const searchText = `${listing.title.toLowerCase()} ${listing.description.toLowerCase()}`;
      return searchTerms.some(term => searchText.includes(term));
    });
  }

  // Message methods
  async getMessages(conversationId: number): Promise<Message[]> {
    // In a real implementation, we'd have a relation to conversations
    // For now, we'll find messages by sender and receiver
    const conversation = await this.getConversation(conversationId);
    if (!conversation) return [];
    
    return Array.from(this.messages.values())
      .filter(message => 
        (message.senderId === conversation.user1Id && message.receiverId === conversation.user2Id) ||
        (message.senderId === conversation.user2Id && message.receiverId === conversation.user1Id)
      )
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const id = this.messageIdCounter++;
    const now = new Date();
    const newMessage: Message = {
      ...message,
      id,
      read: false,
      createdAt: now
    };
    this.messages.set(id, newMessage);
    
    // Update the conversation's lastMessageAt
    const conversation = await this.getConversationByUsers(
      message.senderId, 
      message.receiverId,
      message.listingId
    );
    
    if (conversation) {
      await this.updateConversation(conversation.id, { lastMessageAt: now });
    } else {
      // Create a new conversation if one doesn't exist
      await this.createConversation({
        user1Id: message.senderId,
        user2Id: message.receiverId,
        listingId: message.listingId
      });
    }
    
    return newMessage;
  }

  async markMessagesAsRead(conversationId: number, userId: number): Promise<boolean> {
    const conversation = await this.getConversation(conversationId);
    if (!conversation) return false;
    
    let updated = false;
    
    for (const [id, message] of this.messages.entries()) {
      if (message.receiverId === userId && !message.read) {
        message.read = true;
        this.messages.set(id, message);
        updated = true;
      }
    }
    
    return updated;
  }

  async getUnreadMessageCount(userId: number): Promise<number> {
    return Array.from(this.messages.values()).filter(
      message => message.receiverId === userId && !message.read
    ).length;
  }

  // Conversation methods
  async getConversations(userId: number): Promise<Conversation[]> {
    return Array.from(this.conversations.values())
      .filter(conversation => 
        conversation.user1Id === userId || conversation.user2Id === userId
      )
      .sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());
  }

  async getConversation(id: number): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }

  async getConversationByUsers(user1Id: number, user2Id: number, listingId: number): Promise<Conversation | undefined> {
    return Array.from(this.conversations.values()).find(
      conversation => (
        (conversation.user1Id === user1Id && conversation.user2Id === user2Id) ||
        (conversation.user1Id === user2Id && conversation.user2Id === user1Id)
      ) && conversation.listingId === listingId
    );
  }

  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    const id = this.conversationIdCounter++;
    const now = new Date();
    const newConversation: Conversation = {
      ...conversation,
      id,
      lastMessageAt: now,
      createdAt: now
    };
    this.conversations.set(id, newConversation);
    return newConversation;
  }

  private async updateConversation(id: number, updatedFields: Partial<Conversation>): Promise<Conversation | undefined> {
    const existingConversation = this.conversations.get(id);
    if (!existingConversation) {
      return undefined;
    }
    
    const updatedConversation = {
      ...existingConversation,
      ...updatedFields
    };
    
    this.conversations.set(id, updatedConversation);
    return updatedConversation;
  }
}

export const storage = new MemStorage();
