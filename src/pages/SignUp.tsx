import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle } from 'lucide-react';
import signupIllustration from '@/assets/signup-illustration.png';

const SignUp = () => {
  const { role } = useParams<{ role: string }>();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithOAuth } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Password validation rules
  const passwordRules = [
    { test: (p: string) => /[a-z]/.test(p), label: 'one lowercase character' },
    { test: (p: string) => /[A-Z]/.test(p), label: 'one uppercase character' },
    { test: (p: string) => /\d/.test(p), label: 'one number' },
    { test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p), label: 'one special character' },
    { test: (p: string) => p.length >= 8, label: '8 character minimum' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password
    const isPasswordValid = passwordRules.every(rule => rule.test(password));
    if (!isPasswordValid) {
      toast({
        title: "Password requirements not met",
        description: "Please ensure your password meets all requirements.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await signUp(email, password, fullName, role || 'student');

    if (error) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account created successfully!",
        description: "Please check your email to verify your account then sign in to continue.",
      });
      navigate(`/auth/${role}/signin`);
    }

    setLoading(false);
  };

  const handleOAuthSignUp = async (provider: 'google' | 'apple') => {
    const { error } = await signInWithOAuth(provider);
    if (error) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Mobile-first: Stack vertically on mobile, side-by-side on desktop */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side - Illustration (hidden on mobile, shown on desktop) */}
        <div className="hidden lg:block lg:w-[634px] lg:flex-shrink-0 relative">
          <img 
            src={signupIllustration} 
            alt="Signup Illustration" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-0">
          <div className="w-full max-w-[474px] bg-white shadow-[0px_2px_25px_rgba(0,0,0,0.15)] rounded-[15px] p-6 sm:p-12 mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-[20px] font-medium leading-[35px] text-signup-text-primary mb-2">
                Create your account
              </h1>
              <p className="text-[12px] leading-[15px] text-signup-text-muted">
                Please enter your details below
              </p>
            </div>

            {/* OAuth Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Button
                variant="signup"
                className="flex-1 h-8 text-[10px] font-medium"
                onClick={() => handleOAuthSignUp('google')}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" className="rounded-sm mr-2">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC04" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
              
              <Button
                variant="signup"
                className="flex-1 h-8 text-[10px] font-medium"
                onClick={() => handleOAuthSignUp('apple')}
              >
                <svg width="13" height="16" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Sign in with Apple
              </Button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="flex items-center">
                <div className="flex-1 h-px bg-signup-border"></div>
                <span className="px-3 text-[10px] text-signup-text-muted">or</span>
                <div className="flex-1 h-px bg-signup-border"></div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <Label htmlFor="fullName" className="block text-[12px] text-signup-text-secondary mb-2">
                  Full Name *
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-8 border-[0.5px] border-signup-border rounded-lg px-[15px] py-[10px] text-[10px] placeholder:text-signup-text-muted"
                  required
                />
              </div>

              {/* Email Address */}
              <div>
                <Label htmlFor="email" className="block text-[12px] text-signup-text-secondary mb-2">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-[34px] border-[0.5px] border-signup-border rounded-lg px-[15px] py-[10px] text-[10px] placeholder:text-signup-text-muted"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password" className="block text-[12px] text-signup-text-secondary mb-2">
                  Password *
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-[34px] border-[0.5px] border-signup-border rounded-lg px-[15px] py-[10px] text-[10px] placeholder:text-signup-text-muted"
                  required
                />

                {/* Password Strength Checker */}
                {password && (
                  <div className="mt-4 space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                      {passwordRules.map((rule, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle 
                            className="w-[9px] h-[9px] text-emerald-500"
                            style={{ color: rule.test(password) ? '#10B981' : '#D9D9D9' }}
                          />
                          <span className="text-[10px] leading-[10px] text-signup-text-muted">
                            {rule.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sign Up Button */}
              <Button
                type="submit"
                variant="signup-primary"
                className="w-full h-[30px] text-[12px] font-medium mt-6"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Sign up"}
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="text-center mt-6">
              <p className="text-[12px] text-signup-text-muted">
                Already have an account?{" "}
                <Link
                  to="/signin"
                  className="text-signup-link font-medium hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;