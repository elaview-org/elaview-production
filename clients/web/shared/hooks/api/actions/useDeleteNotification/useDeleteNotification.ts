export default function useDeleteNotification(){
//     const deleteMutation = api.notifications.delete.useMutation({
//     onSuccess: () => {
//       void utils.notifications.getUnread.invalidate();
//       toast.success("Notification deleted");
//     },
//   });
function deleteNotification(){
    //deleteMutation.mutate({ notificationId });
}
    return {
        deleteNotification
    }
}