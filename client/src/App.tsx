import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import ListingPage from "@/pages/listing-page";
import CreateListingPage from "@/pages/create-listing-page";
import ProfilePage from "@/pages/profile-page";
import MessagesPage from "@/pages/messages-page";
import HelpCenterPage from "@/pages/help-center-page";
import SafetyTipsPage from "@/pages/safety-tips-page";
import TermsOfServicePage from "@/pages/terms-of-service-page";
import PrivacyPolicyPage from "@/pages/privacy-policy-page";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import Layout from "./components/layout/layout";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/listing/:id" component={ListingPage} />
        <ProtectedRoute path="/create-listing" component={CreateListingPage} />
        <ProtectedRoute path="/profile" component={ProfilePage} />
        <ProtectedRoute path="/messages" component={MessagesPage} />
        <Route path="/helpCenter" component={HelpCenterPage} />
        <Route path="/safetyTips" component={SafetyTipsPage} />
        <Route path="/termsOfService" component={TermsOfServicePage} />
        <Route path="/privacyPolicy" component={PrivacyPolicyPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
