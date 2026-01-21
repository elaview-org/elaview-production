import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { spacing, fontSize, colors, borderRadius } from "@/constants/theme";
import {
  mockEarningsSummary,
  mockTransactions,
  mockPayouts,
  formatCurrency,
  EarningsTransaction,
} from "@/mocks/earnings";

export default function Earnings() {
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleWithdraw = () => {
    // TODO: Navigate to withdrawal flow
  };

  const renderTransaction = (transaction: EarningsTransaction) => {
    const isPositive = transaction.amount > 0;
    return (
      <View
        key={transaction.id}
        style={[styles.transactionRow, { borderBottomColor: theme.border }]}
      >
        <View style={styles.transactionIcon}>
          <Ionicons
            name={isPositive ? "arrow-down-circle" : "arrow-up-circle"}
            size={24}
            color={isPositive ? colors.success : theme.textSecondary}
          />
        </View>
        <View style={styles.transactionDetails}>
          <Text style={[styles.transactionTitle, { color: theme.text }]}>
            {transaction.description}
          </Text>
          {transaction.spaceTitle && (
            <Text
              style={[
                styles.transactionSubtitle,
                { color: theme.textSecondary },
              ]}
            >
              {transaction.spaceTitle}
            </Text>
          )}
          <Text style={[styles.transactionDate, { color: theme.textMuted }]}>
            {transaction.createdAt.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </Text>
        </View>
        <Text
          style={[
            styles.transactionAmount,
            { color: isPositive ? colors.success : theme.text },
          ]}
        >
          {isPositive ? "+" : ""}
          {formatCurrency(transaction.amount)}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
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
          {formatCurrency(mockEarningsSummary.availableBalance)}
        </Text>
        <View style={styles.pendingRow}>
          <Ionicons name="time-outline" size={14} color={colors.warning} />
          <Text style={[styles.pendingText, { color: theme.textSecondary }]}>
            {formatCurrency(mockEarningsSummary.pendingBalance)} pending
          </Text>
        </View>
        <Button
          title="Withdraw Funds"
          onPress={handleWithdraw}
          variant="primary"
          fullWidth
          style={styles.withdrawButton}
        />
      </Card>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            This Month
          </Text>
          <Text style={[styles.statValue, { color: theme.text }]}>
            {formatCurrency(mockEarningsSummary.thisMonthEarnings)}
          </Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            Last Month
          </Text>
          <Text style={[styles.statValue, { color: theme.text }]}>
            {formatCurrency(mockEarningsSummary.lastMonthEarnings)}
          </Text>
        </Card>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Recent Activity
          </Text>
          <TouchableOpacity>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>
              See All
            </Text>
          </TouchableOpacity>
        </View>
        <Card style={styles.transactionsCard}>
          {mockTransactions.slice(0, 5).map(renderTransaction)}
        </Card>
      </View>

      {/* Payout Methods */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Payout Method
          </Text>
          <TouchableOpacity>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>
              Edit
            </Text>
          </TouchableOpacity>
        </View>
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
                Bank Account
              </Text>
              <Text
                style={[styles.payoutSubtitle, { color: theme.textSecondary }]}
              >
                ••••4567
              </Text>
            </View>
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultBadgeText}>Default</Text>
            </View>
          </View>
        </Card>
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
});
