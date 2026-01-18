import {CodegenConfig} from "@graphql-codegen/cli";

// Use ELAVIEW_MOBILE_EXPO_PUBLIC_GRAPHQL_ENDPOINT from devbox/Doppler
// Falls back to localhost for development if not set
const graphqlEndpoint =
    process.env.ELAVIEW_MOBILE_EXPO_PUBLIC_GRAPHQL_ENDPOINT ||
    "http://localhost:7106/api/graphql";

const config: CodegenConfig = {
    overwrite: true,
    // Point to your running backend GraphQL endpoint
    schema: graphqlEndpoint,
    // Scan all source files for GraphQL operations
    documents: ["src/**/*.{ts,tsx}"],
    // Don't exit with non-zero status when there are no documents
    ignoreNoDocuments: true,
    generates: {
        // Generate TypeScript types and React Apollo hooks
        "./src/types/graphql.ts": {
            plugins: [
                "typescript",
                "typescript-operations",
                "typescript-react-apollo",
            ],
            config: {
                avoidOptionals: {
                    // Use `null` for nullable fields instead of optionals
                    field: true,
                    // Allow nullable input fields to remain unspecified
                    inputValue: false,
                },
                // Use `unknown` instead of `any` for unconfigured scalars
                defaultScalarType: "unknown",
                // Apollo Client always includes `__typename` fields
                nonOptionalTypename: true,
                // Apollo Client doesn't add the `__typename` field to root types
                skipTypeNameForRoot: true,
                maybeValue: "T | undefined | null",
                // Generate typed hooks for queries and mutations
                withHooks: true,
                // Export fragment types
                exportFragmentSpreadSubTypes: true,
            },
        },
    },
};

export default config;
