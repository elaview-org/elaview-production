type TConversation = {
  id: string;
  type: "ADVERTISER" | "SPACE_OWNER";
  campaignName: string;
  campaignImage: string | null;
  spaceName: string | null;
  spaceLocation: string | null;
  spaceImage: string | null;
  bookingStatus: string | null;
  proofStatus: string | null;
  proofUploadedAt: Date | null;
  otherParty: {
    id: string | undefined;
    name: string | null;
    email: string | null;
    avatar: string | null;
  };
  lastMessage: {
    content: string;
    timestamp: Date;
    isOwn: boolean;
    type: string;
  } | null;
  unreadCount: number;
  updatedAt: Date;
  campaignId: string;
};

export default function useConversationsWithPreview() {
  //   const { data: conversations, isLoading } = api.messages.getConversationsWithPreview.useQuery(
  //     undefined,
  //     {
  //       refetchInterval: 10000,
  //       refetchOnWindowFocus: true,
  //     }
  //   );
  //add validate(campaignId, bookingId);

  async function validator() {


    //     await utils.messages.getConversationsWithPreview.invalidate();

  }
  return {
    conversations: [] as TConversation[],
    isLoading: false,
    validate: validator,
  };
}
