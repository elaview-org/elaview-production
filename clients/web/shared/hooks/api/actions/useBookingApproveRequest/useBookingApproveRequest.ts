export default function useBookingApproveRequest() {
  function approveBookingRequest() {
    //           const approveMutation = api.bookings.approveRequest.useMutation({
    //     onSuccess: () => {
    //       refetch();
    //     },
    //     onError: (error) => {
    //       alert(`Failed to approve: ${error.message}`);
    //     },
    //   });
    // approveMutation.mutate({ bookingId });
  }
  return {
    approveBookingRequest,
    isPending: false,
  };
}
