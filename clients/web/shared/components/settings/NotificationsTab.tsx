// src/components/settings/NotificationsTab.tsx
"use client";

import { useState, useEffect } from 'react';
import { api } from '../../../../elaview-mvp/src/trpc/react';
import { 
  Bell, 
  Save, 
  Loader2, 
  AlertCircle,
  Check,
  Mail,
  Calendar
} from 'lucide-react';

export function NotificationsTab() {
  const utils = api.useUtils();
  
  const { data: settingsData, isLoading } = api.user.getNotificationSettings.useQuery();
  const updateSettings = api.user.updateNotificationSettings.useMutation({
    onSuccess: () => {
      utils.user.getNotificationSettings.invalidate();
      setSuccessMessage('Notification preferences updated successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const [settings, setSettings] = useState({
    bookingRequests: true,
    bookingApprovals: true,
    paymentReceipts: true,
    campaignUpdates: true,
    marketingEmails: false,
    systemNotifications: true,
    emailDigest: 'weekly' as 'daily' | 'weekly' | 'monthly' | 'never',
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (settingsData?.settings) {
      setSettings(settingsData.settings);
    }
  }, [settingsData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    updateSettings.mutate(settings);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Notification Preferences</h2>
        <p className="text-gray-400">
          Choose how you want to be notified about activity on your account
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Notifications */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Mail className="w-5 h-5 mr-2 text-blue-400" />
            Email Notifications
          </h3>
          
          <div className="space-y-3">
            {[
              { key: 'bookingRequests', label: 'Booking Requests', description: 'Get notified when someone requests to book your space' },
              { key: 'bookingApprovals', label: 'Booking Approvals', description: 'Notifications about booking approvals and rejections' },
              { key: 'paymentReceipts', label: 'Payment Receipts', description: 'Receive payment confirmations and receipts' },
              { key: 'campaignUpdates', label: 'Campaign Updates', description: 'Updates about your active campaigns' },
              { key: 'systemNotifications', label: 'System Notifications', description: 'Important system updates and maintenance alerts' },
              { key: 'marketingEmails', label: 'Marketing Emails', description: 'Promotional content and platform updates' },
            ].map((item) => (
              <label key={item.key} className="flex items-start space-x-3 p-4 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[item.key as keyof typeof settings] as boolean}
                  onChange={(e) => setSettings({
                    ...settings,
                    [item.key]: e.target.checked
                  })}
                  className="mt-1 h-5 w-5 text-blue-600 bg-white/5 border-white/20 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:ring-offset-transparent"
                />
                <div className="flex-1">
                  <div className="text-white font-medium">{item.label}</div>
                  <div className="text-sm text-gray-400">{item.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Email Digest */}
        <div className="space-y-4 pt-6 border-t border-white/10">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-cyan-400" />
            Email Digest Frequency
          </h3>
          
          <p className="text-sm text-gray-400">
            Receive a summary of your notifications in a single email
          </p>
          
          <div className="space-y-3">
            {[
              { value: 'daily', label: 'Daily', description: 'Receive a digest every day' },
              { value: 'weekly', label: 'Weekly', description: 'Receive a digest every Monday' },
              { value: 'monthly', label: 'Monthly', description: 'Receive a digest on the 1st of each month' },
              { value: 'never', label: 'Never', description: 'Don\'t send me digest emails' },
            ].map((option) => (
              <label key={option.value} className="flex items-start space-x-3 p-4 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                <input
                  type="radio"
                  name="emailDigest"
                  value={option.value}
                  checked={settings.emailDigest === option.value}
                  onChange={(e) => setSettings({
                    ...settings,
                    emailDigest: e.target.value as any
                  })}
                  className="mt-1 h-5 w-5 text-blue-600 bg-white/5 border-white/20 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:ring-offset-transparent"
                />
                <div className="flex-1">
                  <div className="text-white font-medium">{option.label}</div>
                  <div className="text-sm text-gray-400">{option.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t border-white/10">
          <button
            type="submit"
            disabled={updateSettings.isPending}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateSettings.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Preferences
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}