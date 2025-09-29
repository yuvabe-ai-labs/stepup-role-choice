import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff, GraduationCap, Building } from "lucide-react";
import signupIllustration from "@/assets/signup-illustration.png";
import { sign } from "crypto";

const SignIn = () => {
  const { role } = useParams<{ role: string }>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithOAuth } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      navigate("/dashboard");
    }

    setLoading(false);
  };

  const handleOAuthSignIn = async (provider: "google" | "apple") => {
    // Store the role for profile creation if it doesn't exist
    if (role) {
      localStorage.setItem("pendingRole", role);
    }

    const { error } = await signInWithOAuth(provider);
    if (error) {
      localStorage.removeItem("pendingRole"); // Clean up on error
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address first.",
        variant: "destructive",
      });
      return;
    }

    // This would trigger password reset
    toast({
      title: "Password reset email sent",
      description: "Check your email for password reset instructions.",
    });
  };

  const roleIcon = role === "student" ? GraduationCap : Building;
  const RoleIcon = roleIcon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-muted">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left Side - Illustration */}
          <div className="hidden lg:block">
            <div className="relative">
              <img
                src={signupIllustration}
                alt="StepUp Illustration"
                className="w-full h-auto rounded-2xl shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent rounded-2xl"></div>
            </div>
          </div>

          {/* Right Side - Sign In Form */}
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
              <Link
                to="/"
                className="inline-flex items-center space-x-2 text-2xl font-bold text-primary mb-6"
              >
                <span>StepUp</span>
              </Link>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <RoleIcon className="w-6 h-6 text-primary" />
                <span className="text-lg font-medium capitalize text-muted-foreground">
                  {role}
                </span>
              </div>
            </div>

            <Card className="shadow-xl border-0">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold">
                  Sign in to your StepUp Account
                </CardTitle>
                <p className="text-muted-foreground mt-2">
                  Welcome back! Please enter your details
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* OAuth Buttons */}
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full h-12"
                    onClick={() => handleOAuthSignIn("google")}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-12"
                    onClick={() => handleOAuthSignIn("apple")}
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                    Continue with Apple
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      or
                    </span>
                  </div>
                </div>

                {/* Email/Password Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="keep-logged-in"
                        checked={keepLoggedIn}
                        onCheckedChange={(checked) =>
                          setKeepLoggedIn(checked as boolean)
                        }
                      />
                      <Label htmlFor="keep-logged-in" className="text-sm">
                        Keep me logged in
                      </Label>
                    </div>
                    <Button
                      type="button"
                      variant="link"
                      className="px-0 text-sm"
                      onClick={handleForgotPassword}
                    >
                      Forgot password?
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link
                      to={`/auth/${role}/signup`}
                      className="font-medium text-primary hover:underline"
                    >
                      Sign up
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
