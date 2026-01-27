import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  type OperationVariables,
  type TypedDocumentNode,
} from "@apollo/client";
import { registerApolloClient } from "@apollo/client-integration-nextjs";
import { cookies } from "next/headers";
import env from "@/lib/env";

const { getClient, query, PreloadQuery } = registerApolloClient(async () => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: `${env.client.apiUrl}/graphql`,
      headers: {
        cookie: (await cookies()).toString(),
      },
      fetchOptions: {},
    }),
  });
});

type MutationInput<TData, TVariables extends OperationVariables> = {
  mutation: TypedDocumentNode<TData, TVariables>;
  variables?: TVariables;
};

async function mutate<
  TData,
  TVariables extends OperationVariables = OperationVariables,
>(options: MutationInput<TData, TVariables>) {
  const client = await getClient();
  return client.mutate<TData, TVariables>({
    mutation: options.mutation,
    ...(options.variables && { variables: options.variables }),
  } as Parameters<typeof client.mutate<TData, TVariables>>[0]);
}

const api = {
  query,
  mutate,
  // getClient,
};

export default api;
export { PreloadQuery };
