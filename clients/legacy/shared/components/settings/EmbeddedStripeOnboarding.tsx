// src/components/settings/EmbeddedStripeOnboarding.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { loadConnectAndInitialize } from '@stripe/connect-js';
import type { StripeConnectInstance } from '@stripe/connect-js';
import {
  ConnectAccountOnboarding,
  ConnectComponentsProvider,
} from '@stripe/react-connect-js';
import { api } from '../../../../elaview-mvp/src/trpc/react';
import { Loader2, AlertCircle, Shield, CheckCircle, Info } from 'lucide-react';
import { toast } from 'sonner';

interface EmbeddedStripeOnboardingProps {
  onComplete: () => void;
  onExit?: () => void;
}

export function EmbeddedStripeOnboarding({ 
  onComplete, 
  onExit 
}: EmbeddedStripeOnboardingProps) {
  const [stripeConnectInstance, setStripeConnectInstance] = useState<StripeConnectInstance | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [accountCreated, setAccountCreated] = useState(false);

  const { data: accountStatus } = api.billing.getConnectAccountStatus.useQuery();

  const createAccountMutation = api.billing.createConnectAccount.useMutation({
    onSuccess: () => {
      console.log('[ONBOARDING] Stripe Connect account created');
      setAccountCreated(true);
    },
    onError: (error) => {
      console.error('[ONBOARDING] Failed to create account:', error);
      setError(error.message || 'Failed to create payout account');
      toast.error('Failed to create payout account');
    },
  });

  const { 
    mutate: createSession, 
    isPending: isCreatingSession,
    error: sessionError 
  } = api.billing.createAccountSession.useMutation({
    onSuccess: async (data) => {
      try {
        const instance = loadConnectAndInitialize({
          publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
          fetchClientSecret: async () => data.clientSecret,
          appearance: {
            overlays: 'dialog',
            variables: {
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              colorPrimary: '#22c55e',
              colorBackground: '#0f172a',
              colorText: '#f8fafc',
              colorDanger: '#ef4444',
              buttonPrimaryColorBackground: '#22c55e',
              borderRadius: '8px',
            },
          },
        });
        setStripeConnectInstance(instance);
      } catch (err) {
        setError('Failed to initialize Stripe Connect. Please try again.');
        toast.error('Failed to load onboarding form');
      }
    },
    onError: (err) => {
      setError(err.message || 'Failed to create account session');
      toast.error('Failed to start onboarding');
    },
  });

  useEffect(() => {
    if (!accountStatus) return;
    if (!accountStatus.hasAccount && !createAccountMutation.isPending && !accountCreated) {
      createAccountMutation.mutate();
      return;
    }
    if ((accountStatus.hasAccount || accountCreated) && !stripeConnectInstance && !isCreatingSession) {
      createSession();
    }
  }, [accountStatus, accountCreated, stripeConnectInstance]);

  const handleExit = useCallback(() => {
    if (onExit) {
      onExit();
    } else {
      toast.info('You can complete setup anytime from your settings');
    }
  }, [onExit]);

  // Loading
  if (createAccountMutation.isPending || isCreatingSession || !stripeConnectInstance) {
    return (
      <div className="bg-slate-900 rounded-lg border border-slate-800 p-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-green-500" />
          <div className="text-center">
            <p className="text-white font-medium">
              {createAccountMutation.isPending
                ? 'Creating your payout account...'
                : isCreatingSession
                  ? 'Loading secure form...'
                  : 'Initializing...'}
            </p>
            <p className="text-sm text-slate-400 mt-1">Setting up Stripe Connect</p>
          </div>
        </div>
      </div>
    );
  }

  // Error
  if (error || sessionError) {
    return (
      <div className="bg-slate-900 rounded-lg border border-red-500/20 p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-400">Unable to Load Onboarding</h3>
            <p className="text-sm text-slate-400 mt-1">
              {error || sessionError?.message || 'An unexpected error occurred.'}
            </p>
            <button
              onClick={() => {
                setError(null);
                setAccountCreated(false);
                if (!accountStatus?.hasAccount) {
                  createAccountMutation.mutate();
                } else {
                  createSession();
                }
              }}
              className="mt-3 text-sm font-medium text-red-400 hover:text-red-300 underline"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main form
  return (
    <div className="space-y-4">
      {/* 🆕 PROMINENT "No Stripe Account Needed" Banner */}
      <div className="bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-green-500/10 border border-green-500/30 rounded-xl p-5 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center ring-2 ring-green-500/30">
            <Info className="h-6 w-6 text-green-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg mb-2">
              🎉 No Stripe Account Needed!
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-3">
              Don't have a Stripe account? Perfect! We'll create a secure <span className="font-semibold text-white">Stripe Express</span> payout account for you below. Just enter your email to get started.
            </p>
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-slate-400">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Takes 3-5 minutes</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Shield className="h-4 w-4 text-green-400" />
                <span>Bank-level encryption</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Powered by Stripe</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stripe component - clean container */}
      <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
        <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
          <ConnectAccountOnboarding onExit={handleExit} />
        </ConnectComponentsProvider>
      </div>

      {/* Help link */}
      <p className="text-xs text-slate-400 text-center">
        Need help?{' '}
        <a href="mailto:support@elaview.com" className="text-green-400 hover:text-green-300 underline">
          Contact Support
        </a>
      </p>
    </div>
  );
}