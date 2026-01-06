# GraphQL Setup for client repos

Assuming your API directory is "/shared/api" (relative to the repo root directory) and 
you already have apollo client set up, run the following command to obtain the graphql
schema:

```bash
curl https://localhost:7106/api/graphql/schema.graphql > "/shared/api"
```

Or, if you opt into HTTP/3:

```bash
curl https://<your-public-domain>:7106/api/graphql/schema.graphql > "/shared/api"
```