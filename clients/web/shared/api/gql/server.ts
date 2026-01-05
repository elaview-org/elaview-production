import {ApolloClient, gql, HttpLink, InMemoryCache} from "@apollo/client";
import {registerApolloClient} from "@apollo/client-integration-nextjs";

const {getClient, query, PreloadQuery} = registerApolloClient(() => {
    return new ApolloClient({
        cache: new InMemoryCache(),
        link: new HttpLink({
            // this needs to be an absolute url, as relative urls cannot be used in SSR
            uri: process.env.NEXT_PUBLIC_API_SERVER_URL!,
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
    mutate: (options: Parameters<ReturnType<typeof getClient>['mutate']>[0])
        : ReturnType<ReturnType<typeof getClient>['mutate']> =>
        getClient().mutate(options),
    getClient,
};

export default api;
export {PreloadQuery};
