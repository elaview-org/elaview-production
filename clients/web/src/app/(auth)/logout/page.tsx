"use client";

import { useEffect } from "react";
import { logout } from "@/lib/services/auth.actions";

export default function Page() {
  useEffect(() => {
    void logout();
  }, []);
}
