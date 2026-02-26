"use server";

import api from "@/api/server";
import { graphql } from "@/types/gql";
import { revalidatePath } from "next/cache";

export interface RefundActionResult {
  success: boolean;
  error: string | null;
}

export async function requestRefundAction(
  paymentId: string,
  amount: number,
  reason: string
): Promise<RefundActionResult> {
  try {
    const result = await api.mutate({
      mutation: graphql(`
        mutation RequestRefund($input: RequestRefundInput!) {
          requestRefund(input: $input) {
            refund {
              id
              amount
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
      variables: { input: { paymentId, amount, reason } },
    });

    const payload = result.data?.requestRefund;

    if (payload?.errors?.length) {
      return { success: false, error: payload.errors[0].message };
    }

    if (!payload?.refund?.id) {
      return { success: false, error: "Failed to request refund" };
    }

    revalidatePath("/spending", "layout");
    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}
