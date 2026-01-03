type DemoRequestStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "DEMO_BOOKED"
  | "CLOSED_WON"
  | "CLOSED_LOST";
type DemoRequestPriority = "LOW" | "MEDIUM" | "HIGH";
type DemoRequest = {
  id: string;
  status: DemoRequestStatus;
  name:string;
  email:string;
  phone:string;
  company:string;
  companySize:string|number;
  priority: DemoRequestPriority;
  createdAt:string;
  message:string;
  notes:string;
  contactedAt:string;
  updatedAt:string;
  source:string;
};

export default function useDemoRequests() {
  //   const { data, isLoading, refetch } = api.admin.marketing.getDemoRequests.useQuery({
  //     status: statusFilter === 'ALL' ? undefined : statusFilter,
  //     search: searchQuery || undefined,
  //     limit: 100,
  //   });

  return {
    data: {
      requests: [
        {
          id: "1",
          status: "NEW",
          name: "Alice Smith",
          email: "alice@example.com",
          phone: "123-456-7890",
          company: "Acme Corp",
          companySize: 50,
          priority: "HIGH",
          createdAt: "2024-06-05T12:00:00Z",
          message: "Interested in a product demo.",
          notes: "",
          contactedAt: "",
          updatedAt: "2024-06-05T12:00:00Z",
          source: "Website",
        },
        {
          id: "2",
          status: "CONTACTED",
          name: "Bob Johnson",
          email: "bob@example.com",
          phone: "987-654-3210",
          company: "Beta Inc",
          companySize: 200,
          priority: "MEDIUM",
          createdAt: "2024-06-04T09:30:00Z",
          message: "Would like to see an advanced demo.",
          notes: "Followed up by email.",
          contactedAt: "2024-06-05T10:00:00Z",
          updatedAt: "2024-06-05T10:01:00Z",
          source: "Referral",
        }
      ] as DemoRequest[],
    },
    isLoading: false,
    refetch: () => {},
  };
}
