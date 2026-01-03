export default function useNotificationAsRead(){
    // const markAsReadMutation = api.notifications.markAsRead.useMutation({
    //     onSuccess: () => {
    //       void utils.notifications.getUnread.invalidate();
    //     },
    //   });
    function markAsRead(){
    //   markAsReadMutation.mutate({ notificationIds: [notification.id] });

    }
    return{
        markAsRead
    }
}