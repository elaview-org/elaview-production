export default function useDeleteAccount() {
  async function userAccountDeletion() {
    //   const deleteAccount = api.user.deleteAccount.useMutation({
    //     onSuccess: () => {
    //       window.location.href = '/';
    //     },
    //     onError: (error) => {
    //       setError(error.message);
    //     },
    //   });
  }
  return {
    userAccountDeletion,
    isPending: false,
  };
}
