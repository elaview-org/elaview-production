export default function useConnectAccountStatus() {
  //   const { data: accountStatus, isLoading: statusLoading } =
  // api.billing.getConnectAccountStatus.useQuery();

  function validator() {
    //utils.billing.getConnectAccountStatus.invalidate()
  }
  return {
    validate: validator,
    accountStatus: {
      hasAccount: true,
      requiresAction: false,
      isActive: true,
    },
    accountStatusLoading: false,
  };
}
