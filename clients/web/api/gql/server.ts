import { ApolloClient, gql, HttpLink, InMemoryCache } from "@apollo/client";
import { registerApolloClient } from "@apollo/client-integration-nextjs";
import { cookies } from "next/headers";

const { getClient, query, PreloadQuery } = registerApolloClient(async () => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      // this needs to be an absolute url, as relative urls cannot be used in SSR
      uri: `${process.env.ELAVIEW_WEB_NEXT_PUBLIC_API_URL!}/graphql`,
      headers: {
        cookie: (await cookies()).toString(),
      },
      fetchOptions: {
        // you can pass additional options that should be passed to `fetch` here,
        // e.g. Next.js-related `fetch` options regarding caching and revalidation
        // see https://nextjs.org/docs/app/api-reference/functions/fetch#fetchurl-options
      },
    }),
  });
});

const api = {
  gql,
  query,
  // mutate: (
  //   options: Parameters<ReturnType<typeof getClient>["mutate"]>[0]
  // ): ReturnType<ReturnType<typeof getClient>["mutate"]> =>
  //   getClient().mutate(options),
  getClient,
};

export default api;
export { PreloadQuery };
