"use server";

import { revalidatePath } from "next/cache";
import serverCaller from "../../../../../elaview-mvp/src/lib/server-caller";

export async function suspendUserAction(userId: string, reason: string, pathname: string) {
  if (!reason || reason.length < 10) {
    throw new Error("Reason must be at least 10 characters");
  }

  // todo: use state action to handle errors
  try {
    const caller = await serverCaller();
    await caller.admin.users.suspendUser({ userId, reason });
    revalidatePath(pathname);
  } catch (error) {
    throw error;
  }
}
