"use client";

import {
  ApolloClient,
  ApolloNextAppProvider,
} from "@apollo/client-integration-nextjs";
import { PropsWithChildren, Suspense } from "react";

type Props = PropsWithChildren<{
  makeClient: () => ApolloClient;
}>;

export default function ApolloProvider({ makeClient, children }: Props) {
  return (
    <Suspense fallback={null}>
      <ApolloNextAppProvider makeClient={makeClient}>
        {children}
      </ApolloNextAppProvider>
    </Suspense>
  );
}
