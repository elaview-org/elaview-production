"use client";

import { gql, HttpLink } from "@apollo/client";
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
} from "@apollo/client-integration-nextjs";
import React, { Suspense } from "react";

import {
  useApolloClient,
  useBackgroundQuery,
  useFragment,
  useLoadableQuery,
  useMutation,
  useQuery,
  useReadQuery,
  useSuspenseQuery,
} from "@apollo/client/react";

function makeClient() {
  const httpLink = new HttpLink({
    // this needs to be an absolute url, as relative urls cannot be used in SSR
    uri: `${process.env.ELAVIEW_WEB_NEXT_PUBLIC_API_URL!}/graphql`,
    // you can disable result caching here if you want to
    // (this does not work if you are rendering your page with `export const dynamic = "force-static"`)
    fetchOptions: {
      credentials: "include",
      // you can pass additional options that should be passed to `fetch` here,
      // e.g. Next.js-related `fetch` options regarding caching and revalidation
      // see https://nextjs.org/docs/app/api-reference/functions/fetch#fetchurl-options
    },
    // you can override the default `fetchOptions` on a per query basis
    // via the `context` property on the options passed as a second argument
    // to an Apollo Client data fetching hook, e.g.:
    // const { data } = useSuspenseQuery(MY_QUERY, { context: { fetchOptions: { ... }}});
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: httpLink,
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
  gql,
  useQuery,
  useMutation,
  useSuspenseQuery,
  useFragment,
  useReadQuery,
  useBackgroundQuery,
  useLoadableQuery,
  useApolloClient,
};

export default api;
