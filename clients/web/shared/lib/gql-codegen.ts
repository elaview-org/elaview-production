import { CodegenConfig } from "@graphql-codegen/cli";
import { config as dotenvConfig } from "dotenv";

// Load environment variables from .env file
dotenvConfig();

const config: CodegenConfig = {
  overwrite: true,
  schema: `${process.env.NEXT_PUBLIC_API_URL!}/graphql`,
  // This assumes that all your source files are in a top-level `src/` directory - you might need to adjust this to your file structure
  documents: ["app/**/*.{ts,tsx}", "shared/**/*.{ts,tsx}"],
  // Don't exit with non-zero status when there are no documents
  ignoreNoDocuments: true,
  generates: {
    // Download the schema file
    "./shared/lib/schema.graphql": {
      plugins: ["schema-ast"],
      config: {
        includeDirectives: true,
      },
    },
    // Generate TypeScript types
    "./shared/types/graphql.generated.ts": {
      plugins: ["typescript", "typescript-operations"],
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
        // Apollo Client doesn't add the `__typename` field to root types so
        // don't generate a type for the `__typename` for root operation types.
        skipTypeNameForRoot: true,
        maybeValue: "T | undefined | null",
      },
    },
  },
};

export default config;
