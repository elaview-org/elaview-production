export default function useSpacesOwnerRequests() {
  //       const { data: requests, isLoading, refetch } = api.bookings.getSpaceOwnerRequests.useQuery({
  //     status: activeTab === 'all' ? undefined :
  //             activeTab === 'pending' ? 'PENDING_APPROVAL' :
  //             activeTab === 'approved' ? 'APPROVED' : 'REJECTED'
  //   });
  return {
    requests: [
      {
        totalAmount: 12,
        platformFee: 12,
        id: "",
        startDate: new Date(),
        endDate: new Date(),
        totalDays:12,
        pricePerDay:'12',
        advertiserNotes:"",
        ownerNotes:'',
        proofStatus:true,
        space:{
            title:'',
            address:'',
            city:'',
            state:'',
            type:''
        },
        campaign: {
          name: "",
          imageUrl: "",
          description: "",
          targetAudience: "",
          advertiser:{
            name:'',
            advertiserProfile:{
                companyName:'',
                industry:''
            }
          }
        },
        status: "",
      },
    ],
    isLoading: false,
    refetch: () => {},
  };
}
