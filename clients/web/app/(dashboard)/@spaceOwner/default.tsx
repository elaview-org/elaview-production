"use client";

import useIsSharedRoute from "@/hooks/use-is-shared-route";
import { notFound } from "next/navigation";

export default function Default() {
  if (useIsSharedRoute()) return null;
  notFound();
}
