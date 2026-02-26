"use server";

import api from "@/api/server";
import { graphql } from "@/types/gql";
import { revalidatePath } from "next/cache";

export interface BookingActionResult {
  success: boolean;
  error: string | null;
}

export interface BulkActionResult {
  success: boolean;
  successCount: number;
  failedCount: number;
  errors: string[];
}

export async function approveBookingAction(
  id: string,
  ownerNotes?: string
): Promise<BookingActionResult> {
  try {
    const result = await api.mutate({
      mutation: graphql(`
        mutation ApproveBooking($input: ApproveBookingInput!) {
          approveBooking(input: $input) {
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
      variables: { input: { id, ownerNotes } },
    });

    const payload = result.data?.approveBooking;

    if (payload?.errors?.length) {
      return { success: false, error: payload.errors[0].message };
    }

    if (!payload?.booking?.id) {
      return { success: false, error: "Failed to approve booking" };
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

export async function rejectBookingAction(
  id: string,
  reason: string
): Promise<BookingActionResult> {
  try {
    const result = await api.mutate({
      mutation: graphql(`
        mutation RejectBooking($input: RejectBookingInput!) {
          rejectBooking(input: $input) {
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

    const payload = result.data?.rejectBooking;

    if (payload?.errors?.length) {
      return { success: false, error: payload.errors[0].message };
    }

    if (!payload?.booking?.id) {
      return { success: false, error: "Failed to reject booking" };
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

export async function cancelBookingAction(
  id: string,
  reason: string
): Promise<BookingActionResult> {
  try {
    const result = await api.mutate({
      mutation: graphql(`
        mutation CancelBooking($input: CancelBookingInput!) {
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

export async function markFileDownloadedAction(
  id: string
): Promise<BookingActionResult> {
  try {
    const result = await api.mutate({
      mutation: graphql(`
        mutation MarkFileDownloaded($input: MarkFileDownloadedInput!) {
          markFileDownloaded(input: $input) {
            booking {
              id
              status
              fileDownloadedAt
            }
            errors {
              ... on Error {
                message
              }
            }
          }
        }
      `),
      variables: { input: { id } },
    });

    const payload = result.data?.markFileDownloaded;

    if (payload?.errors?.length) {
      return { success: false, error: payload.errors[0].message };
    }

    if (!payload?.booking?.id) {
      return { success: false, error: "Failed to mark file as downloaded" };
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

export async function markInstalledAction(
  id: string
): Promise<BookingActionResult> {
  try {
    const result = await api.mutate({
      mutation: graphql(`
        mutation MarkInstalled($input: MarkInstalledInput!) {
          markInstalled(input: $input) {
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
      variables: { input: { id } },
    });

    const payload = result.data?.markInstalled;

    if (payload?.errors?.length) {
      return { success: false, error: payload.errors[0].message };
    }

    if (!payload?.booking?.id) {
      return { success: false, error: "Failed to mark as installed" };
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

export async function bulkApproveBookingsAction(
  ids: string[]
): Promise<BulkActionResult> {
  const results = await Promise.all(
    ids.map(async (id) => {
      const result = await approveBookingAction(id);
      return result;
    })
  );

  const successCount = results.filter((r) => r.success).length;
  const failedCount = results.filter((r) => !r.success).length;
  const errors = results.filter((r) => r.error).map((r) => r.error as string);

  revalidatePath("/bookings");

  return {
    success: failedCount === 0,
    successCount,
    failedCount,
    errors,
  };
}

export async function bulkRejectBookingsAction(
  ids: string[],
  reason: string
): Promise<BulkActionResult> {
  const results = await Promise.all(
    ids.map(async (id) => {
      const result = await rejectBookingAction(id, reason);
      return result;
    })
  );

  const successCount = results.filter((r) => r.success).length;
  const failedCount = results.filter((r) => !r.success).length;
  const errors = results.filter((r) => r.error).map((r) => r.error as string);

  revalidatePath("/bookings");

  return {
    success: failedCount === 0,
    successCount,
    failedCount,
    errors,
  };
}

export async function submitProofAction(
  bookingId: string,
  photoUrls: string[]
): Promise<BookingActionResult> {
  try {
    const result = await api.mutate({
      mutation: graphql(`
        mutation SubmitProof($input: SubmitProofInput!) {
          submitProof(input: $input) {
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
      variables: { input: { bookingId, photoUrls } },
    });

    const payload = result.data?.submitProof;

    if (payload?.errors?.length) {
      return { success: false, error: payload.errors[0].message };
    }

    if (!payload?.booking?.id) {
      return { success: false, error: "Failed to submit verification photos" };
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
        mutation CreateBookingConversation(
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
