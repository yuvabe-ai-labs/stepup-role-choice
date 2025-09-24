import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import stepupIllustration from '@/assets/stepup-illustration.png';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      navigate('/dashboard');
    }

    setLoading(false);
  };

  const handleOAuthSignIn = async (provider: 'google' | 'apple') => {
    const { error } = await signInWithOAuth(provider);
    if (error) {
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

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Mobile-first: Stack vertically on mobile, side-by-side on desktop */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side - Illustration (hidden on mobile, shown on desktop) */}
        <div className="hidden lg:block lg:w-[634px] lg:flex-shrink-0 relative bg-white border-r">
          <div className="absolute inset-0 flex items-center justify-center">
            <img 
              src={stepupIllustration} 
              alt="StepUp Dashboard Illustration" 
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>

        {/* Right Side - Sign In Form */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-0 bg-white">
          <div className="w-full max-w-[463.5px] bg-white shadow-[0px_2px_25px_rgba(0,0,0,0.15)] rounded-[15px] px-20 py-[60px] mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-[20px] font-medium leading-[35px] text-signup-text-primary mb-[5px]">
                Sign in to your Account
              </h1>
              <p className="text-[12px] leading-[15px] text-signup-text-muted">
                Welcome back! Please enter your details
              </p>
            </div>

            {/* OAuth Buttons */}
            <div className="flex gap-[10px] mb-6">
              <Button
                variant="signup"
                className="flex-1 h-8 text-[10px] font-medium border-[0.5px] border-signup-border"
                onClick={() => handleOAuthSignIn('google')}
              >
                <svg className="w-[15px] h-[17px] mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
              <Button
                variant="signup"
                className="flex-1 h-8 text-[10px] font-medium border-[0.5px] border-signup-border"
                onClick={() => handleOAuthSignIn('apple')}
              >
                <svg className="w-[13px] h-[16px] mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Sign in with Apple
              </Button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="flex items-center">
                <div className="flex-1 h-px bg-[#E9E9E9]"></div>
                <span className="px-3 text-[10px] text-[#B9B9B9]">or</span>
                <div className="flex-1 h-px bg-[#E9E9E9]"></div>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-[15px]">
              <div>
                <Label htmlFor="email" className="block text-[14px] leading-[11px] text-signup-text-secondary mb-[10px]">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-8 border-[0.5px] border-signup-border rounded-lg px-[15px] py-[10px] text-[12px] placeholder:text-[#E5E7EB]"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="block text-[14px] leading-[11px] text-signup-text-secondary mb-[10px]">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-[34px] border-[0.5px] border-signup-border rounded-lg px-[15px] py-[10px] text-[12px] placeholder:text-[#E5E7EB] pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-[10px] w-[10px] text-[#E5E7EB]" />
                    ) : (
                      <Eye className="h-[10px] w-[10px] text-[#E5E7EB]" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="keep-logged-in"
                    checked={keepLoggedIn}
                    onCheckedChange={(checked) => setKeepLoggedIn(checked as boolean)}
                    className="w-[14px] h-[14px] border-[0.7px] border-signup-border rounded-[2px]"
                  />
                  <Label htmlFor="keep-logged-in" className="text-[12px] leading-[11px] text-[#6B7280]">
                    Keep me logged in
                  </Label>
                </div>
                <Button
                  type="button"
                  variant="link"
                  className="px-0 text-[12px] leading-[11px] text-signup-link h-auto p-0"
                  onClick={handleForgotPassword}
                >
                  Forgot password?
                </Button>
              </div>

              <Button 
                type="submit" 
                variant="signup-primary"
                className="w-full h-[30px] text-[12px] leading-[15px] font-medium mt-[25px] bg-signup-button text-white rounded-lg" 
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Sign up link */}
            <div className="text-center mt-[30px]">
              <p className="text-[14px] leading-[16px] text-signup-text-muted">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-signup-link font-medium hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;