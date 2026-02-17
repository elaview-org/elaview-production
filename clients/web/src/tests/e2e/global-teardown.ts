import { type CleanupEntry, readAll, clear } from "./helpers/cleanup-registry";
import { loginViaApi, graphqlMutation } from "./helpers/api";

const entityOrder: CleanupEntry["type"][] = [
  "review",
  "campaign",
  "space",
  "paymentMethod",
  "account",
];

const mutations: Record<
  CleanupEntry["type"],
  { query: string; variables: (entry: CleanupEntry) => Record<string, unknown> }
> = {
  review: {
    query: `mutation($input: DeleteReviewInput!) { deleteReview(input: $input) { deletedReviewId } }`,
    variables: (e) => ({ input: { id: (e as { id: string }).id } }),
  },
  campaign: {
    query: `mutation($input: DeleteCampaignInput!) { deleteCampaign(input: $input) { deletedCampaignId } }`,
    variables: (e) => ({ input: { id: (e as { id: string }).id } }),
  },
  space: {
    query: `mutation($input: DeleteSpaceInput!) { deleteSpace(input: $input) { deletedSpaceId } }`,
    variables: (e) => ({ input: { id: (e as { id: string }).id } }),
  },
  paymentMethod: {
    query: `mutation($input: DeletePaymentMethodInput!) { deletePaymentMethod(input: $input) { deletedPaymentMethodId } }`,
    variables: (e) => ({
      input: { paymentMethodId: (e as { id: string }).id },
    }),
  },
  account: {
    query: `mutation($input: DeleteMyAccountInput!) { deleteMyAccount(input: $input) { success } }`,
    variables: (e) => ({ input: { password: e.password } }),
  },
};

export default async function globalTeardown() {
  const entries = readAll();
  if (entries.length === 0) return;

  console.log(`[teardown] Cleaning up ${entries.length} test entities`);

  const cookieCache = new Map<string, string>();

  async function getAuthCookie(email: string, password: string) {
    const cached = cookieCache.get(email);
    if (cached) return cached;

    const cookie = await loginViaApi({ email, password });
    cookieCache.set(email, cookie);
    return cookie;
  }

  for (const type of entityOrder) {
    const batch = entries.filter((e) => e.type === type);
    for (const entry of batch) {
      try {
        const cookie = await getAuthCookie(entry.email, entry.password);
        const mutation = mutations[type];
        await graphqlMutation(
          cookie,
          mutation.query,
          mutation.variables(entry)
        );
        console.log(`[teardown] Deleted ${type}: ${entry.email}`);
      } catch (error) {
        console.warn(
          `[teardown] Failed to delete ${type} for ${entry.email}:`,
          error instanceof Error ? error.message : error
        );
      }
    }
  }

  clear();
  console.log("[teardown] Cleanup registry cleared");
}
