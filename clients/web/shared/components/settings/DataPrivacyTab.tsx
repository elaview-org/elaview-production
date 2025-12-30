// src/components/settings/DataPrivacyTab.tsx
"use client";

import { useState } from 'react';
import { api } from '../../../../elaview-mvp/src/trpc/react';
import { 
  Download, 
  Trash2, 
  Loader2, 
  AlertCircle,
  Check,
  Shield,
  FileText,
  AlertTriangle
} from 'lucide-react';

export function DataPrivacyTab() {
  const exportData = api.user.exportData.useQuery(undefined, {
    enabled: false,
  });
  
  const deleteAccount = api.user.deleteAccount.useMutation({
    onSuccess: () => {
      window.location.href = '/';
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleExportData = async () => {
    try {
      setError(null);
      const data = await exportData.refetch();
      
      if (data.data) {
        const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `elaview-data-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        setSuccessMessage('Your data has been exported successfully');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export data');
    }
  };

  const handleDeleteAccount = () => {
    deleteAccount.mutate();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Data & Privacy</h2>
        <p className="text-gray-400">
          Manage your data and account privacy settings
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-start space-x-3">
          <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-400">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Data Export */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/10 space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <FileText className="w-5 h-5 mr-2 text-blue-400" />
          Export Your Data
        </h3>
        
        <p className="text-gray-300">
          Download a copy of all your data including campaigns, bookings, and transactions.
        </p>

        <ul className="text-sm text-gray-400 space-y-2 ml-6 list-disc">
          <li>Profile information and business details</li>
          <li>Campaign data and creative assets</li>
          <li>Booking history and transactions</li>
          <li>Messages and notifications</li>
          <li>Payment records</li>
        </ul>

        <button
          onClick={handleExportData}
          disabled={exportData.isFetching}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {exportData.isFetching ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-5 h-5 mr-2" />
              Export Data
            </>
          )}
        </button>

        <p className="text-xs text-gray-500">
          Your data will be downloaded as a JSON file
        </p>
      </div>

      {/* Privacy Information */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/10 space-y-3">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Shield className="w-5 h-5 mr-2 text-cyan-400" />
          Privacy & Data Protection
        </h3>
        
        <p className="text-sm text-gray-300">
          We take your privacy seriously and protect your data in accordance with GDPR regulations.
        </p>
        
        <div className="space-y-2">
          <p className="font-medium text-white text-sm">Your Rights:</p>
          <ul className="ml-6 list-disc space-y-1 text-sm text-gray-400">
            <li>Right to access your personal data</li>
            <li>Right to rectification of inaccurate data</li>
            <li>Right to erasure ("right to be forgotten")</li>
            <li>Right to data portability</li>
          </ul>
        </div>
      </div>

      {/* Delete Account */}
      <div className="bg-red-500/10 rounded-xl p-6 border border-red-500/20 space-y-4">
        <h3 className="text-lg font-semibold text-red-400 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          Danger Zone
        </h3>
        
        <div>
          <h4 className="text-white font-medium mb-2">Delete Your Account</h4>
          <p className="text-gray-300 text-sm mb-4">
            Permanently delete your account and all data. This cannot be undone.
          </p>
          
          <ul className="text-sm text-gray-400 space-y-2 ml-6 list-disc mb-4">
            <li>All campaigns and bookings will be cancelled</li>
            <li>Your spaces will be removed</li>
            <li>All data will be permanently deleted</li>
          </ul>
        </div>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all duration-200"
          >
            <Trash2 className="w-5 h-5 mr-2" />
            Delete Account
          </button>
        ) : (
          <div className="bg-red-500/20 rounded-lg p-4 space-y-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-medium">Are you absolutely sure?</p>
                <p className="text-sm text-gray-300 mt-1">
                  This will permanently delete your account and cannot be reversed.
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleDeleteAccount}
                disabled={deleteAccount.isPending}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteAccount.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  'Yes, Delete My Account'
                )}
              </button>
              
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteAccount.isPending}
                className="px-4 py-2 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}