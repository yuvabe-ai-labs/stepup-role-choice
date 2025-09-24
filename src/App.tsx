import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Landing from "./pages/Landing";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Chatbot from "./pages/Chatbot";
import Internships from "./pages/Internships";
import Courses from "./pages/Courses";
import Units from "./pages/Units";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route component with onboarding check
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const [profileLoading, setProfileLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (user) {
        try {
          // Force fresh data by adding a timestamp to bypass cache
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('onboarding_completed')
            .eq('user_id', user.id)
            .maybeSingle();
          
          if (error) {
            console.error('Error fetching profile:', error);
            setProfileLoading(false);
            return;
          }
          
          const isOnboardingCompleted = profile?.onboarding_completed || false;
          setHasCompletedOnboarding(isOnboardingCompleted);
          
          // Only redirect if we're on the wrong page for the onboarding status
          if (!isOnboardingCompleted && location.pathname === '/dashboard') {
            navigate('/chatbot', { replace: true });
          }
          // Remove automatic redirect from chatbot to dashboard to prevent conflicts
          
        } catch (error) {
          console.error('Error checking onboarding status:', error);
        }
      }
      setProfileLoading(false);
    };

    if (!loading && user) {
      checkOnboardingStatus();
    } else {
      setProfileLoading(false);
    }
  }, [user, loading, location.pathname, navigate]);
  
  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-muted flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth/:role/signin" element={<SignIn />} />
            <Route path="/auth/:role/signup" element={<SignUp />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/chatbot" element={
              <ProtectedRoute>
                <Chatbot />
              </ProtectedRoute>
            } />
            <Route path="/internships" element={
              <ProtectedRoute>
                <Internships />
              </ProtectedRoute>
            } />
            <Route path="/courses" element={
              <ProtectedRoute>
                <Courses />
              </ProtectedRoute>
            } />
            <Route path="/units" element={
              <ProtectedRoute>
                <Units />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
