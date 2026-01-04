"use client";

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Loader2, AlertCircle, Info } from "lucide-react";
import Button from "../atoms/Button/Button";
import TextField from "../atoms/TextField";
import Modal from "../atoms/Modal";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignIn: () => void;
}

export function SignUpModal({
  isOpen,
  onClose,
  onSwitchToSignIn,
}: SignUpModalProps) {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [accountExistsMessage, setAccountExistsMessage] = useState("");

  // Verification state
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setIsLoading(true);
    setError("");
    setAccountExistsMessage("");

    try {
      await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
      });

      // Send verification email
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
    } catch (err: any) {
      console.error("Sign up error:", err);

      // Check if error is about existing account
      const errorMessage = err.errors?.[0]?.message || "";
      const errorCode = err.errors?.[0]?.code || "";

      if (
        errorMessage.toLowerCase().includes("account") ||
        errorCode === "form_identifier_exists" ||
        errorCode === "external_account_exists"
      ) {
        // Account exists - switch to sign in
        setAccountExistsMessage(
          "Looks like you already have an account. Please sign in instead."
        );
        setTimeout(() => {
          onSwitchToSignIn();
        }, 2000);
      } else {
        setError(errorMessage || "Failed to create account");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setIsLoading(true);
    setError("");

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        onClose();
        router.push("/campaigns");
      }
    } catch (err: any) {
      console.error("Verification error:", err);
      setError(err.errors?.[0]?.message || "Invalid verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (!isLoaded) return;

    setIsLoading(true);
    setError("");
    setAccountExistsMessage("");

    try {
      // Use absolute URL for OAuth redirect
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: `${window.location.origin}/sso-callback`,
        redirectUrlComplete: `${window.location.origin}/campaigns`,
      });
    } catch (err: any) {
      console.error("Google sign up error:", err);

      // Check if error is about existing account
      const errorMessage = err.errors?.[0]?.message || "";
      const errorCode = err.errors?.[0]?.code || "";

      if (
        errorMessage.toLowerCase().includes("account") ||
        errorMessage.toLowerCase().includes("exists") ||
        errorCode === "external_account_exists"
      ) {
        // Account exists - switch to sign in
        setAccountExistsMessage(
          "Looks like you already have an account. Switching to sign in..."
        );
        setTimeout(() => {
          onSwitchToSignIn();
        }, 2000);
      } else {
        setError(errorMessage || "Failed to sign up with Google");
      }

      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={pendingVerification ? "Verify Your Email" : "Create Your Account"}
      subtitle={
        pendingVerification
          ? `We sent a code to ${email}`
          : "Join Elaview to start advertising"
      }
    >
      {!pendingVerification ? (
        <form onSubmit={handleEmailSignUp} className="space-y-6">
          {/* Account Exists Message */}
          {accountExistsMessage && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-start space-x-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-400 font-medium">
                  {accountExistsMessage}
                </p>
                <p className="text-xs text-blue-300/70 mt-1">
                  Redirecting in a moment...
                </p>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {error && !accountExistsMessage && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Google Sign Up */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={isLoading || !!accountExistsMessage}
            className="w-full bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                <span>Checking account...</span>
              </>
            ) : (
              <>
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
              </>
            )}
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

          {/* Name Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="First name"
              htmlFor="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              icon={User}
              placeholder="John"
              disabled={isLoading || !!accountExistsMessage}
              required
              id="firstName"
            />

            <TextField
              htmlFor="lastName"
              label="Last name"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              disabled={isLoading || !!accountExistsMessage}
              placeholder="Doe"
            />
          </div>

          {/* Email Input */}

          <TextField
            htmlFor="email"
            label="Email address"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading || !!accountExistsMessage}
            placeholder="john@example.com"
            icon={Mail}
          />

          {/* Password Input */}

          <TextField
            htmlFor="password"
            label="Password"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            disabled={isLoading || !!accountExistsMessage}
            placeholder="Min. 8 characters"
            icon={Lock}
          />

          {/* Submit Button */}

          <Button
            variant="submitGradientWithGlow"
            buttonType="submit"
            disabled={isLoading || !!accountExistsMessage}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </Button>

          {/* Sign In Link this should be link not button */}
          <div className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToSignIn}
              disabled={isLoading}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sign in
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerification} className="space-y-6">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Verification Code Input */}
          <TextField
            htmlFor="code"
            label="Verification"
            id="code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            maxLength={6}
            placeholder="000000"
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
                <span>Verifying...</span>
              </>
            ) : (
              <span>Verify Email</span>
            )}
          </button>

          {/* Resend Link */}
          <div className="text-center text-sm text-gray-400">
            Didn't receive a code?{" "}
            <button
              type="button"
              onClick={() =>
                signUp?.prepareEmailAddressVerification({
                  strategy: "email_code",
                })
              }
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Resend
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
