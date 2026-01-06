# Handy Commands

### Regenerate GraphQL types after backend made changes

```bash
cd ../../backend && docker compose up --build -d && cd -
pnpm graphql-codegen --config shared/lib/gql-codegen.ts
cd ../../backend && docker compose down && cd -
```

