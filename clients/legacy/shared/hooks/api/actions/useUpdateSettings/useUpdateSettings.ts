
type TSettings = {
    bookingRequests: boolean,
    bookingApprovals: boolean,
    paymentReceipts: boolean,
    campaignUpdates: boolean,
    marketingEmails: boolean,
    systemNotifications: boolean,
    emailDigest: "daily" | "weekly" | "monthly" | "never",
  }
export default function useUpdateSettings(){
    //   const updateSettings = api.user.updateNotificationSettings.useMutation({
    //     onSuccess: () => {
    //       utils.user.getNotificationSettings.invalidate();
    //       setSuccessMessage('Notification preferences updated successfully');
    //       setTimeout(() => setSuccessMessage(null), 3000);
    //     },
    //     onError: (error) => {
    //       setError(error.message);
    //     },
    //   });

    const updateSettings = (settings: TSettings)=>{}
    return {
        updateSettings,
        isPending: true
    }
}