// src/pages/GoogleAuthCallback.tsx

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const GoogleAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Connecting to Google Calendar...");

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const error = searchParams.get("error");

      if (error) {
        setStatus("error");
        setMessage("Authorization cancelled or failed");
        setTimeout(() => navigate("/unit-dashboard"), 3000);
        return;
      }

      if (!code) {
        setStatus("error");
        setMessage("No authorization code received");
        setTimeout(() => navigate("/unit-dashboard"), 3000);
        return;
      }

      try {
        // Exchange code for tokens
        const tokenResponse = await fetch(
          "https://oauth2.googleapis.com/token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              code,
              client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
              client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
              redirect_uri: `${window.location.origin}/auth/google/callback`,
              grant_type: "authorization_code",
            }),
          }
        );

        if (!tokenResponse.ok) {
          throw new Error("Failed to exchange authorization code");
        }

        const tokens = await tokenResponse.json();

        // Store tokens in database
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("User not authenticated");
        }

        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            google_access_token: tokens.access_token,
            google_refresh_token: tokens.refresh_token,
          })
          .eq("id", user.id);

        if (updateError) {
          throw updateError;
        }

        setStatus("success");
        setMessage("Google Calendar connected successfully!");
        setTimeout(() => navigate("/unit-dashboard"), 2000);
      } catch (error) {
        console.error("Error handling Google auth callback:", error);
        setStatus("error");
        setMessage("Failed to connect Google Calendar");
        setTimeout(() => navigate("/unit-dashboard"), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        {status === "loading" && (
          <>
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
            <p className="text-lg font-medium">{message}</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="w-12 h-12 mx-auto rounded-full bg-green-100 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-lg font-medium text-green-600">{message}</p>
            <p className="text-sm text-muted-foreground">Redirecting...</p>
          </>
        )}
        {status === "error" && (
          <>
            <div className="w-12 h-12 mx-auto rounded-full bg-red-100 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <p className="text-lg font-medium text-red-600">{message}</p>
            <p className="text-sm text-muted-foreground">Redirecting...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default GoogleAuthCallback;
