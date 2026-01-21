"use client";

import { ApolloLink, gql, HttpLink } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
} from "@apollo/client-integration-nextjs";
import { createClient } from "graphql-ws";
import React, { Suspense } from "react";

import {
  useApolloClient,
  useBackgroundQuery,
  useFragment,
  useLoadableQuery,
  useMutation,
  useQuery,
  useReadQuery,
  useSubscription,
  useSuspenseQuery,
} from "@apollo/client/react";

function makeClient() {
  const httpLink = new HttpLink({
    uri: `${process.env.NEXT_PUBLIC_API_URL!}/graphql`,
    fetchOptions: {
      credentials: "include",
    },
  });

  const wsUrl = process.env.NEXT_PUBLIC_API_URL!.replace(/^http/, "ws");
  const wsLink =
    typeof window !== "undefined"
      ? new GraphQLWsLink(
          createClient({
            url: `${wsUrl}/graphql`,
            connectionParams: () => ({}),
          })
        )
      : null;

  const link = wsLink
    ? ApolloLink.split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
          );
        },
        wsLink,
        httpLink
      )
    : httpLink;

  return new ApolloClient({
    cache: new InMemoryCache(),
    link,
  });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <Suspense fallback={null}>
      <ApolloNextAppProvider makeClient={makeClient}>
        {children}
      </ApolloNextAppProvider>
    </Suspense>
  );
}

export {
  gql,
  useQuery,
  useMutation,
  useSubscription,
  useSuspenseQuery,
  useFragment,
  useReadQuery,
  useBackgroundQuery,
  useLoadableQuery,
  useApolloClient,
};
