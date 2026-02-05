import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.ELAVIEW_WEB_API_URL
    ? `${process.env.ELAVIEW_WEB_API_URL}/graphql`
    : "./src/lib/gql/schema.graphql",
  documents: [
    "src/app/**/*.{ts,tsx}",
    "src/components/**/*.{ts,tsx}",
    "src/lib/**/*.{ts,tsx}",
    "!src/types/gql/**/*",
  ],
  ignoreNoDocuments: true,
  generates: {
    "./src/lib/gql/schema.graphql": {
      plugins: ["schema-ast"],
      config: {
        includeDirectives: true,
      },
    },
    "./src/types/gql/": {
      preset: "client",
      presetConfig: {
        fragmentMasking: {
          unmaskFunctionName: "getFragmentData",
        },
      },
      config: {
        avoidOptionals: {
          field: true,
          inputValue: false,
        },
        scalars: {
          Decimal: "number",
          DateTime: "string",
          Date: "string",
          UUID: "string",
          Long: "number",
        },
        defaultScalarType: "unknown",
        nonOptionalTypename: true,
        skipTypeNameForRoot: true,
        maybeValue: "T | undefined | null",
      },
    },
  },
  hooks: {
    afterAllFileWrite: [
      `sh -c 'grep -q "export \\* from \\"./graphql\\"" ./src/types/gql/index.ts || echo "\nexport * from \\"./graphql\\";" >> ./src/types/gql/index.ts'`,
    ],
  },
};

export default config;
