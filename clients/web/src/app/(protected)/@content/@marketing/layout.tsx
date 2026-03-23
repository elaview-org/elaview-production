import { ReactNode } from "react";
import { UserRole } from "@/types/gql/graphql";
import { checkRole } from "@/lib/auth/require-role";

/**
 * Server-side role guard for all @marketing pages.
 * Marketing pages are accessible to both Admin and Marketing roles.
 * Prevents queries from running for unauthorized users.
 */
export default async function MarketingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const isAuthorized = await checkRole(UserRole.Admin, UserRole.Marketing);

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
