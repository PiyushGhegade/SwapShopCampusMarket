import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth, userFormSchema } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Loader2 } from "lucide-react";

type LoginFormValues = {
  email: string;
  password: string;
  rememberMe: boolean;
};

type RegisterFormValues = z.infer<typeof userFormSchema>;

const loginFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional()
});

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const { user, loginMutation, registerMutation, isLoading } = useAuth();
  
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false
    }
  });
  
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      displayName: "",
      location: ""
    }
  });
  
  const onLoginSubmit = (values: LoginFormValues) => {
    loginMutation.mutate({
      email: values.email,
      password: values.password
    });
  };
  
  const onRegisterSubmit = (values: RegisterFormValues) => {
    registerMutation.mutate(values);
  };
  
  // Redirect if user is already logged in
  if (user) {
    return <Redirect to="/" />;
  }
  
  return (
    <div className="flex min-h-screen">
      {/* Left side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center">
              {/* <i className="ri-store-2-fill text-primary text-3xl mr-2"></i> */}
              <i className="ri-shopping-cart-line  text-primary text-3xl mr-2"></i>
              <h1 className="text-2xl font-bold text-primary">SWAP SHOP</h1>
            </div>
            <p className="text-gray-500 mt-2">Buy and sell items within your IIT Patna community</p>
          </div>
          
          <Tabs defaultValue="signin" value={activeTab} onValueChange={(value) => setActiveTab(value as "signin" | "signup")}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>College Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your.name_your.rollno.@iitp.ac.in" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex items-center justify-between">
                    <FormField
                      control={loginForm.control}
                      name="rememberMe"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox 
                              checked={field.value} 
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal cursor-pointer">
                            Remember me
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <a href="#" className="text-sm font-medium text-primary hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="signup">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Choose a username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>College Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your.name_your_rollno.@iitp.ac.in" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="displayName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Name (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Campus Location (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Aryabhatta , A406" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...</>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Only students with verified @iitp.ac.in emails can join.</p>
          </div>
        </div>
      </div>
      
      {/* Right side - Hero Image */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-r from-[#4285F4] to-blue-600">
        <div className="flex flex-col justify-center items-center h-full px-8 text-white">
          <h2 className="text-3xl font-bold mb-6">The Student Marketplace</h2>
          <div className="max-w-md">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-4">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                  <i className="ri-exchange-dollar-line text-xl"></i>
                </div>
                <h3 className="font-semibold">Buy & Sell with Ease</h3>
              </div>
              <p className="text-sm opacity-90">Find great deals on textbooks, furniture, electronics, and more from fellow students.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-4">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                  <i className="ri-shield-check-line text-xl"></i>
                </div>
                <h3 className="font-semibold">Campus Community</h3>
              </div>
              <p className="text-sm opacity-90">Trade safely with verified students from your college. No outside sellers.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                  <i className="ri-chat-1-line text-xl"></i>
                </div>
                <h3 className="font-semibold">Direct Messaging</h3>
              </div>
              <p className="text-sm opacity-90">Communicate directly with buyers and sellers to arrange meetings on campus.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
