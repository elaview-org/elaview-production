import { authenticatedRedirect } from "@/lib/auth";

export default async function Page() {
  await authenticatedRedirect();

  return null;
}
