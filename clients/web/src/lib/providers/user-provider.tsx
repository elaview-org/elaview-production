"use client";

import { createContext, ReactNode, use } from "react";
import { ResultOf } from "@graphql-typed-document-node/core";
import { FragmentType, getFragmentData, graphql } from "@/types/gql";

const UserProvider_UserFragment = graphql(`
  fragment UserProvider_UserFragment on User {
    id
    role
    activeProfileType
    email
    name
    avatar
  }
`);

type UserData = ResultOf<typeof UserProvider_UserFragment>;

const UserContext = createContext<UserData | null>(null);

type Props = {
  children: ReactNode;
  data: FragmentType<typeof UserProvider_UserFragment>;
};

export default function UserProvider({ children, data }: Props) {
  return (
    <UserContext value={getFragmentData(UserProvider_UserFragment, data)}>
      {children}
    </UserContext>
  );
}

export function useUser(): UserData {
  const ctx = use(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
