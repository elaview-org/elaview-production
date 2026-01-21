import { CodegenConfig } from "@graphql-codegen/cli";

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
    "./src/types/schema.graphql": {
      plugins: ["schema-ast"],
      config: {
        includeDirectives: true,
      },
    },
    "./src/types/graphql.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
      config: {
        avoidOptionals: {
          field: true,
          inputValue: false,
        },
        defaultScalarType: "unknown",
        nonOptionalTypename: true,
        skipTypeNameForRoot: true,
        maybeValue: "T | undefined | null",
        withHooks: true,
        exportFragmentSpreadSubTypes: true,
        apolloReactHooksImportFrom: "@apollo/client/react",
      },
    },
  },
};

export default config;
