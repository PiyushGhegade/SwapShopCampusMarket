import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Conversation } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ConversationListProps {
  conversations: any[]; // Using any type because the enriched conversations have additional fields
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
}

export default function ConversationList({
  conversations,
  selectedConversation,
  onSelectConversation
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter conversations based on search query
  const filteredConversations = conversations.filter(
    (conversation) => {
      if (!searchQuery) return true;
      const otherUserName = conversation.otherUser?.displayName || conversation.otherUser?.username || "";
      const listingTitle = conversation.listing?.title || "";
      return (
        otherUserName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listingTitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  );

  return (
    <div className="h-[600px] flex flex-col">
      <div className="p-3 border-b border-gray-200">
        <Input
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>
      
      {filteredConversations.length > 0 ? (
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <button
              key={conversation.id}
              className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                selectedConversation?.id === conversation.id ? "bg-gray-50" : ""
              }`}
              onClick={() => onSelectConversation(conversation)}
            >
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={conversation.otherUser?.avatar} alt={conversation.otherUser?.username} />
                  <AvatarFallback>
                    {conversation.otherUser?.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium truncate">
                      {conversation.otherUser?.displayName || conversation.otherUser?.username}
                    </h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {formatDistanceToNow(new Date(conversation.lastMessageAt), { addSuffix: true })}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-500 truncate">
                    {conversation.listing?.title}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-6 text-gray-500">
          {searchQuery ? "No conversations match your search" : "No conversations found"}
        </div>
      )}
    </div>
  );
}
