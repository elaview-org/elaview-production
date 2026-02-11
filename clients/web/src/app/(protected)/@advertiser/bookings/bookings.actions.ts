"use server";

import api from "@/lib/gql/server";
import { graphql } from "@/types/gql";
import type { DisputeIssueType } from "@/types/gql/graphql";
import { revalidatePath } from "next/cache";

export interface BookingActionResult {
  success: boolean;
  error: string | null;
}

export async function cancelBookingAction(
  id: string,
  reason: string
): Promise<BookingActionResult> {
  try {
    const result = await api.mutate({
      mutation: graphql(`
        mutation AdvertiserCancelBooking($input: CancelBookingInput!) {
          cancelBooking(input: $input) {
            booking {
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
      variables: { input: { id, reason } },
    });

    const payload = result.data?.cancelBooking;

    if (payload?.errors?.length) {
      return { success: false, error: payload.errors[0].message };
    }

    if (!payload?.booking?.id) {
      return { success: false, error: "Failed to cancel booking" };
    }

    revalidatePath("/bookings");
    revalidatePath(`/bookings/${id}`);
    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function approveProofAction(
  bookingId: string
): Promise<BookingActionResult> {
  try {
    const result = await api.mutate({
      mutation: graphql(`
        mutation ApproveProof($input: ApproveProofInput!) {
          approveProof(input: $input) {
            booking {
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
      variables: { input: { bookingId } },
    });

    const payload = result.data?.approveProof;

    if (payload?.errors?.length) {
      return { success: false, error: payload.errors[0].message };
    }

    if (!payload?.booking?.id) {
      return { success: false, error: "Failed to approve installation" };
    }

    revalidatePath("/bookings");
    revalidatePath(`/bookings/${bookingId}`);
    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function disputeProofAction(
  bookingId: string,
  issueType: DisputeIssueType,
  reason: string
): Promise<BookingActionResult> {
  try {
    const result = await api.mutate({
      mutation: graphql(`
        mutation DisputeProof($input: DisputeProofInput!) {
          disputeProof(input: $input) {
            booking {
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
      variables: { input: { bookingId, issueType, reason } },
    });

    const payload = result.data?.disputeProof;

    if (payload?.errors?.length) {
      return { success: false, error: payload.errors[0].message };
    }

    if (!payload?.booking?.id) {
      return { success: false, error: "Failed to submit dispute" };
    }

    revalidatePath("/bookings");
    revalidatePath(`/bookings/${bookingId}`);
    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function createBookingConversationAction(
  bookingId: string
): Promise<{
  success: boolean;
  conversationId?: string;
  error: string | null;
}> {
  try {
    const result = await api.mutate({
      mutation: graphql(`
        mutation AdvertiserCreateBookingConversation(
          $input: CreateBookingConversationInput!
        ) {
          createBookingConversation(input: $input) {
            conversation {
              id
            }
            errors {
              ... on Error {
                message
              }
            }
          }
        }
      `),
      variables: { input: { bookingId } },
    });

    const payload = result.data?.createBookingConversation;

    if (payload?.errors?.length) {
      return { success: false, error: payload.errors[0].message };
    }

    if (!payload?.conversation?.id) {
      return { success: false, error: "Failed to create conversation" };
    }

    return {
      success: true,
      conversationId: payload.conversation.id,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}
