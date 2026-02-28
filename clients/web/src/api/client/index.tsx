"use client";

import { ApolloLink, HttpLink } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { ApolloClient, InMemoryCache } from "@apollo/client-integration-nextjs";
import { createClient } from "graphql-ws";
import * as apolloApi from "@apollo/client/react";
import env from "@/lib/core/env";
import auth from "./auth";
import listings from "./listings";
import calendar from "./calendar";
import earnings from "./earnings";

export function makeClient() {
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
    cache: new InMemoryCache({
      resultCaching: true,
      typePolicies: {
        Query: {
          fields: {
            me: { merge: true },
          },
        },
      },
    }),
    link,
  });
}

const api = {
  ...apolloApi,
  auth,
  listings,
  calendar,
  earnings,
} as const;
export default api;
