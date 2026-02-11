"use server";

import api from "@/lib/gql/server";
import { graphql } from "@/types/gql";
import { revalidatePath } from "next/cache";

export async function blockDatesAction(
  spaceId: string,
  dates: string[],
  reason?: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const result = await api.mutate({
      mutation: graphql(`
        mutation BlockDates($input: BlockDatesInput!) {
          blockDates(input: $input) {
            blockedDates {
              id
              date
            }
            errors {
              ... on Error {
                message
              }
            }
          }
        }
      `),
      variables: {
        input: {
          spaceId,
          dates,
          reason: reason || null,
        },
      },
    });

    const payload = result.data?.blockDates;

    if (payload?.errors?.length) {
      return { success: false, error: payload.errors[0].message };
    }

    revalidatePath(`/listings/${spaceId}`);
    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function unblockDatesAction(
  spaceId: string,
  dates: string[]
): Promise<{ success: boolean; error: string | null }> {
  try {
    const result = await api.mutate({
      mutation: graphql(`
        mutation UnblockDates($input: UnblockDatesInput!) {
          unblockDates(input: $input) {
            unblockedCount
            errors {
              ... on Error {
                message
              }
            }
          }
        }
      `),
      variables: {
        input: {
          spaceId,
          dates,
        },
      },
    });

    const payload = result.data?.unblockDates;

    if (payload?.errors?.length) {
      return { success: false, error: payload.errors[0].message };
    }

    revalidatePath(`/listings/${spaceId}`);
    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}
