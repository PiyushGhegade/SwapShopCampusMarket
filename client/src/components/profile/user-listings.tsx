import { useQuery } from "@tanstack/react-query";
import { Listing } from "@shared/schema";
import { Loader2, PlusCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import CreateListingModal from "@/components/products/create-listing-modal";
import { Badge } from "@/components/ui/badge";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserListingsProps {
  userId: number;
}

export default function UserListings({ userId }: UserListingsProps) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [createListingOpen, setCreateListingOpen] = useState(false);
  
  const { data: listings, isLoading } = useQuery<Listing[]>({
    queryKey: [`/api/listings?userId=${userId}`],
  });
  
  const deleteListingMutation = useMutation({
    mutationFn: async (listingId: number) => {
      await apiRequest("DELETE", `/api/listings/${listingId}`);
    },
    onSuccess: () => {
      toast({
        title: "Listing deleted",
        description: "Your listing has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/listings?userId=${userId}`] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting listing",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const handleDelete = (listingId: number) => {
    if (confirm("Are you sure you want to delete this listing?")) {
      deleteListingMutation.mutate(listingId);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">My Listings</h2>
        <Button onClick={() => setCreateListingOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create New Listing
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : listings && listings.length > 0 ? (
        <div className="space-y-4">
          {listings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="w-full sm:w-48 h-48 sm:h-auto">
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <CardContent className="flex-1 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-lg">{listing.title}</h3>
                        <Badge variant={listing.status === "active" ? "default" : "secondary"}>
                          {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-green-600 font-bold mt-1">${listing.price.toFixed(2)}</p>
                      <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                        {listing.description}
                      </p>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <i className="ri-more-2-fill"></i>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/listing/${listing.id}`} className="cursor-pointer">
                            View Listing
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600 cursor-pointer"
                          onClick={() => handleDelete(listing.id)}
                        >
                          Delete Listing
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                    <span>Posted {new Date(listing.createdAt).toLocaleDateString()}</span>
                    
                    {listing.location && (
                      <div className="flex items-center">
                        <i className="ri-map-pin-line mr-1"></i>
                        <span>{listing.location}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <i className="ri-shopping-bag-line text-2xl text-primary"></i>
              </div>
              <h3 className="text-lg font-medium mb-2">No listings yet</h3>
              <p className="text-gray-500 max-w-md mb-6">
                You haven't created any listings yet. Start selling your items to other students on campus.
              </p>
              <Button onClick={() => setCreateListingOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Your First Listing
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <CreateListingModal open={createListingOpen} onOpenChange={setCreateListingOpen} />
    </div>
  );
}
