import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role: string
  ) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  signInWithOAuth: (provider: "google" | "apple") => Promise<{ error: any }>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST - keep it synchronous
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handle profile operations in a separate effect to avoid deadlock
  useEffect(() => {
    const handleProfileOperations = async () => {
      if (!user || !session) return;

      try {
        console.log("Checking profile for user:", user.id);

        // Check if profile exists
        const { data: existingProfile, error: fetchError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (fetchError) {
          console.error("Error fetching profile:", fetchError);
          toast({
            title: "Profile check failed",
            description: "There was an error checking your profile.",
            variant: "destructive",
          });
          return;
        }

        // If no profile exists, create one
        if (!existingProfile) {
          console.log("No profile found, creating profile...");

          const userData = user.user_metadata;
          const pendingRole = localStorage.getItem("pendingRole");
          const userRole = userData.role || pendingRole || "student";
          const fullName =
            userData.full_name ||
            userData.name ||
            user.email?.split("@")[0] ||
            "User";
          const email = user.email || "";

          // Clear pending role
          if (pendingRole) {
            localStorage.removeItem("pendingRole");
          }

          const { data: newProfile, error: profileError } = await supabase
            .from("profiles")
            .insert({
              user_id: user.id,
              full_name: fullName,
              role: userRole,
              email: email,
              onboarding_completed: false,
            })
            .select()
            .single();

          if (profileError) {
            console.error("Profile creation failed:", profileError);
            toast({
              title: "Profile setup failed",
              description:
                "There was an error setting up your profile. Please contact support.",
              variant: "destructive",
            });
          } else {
            console.log("Profile created successfully:", newProfile);
            toast({
              title: "Welcome!",
              description: "Your account has been set up successfully.",
            });
          }
        } else {
          console.log("Profile already exists:", existingProfile);
        }
      } catch (error) {
        console.error("Profile operation failed:", error);
      }
    };

    // Defer profile operations to avoid blocking auth state changes
    if (user && session) {
      const timeoutId = setTimeout(handleProfileOperations, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [user, session, toast]);

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: string
  ) => {
    try {
      console.log("Starting signup process for:", email, "with role:", role);
      // Redirect to role-specific signin page after email confirmation
      const redirectUrl = `${window.location.origin}/auth/${role}/signin`;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });

      if (error) {
        console.error("Signup error:", error);
        return { error };
      }

      // Don't create profile immediately - will be created on first sign in
      console.log(
        "User signup initiated, profile will be created on email confirmation"
      );

      return { error: null };
    } catch (error: any) {
      console.error("Signup process failed:", error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error);
        // Handle specific error for unconfirmed email
        if (error.message.includes("Email not confirmed")) {
          return {
            error: {
              ...error,
              message:
                "Please check your email and click the confirmation link before signing in.",
            },
          };
        }
      }

      return { error };
    } catch (error: any) {
      console.error("Sign in failed:", error);
      return { error };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error };
    } catch (error: any) {
      return { error };
    }
  };

  const signInWithOAuth = async (provider: "google" | "apple") => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      return { error };
    } catch (error: any) {
      console.error("OAuth sign in failed:", error);
      return { error };
    }
  };

  const value = {
    user,
    session,
    signUp,
    signIn,
    signOut,
    resetPassword,
    signInWithOAuth,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
