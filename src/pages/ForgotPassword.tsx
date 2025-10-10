import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import signupIllustration from "@/assets/signup-illustration.png";
import { ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Check if user exists in auth.users
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('email', email)
        .maybeSingle();

      if (profileError) {
        console.error('Error checking user:', profileError);
      }

      if (!profiles) {
        setError("User not found. Please enter the correct email address.");
        setLoading(false);
        return;
      }

      // Send password reset email
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        toast({
          title: "Error",
          description: resetError.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Navigate to check email page
      navigate("/check-email", { state: { email } });
    } catch (err) {
      console.error('Error:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Illustration */}
      <div className="flex-1 hidden lg:flex items-center justify-center bg-gray-50">
        <div className="max-w-lg">
          <img src={signupIllustration} alt="Forgot Password Illustration" className="w-full h-auto" />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center bg-white px-6">
        <div className="w-full max-w-[474px]">
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
                  fontFamily: "'Neue Haas Grotesk Text Pro', system-ui, sans-serif",
                }}
              >
                Forgot Password?
              </h1>
              <p
                className="text-[12px] leading-[15px]"
                style={{
                  color: "#9CA3AF",
                  fontFamily: "'Neue Haas Grotesk Text Pro', system-ui, sans-serif",
                }}
              >
                Don't worry, we will send you reset instruction
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-[12px] mb-2" style={{ color: "#4B5563" }}>
                  Email
                </label>
                <div className={`border ${error ? 'border-red-500' : 'border-[#D1D5DB]'} rounded-lg h-8 px-4 flex items-center`}>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    className="w-full text-[12px] outline-none bg-transparent placeholder-[#9CA3AF]"
                    required
                  />
                </div>
                {error && (
                  <p className="text-[10px] text-red-500 mt-1" style={{ fontFamily: "'Neue Haas Grotesk Text Pro', system-ui, sans-serif" }}>
                    {error}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[30px] rounded-lg flex items-center justify-center text-[12px] font-medium text-white hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: "#76A9FA" }}
              >
                {loading ? "Sending..." : "Send Password Reset Link"}
              </button>

              {/* Back to Sign In */}
              <Link
                to="/auth/student/signin"
                className="w-full h-[30px] rounded-lg flex items-center justify-center text-[12px] font-medium border border-[#D1D5DB] hover:bg-gray-50 transition-colors gap-2"
                style={{ color: "#76A9FA" }}
              >
                <ArrowLeft size={14} />
                Back to Sign In page
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
