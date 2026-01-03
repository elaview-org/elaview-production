export default function useDeleteLeads() {
  //! I might need some api delete
  // const deleteLeads = api.crm.deleteLeads.useMutation({
  //   onSuccess: () => {
  //     toast.success(`Deleted ${selectedLeads.length} leads`);
  //     setSelectedLeads([]);
  //     refetch();
  //   },
  //   onError: () => {
  //     toast.error("Failed to delete leads");
  //   },
  // });
  function deleteLeadsByIds(ids:string[]){
    // deleteLeads.mutate({ ids: selectedLeads });
  }
  return {
    isPending: false,
    deleteLeadsByIds: deleteLeadsByIds
  };
}
