export default function useUserSwitchRole() {
  async function switchRole() {
    // const switchRoleMutation = api.user.switchRole.useMutation({
    //   onSuccess: async () => {
    //     await utils.notifications.getUnread.invalidate();
    //     await utils.user.getCurrentUser.invalidate();
    //     toast.success("Switched to Advertiser mode!");
    //     router.push("/browse");
    //   },
    //   onError: () => {
    //     toast.error("Failed to switch role. Please try again.");
    //   },
    // });
    // await switchRoleMutation.mutateAsync({ role: "ADVERTISER" });
  }
  return {
    switchRole,
    isPending:false
  };
}
