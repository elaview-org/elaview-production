// src/components/settings/SpaceOwnerStripeSettings.tsx
"use client";

import { useState } from 'react';
import { api } from '../../../../elaview-mvp/src/trpc/react';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  DollarSign,
  CreditCard,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  Info,
  TrendingUp,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { toast } from 'sonner';
import { format } from 'date-fns';

export function SpaceOwnerStripeSettings() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: accountStatus, isLoading, refetch } =
    api.billing.getConnectAccountStatus.useQuery(undefined, {
      refetchInterval: 30000, // Refresh every 30 seconds
    });

  const createAccountMutation = api.billing.createConnectAccount.useMutation({
    onSuccess: () => {
      toast.success('Redirecting to Stripe onboarding...');
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create account');
    },
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 1000);
    toast.success('Status refreshed');
  };

  const handleReconnect = () => {
    createAccountMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <RefreshCw className="h-8 w-8 animate-spin text-green-500" />
      </div>
    );
  }

  // Determine status color and icon
  const getStatusDisplay = () => {
    if (!accountStatus?.hasAccount) {
      return {
        color: 'red',
        icon: AlertCircle,
        label: 'Not Connected',
        description: 'Connect your Stripe account to receive payouts',
      };
    }

    if (accountStatus.accountStatus === 'ACTIVE') {
      return {
        color: 'green',
        icon: CheckCircle2,
        label: 'Connected & Active',
        description: 'Your account is set up and ready to receive payouts',
      };
    }

    if (accountStatus.accountStatus === 'RESTRICTED') {
      return {
        color: 'yellow',
        icon: AlertTriangle,
        label: 'Action Required',
        description: 'Additional verification needed to receive payouts',
      };
    }

    if (accountStatus.accountStatus === 'DISABLED') {
      return {
        color: 'red',
        icon: AlertCircle,
        label: 'Disconnected',
        description: 'Your account needs to be reconnected',
      };
    }

    return {
      color: 'gray',
      icon: Clock,
      label: 'Pending Setup',
      description: 'Complete Stripe onboarding to start receiving payouts',
    };
  };

  const statusDisplay = getStatusDisplay();
  const StatusIcon = statusDisplay.icon;

  return (
    <div className="space-y-6">
      {/* Main Status Card */}
      <div className={`rounded-xl border-2 p-6 ${
        statusDisplay.color === 'green'
          ? 'border-green-500/30 bg-green-500/5'
          : statusDisplay.color === 'yellow'
          ? 'border-yellow-500/30 bg-yellow-500/5'
          : statusDisplay.color === 'red'
          ? 'border-red-500/30 bg-red-500/5'
          : 'border-slate-700 bg-slate-900/50'
      }`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className={`rounded-full p-3 ${
              statusDisplay.color === 'green'
                ? 'bg-green-500/10'
                : statusDisplay.color === 'yellow'
                ? 'bg-yellow-500/10'
                : statusDisplay.color === 'red'
                ? 'bg-red-500/10'
                : 'bg-slate-700'
            }`}>
              <StatusIcon className={`h-6 w-6 ${
                statusDisplay.color === 'green'
                  ? 'text-green-400'
                  : statusDisplay.color === 'yellow'
                  ? 'text-yellow-400'
                  : statusDisplay.color === 'red'
                  ? 'text-red-400'
                  : 'text-slate-400'
              }`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold text-white">
                  {statusDisplay.label}
                </h3>
                {accountStatus?.onboardingComplete && (
                  <span className="rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-400">
                    Verified
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-slate-400">
                {statusDisplay.description}
              </p>

              {accountStatus?.hasAccount && (
                <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                  {accountStatus.lastHealthCheck && (
                    <span>
                      Last checked: {format(new Date(accountStatus.lastHealthCheck), 'MMM d, h:mm a')}
                    </span>
                  )}
                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="flex items-center gap-1 hover:text-slate-300 transition-colors"
                  >
                    <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {!accountStatus?.hasAccount && (
              <Button
                onClick={handleReconnect}
                disabled={createAccountMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {createAccountMutation.isPending ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CreditCard className="mr-2 h-4 w-4" />
                )}
                Connect Stripe
              </Button>
            )}

            {accountStatus?.hasAccount && !accountStatus.onboardingComplete && (
              <Button
                onClick={handleReconnect}
                disabled={createAccountMutation.isPending}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Complete Setup
              </Button>
            )}

            {accountStatus?.accountStatus === 'DISABLED' && (
              <Button
                onClick={handleReconnect}
                disabled={createAccountMutation.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reconnect Account
              </Button>
            )}

            {accountStatus?.accountStatus === 'RESTRICTED' && (
              <Button
                onClick={handleReconnect}
                disabled={createAccountMutation.isPending}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Fix Issues
              </Button>
            )}
          </div>
        </div>

        {/* Requirements */}
        {accountStatus?.requirementsCurrentlyDue && accountStatus.requirementsCurrentlyDue.length > 0 && (
          <div className="mt-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-4">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-yellow-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-400">Action Required</h4>
                <p className="mt-1 text-sm text-yellow-300/80">
                  Stripe needs additional information: {accountStatus.requirementsCurrentlyDue.join(', ')}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      {accountStatus?.hasAccount && accountStatus.onboardingComplete && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Held Payouts */}
          <div className="rounded-lg bg-slate-900/50 border border-slate-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Held Payouts</span>
              <Clock className="h-4 w-4 text-slate-500" />
            </div>
            <div className="text-2xl font-bold text-white">$0.00</div>
            <p className="text-xs text-slate-500 mt-1">
              No pending payouts
            </p>
          </div>

          {/* Total Earned */}
          <div className="rounded-lg bg-slate-900/50 border border-slate-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Total Earned</span>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-green-400">$0.00</div>
            <p className="text-xs text-slate-500 mt-1">
              All-time earnings
            </p>
          </div>

          {/* Next Payout */}
          <div className="rounded-lg bg-slate-900/50 border border-slate-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Next Payout</span>
              <DollarSign className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-white">--</div>
            <p className="text-xs text-slate-500 mt-1">
              No scheduled payouts
            </p>
          </div>
        </div>
      )}

      {/* Account Details */}
      {accountStatus?.hasAccount && accountStatus.onboardingComplete && (
        <div className="rounded-lg bg-slate-900/50 border border-slate-800 p-6">
          <h4 className="font-semibold text-white mb-4">Account Details</h4>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-slate-800">
              <span className="text-sm text-slate-400">Status</span>
              <span className={`text-sm font-medium ${
                accountStatus.accountStatus === 'ACTIVE' ? 'text-green-400' : 'text-yellow-400'
              }`}>
                {accountStatus.accountStatus}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-slate-800">
              <span className="text-sm text-slate-400">Charges Enabled</span>
              <span className={`text-sm ${
                accountStatus.isActive ? 'text-green-400' : 'text-slate-500'
              }`}>
                {accountStatus.isActive ? 'Yes' : 'No'}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-slate-800">
              <span className="text-sm text-slate-400">Payouts Enabled</span>
              <span className={`text-sm ${
                accountStatus.isActive ? 'text-green-400' : 'text-slate-500'
              }`}>
                {accountStatus.isActive ? 'Yes' : 'No'}
              </span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-slate-400">Details Submitted</span>
              <span className={`text-sm ${
                accountStatus.detailsSubmitted ? 'text-green-400' : 'text-yellow-400'
              }`}>
                {accountStatus.detailsSubmitted ? 'Complete' : 'Incomplete'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="rounded-lg bg-blue-500/5 border border-blue-500/20 p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-400 mb-1">About Stripe Connect</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Stripe Connect securely handles your payouts. We transfer earnings directly to your
              bank account according to your payout schedule. Installation fees and 30% of rental
              fees are paid after proof approval, with the remaining 70% paid at campaign completion.
            </p>
            <a
              href="https://stripe.com/connect"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-sm text-blue-400 hover:text-blue-300"
            >
              Learn more about Stripe Connect
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
