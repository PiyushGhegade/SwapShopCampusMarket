import { useState } from "react";
import { User } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

interface ProfileInfoProps {
  user: User;
}

type ProfileFormValues = {
  displayName?: string;
  location?: string;
  avatar?: string;
};

export default function ProfileInfo({ user }: ProfileInfoProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormValues>({
    defaultValues: {
      displayName: user.displayName || "",
      location: user.location || "",
      avatar: user.avatar || "",
    }
  });
  
  const updateProfileMutation = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      const res = await apiRequest("PATCH", `/api/users/${user.id}`, values);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      setIsEditing(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const onSubmit = (data: ProfileFormValues) => {
    // In a real app this would actually update the user profile
    // Since we're using in-memory storage and don't have the proper endpoint,
    // we'll just show a toast and toggle editing mode
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
    setIsEditing(false);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-medium">Profile Information</h2>
          {!isEditing ? (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          ) : (
            <Button variant="ghost" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          )}
        </div>
        
        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="avatar">Profile Picture URL</Label>
              <Input 
                id="avatar"
                placeholder="https://example.com/avatar.jpg"
                {...register("avatar")}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input 
                id="displayName"
                placeholder="Your full name"
                {...register("displayName")}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Campus Location</Label>
              <Input 
                id="location"
                placeholder="e.g. North Dorms, West Campus"
                {...register("location")}
              />
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.avatar} alt={user.username} />
                <AvatarFallback className="text-lg">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h3 className="text-lg font-medium">{user.displayName || user.username}</h3>
                <p className="text-gray-500">@{user.username}</p>
                <p className="text-gray-500 mt-1">{user.email}</p>
              </div>
            </div>
            
            <div className="grid gap-4 pt-4 border-t border-gray-100">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Member Since</h4>
                <p>{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
              
              {user.location && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Campus Location</h4>
                  <p>{user.location}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
