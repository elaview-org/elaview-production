type DemoRequestStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "DEMO_BOOKED"
  | "CLOSED_WON"
  | "CLOSED_LOST";

type DemoRequestPriority = "LOW" | "MEDIUM" | "HIGH";
export default function useUpdateDemoRequestStatus() {
  //   const updateStatus = api.admin.marketing.updateDemoRequestStatus.useMutation({
  //     onSuccess: () => {
  //       refetch();
  //     },
  //   });

  async function updateDemoRequestById({
    id,
    status,
    priority,
    notes,
  }: {
    id: string;
    status: DemoRequestStatus;
    priority?: DemoRequestPriority;
    notes?: string;
  }) {}

  return {
    updateStatus: () => {},
    updateDemoRequestById: updateDemoRequestById,
  };
}
