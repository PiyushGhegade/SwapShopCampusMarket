import { useState } from "react";
import { useLocation as useRouterLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import ProfileInfo from "@/components/profile/profile-info";
import UserListings from "@/components/profile/user-listings";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const [location, navigate] = useRouterLocation();
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  
  // Get the active tab from URL query param or default to "profile"
  const params = new URLSearchParams(location.split('?')[1]);
  const defaultTab = params.get('tab') || "profile";
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update the URL without reloading the page
    const newParams = new URLSearchParams();
    newParams.set('tab', value);
    navigate(`/profile?${newParams.toString()}`, { replace: true });
  };

  const handleLogout = () => {
    logoutMutation.mutate();
    navigate("/");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold mb-1">My Profile</h1>
            <p className="text-gray-500">Manage your account and listings</p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout} 
            className="mt-4 sm:mt-0"
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing out...</>
            ) : (
              "Sign out"
            )}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <ProfileInfo user={user} />
          </TabsContent>
          
          <TabsContent value="listings">
            <UserListings userId={user.id} />
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-medium mb-6">Account Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Email Notifications</h3>
                  <p className="text-gray-500 mb-4">Choose which types of emails you'd like to receive</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="new-messages"
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        defaultChecked
                      />
                      <label htmlFor="new-messages" className="ml-2 block text-sm text-gray-700">
                        New messages
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="listing-activity"
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        defaultChecked
                      />
                      <label htmlFor="listing-activity" className="ml-2 block text-sm text-gray-700">
                        Activity on my listings
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="campus-updates"
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        defaultChecked
                      />
                      <label htmlFor="campus-updates" className="ml-2 block text-sm text-gray-700">
                        Campus marketplace updates
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Privacy</h3>
                  <p className="text-gray-500 mb-4">Manage your privacy settings</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="show-location"
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        defaultChecked
                      />
                      <label htmlFor="show-location" className="ml-2 block text-sm text-gray-700">
                        Show my campus location on listings
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="online-status"
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        defaultChecked
                      />
                      <label htmlFor="online-status" className="ml-2 block text-sm text-gray-700">
                        Show when I'm online
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-red-600 mb-2">Danger Zone</h3>
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      toast({
                        title: "This is just a demo",
                        description: "Account deletion is not implemented in this demo",
                      });
                    }}
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
