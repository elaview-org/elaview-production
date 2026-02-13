#!/bin/sh
SID="620e8bde-b451-4fe6-8889-01bc4a504115"
EID="98474d47-bd03-4aac-a3f5-e004447e7227"

payload=$(cat <<EOF
{"query":"mutation { serviceDomainDelete(input: { serviceId: \\"${SID}\\", environmentId: \\"${EID}\\", domain: \\"server-staging-8fd8.up.railway.app\\" }) }"}
EOF
)

curl -X POST "https://backboard.railway.com/graphql/v2" \
  -H "Authorization: Bearer $ELAVIEW_RAILWAY_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$payload"

echo ""
echo "---"
echo "Now creating with custom name..."

payload=$(cat <<EOF
{"query":"mutation { serviceDomainCreate(input: { serviceId: \\"${SID}\\", environmentId: \\"${EID}\\", domain: \\"elaview-api-staging\\" }) { domain } }"}
EOF
)

curl -X POST "https://backboard.railway.com/graphql/v2" \
  -H "Authorization: Bearer $ELAVIEW_RAILWAY_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$payload"