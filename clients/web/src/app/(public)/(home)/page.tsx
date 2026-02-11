import { authenticatedRedirect } from "@/lib/services/auth";

export default async function Page() {
  await authenticatedRedirect();

  return <div>Elaview</div>;
}
