"use server";

import api from "@/api/server";
import { revalidatePath } from "next/cache";
import { graphql, type LoadMoreNotificationsQuery } from "@/types/gql";

export async function markNotificationReadAction(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { data } = await api.mutate({
      mutation: graphql(`
        mutation MarkNotificationRead($input: MarkNotificationReadInput!) {
          markNotificationRead(input: $input) {
            notification {
              id
              isRead
              readAt
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
        input: { id },
      },
    });

    const result = data?.markNotificationRead;

    if (result?.errors?.length) {
      return { success: false, error: result.errors[0].message };
    }

    if (!result?.notification) {
      return { success: false, error: "Failed to mark notification as read" };
    }

    revalidatePath("/notifications");
    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function markAllNotificationsReadAction(): Promise<{
  success: boolean;
  count: number;
  error: string | null;
}> {
  try {
    const { data } = await api.mutate({
      mutation: graphql(`
        mutation MarkAllNotificationsRead {
          markAllNotificationsRead {
            count
          }
        }
      `),
    });

    const result = data?.markAllNotificationsRead;

    if (!result) {
      return { success: false, count: 0, error: "Failed to mark all as read" };
    }

    revalidatePath("/notifications");
    return { success: true, count: result.count, error: null };
  } catch (error) {
    return {
      success: false,
      count: 0,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function deleteNotificationAction(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { data } = await api.mutate({
      mutation: graphql(`
        mutation DeleteNotification($input: DeleteNotificationInput!) {
          deleteNotification(input: $input) {
            success
          }
        }
      `),
      variables: {
        input: { id },
      },
    });

    const result = data?.deleteNotification;

    if (!result?.success) {
      return { success: false, error: "Failed to delete notification" };
    }

    revalidatePath("/notifications");
    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

const LoadMoreNotificationsQuery = graphql(`
  query LoadMoreNotifications(
    $after: String
    $isRead: Boolean
    $type: NotificationType
  ) {
    myNotifications(
      first: 20
      after: $after
      where: { and: [{ isRead: { eq: $isRead } }, { type: { eq: $type } }] }
      order: [{ createdAt: DESC }]
    ) {
      nodes {
        id
        title
        body
        type
        isRead
        readAt
        createdAt
        entityId
        entityType
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`);

type LoadMoreResult = {
  notifications: NonNullable<
    NonNullable<LoadMoreNotificationsQuery["myNotifications"]>["nodes"]
  >;
  pageInfo: NonNullable<
    LoadMoreNotificationsQuery["myNotifications"]
  >["pageInfo"];
};

export async function loadMoreNotificationsAction(
  after?: string,
  isRead?: boolean,
  type?: string
): Promise<{
  success: boolean;
  data: LoadMoreResult | null;
  error: string | null;
}> {
  try {
    const { data, error } = await api.query({
      query: LoadMoreNotificationsQuery,
      variables: {
        after,
        isRead: isRead ?? undefined,
        type: type as never,
      },
    });

    if (error || !data?.myNotifications) {
      return {
        success: false,
        data: null,
        error: error?.message ?? "Failed to load more notifications",
      };
    }

    return {
      success: true,
      data: {
        notifications: data.myNotifications.nodes ?? [],
        pageInfo: data.myNotifications.pageInfo,
      },
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}
