export default function useAllNotificationsAsRead() {
  //       const markAllAsReadMutation = api.notifications.markAllAsRead.useMutation({
  //     onSuccess: (result) => {
  //       void utils.notifications.getUnread.invalidate();
  //       toast.success(`Marked ${result.count} notifications as read`);
  //     },
  //   });
  function markAllAsRead() {

    //markAllAsReadMutation.mutate();

  }
  return {
    markAllAsRead,
    isPending:false
  };
}
