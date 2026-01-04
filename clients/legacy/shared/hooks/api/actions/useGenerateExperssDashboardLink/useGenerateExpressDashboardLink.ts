export default function useGenerateExpressDashboardLink() {
  //       const openDashboard = api.billing.generateExpressDashboardLink.useMutation({
  //     onSuccess: (data) => {
  //       window.open(data.url, "_blank");
  //       toast.success("Opening Stripe Dashboard...");
  //     },
  //     onError: (error) => {
  //       toast.error(error.message || "Failed to open dashboard");
  //     },
  //   });
  function openDashboard(): { mutate: () => void } {
    return {
      mutate: () => {},
    };
  }
  function openDashboardHandler(){
    //openDashboard.mutat();
  }
  return {
    openDashboard,
    openDashboardHandler,
    isPending:false
  };
}
