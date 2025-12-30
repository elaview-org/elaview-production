"use client";

import { useState } from 'react';
import { useSignIn, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Modal } from './Modal';
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Unified Authentication Modal for Elaview
 * G
 * This component handles BOTH sign-in and sign-up in a single flow.
 * 
 * KEY INSIGHT from Clerk documentation:
 * With OAuth (Google), there's NO difference between sign-in and sign-up.
 * Clerk automatically:
 * - Creates accounts for new users
 * - Signs in existing users
 * - Links accounts by email
 * - Handles the transfer flow between SignIn and SignUp objects
 * 
 * This is the modern SaaS standard (used by Notion, Linear, Vercel, etc.)
 */
export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signIn, isLoaded } = useSignIn();
  const { signOut } = useClerk();
  const router = useRouter();

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Email/Password Form States (optional, hidden by default)
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /**
   * Google OAuth Handler
   *
   * This single handler works for BOTH new and existing users.
   * Clerk's OAuth flow automatically handles:
   * - Account creation (if new user)
   * - Sign-in (if existing user)
   * - Account linking (if email matches existing account)
   * - Transfer between SignIn/SignUp flows
   *
   * No need for separate sign-in/sign-up buttons!
   *
   * FIX: Clear any existing stale sessions before starting OAuth
   * This prevents "Session already exists" errors when users have
   * old sessions in their browser cookies.
   */
  const handleGoogleAuth = async () => {
    if (!isLoaded) return;

    try {
      setIsLoading(true);
      setError('');

      // CRITICAL FIX: Clear any stale sessions before OAuth
      // This prevents "Session already exists" errors from Clerk
      try {
        await signOut();
      } catch (signOutError) {
        // Ignore errors if no session exists - this is fine
        console.log('No existing session to clear (expected)');
      }

      // This one call handles BOTH sign-in and sign-up
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: `${window.location.origin}/sso-callback`,
        redirectUrlComplete: `${window.location.origin}/campaigns`,
      });
    } catch (err: any) {
      console.error('OAuth error:', err);
      setError('Failed to connect with Google. Please try again.');
      setIsLoading(false);
    }
  };

  /**
   * Email/Password Handler (Optional)
   *
   * This is for users who prefer email/password.
   * We try to sign them in first. If the account doesn't exist,
   * we show a helpful message directing them to use Google to sign up.
   *
   * FIX: Clear any existing stale sessions before email sign-in
   */
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !email || !password) return;

    try {
      setIsLoading(true);
      setError('');

      // CRITICAL FIX: Clear any stale sessions before email auth
      try {
        await signOut();
      } catch (signOutError) {
        // Ignore errors if no session exists
        console.log('No existing session to clear (expected)');
      }

      // Try to sign in
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === 'complete') {
        // Success! Close modal and redirect
        onClose();
        router.push('/campaigns');
      } else {
        // Handle any additional verification steps
        setError('Please complete the verification process.');
      }
    } catch (err: any) {
      console.error('Email auth error:', err);

      // Check error codes to provide helpful messages
      const errorCode = err.errors?.[0]?.code;

      if (errorCode === 'form_identifier_not_found') {
        // Account doesn't exist - direct them to use Google
        setError('No account found. Please use "Continue with Google" to create an account instantly.');
      } else if (errorCode === 'form_password_incorrect') {
        setError('Incorrect password. Please try again.');
      } else {
        setError(err.errors?.[0]?.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Welcome to Elaview"
      subtitle="Sign in or create an account to continue"
    >
      <div className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Google OAuth Button (Primary Action) */}
        <button
          onClick={handleGoogleAuth}
          disabled={isLoading}
          className="w-full bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
              <span>Connecting...</span>
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
            <button
              onClick={() => setShowEmailForm(!showEmailForm)}
              className="px-4 bg-slate-900 text-gray-400 hover:text-gray-300 transition-colors"
              type="button"
            >
              {showEmailForm ? 'Hide email option' : 'Or use email'}
            </button>
          </div>
        </div>

        {/* Email/Password Form (Optional - Hidden by Default) */}
        {showEmailForm && (
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-3 px-4 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign in with Email</span>
              )}
            </button>

            <p className="text-xs text-slate-400 text-center">
              Don't have an account? Use Google above to create one instantly.
            </p>
          </form>
        )}

        {/* Footer Note */}
        <p className="text-xs text-gray-500 text-center pt-2">
          By continuing, you agree to Elaview's Terms of Service and Privacy Policy
        </p>
      </div>
    </Modal>
  );
}