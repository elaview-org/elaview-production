type TQuery = string | undefined;
type TQueryOptions = {
  staleTime: number;
  refetchOnWindowFocus: boolean;
  refetchOnMount?: boolean;
  refetchInterval?:number
};

export default function useUnreadNotifications(
  query: TQuery,
  options: TQueryOptions
) {
  //     const { data: notificationData, isLoading } = api.notifications.getUnread.useQuery(query, {
  //     staleTime: 30000,
  //     refetchOnWindowFocus: true,
  //     refetchOnMount: true,
  //   });
  return {
    notificationData: {
        otherRoleCount: 12,
        notifications:[{id:'', isRead:true, type:'', title:'', content:'', createdAt:new Date()}],
        unreadCount:12
    },
    isLoading: false,
  };
}
