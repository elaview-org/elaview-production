"use client";

import useConversation from "../../getters/useConversation/useConversation";
import useConversationsWithPreview from "../../getters/useConversationsWithPreview/useConversationsWithPreview";

export default function useSendMessage() {
  const previewConversation = useConversationsWithPreview();
  const conversation = useConversation();

  async function sendMessageMutation({
    campaignId,
    content,
    attachments,
    messageType,
    bookingId,
  }: {
    campaignId: string;
    content: string;
    attachments?: string[] | undefined;
    messageType: "PROOF_SUBMISSION" | "TEXT";
    bookingId?: string;
  }) {
    //this will handle sending message

    // const sendMessageMutation = api.messages.sendMessage.useMutation({
    //   onSuccess: async () => {
    //     console.log("✅ [SEND SUCCESS] Message sent!");
    //     console.log("🔄 [SEND SUCCESS] Invalidating with params:", {
    //       campaignId,
    //       bookingId,
    //     });

    //     // FIX: Invalidate with both campaignId AND bookingId to ensure messages refresh
    //     //   await utils.messages.getConversation.invalidate({
    //     //     campaignId,
    //     //     bookingId,
    //     //   });

    //     console.log("✅ [SEND SUCCESS] getConversation invalidated");

    //     // Also invalidate conversations list
    //     await utils.messages.getConversationsWithPreview.invalidate();
    await conversation.validate({ campaignId, bookingId });
    await previewConversation.validate();
    //     console.log(
    //       "✅ [SEND SUCCESS] getConversationsWithPreview invalidated"
    //     );

    //     setMessage("");
    //     setSelectedFiles([]);
    //     setPreviews([]);
    //     toast.success("Message sent successfully");

    //     console.log("✅ [SEND SUCCESS] Complete!");
    //   },
    //   onError: (error) => {
    //     console.error("❌ [SEND ERROR]", error);
    //     toast.error(error.message || "Failed to send message", {
    //       duration: 6000,
    //     });
    //   },
    // });

    // await sendMessageMutation.mutateAsync({
    //     campaignId,
    //     content: message.trim() || (isProofSubmission ? "📸 Installation proof submitted" : ""),
    //     attachments: attachmentUrls.length > 0 ? attachmentUrls : undefined,
    //     messageType: isProofSubmission ? "PROOF_SUBMISSION" : "TEXT",
    //     bookingId: bookingId,  // ✅ FIX: Always send bookingId for ALL messages
    //   });
  }

  return {
    sendMessageMutation,
    isPending: false,
  };
}
