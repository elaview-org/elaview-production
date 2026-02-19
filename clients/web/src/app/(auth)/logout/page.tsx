"use client";

import { useEffect } from "react";
import api from "@/api/client";

export default function Page() {
  const { logout } = api.auth.useLogout();

  useEffect(() => {
    logout();
  }, [logout]);
}
