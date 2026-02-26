import { UserContext } from "@/lib/providers/user-provider";
import { use } from "react";

export default function useUser() {
  const ctx = use(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used within UserProvider");
  }
  return ctx;
}
