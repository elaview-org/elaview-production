//this api will use socket.io

import { MessageWithSender } from "@/shared/components/messages/MessageList";

export default function useConversation() {
  //   const { data: messages } = api.messages.getConversation.useQuery(
  //     {
  //       campaignId: selectedConversation?.campaignId || "",
  //       bookingId: selectedConversationId,
  //     },
  //     {
  //       enabled: !!selectedConversationId, // Only need bookingId, not full conversation object
  //       refetchInterval: 5000,
  //     }
  //   );
  async function validator({campaignId, bookingId}:{campaignId:string, bookingId?:string}) {
        // await utils.messages.getConversation.invalidate({
    //     campaignId,
    //     bookingId,
    //   });
  }
  return {
    messages: [] as MessageWithSender[],
    validate: validator
  };
}
