export default function useSpacesDelete() {
  function deleteSpace() {
    //   const deleteSpaceMutation = api.spaces.delete.useMutation({
    //     onSuccess: () => {
    //       void refetch();
    //       setShowDeleteModal(false);
    //       setSelectedSpace(null);
    //     },
    //     onError: (error) => {
    //       alert(`Error deleting space: ${error.message}`);
    //     },
    //   });
    //   deleteSpaceMutation.mutate({ id: selectedSpace });
  }
  return {
    deleteSpace,
    isPending:false
  };
}
