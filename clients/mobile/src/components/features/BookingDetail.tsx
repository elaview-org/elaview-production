import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { useRouter, useLocalSearchParams, Href } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import api from "@/api";
import { useTheme } from "@/contexts/ThemeContext";
import { useSession } from "@/contexts/SessionContext";
import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import {
  BookingStatus,
  ProfileType,
  type Mutation,
  type Query,
} from "@/types/graphql";
import { spacing, fontSize, colors, borderRadius } from "@/constants/theme";

const GET_BOOKING = api.gql`
  query GetBookingDetail($id: ID!) {
    bookingById(id: $id) {
      id
      status
      startDate
      endDate
      totalDays
      pricePerDay
      installationFee
      subtotalAmount
      platformFeeAmount
      platformFeePercent
      totalAmount
      ownerPayoutAmount
      advertiserNotes
      ownerNotes
      rejectionReason
      cancellationReason
      createdAt
      updatedAt
      space {
        id
        title
        type
        images
        address
        city
        state
        spaceOwnerProfile {
          user { id name }
        }
      }
      campaign {
        id
        name
        advertiserProfile {
          user { id name }
        }
      }
      proof {
        id
        status
        photos
        submittedAt
        reviewedAt
        rejectionReason
      }
    }
  }
`;

const APPROVE_BOOKING = api.gql`
  mutation ApproveBooking($input: ApproveBookingInput!) {
    approveBooking(input: $input) {
      booking { id status ownerNotes }
      errors { ... on NotFoundError { message } ... on ForbiddenError { message } ... on InvalidStatusTransitionError { message } }
    }
  }
`;

const REJECT_BOOKING = api.gql`
  mutation RejectBooking($input: RejectBookingInput!) {
    rejectBooking(input: $input) {
      booking { id status rejectionReason }
      errors { ... on NotFoundError { message } ... on ForbiddenError { message } ... on InvalidStatusTransitionError { message } }
    }
  }
`;

const CANCEL_BOOKING = api.gql`
  mutation CancelBooking($input: CancelBookingInput!) {
    cancelBooking(input: $input) {
      booking { id status cancellationReason }
      errors { ... on NotFoundError { message } ... on ForbiddenError { message } ... on InvalidStatusTransitionError { message } }
    }
  }
`;

interface BookingDetailProps {
  perspective: "owner" | "advertiser";
}

export default function BookingDetail({ perspective }: BookingDetailProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { profileType } = useSession();

  const [rejectReason, setRejectReason] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [showCancelInput, setShowCancelInput] = useState(false);

  const { data, loading, refetch } = api.query<Pick<Query, "bookingById">>(
    GET_BOOKING,
    {
      variables: { id },
      skip: !id,
      fetchPolicy: "cache-and-network",
    }
  );

  const [approveMutation, { loading: approving }] = api.mutation<
    Pick<Mutation, "approveBooking">
  >(APPROVE_BOOKING);

  const [rejectMutation, { loading: rejecting }] = api.mutation<
    Pick<Mutation, "rejectBooking">
  >(REJECT_BOOKING);

  const [cancelMutation, { loading: cancelling }] = api.mutation<
    Pick<Mutation, "cancelBooking">
  >(CANCEL_BOOKING);

  const booking = data?.bookingById;
  const isOwner = perspective === "owner";

  if (loading && !data) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.background }]}>
        <Ionicons name="alert-circle-outline" size={48} color={theme.textMuted} />
        <Text style={[styles.errorTitle, { color: theme.text }]}>Booking not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const space = booking.space;
  const spacePhoto = space?.images?.[0];
  const ownerName = space?.spaceOwnerProfile?.user?.name ?? "Unknown";
  const advertiserName = booking.campaign?.advertiserProfile?.user?.name ?? "Unknown";
  const counterpartyLabel = isOwner ? "Advertiser" : "Space Owner";
  const counterpartyName = isOwner ? advertiserName : ownerName;

  const handleApprove = () => {
    Alert.alert("Approve Booking", "Are you sure you want to approve this booking request?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Approve",
        onPress: async () => {
          const { data: result } = await approveMutation({
            variables: { input: { id: booking.id } },
          });
          const errors = result?.approveBooking?.errors;
          if (errors?.length) {
            Alert.alert("Error", (errors[0] as any).message);
          } else {
            Alert.alert("Approved", "The booking has been approved.");
            refetch();
          }
        },
      },
    ]);
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      Alert.alert("Required", "Please provide a reason for declining.");
      return;
    }
    const { data: result } = await rejectMutation({
      variables: { input: { id: booking.id, reason: rejectReason.trim() } },
    });
    const errors = result?.rejectBooking?.errors;
    if (errors?.length) {
      Alert.alert("Error", (errors[0] as any).message);
    } else {
      Alert.alert("Declined", "The booking has been declined.");
      setShowRejectInput(false);
      setRejectReason("");
      refetch();
    }
  };

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      Alert.alert("Required", "Please provide a reason for cancellation.");
      return;
    }
    const { data: result } = await cancelMutation({
      variables: { input: { id: booking.id, reason: cancelReason.trim() } },
    });
    const errors = result?.cancelBooking?.errors;
    if (errors?.length) {
      Alert.alert("Error", (errors[0] as any).message);
    } else {
      Alert.alert("Cancelled", "The booking has been cancelled.");
      setShowCancelInput(false);
      setCancelReason("");
      refetch();
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const canApproveReject =
    isOwner && booking.status === BookingStatus.PendingApproval;
  const canCancel =
    booking.status === BookingStatus.PendingApproval ||
    booking.status === BookingStatus.Approved ||
    booking.status === BookingStatus.Paid;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={theme.text} />
        <Text style={[styles.backText, { color: theme.text }]}>Back</Text>
      </TouchableOpacity>

      {/* Space Hero */}
      <Card style={styles.heroCard}>
        {spacePhoto ? (
          <Image source={{ uri: spacePhoto }} style={styles.heroImage} />
        ) : (
          <View style={[styles.heroImage, styles.heroPlaceholder]}>
            <Ionicons name="image-outline" size={40} color={colors.gray400} />
          </View>
        )}
        <View style={styles.heroContent}>
          <Text style={[styles.spaceTitle, { color: theme.text }]}>
            {space?.title ?? "Untitled Space"}
          </Text>
          {space && (
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={14} color={theme.textSecondary} />
              <Text style={[styles.locationText, { color: theme.textSecondary }]}>
                {space.city}, {space.state}
              </Text>
            </View>
          )}
          <StatusBadge status={booking.status} style={{ marginTop: spacing.sm }} />
        </View>
      </Card>

      {/* Counterparty */}
      <Card style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          {counterpartyLabel}
        </Text>
        <View style={styles.counterpartyRow}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={20} color={colors.primary} />
          </View>
          <Text style={[styles.counterpartyName, { color: theme.text }]}>
            {counterpartyName}
          </Text>
        </View>
      </Card>

      {/* Booking Dates */}
      <Card style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          BOOKING DATES
        </Text>
        <View style={styles.dateRow}>
          <View style={styles.dateItem}>
            <Text style={[styles.dateLabel, { color: theme.textSecondary }]}>Start</Text>
            <Text style={[styles.dateValue, { color: theme.text }]}>
              {formatDate(booking.startDate as string)}
            </Text>
          </View>
          <Ionicons name="arrow-forward" size={16} color={theme.textMuted} />
          <View style={styles.dateItem}>
            <Text style={[styles.dateLabel, { color: theme.textSecondary }]}>End</Text>
            <Text style={[styles.dateValue, { color: theme.text }]}>
              {formatDate(booking.endDate as string)}
            </Text>
          </View>
        </View>
        <Text style={[styles.totalDays, { color: theme.textSecondary }]}>
          {booking.totalDays} day{booking.totalDays !== 1 ? "s" : ""}
        </Text>
      </Card>

      {/* Pricing */}
      <Card style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          PRICING BREAKDOWN
        </Text>
        <View style={styles.priceRow}>
          <Text style={[styles.priceLabel, { color: theme.textSecondary }]}>
            Daily rate × {booking.totalDays} days
          </Text>
          <Text style={[styles.priceValue, { color: theme.text }]}>
            ${Number(booking.subtotalAmount).toFixed(2)}
          </Text>
        </View>
        {Number(booking.installationFee) > 0 && (
          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: theme.textSecondary }]}>
              Installation fee
            </Text>
            <Text style={[styles.priceValue, { color: theme.text }]}>
              ${Number(booking.installationFee).toFixed(2)}
            </Text>
          </View>
        )}
        <View style={styles.priceRow}>
          <Text style={[styles.priceLabel, { color: theme.textSecondary }]}>
            Platform fee ({Number(booking.platformFeePercent)}%)
          </Text>
          <Text style={[styles.priceValue, { color: theme.text }]}>
            ${Number(booking.platformFeeAmount).toFixed(2)}
          </Text>
        </View>
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <View style={styles.priceRow}>
          <Text style={[styles.totalLabel, { color: theme.text }]}>Total</Text>
          <Text style={[styles.totalValue, { color: theme.text }]}>
            ${Number(booking.totalAmount).toFixed(2)}
          </Text>
        </View>
        {isOwner && (
          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: colors.success }]}>
              Your payout
            </Text>
            <Text style={[styles.priceValue, { color: colors.success }]}>
              ${Number(booking.ownerPayoutAmount).toFixed(2)}
            </Text>
          </View>
        )}
      </Card>

      {/* Notes */}
      {booking.advertiserNotes && (
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            ADVERTISER NOTES
          </Text>
          <Text style={[styles.notesText, { color: theme.text }]}>
            {booking.advertiserNotes}
          </Text>
        </Card>
      )}

      {booking.ownerNotes && (
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            OWNER NOTES
          </Text>
          <Text style={[styles.notesText, { color: theme.text }]}>
            {booking.ownerNotes}
          </Text>
        </Card>
      )}

      {/* Rejection / Cancellation reason */}
      {booking.rejectionReason && (
        <Card style={{ ...styles.section, borderLeftWidth: 3, borderLeftColor: colors.error }}>
          <Text style={[styles.sectionTitle, { color: colors.error }]}>
            DECLINE REASON
          </Text>
          <Text style={[styles.notesText, { color: theme.text }]}>
            {booking.rejectionReason}
          </Text>
        </Card>
      )}

      {booking.cancellationReason && (
        <Card style={{ ...styles.section, borderLeftWidth: 3, borderLeftColor: colors.warning }}>
          <Text style={[styles.sectionTitle, { color: colors.warning }]}>
            CANCELLATION REASON
          </Text>
          <Text style={[styles.notesText, { color: theme.text }]}>
            {booking.cancellationReason}
          </Text>
        </Card>
      )}

      {/* Proof of Installation */}
      {booking.proof && (
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            PROOF OF INSTALLATION
          </Text>
          <StatusBadge status={booking.proof.status as any} style={{ marginBottom: spacing.sm }} />
          {Array.isArray(booking.proof.photos) && booking.proof.photos.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {booking.proof.photos.map((photo: any, idx: number) => (
                <Image
                  key={idx}
                  source={{ uri: String(photo) }}
                  style={styles.proofPhoto}
                />
              ))}
            </ScrollView>
          )}
          {booking.proof.submittedAt ? (
            <Text style={[styles.proofDate, { color: theme.textSecondary }]}>
              Submitted {formatDate(booking.proof.submittedAt as string)}
            </Text>
          ) : null}
        </Card>
      )}

      {/* Actions */}
      {canApproveReject && !showRejectInput && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.approveButton]}
            onPress={handleApprove}
            disabled={approving}
          >
            {approving ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={20} color={colors.white} />
                <Text style={styles.actionButtonText}>Approve</Text>
              </>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => setShowRejectInput(true)}
          >
            <Ionicons name="close-circle" size={20} color={colors.white} />
            <Text style={styles.actionButtonText}>Decline</Text>
          </TouchableOpacity>
        </View>
      )}

      {showRejectInput && (
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            DECLINE REASON
          </Text>
          <TextInput
            style={[styles.reasonInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.backgroundSecondary }]}
            placeholder="Why are you declining this request?"
            placeholderTextColor={theme.textMuted}
            value={rejectReason}
            onChangeText={setRejectReason}
            multiline
          />
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              onPress={handleReject}
              disabled={rejecting}
            >
              {rejecting ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.actionButtonText}>Confirm Decline</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.gray400 }]}
              onPress={() => {
                setShowRejectInput(false);
                setRejectReason("");
              }}
            >
              <Text style={styles.actionButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Card>
      )}

      {canCancel && !isOwner && !showCancelInput && (
        <TouchableOpacity
          style={[styles.cancelLink]}
          onPress={() => setShowCancelInput(true)}
        >
          <Ionicons name="close-circle-outline" size={18} color={colors.error} />
          <Text style={styles.cancelLinkText}>Cancel Booking</Text>
        </TouchableOpacity>
      )}

      {showCancelInput && (
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            CANCELLATION REASON
          </Text>
          <TextInput
            style={[styles.reasonInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.backgroundSecondary }]}
            placeholder="Why are you cancelling?"
            placeholderTextColor={theme.textMuted}
            value={cancelReason}
            onChangeText={setCancelReason}
            multiline
          />
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              onPress={handleCancel}
              disabled={cancelling}
            >
              {cancelling ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.actionButtonText}>Confirm Cancel</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.gray400 }]}
              onPress={() => {
                setShowCancelInput(false);
                setCancelReason("");
              }}
            >
              <Text style={styles.actionButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </Card>
      )}

      {/* Timeline */}
      <Card style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          TIMELINE
        </Text>
        <View style={styles.timelineItem}>
          <Ionicons name="add-circle" size={16} color={colors.primary} />
          <Text style={[styles.timelineText, { color: theme.textSecondary }]}>
            Created {formatDate(booking.createdAt as string)}
          </Text>
        </View>
        <View style={styles.timelineItem}>
          <Ionicons name="refresh-circle" size={16} color={colors.primary} />
          <Text style={[styles.timelineText, { color: theme.textSecondary }]}>
            Updated {formatDate(booking.updatedAt as string)}
          </Text>
        </View>
      </Card>

      {/* View Space Button */}
      {space && (
        <TouchableOpacity
          style={styles.viewSpaceButton}
          onPress={() => {
            const prefix = isOwner ? "/(protected)/(owner)" : "/(protected)/(advertiser)";
            router.push(`${prefix}/space/${space.id}` as Href);
          }}
        >
          <Ionicons name="open-outline" size={18} color={colors.primary} />
          <Text style={styles.viewSpaceText}>View Space Listing</Text>
        </TouchableOpacity>
      )}

      <View style={{ height: spacing.xxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    padding: spacing.md,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  backText: {
    fontSize: fontSize.md,
    fontWeight: "500",
    marginLeft: spacing.xs,
  },
  errorTitle: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    marginTop: spacing.md,
  },
  backLink: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: "600",
    marginTop: spacing.md,
  },
  heroCard: {
    marginBottom: spacing.md,
    padding: 0,
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
    height: 180,
    backgroundColor: colors.gray100,
  },
  heroPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  heroContent: {
    padding: spacing.md,
  },
  spaceTitle: {
    fontSize: fontSize.xl,
    fontWeight: "700",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.xs,
  },
  locationText: {
    fontSize: fontSize.sm,
    marginLeft: 4,
  },
  section: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.xs,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  counterpartyRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.sm,
  },
  counterpartyName: {
    fontSize: fontSize.md,
    fontWeight: "600",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateItem: {
    flex: 1,
  },
  dateLabel: {
    fontSize: fontSize.xs,
    marginBottom: 2,
  },
  dateValue: {
    fontSize: fontSize.md,
    fontWeight: "600",
  },
  totalDays: {
    fontSize: fontSize.sm,
    marginTop: spacing.sm,
    textAlign: "center",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  priceLabel: {
    fontSize: fontSize.sm,
  },
  priceValue: {
    fontSize: fontSize.sm,
    fontWeight: "600",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: spacing.sm,
  },
  totalLabel: {
    fontSize: fontSize.md,
    fontWeight: "700",
  },
  totalValue: {
    fontSize: fontSize.md,
    fontWeight: "700",
  },
  notesText: {
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  proofPhoto: {
    width: 120,
    height: 90,
    borderRadius: borderRadius.md,
    marginRight: spacing.sm,
    backgroundColor: colors.gray100,
  },
  proofDate: {
    fontSize: fontSize.xs,
    marginTop: spacing.sm,
  },
  actionRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.xs,
  },
  approveButton: {
    backgroundColor: colors.success,
  },
  rejectButton: {
    backgroundColor: colors.error,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: "600",
  },
  cancelLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  cancelLinkText: {
    color: colors.error,
    fontSize: fontSize.md,
    fontWeight: "500",
  },
  reasonInput: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSize.sm,
    minHeight: 80,
    textAlignVertical: "top",
    marginBottom: spacing.md,
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  timelineText: {
    fontSize: fontSize.sm,
  },
  viewSpaceButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  viewSpaceText: {
    color: colors.primary,
    fontSize: fontSize.md,
    fontWeight: "600",
  },
});
