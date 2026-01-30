"use client";

import { useEffect } from "react";
import { logout } from "@/lib/auth.actions";

export default function Page() {
  useEffect(() => {
    void logout();
  }, []);
}
