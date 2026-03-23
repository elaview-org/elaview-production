import { ReactNode } from "react";
import { UserRole } from "@/types/gql/graphql";
import { checkRole } from "@/lib/auth/require-role";

/**
 * Server-side role guard for all @admin pages.
 * Prevents admin page queries from running for non-admin users,
 * which would otherwise trigger auth errors from the backend.
 */
export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const isAdmin = await checkRole(UserRole.Admin);

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
}
