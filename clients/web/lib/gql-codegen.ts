import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.ELAVIEW_WEB_API_URL
    ? `${process.env.ELAVIEW_WEB_API_URL}/graphql`
    : "./lib/schema.graphql",
  documents: [
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "hooks/**/*.{ts,tsx}",
    "lib/**/*.{ts,tsx}",
    "api/**/*.{ts,tsx}",
    "!types/gql/**/*",
  ],
  ignoreNoDocuments: true,
  generates: {
    "./lib/schema.graphql": {
      plugins: ["schema-ast"],
      config: {
        includeDirectives: true,
      },
    },
    "./types/gql/": {
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
        defaultScalarType: "unknown",
        nonOptionalTypename: true,
        skipTypeNameForRoot: true,
        maybeValue: "T | undefined | null",
      },
    },
  },
  hooks: {
    afterAllFileWrite: [
      `sh -c 'grep -q "export \\* from \\"./graphql\\"" ./types/gql/index.ts || echo "\nexport * from \\"./graphql\\";" >> ./types/gql/index.ts'`,
    ],
  },
};

export default config;
