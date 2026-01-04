"use client";

import { useState } from "react";
import { useSignIn, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Modal } from "./Modal";
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import TextField from "../atoms/TextField";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignUp: () => void;
}

export function SignInModal({
  isOpen,
  onClose,
  onSwitchToSignUp,
}: SignInModalProps) {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { signOut } = useClerk();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setIsLoading(true);
    setError("");

    try {
      // CRITICAL FIX: Clear any stale sessions before email sign-in
      try {
        await signOut();
      } catch (signOutError) {
        // Ignore errors if no session exists
        console.log("No existing session to clear (expected)");
      }

      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        onClose();
        router.push("/campaigns");
      }
    } catch (err: any) {
      console.error("Sign in error:", err);
      setError(err.errors?.[0]?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isLoaded) return;

    setIsLoading(true);
    setError("");

    try {
      // CRITICAL FIX: Clear any stale sessions before Google OAuth
      // This prevents "Session already exists" errors from Clerk
      try {
        await signOut();
      } catch (signOutError) {
        // Ignore errors if no session exists - this is fine
        console.log("No existing session to clear (expected)");
      }

      // Use absolute URL for OAuth redirect
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: `${window.location.origin}/sso-callback`,
        redirectUrlComplete: `${window.location.origin}/campaigns`,
      });
    } catch (err: any) {
      console.error("Google sign in error:", err);
      setError(err.errors?.[0]?.message || "Failed to sign in with Google");
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Welcome Back"
      subtitle="Sign in to continue to Elaview"
    >
      <form onSubmit={handleEmailSignIn} className="space-y-6">
        {/* Error Alert */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Google Sign In */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-slate-900 text-gray-400">or</span>
          </div>
        </div>

        <TextField
          label="Email address"
          htmlFor="email"
          icon={Mail}
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter your email"
        />
        <TextField
          label="Password"
          htmlFor="password"
          icon={Lock}
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Enter your password"
        />
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-3 px-4 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <span>Sign In</span>
          )}
        </button>

        {/* Sign Up Link */}
        <div className="text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToSignUp}
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            Sign up
          </button>
        </div>
      </form>
    </Modal>
  );
}
