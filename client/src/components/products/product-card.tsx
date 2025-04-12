import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { Listing } from "@shared/schema";

interface ProductCardProps {
  listing: Listing;
}

export default function ProductCard({ listing }: ProductCardProps) {
  // Get the time distance
  const timeAgo = formatDistanceToNow(new Date(listing.createdAt), { addSuffix: true });
  
  // Get the first image or use a placeholder
  const mainImage = listing.images && listing.images.length > 0 
    ? listing.images[0] 
    : "https://via.placeholder.com/300x200?text=No+Image";

  return (
    <Card className="overflow-hidden shadow-sm hover:shadow transition-shadow duration-200">
      <Link href={`/listing/${listing.id}`} className="block">
        <div className="aspect-w-1 aspect-h-1 w-full">
          <img 
            src={mainImage} 
            alt={listing.title} 
            className="h-48 w-full object-cover"
          />
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-medium text-gray-900 truncate">{listing.title}</h3>
            <span className="font-bold text-green-600">${listing.price.toFixed(2)}</span>
          </div>
          <p className="text-sm text-gray-500 mb-2 line-clamp-2">
            {listing.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Posted {timeAgo}</span>
            {listing.location && (
              <div className="flex items-center space-x-1">
                <i className="ri-map-pin-line text-xs text-gray-500"></i>
                <span className="text-xs text-gray-500">{listing.location}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
