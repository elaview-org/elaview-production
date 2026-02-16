import { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Linking,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { spacing, fontSize, colors, borderRadius } from "@/constants/theme";
import api from "@/api";
import type { PayoutStatus } from "@/types/graphql";

// ── Queries & Mutations ──────────────────────────────────────────────

const EARNINGS_SUMMARY = api.gql`
  query EarningsSummary {
    earningsSummary {
      availableBalance
      pendingPayouts
      totalEarnings
      thisMonthEarnings
      lastMonthEarnings
    }
  }
`;

const MY_PAYOUTS = api.gql`
  query MyPayouts($first: Int, $after: String) {
    myPayouts(first: $first, after: $after, order: [{ createdAt: DESC }]) {
      edges {
        cursor
        node {
          id
          amount
          status
          stage
          createdAt
          processedAt
          failureReason
          booking {
            id
            space {
              id
              title
            }
            startDate
            endDate
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

const STRIPE_ACCOUNT_STATUS = api.gql`
  query StripeAccountStatus {
    me {
      id
      spaceOwnerProfile {
        id
        stripeAccountId
        stripeAccountStatus
      }
    }
  }
`;

const CONNECT_STRIPE = api.gql`
  mutation ConnectStripeAccount {
    connectStripeAccount {
      accountId
      onboardingUrl
      errors {
        ... on PaymentError { message }
        ... on NotFoundError { message }
      }
    }
  }
`;

// ── Helpers ──────────────────────────────────────────────────────────

function formatCurrency(value: number | null | undefined): string {
  return `$${(value ?? 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function payoutStatusLabel(status: PayoutStatus): string {
  const map: Record<PayoutStatus, string> = {
    COMPLETED: "Completed",
    PENDING: "Pending",
    PROCESSING: "Processing",
    FAILED: "Failed",
    PARTIALLY_PAID: "Partial",
  };
  return map[status] ?? status;
}

function payoutStatusColor(status: PayoutStatus): string {
  switch (status) {
    case "COMPLETED":
      return colors.success;
    case "PENDING":
    case "PROCESSING":
      return colors.warning;
    case "FAILED":
      return colors.error;
    default:
      return colors.primary;
  }
}

// ── Payout node type ─────────────────────────────────────────────────

interface PayoutNode {
  id: string;
  amount: number;
  status: PayoutStatus;
  stage: string;
  createdAt: string;
  processedAt: string | null;
  failureReason: string | null;
  booking: {
    id: string;
    space: { id: string; title: string } | null;
    startDate: string;
    endDate: string;
  };
}

// ── Component ────────────────────────────────────────────────────────

export default function Earnings() {
  const { theme } = useTheme();

  const {
    data: summaryData,
    loading: summaryLoading,
    refetch: refetchSummary,
  } = api.query<{ earningsSummary: any }>(EARNINGS_SUMMARY);

  const {
    data: payoutsData,
    loading: payoutsLoading,
    refetch: refetchPayouts,
    fetchMore,
  } = api.query<{ myPayouts: any }>(MY_PAYOUTS, {
    variables: { first: 10 },
  });

  const {
    data: stripeData,
    refetch: refetchStripe,
  } = api.query<{ me: any }>(STRIPE_ACCOUNT_STATUS);

  const [connectStripe, { loading: connectingStripe }] =
    api.mutation(CONNECT_STRIPE);

  const summary = summaryData?.earningsSummary;
  const payoutEdges = payoutsData?.myPayouts?.edges ?? [];
  const payouts: PayoutNode[] = payoutEdges.map((e: any) => e.node);
  const pageInfo = payoutsData?.myPayouts?.pageInfo;

  const stripeProfile = stripeData?.me?.spaceOwnerProfile;
  const stripeConnected = !!stripeProfile?.stripeAccountId;
  const stripeStatus = stripeProfile?.stripeAccountStatus as string | null;

  const loading = summaryLoading && !summaryData;

  const onRefresh = useCallback(async () => {
    await Promise.all([refetchSummary(), refetchPayouts(), refetchStripe()]);
  }, [refetchSummary, refetchPayouts, refetchStripe]);

  const handleLoadMore = useCallback(() => {
    if (!pageInfo?.hasNextPage) return;
    fetchMore({ variables: { after: pageInfo.endCursor } });
  }, [fetchMore, pageInfo]);

  const handleConnectStripe = useCallback(async () => {
    try {
      const { data } = await connectStripe();
      const result = (data as any)?.connectStripeAccount;
      const url = result?.onboardingUrl as string | undefined;
      const errors = result?.errors as Array<{ message: string }> | undefined;
      if (errors?.length) {
        Alert.alert("Error", errors[0].message);
        return;
      }
      if (url) {
        await Linking.openURL(url);
      }
    } catch {
      Alert.alert("Error", "Failed to connect Stripe account.");
    }
  }, [connectStripe]);

  const renderPayout = (payout: PayoutNode) => {
    const spaceTitle = payout.booking.space?.title ?? "Unknown Space";
    const date = new Date(payout.createdAt);

    return (
      <View
        key={payout.id}
        style={[styles.transactionRow, { borderBottomColor: theme.border }]}
      >
        <View style={styles.transactionIcon}>
          <Ionicons
            name={
              payout.status === "COMPLETED"
                ? "checkmark-circle"
                : payout.status === "FAILED"
                  ? "close-circle"
                  : "time"
            }
            size={24}
            color={payoutStatusColor(payout.status)}
          />
        </View>
        <View style={styles.transactionDetails}>
          <Text style={[styles.transactionTitle, { color: theme.text }]}>
            {spaceTitle}
          </Text>
          <Text
            style={[
              styles.transactionSubtitle,
              { color: theme.textSecondary },
            ]}
          >
            {payoutStatusLabel(payout.status)}
          </Text>
          <Text style={[styles.transactionDate, { color: theme.textMuted }]}>
            {date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </Text>
        </View>
        <Text
          style={[styles.transactionAmount, { color: colors.success }]}
        >
          +{formatCurrency(payout.amount)}
        </Text>
      </View>
    );
  };

  // ── Loading state ────────────────────────────────────────────────

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: theme.background, justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={summaryLoading && !!summaryData}
          onRefresh={onRefresh}
          tintColor={theme.textMuted}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Balance Card */}
      <Card style={styles.balanceCard}>
        <Text style={[styles.balanceLabel, { color: theme.textSecondary }]}>
          Available Balance
        </Text>
        <Text style={[styles.balanceAmount, { color: theme.text }]}>
          {formatCurrency(summary?.availableBalance)}
        </Text>
        <View style={styles.pendingRow}>
          <Ionicons name="time-outline" size={14} color={colors.warning} />
          <Text style={[styles.pendingText, { color: theme.textSecondary }]}>
            {formatCurrency(summary?.pendingPayouts)} pending
          </Text>
        </View>
        {stripeConnected && (
          <Button
            title="Withdraw Funds"
            onPress={() => {
              // TODO: Navigate to withdrawal flow
            }}
            variant="primary"
            fullWidth
            style={styles.withdrawButton}
          />
        )}
      </Card>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            This Month
          </Text>
          <Text style={[styles.statValue, { color: theme.text }]}>
            {formatCurrency(summary?.thisMonthEarnings)}
          </Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            Last Month
          </Text>
          <Text style={[styles.statValue, { color: theme.text }]}>
            {formatCurrency(summary?.lastMonthEarnings)}
          </Text>
        </Card>
      </View>

      {/* Recent Payouts */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Recent Payouts
          </Text>
          {pageInfo?.hasNextPage && (
            <TouchableOpacity onPress={handleLoadMore}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>
                Load More
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <Card style={styles.transactionsCard}>
          {payoutsLoading && payouts.length === 0 ? (
            <View style={styles.emptyState}>
              <ActivityIndicator size="small" color={theme.textMuted} />
            </View>
          ) : payouts.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="wallet-outline"
                size={32}
                color={theme.textMuted}
              />
              <Text
                style={[styles.emptyStateText, { color: theme.textMuted }]}
              >
                No payouts yet
              </Text>
            </View>
          ) : (
            payouts.map(renderPayout)
          )}
        </Card>
      </View>

      {/* Payout Method (Stripe) */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Payout Method
          </Text>
        </View>
        {stripeConnected ? (
          <Card style={styles.payoutMethodCard}>
            <View style={styles.payoutMethod}>
              <View
                style={[
                  styles.payoutIcon,
                  { backgroundColor: theme.backgroundSecondary },
                ]}
              >
                <Ionicons name="card-outline" size={20} color={theme.text} />
              </View>
              <View style={styles.payoutDetails}>
                <Text style={[styles.payoutTitle, { color: theme.text }]}>
                  Stripe Account
                </Text>
                <Text
                  style={[
                    styles.payoutSubtitle,
                    { color: theme.textSecondary },
                  ]}
                >
                  {stripeStatus === "active"
                    ? "Active"
                    : stripeStatus ?? "Connected"}
                </Text>
              </View>
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultBadgeText}>Default</Text>
              </View>
            </View>
          </Card>
        ) : (
          <Card style={styles.payoutMethodCard}>
            <View style={styles.connectPrompt}>
              <Ionicons
                name="warning-outline"
                size={24}
                color={colors.warning}
              />
              <Text
                style={[
                  styles.connectPromptText,
                  { color: theme.textSecondary },
                ]}
              >
                Connect a Stripe account to receive payouts
              </Text>
              <Button
                title={connectingStripe ? "Connecting..." : "Connect Stripe"}
                onPress={handleConnectStripe}
                variant="primary"
                fullWidth
                style={styles.connectButton}
              />
            </View>
          </Card>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  balanceCard: {
    padding: spacing.lg,
    alignItems: "center",
    marginBottom: spacing.md,
  },
  balanceLabel: {
    fontSize: fontSize.sm,
    marginBottom: spacing.xs,
  },
  balanceAmount: {
    fontSize: 40,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  pendingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  pendingText: {
    fontSize: fontSize.sm,
    marginLeft: spacing.xs,
  },
  withdrawButton: {
    marginTop: spacing.sm,
  },
  statsRow: {
    flexDirection: "row",
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    padding: spacing.md,
    marginRight: spacing.sm,
  },
  statLabel: {
    fontSize: fontSize.xs,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: "700",
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: "600",
  },
  seeAllText: {
    fontSize: fontSize.sm,
    fontWeight: "500",
  },
  transactionsCard: {
    padding: 0,
  },
  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  transactionIcon: {
    marginRight: spacing.md,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: fontSize.md,
    fontWeight: "500",
  },
  transactionSubtitle: {
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  transactionDate: {
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: fontSize.md,
    fontWeight: "600",
  },
  payoutMethodCard: {
    padding: spacing.md,
  },
  payoutMethod: {
    flexDirection: "row",
    alignItems: "center",
  },
  payoutIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  payoutDetails: {
    flex: 1,
  },
  payoutTitle: {
    fontSize: fontSize.md,
    fontWeight: "500",
  },
  payoutSubtitle: {
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  defaultBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  defaultBadgeText: {
    color: colors.primary,
    fontSize: fontSize.xs,
    fontWeight: "600",
  },
  emptyState: {
    padding: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    fontSize: fontSize.sm,
    marginTop: spacing.sm,
  },
  connectPrompt: {
    alignItems: "center",
    padding: spacing.md,
  },
  connectPromptText: {
    fontSize: fontSize.sm,
    textAlign: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  connectButton: {
    marginTop: spacing.xs,
  },
});
