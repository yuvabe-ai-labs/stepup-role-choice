import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle } from "lucide-react";
import signupIllustration from "@/assets/signup-illustration.png";
import { Eye, EyeOff } from "lucide-react";

const SignUp = () => {
  const { role } = useParams<{ role: string }>();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithOAuth } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // Password validation rules
  const passwordRules = [
    { test: (p: string) => /[a-z]/.test(p), label: "one lowercase character" },
    { test: (p: string) => /[A-Z]/.test(p), label: "one uppercase character" },
    { test: (p: string) => /\d/.test(p), label: "one number" },
    {
      test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p),
      label: "one special character",
    },
    { test: (p: string) => p.length >= 8, label: "8 character minimum" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password
    const isPasswordValid = passwordRules.every((rule) => rule.test(password));
    if (!isPasswordValid) {
      toast({
        title: "Password requirements not met",
        description: "Please ensure your password meets all requirements.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await signUp(
      email,
      password,
      fullName,
      role || "student"
    );

    if (error) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account created successfully!",
        description:
          "Please check your email to verify your account. Click the link to get started!",
      });
    }

    setLoading(false);
  };

  const handleOAuthSignUp = async (provider: "google" | "apple") => {
    // Store the role for profile creation after OAuth
    if (role) {
      localStorage.setItem("pendingRole", role);
    }

    const { error } = await signInWithOAuth(provider);
    if (error) {
      localStorage.removeItem("pendingRole"); // Clean up on error
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    }
    // Note: No navigation here - OAuth will handle redirect via auth callback
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Illustration */}
      <div className="flex-1 hidden lg:flex items-center justify-center bg-gray-50">
        <div className="max-w-lg">
          <img
            src={signupIllustration}
            alt="Signup Illustration"
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center bg-white px-6">
        <div className="w-full max-w-[474px]">
          {/* Card Container */}
          <div
            className="bg-white rounded-[15px] px-[87px] py-12 w-full"
            style={{ boxShadow: "0px 2px 25px rgba(0, 0, 0, 0.15)" }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h1
                className="text-[20px] font-medium leading-[35px] mb-2"
                style={{
                  color: "#1F2A37",
                  fontFamily:
                    "'Neue Haas Grotesk Text Pro', system-ui, -apple-system, sans-serif",
                }}
              >
                Create your account
              </h1>
              <p
                className="text-[12px] leading-[15px]"
                style={{
                  color: "#9CA3AF",
                  fontFamily:
                    "'Neue Haas Grotesk Text Pro', system-ui, -apple-system, sans-serif",
                }}
              >
                Please enter your details below
              </p>
            </div>
            {/* OAuth Buttons */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => handleOAuthSignUp("google")}
                className="flex-1 h-8 bg-white border border-[#D1D5DB] rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  className="rounded-sm"
                >
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC04"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span
                  className="text-[10px] font-medium"
                  style={{
                    color: "#1F2A37",
                    fontFamily:
                      "'Neue Haas Grotesk Text Pro', system-ui, -apple-system, sans-serif",
                  }}
                >
                  Google
                </span>
              </button>

              <button
                onClick={() => handleOAuthSignUp("apple")}
                className="flex-1 h-8 bg-white border border-[#D1D5DB] rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <svg width="13" height="16" viewBox="0 0 24 24" fill="black">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <span
                  className="text-[10px] font-medium"
                  style={{
                    color: "#1F2A37",
                    fontFamily:
                      "'Neue Haas Grotesk Text Pro', system-ui, -apple-system, sans-serif",
                  }}
                >
                  Sign up with Apple
                </span>
              </button>
            </div>
            {/* Divider */}
            <div className="flex items-center mb-6">
              <div className="flex-1 h-px bg-[#D1D5DB]"></div>
              <span
                className="px-3 text-[10px] leading-3"
                style={{
                  color: "#9CA3AF",
                  fontFamily: "'Lato', system-ui, -apple-system, sans-serif",
                }}
              >
                or
              </span>
              <div className="flex-1 h-px bg-[#D1D5DB]"></div>
            </div>
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-[12px] leading-[11px] mb-2"
                  style={{
                    color: "#4B5563",
                    fontFamily:
                      "'Neue Haas Grotesk Text Pro', system-ui, -apple-system, sans-serif",
                  }}
                >
                  Full Name *
                </label>
                <div className="border border-[#D1D5DB] rounded-lg h-8 px-4 flex items-center">
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Enter name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-[12px] leading-[11px] outline-none bg-transparent placeholder-[#9CA3AF]"
                    style={{
                      fontFamily:
                        "'Neue Haas Grotesk Text Pro', system-ui, -apple-system, sans-serif",
                    }}
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-[12px] leading-[11px] mb-2"
                  style={{
                    color: "#4B5563",
                    fontFamily:
                      "'Neue Haas Grotesk Text Pro', system-ui, -apple-system, sans-serif",
                  }}
                >
                  Email Address *
                </label>
                <div className="border border-[#D1D5DB] rounded-lg h-8 px-4 flex items-center">
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-[12px] leading-[11px] outline-none bg-transparent placeholder-[#9CA3AF]"
                    style={{
                      fontFamily:
                        "'Lato', system-ui, -apple-system, sans-serif",
                    }}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-[12px] mb-2"
                  style={{ color: "#4B5563" }}
                >
                  Password *
                </label>
                <div className="border border-[#D1D5DB] rounded-lg h-8 px-4 flex items-center gap-2">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-[12px] outline-none bg-transparent placeholder-[#9CA3AF]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#9CA3AF] hover:text-[#4B5563] transition-colors"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[30px] rounded-lg flex items-center justify-center text-[12px] font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50"
                style={{
                  backgroundColor: "#76A9FA",
                  fontFamily:
                    "'Neue Haas Grotesk Text Pro', system-ui, -apple-system, sans-serif",
                }}
              >
                {loading ? "Creating account..." : "Sign up"}
              </button>
            </form>
            {/* Sign In Link */}
            <div className="text-center mt-6">
              <span
                className="text-[12px] leading-4"
                style={{
                  color: "#9CA3AF",
                  fontFamily:
                    "'Neue Haas Grotesk Text Pro', system-ui, -apple-system, sans-serif",
                }}
              >
                Already have an account?{" "}
                <Link
                  to={`/auth/${role}/signin`}
                  className="text-[12px] leading-4 font-medium hover:underline"
                  style={{
                    color: "#3F83F8",
                    fontFamily:
                      "'Neue Haas Grotesk Text Pro', system-ui, -apple-system, sans-serif",
                  }}
                >
                  Sign In
                </Link>
              </span>
            </div>{" "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
