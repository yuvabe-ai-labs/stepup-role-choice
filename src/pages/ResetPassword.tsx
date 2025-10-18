import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import signupIllustration from "@/assets/signup-illustration.png";
import { Eye, EyeOff, Check, X } from "lucide-react";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there's a recovery token in the URL hash
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get("access_token");
    const type = hashParams.get("type");

    if (accessToken && type === "recovery") {
      setHasToken(true);
    } else {
      setError("Invalid or expired reset link. Please request a new one.");
      setTimeout(() => {
        navigate("/forgot-password");
      }, 3000);
    }
  }, [navigate]);

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const passwordsMatch = newPassword === confirmPassword && confirmPassword !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!validatePassword(newPassword)) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        if (updateError.message.includes("same")) {
          setError("New password must be different from your current password");
        } else {
          setError(updateError.message);
        }
        setLoading(false);
        return;
      }

      setSuccess(true);
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      });

      setTimeout(() => {
        navigate("/auth/student/signin");
      }, 2000);
    } catch (err) {
      console.error("Error:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  if (!hasToken && !error) {
    return null;
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-medium mb-2" style={{ color: "#1F2A37" }}>
            Password Updated Successfully!
          </h2>
          <p className="text-sm" style={{ color: "#9CA3AF" }}>
            Redirecting to sign in...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Illustration */}
      <div className="flex-1 hidden lg:flex items-center justify-center bg-gray-50">
        <div className="max-w-lg">
          <img src={signupIllustration} alt="Reset Password Illustration" className="w-full h-auto" />
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
                Reset Password
              </h1>
              <p
                className="text-[12px] leading-[15px]"
                style={{
                  color: "#9CA3AF",
                  fontFamily: "'Neue Haas Grotesk Text Pro', system-ui, sans-serif",
                }}
              >
                Enter your new password below
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-red-600" style={{ fontFamily: "'Neue Haas Grotesk Text Pro', system-ui, sans-serif" }}>
                  {error}
                </p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className="block text-[12px] mb-2" style={{ color: "#4B5563" }}>
                  New Password
                </label>
                <div className="border border-[#D1D5DB] rounded-lg h-8 px-4 flex items-center">
                  <input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setError("");
                    }}
                    className="w-full text-[12px] outline-none bg-transparent placeholder-[#9CA3AF]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-[12px] mb-2" style={{ color: "#4B5563" }}>
                  Confirm Password
                </label>
                <div className="border border-[#D1D5DB] rounded-lg h-8 px-4 flex items-center">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError("");
                    }}
                    className="w-full text-[12px] outline-none bg-transparent placeholder-[#9CA3AF]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full flex items-center justify-center ${validatePassword(newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}>
                    {validatePassword(newPassword) && <Check size={8} className="text-white" />}
                  </div>
                  <p className="text-[10px]" style={{ color: validatePassword(newPassword) ? "#10B981" : "#9CA3AF" }}>
                    At least 8 characters
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full flex items-center justify-center ${passwordsMatch ? 'bg-green-500' : 'bg-gray-300'}`}>
                    {passwordsMatch && <Check size={8} className="text-white" />}
                  </div>
                  <p className="text-[10px]" style={{ color: passwordsMatch ? "#10B981" : "#9CA3AF" }}>
                    Passwords match
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !validatePassword(newPassword) || !passwordsMatch}
                className="w-full h-[30px] rounded-lg flex items-center justify-center text-[12px] font-medium text-white hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: "#76A9FA" }}
              >
                {loading ? "Updating..." : "Reset Password"}
              </button>

              {/* Back to Sign In */}
              <button
                type="button"
                onClick={() => navigate("/auth/student/signin")}
                className="w-full h-[30px] rounded-lg flex items-center justify-center text-[12px] font-medium border border-[#D1D5DB] hover:bg-gray-50 transition-colors"
                style={{ color: "#76A9FA" }}
              >
                Back to Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
