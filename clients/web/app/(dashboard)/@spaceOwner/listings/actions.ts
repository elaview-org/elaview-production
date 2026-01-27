"use server";

import { cookies } from "next/headers";
import { ViewOptions } from "@/types/constants";
import storageKey from "@/lib/storage-keys";

export async function setListingsView(view: ViewOptions) {
  const cookieStore = await cookies();
  cookieStore.set(storageKey.preferences.listings.view, view, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}

export async function getListingsView(): Promise<ViewOptions> {
  const cookieStore = await cookies();
  const value = cookieStore.get(storageKey.preferences.listings.view)?.value;
  if (value === ViewOptions.Table || value === ViewOptions.Map) {
    return value;
  }
  return ViewOptions.Grid;
}