export default function useNotificationSettings() {
  return {
    isLoading: false,
    settingsData: {
      settings: {
        bookingRequests: true,
        bookingApprovals: true,
        paymentReceipts: true,
        campaignUpdates: true,
        marketingEmails: false,
        systemNotifications: true,
        emailDigest: "weekly" as "daily" | "weekly" | "monthly" | "never",
      },
    },
  };
}
