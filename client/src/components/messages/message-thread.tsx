import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Message, User, Conversation } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Loader2 } from "lucide-react";

interface MessageThreadProps {
  conversation: any; // Using any because we have enriched data
  currentUser: User;
}

export default function MessageThread({ conversation, currentUser }: MessageThreadProps) {
  const { toast } = useToast();
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fetch messages for the conversation
  const { data: messages, isLoading } = useQuery<Message[]>({
    queryKey: [`/api/conversations/${conversation.id}/messages`],
    enabled: !!conversation?.id,
  });
  
  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const messageData = {
        content,
        senderId: currentUser.id,
        receiverId: conversation.otherUser.id,
        listingId: conversation.listing.id
      };
      
      const res = await apiRequest("POST", "/api/messages", messageData);
      return res.json();
    },
    onSuccess: () => {
      setMessageText("");
      queryClient.invalidateQueries({ queryKey: [`/api/conversations/${conversation.id}/messages`] });
      queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Scroll to bottom when messages load or new message is sent
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  const handleSendMessage = () => {
    if (messageText.trim() === "") return;
    sendMessageMutation.mutate(messageText);
  };
  
  return (
    <div className="flex flex-col h-[600px]">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={conversation.otherUser?.avatar} alt={conversation.otherUser?.username} />
            <AvatarFallback>
              {conversation.otherUser?.username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">
              {conversation.otherUser?.displayName || conversation.otherUser?.username}
            </h3>
            <Link 
              href={`/listing/${conversation.listing?.id}`} 
              className="text-sm text-primary hover:underline"
            >
              View listing: {conversation.listing?.title}
            </Link>
          </div>
        </div>
        
        <div className="text-right">
          <span className="text-sm font-medium">${conversation.listing?.price.toFixed(2)}</span>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : messages && messages.length > 0 ? (
          messages.map((message) => {
            const isCurrentUser = message.senderId === currentUser.id;
            
            return (
              <div 
                key={message.id} 
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${isCurrentUser ? 'order-2' : 'order-1'}`}>
                  {!isCurrentUser && (
                    <Avatar className="h-8 w-8 mb-1 inline-flex">
                      <AvatarImage src={conversation.otherUser?.avatar} alt={conversation.otherUser?.username} />
                      <AvatarFallback>
                        {conversation.otherUser?.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div 
                    className={`rounded-lg p-3 ${
                      isCurrentUser 
                        ? 'bg-primary text-white ml-2' 
                        : 'bg-gray-100 text-gray-900 ml-2'
                    }`}
                  >
                    <p>{message.content}</p>
                  </div>
                  
                  <div 
                    className={`text-xs text-gray-500 mt-1 ${
                      isCurrentUser ? 'text-right' : 'text-left'
                    }`}
                  >
                    {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <i className="ri-chat-1-line text-2xl text-primary"></i>
            </div>
            <p className="text-center">No messages yet. Start the conversation!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <Textarea
            placeholder="Type a message..."
            className="flex-1 resize-none"
            rows={2}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={sendMessageMutation.isPending || messageText.trim() === ""}
          >
            {sendMessageMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <i className="ri-send-plane-fill text-lg"></i>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
