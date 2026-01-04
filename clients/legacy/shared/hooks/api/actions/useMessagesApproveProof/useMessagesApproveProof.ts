export default function useMessagesApproveProof() {
  async function approveProof({
    messageId,
    bookingId,
  }: {
    messageId: string;
    bookingId: string;
  }) {
    //     const approveProofMutation = api.messages.approveProof.useMutation({
    // onSuccess: async () => {
    //   await utils.messages.getConversation.invalidate();
    //   toast.success("Installation proof approved! Payment sent to space owner.");
    // },
    // onError: (error) => {
    //   toast.error(error.message || "Failed to approve proof");
    // },
    //   });
    // await approveProofMutation.mutateAsync({
    //   messageId: message.id,
    //   bookingId: message.bookingId,
    // });
  }
  return {
    approveProof,
    isPending: false,
  };
}
