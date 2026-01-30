import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  type OperationVariables,
  type TypedDocumentNode,
} from "@apollo/client";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { registerApolloClient } from "@apollo/client-integration-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import env from "@/lib/env";

const {
  getClient,
  query: _query,
  PreloadQuery,
} = registerApolloClient(async () => {
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

function throwIfAuthError(error: unknown) {
  if (
    CombinedGraphQLErrors.is(error) &&
    error.errors.some((e) => e.extensions?.code === "AUTH_NOT_AUTHENTICATED")
  ) {
    redirect("/logout");
  }
}

async function query<
  TData = unknown,
  TVariables extends OperationVariables = OperationVariables,
>(options: ApolloClient.QueryOptions<TData, TVariables>) {
  try {
    const result = await _query(options);
    throwIfAuthError(result.error);
    return result;
  } catch (error) {
    throwIfAuthError(error);
    throw error;
  }
}

type MutationInput<TData, TVariables extends OperationVariables> = {
  mutation: TypedDocumentNode<TData, TVariables>;
  variables?: TVariables;
};

async function mutate<
  TData,
  TVariables extends OperationVariables = OperationVariables,
>(options: MutationInput<TData, TVariables>) {
  try {
    const client = await getClient();
    const result = await client.mutate<TData, TVariables>({
      mutation: options.mutation,
      ...(options.variables && { variables: options.variables }),
    } as Parameters<typeof client.mutate<TData, TVariables>>[0]);
    throwIfAuthError(result.error);
    return result;
  } catch (error) {
    throwIfAuthError(error);
    throw error;
  }
}

const api = {
  query,
  mutate,
  getClient,
};

export default api;
export { PreloadQuery };
