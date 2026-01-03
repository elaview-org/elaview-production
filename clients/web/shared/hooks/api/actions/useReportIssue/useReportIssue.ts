export default function useReportIssue() {
  async function reportIssue({
    bookingId,
    issueType,
    description,
    photos,
  }: {
    bookingId: string;
    issueType: string;
    description: String;
    photos: string[];
  }) {
    //   const reportIssueMutation = api.messages.reportIssue.useMutation({
    //     onSuccess: async () => {
    //       await utils.messages.getConversation.invalidate();
    //       await utils.campaigns.getById.invalidate();
    //       toast.success("Issue reported successfully. Our support team will review within 24-48 hours.");
    //       onSuccess();
    //     },
    //     onError: (error) => {
    //       toast.error(error.message || "Failed to report issue");
    //     },
    //   });
  }
  return {
    reportIssue,
    isPending:false
  };
}
