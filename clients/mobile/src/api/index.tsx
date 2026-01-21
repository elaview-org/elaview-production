import {
  ApolloClient,
  ApolloLink,
  gql,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import {
  ApolloProvider,
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
import { createClient } from "graphql-ws";
import { ReactNode } from "react";
import { graphqlUrl, graphqlWsUrl } from "@/config";

const httpLink = new HttpLink({
  uri: graphqlUrl,
  credentials: "include",
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: graphqlWsUrl,
  })
);

const link = ApolloLink.split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export function ApolloWrapper({ children }: { children: ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

const api = {
  gql,
  query: useQuery,
  mutation: useMutation,
  subscription: useSubscription,
  suspenseQuery: useSuspenseQuery,
  fragment: useFragment,
  readQuery: useReadQuery,
  backgroundQuery: useBackgroundQuery,
  loadableQuery: useLoadableQuery,
  client: useApolloClient,
};

export default api;
