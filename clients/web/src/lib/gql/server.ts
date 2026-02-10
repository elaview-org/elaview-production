import "server-only";

import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  type OperationVariables,
  type TypedDocumentNode,
} from "@apollo/client";
import type { DocumentTypeDecoration } from "@graphql-typed-document-node/core";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { registerApolloClient } from "@apollo/client-integration-nextjs";
import { cookies } from "next/headers";
import { type FragmentType, getFragmentData } from "@/types/gql";
import env from "@/lib/core/env";
import { redirect } from "next/navigation";

const {
  getClient,
  query: _query,
  PreloadQuery,
} = registerApolloClient(
  async () =>
    new ApolloClient({
      cache: new InMemoryCache({
        resultCaching: true,
      }),
      queryDeduplication: true,
      link: new HttpLink({
        uri: `${env.client.apiUrl}/graphql`,
        headers: {
          cookie: (await cookies()).toString(),
        },
        fetchOptions: {},
      }),
    })
);

function throwIfAuthError(error: unknown) {
  if (
    CombinedGraphQLErrors.is(error) &&
    error.errors.some((e) => e.extensions?.code === "AUTH_NOT_AUTHENTICATED")
  ) {
    redirect("/logout");
  }
}

type CacheOptions = {
  revalidate?: number | false;
  tags?: string[];
};

async function query<
  TData = unknown,
  TVariables extends OperationVariables = OperationVariables,
>(options: ApolloClient.QueryOptions<TData, TVariables> & CacheOptions) {
  const { revalidate, tags, ...rest } = options;
  const queryOptions = rest as ApolloClient.QueryOptions<TData, TVariables>;

  queryOptions.context = {
    ...queryOptions.context,
    fetchPolicy: queryOptions.fetchPolicy ?? "cache-first",
    ...((revalidate !== undefined || tags) && {
      fetchOptions: {
        next: {
          ...(revalidate !== undefined && { revalidate }),
          ...(tags && { tags }),
        },
      },
    }),
  } as typeof queryOptions.context;

  try {
    const result = await _query(queryOptions);
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

function createFragmentReader<TQuery>(queryFn: () => Promise<TQuery>) {
  return async <TType>(
    fragment: DocumentTypeDecoration<TType, unknown>
  ): Promise<TType> => {
    const data = await queryFn();
    return getFragmentData(fragment, data as FragmentType<typeof fragment>);
  };
}

const api = {
  query,
  mutate,
  getClient,
  createFragmentReader,
};

export default api;
export { PreloadQuery };
