import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import ConversationList from "@/components/messages/conversation-list";
import MessageThread from "@/components/messages/message-thread";
import { Conversation } from "@shared/schema";

export default function MessagesPage() {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  
  // Fetch user's conversations
  const { data: conversations, isLoading: conversationsLoading } = useQuery<any[]>({
    queryKey: ['/api/conversations'],
    enabled: !!user,
  });
  
  // Set first conversation as selected by default when data loads
  useEffect(() => {
    if (conversations && conversations.length > 0 && !selectedConversation) {
      setSelectedConversation(conversations[0]);
    }
  }, [conversations, selectedConversation]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      
      {conversationsLoading ? (
        <div className="flex justify-center items-center h-72">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : conversations && conversations.length > 0 ? (
        <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Conversation list */}
          <div className="w-full md:w-1/3 border-r border-gray-200">
            <ConversationList 
              conversations={conversations} 
              selectedConversation={selectedConversation}
              onSelectConversation={setSelectedConversation}
            />
          </div>
          
          {/* Message thread */}
          <div className="w-full md:w-2/3">
            {selectedConversation ? (
              <MessageThread 
                conversation={selectedConversation} 
                currentUser={user}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 p-8">
                Select a conversation to view messages
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <i className="ri-message-2-line text-2xl text-primary"></i>
            </div>
            <h3 className="text-lg font-medium mb-2">No messages yet</h3>
            <p className="text-gray-500 max-w-sm mb-6">
              When you contact a seller about an item, your conversations will appear here.
            </p>
            <a href="/" className="text-primary hover:underline font-medium">
              Browse items to get started
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
