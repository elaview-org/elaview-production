"use server";

import api from "@/lib/gql/server";
import { graphql } from "@/types/gql";
import { revalidatePath } from "next/cache";

export interface PayoutActionResult {
  success: boolean;
  error: string | null;
}

export async function retryPayoutAction(
  payoutId: string
): Promise<PayoutActionResult> {
  try {
    const result = await api.mutate({
      mutation: graphql(`
        mutation RetryPayout($input: RetryPayoutInput!) {
          retryPayout(input: $input) {
            payout {
              id
              status
            }
            errors {
              ... on Error {
                message
              }
            }
          }
        }
      `),
      variables: { input: { payoutId } },
    });

    const payload = result.data?.retryPayout;

    if (payload?.errors?.length) {
      return { success: false, error: payload.errors[0].message };
    }

    if (!payload?.payout?.id) {
      return { success: false, error: "Failed to retry payout" };
    }

    revalidatePath("/earnings", "layout");
    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}
