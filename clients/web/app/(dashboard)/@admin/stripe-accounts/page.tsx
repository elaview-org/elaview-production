// src/app/(admin)/admin/stripe-accounts/page.tsx
"use client";

import { useState } from "react";
import {
  Building,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  DollarSign,
  Users,
  Clock,
  ExternalLink,
  Loader2,
  Search,
} from "lucide-react";
import { api } from "../../../../../elaview-mvp/src/trpc/react";
import { format } from "date-fns";
import { Button } from "../../../../../elaview-mvp/src/components/ui/Button";

type AccountStatus = 'ALL' | 'ACTIVE' | 'PENDING' | 'RESTRICTED' | 'DISABLED';

export default function StripeAccountsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<AccountStatus>('ALL');
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  // ✅ FIX: Pass required input parameters
  const { data: accountsData, isLoading, refetch } = api.admin.stripe.getAllStripeAccounts.useQuery({
    status: statusFilter,
    search: searchTerm || undefined,
    limit: 50,
    offset: 0,
  });

  // ✅ FIX: Use correct parameter name (userId not spaceOwnerId)
  const { data: accountDetails } = api.admin.stripe.getStripeAccountDetails.useQuery(
    { userId: selectedAccountId ?? '' },
    { enabled: !!selectedAccountId }
  );

  const { data: heldPayoutsData } = api.admin.finance.getHeldPayouts.useQuery();

  const healthCheckMutation = api.admin.stripe.forceAccountHealthCheck.useMutation({
    onSuccess: (_result) => {
      // ✅ FIX: Use correct response structure
      toast.success(`Health check complete`);
      void refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const retryPayoutsMutation = api.admin.finance.retryHeldPayouts.useMutation({
    onSuccess: (result) => {
      // ✅ FIX: Use correct response property name
      toast.success(`Processed ${result.processedCount} payouts`);
      void refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // ✅ FIX: Extract arrays from response objects
  const accounts = accountsData?.accounts ?? [];
  const heldPayouts = heldPayoutsData?.payouts ?? [];

  // ✅ FIX: Use accounts array for filtering
  const filteredAccounts = accounts.filter((account) => {
    if (!searchTerm) return statusFilter === 'ALL' || account.accountStatus === statusFilter;

    const searchLower = searchTerm.toLowerCase();
    const matchesName = account.name?.toLowerCase().includes(searchLower) ?? false;
    const matchesEmail = account.email.toLowerCase().includes(searchLower);
    const matchesSearch = matchesName || matchesEmail;

    const matchesStatus = statusFilter === 'ALL' || account.accountStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // ✅ FIX: Use accounts array for stats
  const stats = {
    total: accounts.length,
    active: accounts.filter(a => a.accountStatus === 'ACTIVE').length,
    pending: accounts.filter(a => a.accountStatus === 'PENDING').length,
    restricted: accounts.filter(a => a.accountStatus === 'RESTRICTED').length,
    disabled: accounts.filter(a => a.accountStatus === 'DISABLED').length,
    heldPayoutsCount: heldPayouts.length,
    heldPayoutsAmount: heldPayouts.reduce((sum, p) => sum + p.amount, 0),
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'PENDING': return <Clock className="h-5 w-5 text-yellow-400" />;
      case 'RESTRICTED': return <AlertTriangle className="h-5 w-5 text-orange-400" />;
      case 'DISABLED': return <XCircle className="h-5 w-5 text-red-400" />;
      default: return <Clock className="h-5 w-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'text-green-400';
      case 'PENDING': return 'text-yellow-400';
      case 'RESTRICTED': return 'text-orange-400';
      case 'DISABLED': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="h-full w-full p-4">
      <div className="h-full bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-slate-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Stripe Connect Accounts</h1>
              <p className="text-slate-400">Monitor and manage space owner payment accounts</p>
            </div>
            <Button
              onClick={() => void refetch()}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="flex-shrink-0 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 p-6 border-b border-slate-800">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <Users className="h-4 w-4" />
              <span>Total Accounts</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-green-400 text-sm mb-1">
              <CheckCircle className="h-4 w-4" />
              <span>Active</span>
            </div>
            <div className="text-2xl font-bold text-green-400">{stats.active}</div>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-yellow-400 text-sm mb-1">
              <Clock className="h-4 w-4" />
              <span>Pending</span>
            </div>
            <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-orange-400 text-sm mb-1">
              <AlertTriangle className="h-4 w-4" />
              <span>Restricted</span>
            </div>
            <div className="text-2xl font-bold text-orange-400">{stats.restricted}</div>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-red-400 text-sm mb-1">
              <XCircle className="h-4 w-4" />
              <span>Disabled</span>
            </div>
            <div className="text-2xl font-bold text-red-400">{stats.disabled}</div>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-purple-400 text-sm mb-1">
              <DollarSign className="h-4 w-4" />
              <span>Held Payouts</span>
            </div>
            <div className="text-2xl font-bold text-purple-400">{stats.heldPayoutsCount}</div>
            <div className="text-xs text-slate-400 mt-1">
              ${(stats.heldPayoutsAmount / 100).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex-shrink-0 p-6 border-b border-slate-800">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as AccountStatus)}
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
              <option value="RESTRICTED">Restricted</option>
              <option value="DISABLED">Disabled</option>
            </select>
          </div>
        </div>

        {/* Accounts List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {filteredAccounts.map((account) => {
              const accountHeldPayouts = heldPayouts.filter(
                p => p.spaceOwnerId === account.userId
              );

              return (
                <div
                  key={account.userId}
                  className="bg-slate-800 rounded-lg border border-slate-700 p-6 hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Building className="h-5 w-5 text-slate-400" />
                        <h3 className="text-lg font-semibold text-white">
                          {account.name ?? account.email}
                        </h3>
                      </div>
                      <p className="text-sm text-slate-400">{account.email}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {getStatusIcon(account.accountStatus)}
                      <span className={`font-medium ${getStatusColor(account.accountStatus)}`}>
                        {account.accountStatus}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Onboarding</div>
                      <div className={account.onboardingComplete ? 'text-green-400' : 'text-yellow-400'}>
                        {account.onboardingComplete ? 'Complete' : 'Incomplete'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Active Spaces</div>
                      <div className="text-white">{account.activeSpaces} / {account.totalSpaces}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Stripe Account ID</div>
                      <div className="text-white font-mono text-xs truncate">
                        {account.stripeAccountId ?? 'Not connected'}
                      </div>
                    </div>
                  </div>

                  {accountHeldPayouts.length > 0 && (
                    <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 text-purple-400 font-medium mb-2">
                        <AlertTriangle className="h-4 w-4" />
                        <span>{accountHeldPayouts.length} Held Payout(s)</span>
                      </div>
                      <div className="text-sm text-slate-300">
                        Total: ${(accountHeldPayouts.reduce((sum, p) => sum + p.amount, 0) / 100).toFixed(2)}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedAccountId(account.userId)}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Details
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => healthCheckMutation.mutate({ userId: account.userId })}
                      disabled={healthCheckMutation.isPending}
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${healthCheckMutation.isPending ? 'animate-spin' : ''}`} />
                      Health Check
                    </Button>

                    {accountHeldPayouts.length > 0 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => retryPayoutsMutation.mutate({ spaceOwnerId: account.userId })}
                        disabled={retryPayoutsMutation.isPending}
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        Retry Payouts
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredAccounts.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No accounts found</p>
              </div>
            )}
          </div>
        </div>

        {/* Account Details Modal */}
        {selectedAccountId && accountDetails && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Stripe Account Details</h2>
                <button
                  onClick={() => setSelectedAccountId(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-sm font-medium text-slate-400 mb-2">Account Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Email:</span>
                      <span className="text-white">{accountDetails.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Country:</span>
                      <span className="text-white">{accountDetails.country}</span>
                    </div>
                    {accountDetails.accountId && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Stripe ID:</span>
                        <span className="text-white font-mono text-xs">{accountDetails.accountId}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Capabilities */}
                <div>
                  <h3 className="text-sm font-medium text-slate-400 mb-2">Capabilities</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Charges Enabled:</span>
                      <span className={accountDetails.chargesEnabled ? 'text-green-400' : 'text-red-400'}>
                        {accountDetails.chargesEnabled ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Payouts Enabled:</span>
                      <span className={accountDetails.payoutsEnabled ? 'text-green-400' : 'text-red-400'}>
                        {accountDetails.payoutsEnabled ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Details Submitted:</span>
                      <span className={accountDetails.detailsSubmitted ? 'text-green-400' : 'text-yellow-400'}>
                        {accountDetails.detailsSubmitted ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Requirements */}
                {accountDetails.requirementsCurrentlyDue.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-orange-400 mb-2">Requirements Currently Due</h3>
                    <ul className="list-disc list-inside text-slate-300 space-y-1 text-sm">
                      {accountDetails.requirementsCurrentlyDue.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {accountDetails.requirementsPastDue.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-red-400 mb-2">Requirements Past Due</h3>
                    <ul className="list-disc list-inside text-red-300 space-y-1 text-sm">
                      {accountDetails.requirementsPastDue.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Database Status */}
                <div>
                  <h3 className="text-sm font-medium text-slate-400 mb-2">Database Status</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Account Status:</span>
                      <span className="text-white">{accountDetails.databaseStatus.accountStatus}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Onboarding Complete:</span>
                      <span className={accountDetails.databaseStatus.onboardingComplete ? 'text-green-400' : 'text-yellow-400'}>
                        {accountDetails.databaseStatus.onboardingComplete ? 'Yes' : 'No'}
                      </span>
                    </div>
                    {accountDetails.databaseStatus.lastHealthCheck && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Last Health Check:</span>
                        <span className="text-white text-sm">
                          {format(new Date(accountDetails.databaseStatus.lastHealthCheck), 'MMM d, yyyy h:mm a')}
                        </span>
                      </div>
                    )}
                    {accountDetails.databaseStatus.disconnectedAt && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Disconnected At:</span>
                        <span className="text-red-400 text-sm">
                          {format(new Date(accountDetails.databaseStatus.disconnectedAt), 'MMM d, yyyy h:mm a')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Simple toast utility
const toast = {
  success: (message: string) => {
    console.log('✅', message);
    // You can replace this with an actual toast library like sonner or react-hot-toast
  },
  error: (message: string) => {
    console.error('❌', message);
  },
};