import { useCallback } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter, Href } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { useSession } from "@/contexts/SessionContext";
import api from "@/api";
import MessagesList, {
  ConversationListItem,
} from "@/components/features/MessagesList";
import { colors } from "@/constants/theme";

const GET_MY_CONVERSATIONS = api.gql`
  query GetOwnerConversations($first: Int, $after: String) {
    myConversations(
      first: $first
      after: $after
      order: { updatedAt: DESC }
    ) {
      edges {
        cursor
        node {
          id
          bookingId
          updatedAt
          booking {
            id
            space {
              title
            }
          }
          participants {
            userId
            lastReadAt
            user {
              id
              name
              avatar
            }
          }
          messages(last: 1) {
            nodes {
              id
              content
              createdAt
              senderUserId
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export default function Messages() {
  const { theme } = useTheme();
  const { user } = useSession();
  const router = useRouter();

  const { data, loading, refetch, fetchMore } = api.query<{ myConversations: any }>(
    GET_MY_CONVERSATIONS,
    {
      variables: { first: 20 },
      fetchPolicy: "cache-and-network",
    },
  );

  const edges = data?.myConversations?.edges ?? [];
  const conversations: ConversationListItem[] = edges.map((e: any) => e.node);
  const pageInfo = data?.myConversations?.pageInfo;

  const handleConversationPress = useCallback(
    (conversation: ConversationListItem) => {
      router.push(
        `/(protected)/(owner)/conversation/${conversation.id}` as Href,
      );
    },
    [router],
  );

  const handleLoadMore = useCallback(() => {
    if (pageInfo?.hasNextPage) {
      fetchMore({ variables: { after: pageInfo.endCursor } });
    }
  }, [fetchMore, pageInfo]);

  if (loading && conversations.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <MessagesList
        conversations={conversations}
        currentUserId={user?.id ?? ""}
        loading={loading}
        onRefresh={() => refetch()}
        onConversationPress={handleConversationPress}
        onLoadMore={handleLoadMore}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
