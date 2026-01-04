// src/components/onboarding/FirstTimeSpaceOwnerOnboarding.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../../elaview-mvp/src/trpc/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/Dialog';
import { Button } from '../ui/Button';
import { EmbeddedStripeOnboarding } from '../settings/EmbeddedStripeOnboarding';
import {
  Loader2,
  DollarSign,
  TrendingUp,
  Shield,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Clock,
  Target,
} from 'lucide-react';
import { toast } from 'sonner';

interface FirstTimeSpaceOwnerOnboardingProps {
  open: boolean;
  onComplete: () => void;
  onClose?: () => void;
}

export function FirstTimeSpaceOwnerOnboarding({
  open,
  onComplete,
  onClose
}: FirstTimeSpaceOwnerOnboardingProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  const { data: accountStatus, refetch: refetchAccountStatus } =
    api.billing.getConnectAccountStatus.useQuery(undefined, {
      enabled: open && step === 2,
      refetchInterval: step === 2 ? 3000 : false, // Poll every 3s during onboarding
    });

  // Auto-advance to step 3 when onboarding is complete
  useEffect(() => {
    if (step === 2 && accountStatus?.onboardingComplete) {
      console.log('[ONBOARDING] Stripe setup complete, advancing to step 3');
      setStep(3);
    }
  }, [step, accountStatus]);

  const handleStep1Continue = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setStep(2);
      setIsTransitioning(false);
    }, 300);
  };

  const handleOnboardingComplete = async () => {
    console.log('[ONBOARDING] User completed Stripe setup');
    await refetchAccountStatus();
  };

  const handleFinalComplete = () => {
    toast.success('🎉 Welcome to space ownership!');
    onComplete();
    router.push('/spaces/new');
  };

  const handleClose = () => {
    if (step === 1 && onClose) {
      onClose();
    } else if (step === 3) {
      onComplete();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-950 border-slate-800"
        onPointerDownOutside={(e) => {
          // Prevent closing during critical steps
          if (step === 2) {
            e.preventDefault();
          }
        }}
      >
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm transition-all ${
                  step === s
                    ? 'bg-green-600 text-white scale-110'
                    : step > s
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {step > s ? <CheckCircle2 className="h-5 w-5" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`w-16 h-1 mx-2 rounded transition-all ${
                    step > s ? 'bg-green-500/20' : 'bg-slate-800'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Welcome & Introduction */}
        {step === 1 && (
          <div
            className={`space-y-6 transition-opacity duration-300 ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse" />
                  <Sparkles className="relative h-16 w-16 text-green-400" />
                </div>
              </div>
              <DialogTitle className="text-3xl text-center text-white">
                Welcome to Space Ownership!
              </DialogTitle>
              <DialogDescription className="text-lg text-center text-slate-300">
                Start earning by listing your advertising spaces
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
              {/* Earning Potential */}
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20 p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="rounded-lg bg-green-500/10 p-2">
                    <DollarSign className="h-6 w-6 text-green-400" />
                  </div>
                  <h3 className="font-semibold text-white">Earn Money</h3>
                </div>
                <p className="text-sm text-slate-400">
                  List your spaces and earn passive income from advertisers
                </p>
              </div>

              {/* Secure Payouts */}
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20 p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="rounded-lg bg-blue-500/10 p-2">
                    <Shield className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-white">Secure Payouts</h3>
                </div>
                <p className="text-sm text-slate-400">
                  Direct bank deposits via Stripe - fast and secure
                </p>
              </div>

              {/* Easy Management */}
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20 p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="rounded-lg bg-purple-500/10 p-2">
                    <Target className="h-6 w-6 text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-white">Full Control</h3>
                </div>
                <p className="text-sm text-slate-400">
                  Approve bookings, set prices, manage availability
                </p>
              </div>
            </div>

            {/* Example Earnings */}
            <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-green-500/10 p-3">
                  <TrendingUp className="h-6 w-6 text-green-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white mb-2">Example Earnings</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Storefront window ($25/day × 30 days)</span>
                      <span className="text-white font-semibold">$750.00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Billboard ($50/day × 30 days)</span>
                      <span className="text-white font-semibold">$1,500.00</span>
                    </div>
                    <div className="border-t border-slate-700 pt-2 mt-2 flex justify-between items-center">
                      <span className="text-slate-300">Platform fee (10%)</span>
                      <span className="text-slate-300">-$225.00</span>
                    </div>
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-green-400 font-semibold">Your monthly earnings</span>
                      <span className="text-green-400 font-bold">$2,025.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* How Payouts Work */}
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-400 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-white mb-1">How Payouts Work</h5>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Advertisers pay when booking your space. We hold funds in escrow until
                    proof of installation is approved, then transfer earnings directly to your
                    bank account according to your schedule (weekly, biweekly, or monthly).
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <Button
                onClick={handleClose}
                className="text-slate-400 hover:text-white flex border-b-2 px-1 py-4 text-sm font-medium whitespace-nowrap transition-colors"
              >
                Maybe Later
              </Button>
              <Button
                onClick={handleStep1Continue}
                className="bg-green-600 hover:bg-green-700 text-white px-8 flex border-b-2 px-1 py-4 text-sm font-medium whitespace-nowrap transition-colors"
              >
                Continue to Payment Setup
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Stripe Connect Onboarding */}
        {step === 2 && (
          <div className="space-y-6">
            <DialogHeader>
              <DialogTitle className="text-2xl text-center text-white">
                Set Up Your Payout Account
              </DialogTitle>
              <DialogDescription className="text-center text-slate-300">
                Step 2 of 3 - Connect your bank account to receive earnings
              </DialogDescription>
            </DialogHeader>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-yellow-400 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-yellow-400 mb-1">Secure Setup</h5>
                  <p className="text-sm text-yellow-300/90">
                    Your payment information is encrypted and processed by Stripe,
                    not stored on our servers. This step is required to list spaces.
                  </p>
                </div>
              </div>
            </div>

            {/* Embedded Stripe Onboarding Component */}
            <EmbeddedStripeOnboarding
              onComplete={handleOnboardingComplete}
              onExit={handleClose}
            />

            <div className="text-center text-sm text-slate-500 pt-4">
              Complete the form above to continue
            </div>
          </div>
        )}

        {/* Step 3: Success & Next Steps */}
        {step === 3 && (
          <div className="space-y-6">
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse" />
                  <CheckCircle2 className="relative h-20 w-20 text-green-400" />
                </div>
              </div>
              <DialogTitle className="text-3xl text-center text-white">
                You're All Set! 🎉
              </DialogTitle>
              <DialogDescription className="text-lg text-center text-slate-300">
                Your payout account is connected and ready
              </DialogDescription>
            </DialogHeader>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 my-6">
              <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-4 text-center">
                <div className="text-3xl font-bold text-white">0</div>
                <div className="text-sm text-slate-400 mt-1">Spaces Listed</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-4 text-center">
                <div className="text-3xl font-bold text-white">0</div>
                <div className="text-sm text-slate-400 mt-1">Bookings</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-4 text-center">
                <div className="text-3xl font-bold text-green-400">$0</div>
                <div className="text-sm text-slate-400 mt-1">Earned</div>
              </div>
            </div>

            {/* Next Steps Checklist */}
            <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
              <h4 className="font-semibold text-white mb-4">Next Steps:</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-green-500/10 p-1 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Payout account connected</div>
                    <div className="text-sm text-slate-400">You're ready to receive payments</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-slate-700 p-1 mt-0.5">
                    <div className="h-4 w-4 rounded-full border-2 border-slate-500" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Create your first space listing</div>
                    <div className="text-sm text-slate-400">Add photos, pricing, and details</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-slate-700 p-1 mt-0.5">
                    <div className="h-4 w-4 rounded-full border-2 border-slate-500" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Wait for advertiser bookings</div>
                    <div className="text-sm text-slate-400">Approve requests and earn money</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button
                onClick={handleFinalComplete}
                className="bg-green-600 hover:bg-green-700 text-white px-12 py-6 text-lg"
              >
                Create Your First Space
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="text-center">
              <button
                onClick={() => onComplete()}
                className="text-sm text-slate-500 hover:text-slate-400"
              >
                I'll do this later
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
