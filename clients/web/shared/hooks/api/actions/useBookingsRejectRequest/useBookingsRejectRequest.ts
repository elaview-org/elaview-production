export default function useBookingsRejectRequest(){
    
    function rejectBookingRequest(){
//   const rejectMutation = api.bookings.rejectRequest.useMutation({
//     onSuccess: () => {
//       refetch();
//       setRejectingRequest(null);
//       setRejectionReason("");
//     },
//     onError: (error) => {
//       alert(`Failed to reject: ${error.message}`);
//     },
//   });
    //   rejectMutation.mutate({
    //     bookingId: rejectingRequest,
    //     reason: rejectionReason.trim(),
    //   });
    }
    return{
        rejectBookingRequest,
        isPending:false
    }
}