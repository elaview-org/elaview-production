import "server-only";

import api from "@/api/server";
import { gql } from "@apollo/client";
import { UserRole } from "@/types/gql/graphql";

type MeRoleData = {
  me: { id: string; role: UserRole } | null;
};

const MeRoleQuery = gql`
  query MeRole {
    me {
      id
      role
    }
  }
`;

/**
 * Server-side role guard. Call at the top of a server component layout
 * to verify the current user has one of the allowed roles.
 *
 * Returns `true` if the user has one of the allowed roles, `false` otherwise.
 * Does NOT redirect — callers decide how to handle unauthorized access.
 */
export async function checkRole(
  ...allowedRoles: UserRole[]
): Promise<boolean> {
  try {
    const { data } = await api.query<MeRoleData>({
      query: MeRoleQuery,
      fetchPolicy: "cache-first",
    });

    if (!data?.me?.role) return false;
    return allowedRoles.includes(data.me.role);
  } catch {
    return false;
  }
}
