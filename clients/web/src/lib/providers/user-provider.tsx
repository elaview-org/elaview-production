"use client";

import { createContext, ReactNode } from "react";
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

export const UserContext = createContext<ResultOf<
  typeof UserProvider_UserFragment
> | null>(null);

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
