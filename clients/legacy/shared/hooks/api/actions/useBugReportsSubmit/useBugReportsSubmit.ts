export default function useBugReportsSubmit() {
  
  function initailizer(){
    // const submitBug = api.bugReports.submit.useMutation({
    //     onSuccess: () => {
    //       // Show success message
    //       setShowSuccess(true);
    
    //       // Reset form after 3 seconds
    //       setTimeout(() => {
    //         onClose();
    //         setShowSuccess(false);
    //         setTitle("");
    //         setDescription("");
    //         setUploadedImages([]);
    //       }, 3000);
    //     },
    //     onError: (error) => {
    //       alert(`Failed to submit bug report: ${error.message}`);
    //     },
    //   });

  }
  function submit(){
    const submitBug = initailizer();
    // submitBug.mutate({
    //   title: title.trim(),
    //   description: description.trim(),
    //   pageUrl,
    //   userAgent,
    //   screenshots,
    // });
  }
    return {
        submit,
        isPending:false
    };
}
