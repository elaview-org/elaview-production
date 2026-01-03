import useCurrentUser from "../../getters/useCurrentUser/useCurrentUser";

export default function useEditCurrentProfile() {
  const { user: userData } = useCurrentUser();
  // const updateProfile = api.user.updateProfile.useMutation({
  //     onSuccess: () => {
  //       utils.user.getCurrentUser.invalidate();
  //       setSuccessMessage('Business profile updated successfully');
  //       setTimeout(() => setSuccessMessage(null), 3000);
  //     },
  //     onError: (error) => {
  //       setError(error.message);
  //     },
  //   });
  const updateProfile = (userData: {
    name: string;
    phone: string;
    companyName: string;
    industry: string;
    website: string;
    businessName: string;
    businessType: string;
  }) => {};
  return {
    updateProfile,
    isPending: false
  };
}
