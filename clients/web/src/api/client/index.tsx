"use client";

import auth from "./auth";
import listings from "./listings";

import { ApolloLink, HttpLink } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
} from "@apollo/client-integration-nextjs";
import { createClient } from "graphql-ws";
import React, { Suspense } from "react";
import * as apolloApi from "@apollo/client/react";
import env from "@/lib/core/env";

function makeClient() {
  const httpLink = new HttpLink({
    uri: `${env.client.apiUrl}/graphql`,
    fetchOptions: {
      credentials: "include",
    },
  });

  const wsUrl = env.client.apiUrl.replace(/^http/, "ws");
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

const api = {
  ...apolloApi,
  auth,
  listings,
} as const;
export default api;
