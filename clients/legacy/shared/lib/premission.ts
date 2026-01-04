import { permission } from "process";

type Role = keyof typeof ROLES;

type Permission = (typeof ROLES)[Role][number];

//action:resources
const ROLES = {
  admin: ["view:comments"],
} as const;

export function hasPermission(user, permission: Permission) {
  return (ROLES[user.role] as readonly Permission[]).includes(permission);
}
