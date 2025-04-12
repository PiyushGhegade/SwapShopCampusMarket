import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Listing, User } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export default function ListingPage() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [messageOpen, setMessageOpen] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const { data: listing, isLoading: listingLoading } = useQuery<Listing>({
    queryKey: [`/api/listings/${id}`],
  });
  
  const { data: seller, isLoading: sellerLoading } = useQuery<User>({
    queryKey: [`/api/users/${listing?.userId}`],
    enabled: !!listing?.userId,
  });
  
  // Simulate the user fetch since we don't have a direct endpoint for it
  // In a real app, you would have a proper endpoint
  const getUserData = async (): Promise<User> => {
    if (!listing) throw new Error("Listing not found");
    // This would be a real API call in a production app
    const users = await fetch("/api/user").then(res => res.json());
    return users.find((u: User) => u.id === listing.userId);
  };
  
  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      if (!user || !listing) throw new Error("You must be logged in to send a message");
      
      const messageData = {
        content: messageContent,
        senderId: user.id,
        receiverId: listing.userId,
        listingId: listing.id
      };
      
      const res = await apiRequest("POST", "/api/messages", messageData);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Message sent",
        description: "Your message has been sent to the seller.",
      });
      setMessageOpen(false);
      setMessageContent("");
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
  
  const handleSendMessage = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "You need to login to send messages to the seller.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    if (messageContent.trim() === "") {
      toast({
        title: "Empty message",
        description: "Please enter a message to send to the seller.",
        variant: "destructive",
      });
      return;
    }
    
    sendMessageMutation.mutate();
  };
  
  const handlePrevImage = () => {
    if (listing && listing.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? listing.images.length - 1 : prev - 1
      );
    }
  };
  
  const handleNextImage = () => {
    if (listing && listing.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === listing.images.length - 1 ? 0 : prev + 1
      );
    }
  };
  
  if (listingLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-2/3">
            <Skeleton className="w-full h-[400px] rounded-lg" />
          </div>
          <div className="w-full md:w-1/3 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-10 w-full mt-6" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!listing) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Listing Not Found</h1>
        <p className="mb-6">The listing you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate("/")}>Return to Home</Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left column - Images */}
        <div className="w-full md:w-2/3">
          <div className="relative">
            <img 
              src={listing.images[currentImageIndex]} 
              alt={listing.title}
              className="w-full h-[400px] object-contain bg-gray-50 rounded-lg"
            />
            
            {listing.images.length > 1 && (
              <>
                <button 
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
                >
                  <i className="ri-arrow-left-s-line text-lg"></i>
                </button>
                <button 
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
                >
                  <i className="ri-arrow-right-s-line text-lg"></i>
                </button>
              </>
            )}
          </div>
          
          {/* Thumbnail images */}
          {listing.images.length > 1 && (
            <div className="mt-4 flex gap-2 overflow-x-auto py-2">
              {listing.images.map((image, index) => (
                <button 
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${
                    index === currentImageIndex ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
          
          {/* Description section */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
          </div>
        </div>
        
        {/* Right column - Details */}
        <div className="w-full md:w-1/3">
          <div className="sticky top-24">
            <h1 className="text-2xl font-bold mb-2">{listing.title}</h1>
            <p className="text-2xl text-green-600 font-bold mb-4">${listing.price.toFixed(2)}</p>
            
            {listing.location && (
              <div className="flex items-center text-gray-500 mb-4">
                <i className="ri-map-pin-line mr-1"></i>
                <span>{listing.location}</span>
              </div>
            )}
            
            <div className="border-t border-b border-gray-200 py-4 my-4">
              <div className="flex items-center">
                {sellerLoading ? (
                  <Skeleton className="w-12 h-12 rounded-full mr-3" />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-3 flex items-center justify-center overflow-hidden">
                    {seller?.avatar ? (
                      <img src={seller.avatar} alt={seller.username} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg font-semibold">{seller?.username.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                )}
                
                <div>
                  {sellerLoading ? (
                    <Skeleton className="w-32 h-5 mb-1" />
                  ) : (
                    <div className="font-medium">{seller?.displayName || seller?.username}</div>
                  )}
                  <div className="text-sm text-gray-500">Seller</div>
                </div>
              </div>
            </div>
            
            {user?.id !== listing.userId && (
              <Button 
                onClick={() => setMessageOpen(true)} 
                className="w-full mb-3"
              >
                <i className="ri-message-2-line mr-2"></i>
                Contact Seller
              </Button>
            )}
            
            <div className="mt-6 text-sm text-gray-500">
              <p>• College verified user</p>
              <p>• On-campus transactions only</p>
              <p>• Listed {new Date(listing.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Message Dialog */}
      <Dialog open={messageOpen} onOpenChange={setMessageOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Message to Seller</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="font-medium mb-1">About: {listing.title}</p>
              <p className="text-sm text-gray-500">Price: ${listing.price.toFixed(2)}</p>
            </div>
            
            <Textarea
              placeholder="Type your message here..."
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              rows={4}
            />
            
            <Button 
              onClick={handleSendMessage}
              className="w-full"
              disabled={sendMessageMutation.isPending}
            >
              {sendMessageMutation.isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
              ) : (
                "Send Message"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
