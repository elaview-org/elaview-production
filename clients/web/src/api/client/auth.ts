"use client";

import { useActionState, useTransition } from "react";
import { type ProfileType } from "@/types/gql";
import { login, logout, signup, switchProfile } from "./auth.actions";

function useLogin() {
  return useActionState(login, {
    success: false,
    message: "",
    data: { email: "", password: "" },
  });
}

function useSignup() {
  return useActionState(signup, {
    success: false,
    message: "",
    data: { name: "", email: "", password: "", confirmPassword: "" },
  });
}

function useLogout() {
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await logout();
    });
  }

  return { logout: handleLogout, isPending };
}

function useSwitchProfile() {
  const [isPending, startTransition] = useTransition();

  function handleSwitchProfile(targetProfileType: ProfileType) {
    startTransition(async () => {
      await switchProfile(targetProfileType);
    });
  }

  return { switchProfile: handleSwitchProfile, isPending };
}

const auth = {
  useLogin,
  useLogout,
  useSignup,
  useSwitchProfile,
};
export default auth;
