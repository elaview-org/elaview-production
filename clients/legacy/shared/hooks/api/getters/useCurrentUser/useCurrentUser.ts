export default function useCurrentUser() {
  //   const { data: user } = api.user.getCurrentUser.useQuery();

  return {
    user: {
      id: "",
      role: "ADVERTISER",
      name:'',
      phone:'',
      advertiserProfile:{
        companyName:'',
        industry:'',
        website:'',
      },
      spaceOwnerProfile:{
        businessName:'',
        businessType:''
      }
    },
    userLoading: false,
  };
}
