import { authenticatedRedirect } from "@/lib/utils";

export default async function Page() {
  await authenticatedRedirect();

  return null;
}
