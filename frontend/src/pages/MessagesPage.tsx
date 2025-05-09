import React, { useState } from 'react';
import { MessageSquare, Send, Search } from 'lucide-react';
import Input from '../components/ui/Input';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

interface Chat {
  id: string;
  userId: string;
  userName: string;
  userImage: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

const MessagesPage: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data
  const [chats] = useState<Chat[]>([
    {
      id: '1',
      userId: 'user1',
      userName: 'Aditya Kumar',
      userImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      lastMessage: 'Is the laptop still available?',
      timestamp: '2024-03-15T10:30:00Z',
      unread: 2,
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Priya Singh',
      userImage: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
      lastMessage: 'Sure, we can meet tomorrow',
      timestamp: '2024-03-14T15:45:00Z',
      unread: 0,
    },
  ]);

  const [messages] = useState<Message[]>([
    {
      id: 'm1',
      senderId: 'user1',
      text: 'Hi, is the laptop still available?',
      timestamp: '2024-03-15T10:30:00Z',
    },
    {
      id: 'm2',
      senderId: 'currentUser',
      text: 'Yes, it is! When would you like to meet?',
      timestamp: '2024-03-15T10:31:00Z',
    },
    {
      id: 'm3',
      senderId: 'user1',
      text: 'How about tomorrow at 3PM?',
      timestamp: '2024-03-15T10:32:00Z',
    },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    
    // In a real app, this would send the message to the backend
    console.log('Sending message:', messageText);
    setMessageText('');
  };

  const filteredChats = chats.filter(chat =>
    chat.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (chats.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mb-6">
          <MessageSquare className="mx-auto h-16 w-16 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">No messages yet</h2>
        <p className="text-gray-600">
          Start a conversation by viewing a product and messaging the seller!
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 h-[calc(100vh-12rem)]">
          {/* Chat List */}
          <div className="border-r">
            <div className="p-4 border-b">
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="h-5 w-5" />}
              />
            </div>
            <div className="overflow-y-auto h-[calc(100%-5rem)]">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedChat === chat.id ? 'bg-orange-50' : ''
                  }`}
                  onClick={() => setSelectedChat(chat.id)}
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={chat.userImage}
                      alt={chat.userName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold">{chat.userName}</h3>
                        <span className="text-xs text-gray-500">
                          {new Date(chat.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {chat.lastMessage}
                      </p>
                    </div>
                    {chat.unread > 0 && (
                      <span className="bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="col-span-2 flex flex-col">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b">
                  <div className="flex items-center space-x-4">
                    <img
                      src={chats.find(c => c.id === selectedChat)?.userImage}
                      alt="User"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">
                        {chats.find(c => c.id === selectedChat)?.userName}
                      </h3>
                      <p className="text-sm text-gray-500">Online</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.senderId === 'currentUser'
                          ? 'justify-end'
                          : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.senderId === 'currentUser'
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100'
                        }`}
                      >
                        <p>{message.text}</p>
                        <p className="text-xs mt-1 opacity-75">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t">
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-grow rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-orange-500"
                    />
                    <button
                      type="submit"
                      className="bg-orange-500 text-white rounded-full p-2 hover:bg-orange-600"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;