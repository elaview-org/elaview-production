import UnderConstruction from "@/components/status/under-construction";
import { authenticatedRedirect } from "@/lib/services/auth";

export default async function Page() {
  await authenticatedRedirect();

  return <UnderConstruction />;
}
