/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** The `DateTime` scalar represents an ISO-8601 compliant date time type. */
  DateTime: { input: string; output: string; }
  /** The `Decimal` scalar type represents a decimal floating-point number. */
  Decimal: { input: number; output: number; }
  /** The `LocalDate` scalar type represents a ISO date string, represented as UTF-8 character sequences YYYY-MM-DD. The scalar follows the specification defined in RFC3339 */
  LocalDate: { input: unknown; output: unknown; }
  /** The `Long` scalar type represents non-fractional signed whole 64-bit numeric values. Long can represent values between -(2^63) and 2^63 - 1. */
  Long: { input: number; output: number; }
  UUID: { input: string; output: string; }
};

export type ActivityEvent = {
  id: Scalars['UUID']['output'];
  timestamp: Scalars['DateTime']['output'];
  type: Scalars['String']['output'];
};

export type AdvertiserAnalytics = {
  __typename: 'AdvertiserAnalytics';
  endDate: Scalars['DateTime']['output'];
  monthlyStats: Array<AdvertiserMonthlyStats>;
  periodComparison: AdvertiserPeriodComparison;
  spacePerformance: Array<AdvertiserSpacePerformance>;
  startDate: Scalars['DateTime']['output'];
  statusDistribution: Array<StatusCount>;
  summary: AdvertiserSummary;
  topPerformers: AdvertiserTopPerformers;
  userId: Scalars['UUID']['output'];
};


export type AdvertiserAnalyticsMonthlyStatsArgs = {
  months: Scalars['Int']['input'];
};


export type AdvertiserAnalyticsSpacePerformanceArgs = {
  first: Scalars['Int']['input'];
};

export type AdvertiserAttentionItem = {
  __typename: 'AdvertiserAttentionItem';
  id: Scalars['UUID']['output'];
  impressions: Scalars['Long']['output'];
  roi: Maybe<Scalars['Decimal']['output']>;
  title: Scalars['String']['output'];
};

export type AdvertiserMonthlyStats = {
  __typename: 'AdvertiserMonthlyStats';
  impressions: Scalars['Long']['output'];
  month: Scalars['String']['output'];
  spending: Maybe<Scalars['Decimal']['output']>;
};

export type AdvertiserPeriodComparison = {
  __typename: 'AdvertiserPeriodComparison';
  current: AdvertiserPeriodData;
  previous: AdvertiserPeriodData;
};

export type AdvertiserPeriodData = {
  __typename: 'AdvertiserPeriodData';
  bookings: Scalars['Int']['output'];
  endDate: Scalars['DateTime']['output'];
  impressions: Scalars['Long']['output'];
  period: Scalars['String']['output'];
  roi: Maybe<Scalars['Decimal']['output']>;
  spending: Maybe<Scalars['Decimal']['output']>;
  startDate: Scalars['DateTime']['output'];
};

export type AdvertiserProfile = {
  __typename: 'AdvertiserProfile';
  campaigns: Maybe<CampaignsConnection>;
  companyName: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['UUID']['output'];
  industry: Maybe<Scalars['String']['output']>;
  onboardingComplete: Scalars['Boolean']['output'];
  savedPaymentMethods: Array<SavedPaymentMethod>;
  stripeAccountDisconnectedAt: Maybe<Scalars['DateTime']['output']>;
  stripeAccountDisconnectedNotifiedAt: Maybe<Scalars['DateTime']['output']>;
  stripeAccountId: Maybe<Scalars['String']['output']>;
  stripeAccountStatus: Maybe<Scalars['String']['output']>;
  stripeCustomerId: Maybe<Scalars['String']['output']>;
  stripeLastAccountHealthCheck: Maybe<Scalars['DateTime']['output']>;
  totalSpend: Scalars['Decimal']['output'];
  user: User;
  userId: Scalars['UUID']['output'];
  website: Maybe<Scalars['String']['output']>;
};


export type AdvertiserProfileCampaignsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<CampaignSortInput>>;
  where?: InputMaybe<CampaignFilterInput>;
};

export type AdvertiserProfileFilterInput = {
  and?: InputMaybe<Array<AdvertiserProfileFilterInput>>;
  campaigns?: InputMaybe<ListFilterInputTypeOfCampaignFilterInput>;
  companyName?: InputMaybe<StringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  industry?: InputMaybe<StringOperationFilterInput>;
  onboardingComplete?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<AdvertiserProfileFilterInput>>;
  savedPaymentMethods?: InputMaybe<ListFilterInputTypeOfSavedPaymentMethodFilterInput>;
  stripeAccountDisconnectedAt?: InputMaybe<DateTimeOperationFilterInput>;
  stripeAccountDisconnectedNotifiedAt?: InputMaybe<DateTimeOperationFilterInput>;
  stripeAccountId?: InputMaybe<StringOperationFilterInput>;
  stripeAccountStatus?: InputMaybe<StringOperationFilterInput>;
  stripeCustomerId?: InputMaybe<StringOperationFilterInput>;
  stripeLastAccountHealthCheck?: InputMaybe<DateTimeOperationFilterInput>;
  user?: InputMaybe<UserFilterInput>;
  userId?: InputMaybe<UuidOperationFilterInput>;
  website?: InputMaybe<StringOperationFilterInput>;
};

export type AdvertiserProfileSortInput = {
  companyName?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  industry?: InputMaybe<SortEnumType>;
  onboardingComplete?: InputMaybe<SortEnumType>;
  stripeAccountDisconnectedAt?: InputMaybe<SortEnumType>;
  stripeAccountDisconnectedNotifiedAt?: InputMaybe<SortEnumType>;
  stripeAccountId?: InputMaybe<SortEnumType>;
  stripeAccountStatus?: InputMaybe<SortEnumType>;
  stripeCustomerId?: InputMaybe<SortEnumType>;
  stripeLastAccountHealthCheck?: InputMaybe<SortEnumType>;
  user?: InputMaybe<UserSortInput>;
  userId?: InputMaybe<SortEnumType>;
  website?: InputMaybe<SortEnumType>;
};

export type AdvertiserSpacePerformance = {
  __typename: 'AdvertiserSpacePerformance';
  id: Scalars['UUID']['output'];
  image: Maybe<Scalars['String']['output']>;
  impressions: Scalars['Long']['output'];
  roi: Maybe<Scalars['Decimal']['output']>;
  title: Scalars['String']['output'];
  totalBookings: Scalars['Int']['output'];
  totalSpend: Maybe<Scalars['Decimal']['output']>;
};

export type AdvertiserSummary = {
  __typename: 'AdvertiserSummary';
  avgCostPerImpression: Maybe<Scalars['Decimal']['output']>;
  completionRate: Maybe<Scalars['Decimal']['output']>;
  previousAvgCostPerImpression: Maybe<Scalars['Decimal']['output']>;
  previousCompletionRate: Maybe<Scalars['Decimal']['output']>;
  previousReach: Scalars['Int']['output'];
  previousRoi: Maybe<Scalars['Decimal']['output']>;
  previousTotalBookings: Scalars['Int']['output'];
  previousTotalImpressions: Scalars['Long']['output'];
  previousTotalSpend: Maybe<Scalars['Decimal']['output']>;
  reach: Scalars['Int']['output'];
  roi: Maybe<Scalars['Decimal']['output']>;
  totalBookings: Scalars['Int']['output'];
  totalImpressions: Scalars['Long']['output'];
  totalSpend: Maybe<Scalars['Decimal']['output']>;
};

export type AdvertiserTopPerformers = {
  __typename: 'AdvertiserTopPerformers';
  bestRoi: Maybe<PerformerItem>;
  bestValue: Maybe<PerformerItem>;
  mostBookings: Maybe<PerformerItem>;
  mostImpressions: Maybe<PerformerItem>;
  needsReview: Maybe<AdvertiserAttentionItem>;
};

/** Defines when a policy shall be executed. */
export enum ApplyPolicy {
  /** After the resolver was executed. */
  AfterResolver = 'AFTER_RESOLVER',
  /** Before the resolver was executed. */
  BeforeResolver = 'BEFORE_RESOLVER',
  /** The policy is applied in the validation step before the execution. */
  Validation = 'VALIDATION'
}

export type ApproveBookingError = ForbiddenError | InvalidStatusTransitionError | NotFoundError;

export type ApproveBookingInput = {
  id: Scalars['ID']['input'];
  ownerNotes?: InputMaybe<Scalars['String']['input']>;
};

export type ApproveBookingPayload = {
  __typename: 'ApproveBookingPayload';
  booking: Maybe<Booking>;
  errors: Maybe<Array<ApproveBookingError>>;
};

export type AttentionItem = {
  __typename: 'AttentionItem';
  bookings: Scalars['Int']['output'];
  id: Scalars['UUID']['output'];
  occupancy: Maybe<Scalars['Decimal']['output']>;
  title: Scalars['String']['output'];
};

export type BlockDatesError = ConflictError | ForbiddenError | NotFoundError | ValidationError;

export type BlockDatesInput = {
  dates: Array<Scalars['LocalDate']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
  spaceId: Scalars['ID']['input'];
};

export type BlockDatesPayload = {
  __typename: 'BlockDatesPayload';
  blockedDates: Maybe<Array<BlockedDate>>;
  errors: Maybe<Array<BlockDatesError>>;
};

export type BlockedDate = {
  __typename: 'BlockedDate';
  createdAt: Scalars['DateTime']['output'];
  date: Scalars['LocalDate']['output'];
  id: Scalars['UUID']['output'];
  reason: Maybe<Scalars['String']['output']>;
  space: Space;
  spaceId: Scalars['UUID']['output'];
};

export type BlockedDateFilterInput = {
  and?: InputMaybe<Array<BlockedDateFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  date?: InputMaybe<LocalDateOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  or?: InputMaybe<Array<BlockedDateFilterInput>>;
  reason?: InputMaybe<StringOperationFilterInput>;
  space?: InputMaybe<SpaceFilterInput>;
  spaceId?: InputMaybe<UuidOperationFilterInput>;
};

export type BlockedDateSortInput = {
  createdAt?: InputMaybe<SortEnumType>;
  date?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  reason?: InputMaybe<SortEnumType>;
  space?: InputMaybe<SpaceSortInput>;
  spaceId?: InputMaybe<SortEnumType>;
};

/** A connection to a list of items. */
export type BlockedDatesBySpaceConnection = {
  __typename: 'BlockedDatesBySpaceConnection';
  /** A list of edges. */
  edges: Maybe<Array<BlockedDatesBySpaceEdge>>;
  /** A flattened list of the nodes. */
  nodes: Maybe<Array<BlockedDate>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type BlockedDatesBySpaceEdge = {
  __typename: 'BlockedDatesBySpaceEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: BlockedDate;
};

export type Booking = {
  __typename: 'Booking';
  advertiserNotes: Maybe<Scalars['String']['output']>;
  campaign: Maybe<Campaign>;
  campaignId: Scalars['UUID']['output'];
  cancellationReason: Maybe<Scalars['String']['output']>;
  cancelledAt: Maybe<Scalars['DateTime']['output']>;
  cancelledByUser: Maybe<User>;
  cancelledByUserId: Maybe<Scalars['UUID']['output']>;
  createdAt: Scalars['DateTime']['output'];
  dispute: Maybe<BookingDispute>;
  endDate: Scalars['DateTime']['output'];
  fileDownloadedAt: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['UUID']['output'];
  installationFee: Scalars['Decimal']['output'];
  ownerNotes: Maybe<Scalars['String']['output']>;
  ownerPayoutAmount: Scalars['Decimal']['output'];
  payments: Array<Payment>;
  payouts: Array<Payout>;
  platformFeeAmount: Scalars['Decimal']['output'];
  platformFeePercent: Scalars['Decimal']['output'];
  pricePerDay: Scalars['Decimal']['output'];
  proof: Maybe<BookingProof>;
  rejectedAt: Maybe<Scalars['DateTime']['output']>;
  rejectionReason: Maybe<Scalars['String']['output']>;
  reviews: Array<Review>;
  space: Maybe<Space>;
  spaceId: Scalars['UUID']['output'];
  startDate: Scalars['DateTime']['output'];
  status: BookingStatus;
  subtotalAmount: Scalars['Decimal']['output'];
  totalAmount: Scalars['Decimal']['output'];
  totalDays: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};


export type BookingPaymentsArgs = {
  order?: InputMaybe<Array<PaymentSortInput>>;
  where?: InputMaybe<PaymentFilterInput>;
};


export type BookingPayoutsArgs = {
  order?: InputMaybe<Array<PayoutSortInput>>;
  where?: InputMaybe<PayoutFilterInput>;
};


export type BookingReviewsArgs = {
  order?: InputMaybe<Array<ReviewSortInput>>;
  where?: InputMaybe<ReviewFilterInput>;
};

export type BookingActivity = ActivityEvent & {
  __typename: 'BookingActivity';
  booking: Booking;
  id: Scalars['UUID']['output'];
  timestamp: Scalars['DateTime']['output'];
  type: Scalars['String']['output'];
};

export type BookingDispute = {
  __typename: 'BookingDispute';
  booking: Booking;
  bookingId: Scalars['UUID']['output'];
  createdAt: Scalars['DateTime']['output'];
  disputedAt: Scalars['DateTime']['output'];
  disputedByUser: User;
  disputedByUserId: Scalars['UUID']['output'];
  id: Scalars['UUID']['output'];
  issueType: DisputeIssueType;
  photos: Array<Scalars['String']['output']>;
  reason: Scalars['String']['output'];
  resolutionAction: Maybe<Scalars['String']['output']>;
  resolutionNotes: Maybe<Scalars['String']['output']>;
  resolvedAt: Maybe<Scalars['DateTime']['output']>;
  resolvedByUser: Maybe<User>;
  resolvedByUserId: Maybe<Scalars['UUID']['output']>;
};

export type BookingDisputeFilterInput = {
  and?: InputMaybe<Array<BookingDisputeFilterInput>>;
  booking?: InputMaybe<BookingFilterInput>;
  bookingId?: InputMaybe<UuidOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  disputedAt?: InputMaybe<DateTimeOperationFilterInput>;
  disputedByUser?: InputMaybe<UserFilterInput>;
  disputedByUserId?: InputMaybe<UuidOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  issueType?: InputMaybe<DisputeIssueTypeOperationFilterInput>;
  or?: InputMaybe<Array<BookingDisputeFilterInput>>;
  photos?: InputMaybe<ListStringOperationFilterInput>;
  reason?: InputMaybe<StringOperationFilterInput>;
  resolutionAction?: InputMaybe<StringOperationFilterInput>;
  resolutionNotes?: InputMaybe<StringOperationFilterInput>;
  resolvedAt?: InputMaybe<DateTimeOperationFilterInput>;
  resolvedByUser?: InputMaybe<UserFilterInput>;
  resolvedByUserId?: InputMaybe<UuidOperationFilterInput>;
};

export type BookingDisputeSortInput = {
  booking?: InputMaybe<BookingSortInput>;
  bookingId?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  disputedAt?: InputMaybe<SortEnumType>;
  disputedByUser?: InputMaybe<UserSortInput>;
  disputedByUserId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  issueType?: InputMaybe<SortEnumType>;
  reason?: InputMaybe<SortEnumType>;
  resolutionAction?: InputMaybe<SortEnumType>;
  resolutionNotes?: InputMaybe<SortEnumType>;
  resolvedAt?: InputMaybe<SortEnumType>;
  resolvedByUser?: InputMaybe<UserSortInput>;
  resolvedByUserId?: InputMaybe<SortEnumType>;
};

export type BookingFilterInput = {
  advertiserNotes?: InputMaybe<StringOperationFilterInput>;
  and?: InputMaybe<Array<BookingFilterInput>>;
  campaign?: InputMaybe<CampaignFilterInput>;
  campaignId?: InputMaybe<UuidOperationFilterInput>;
  cancellationReason?: InputMaybe<StringOperationFilterInput>;
  cancelledAt?: InputMaybe<DateTimeOperationFilterInput>;
  cancelledByUser?: InputMaybe<UserFilterInput>;
  cancelledByUserId?: InputMaybe<UuidOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  dispute?: InputMaybe<BookingDisputeFilterInput>;
  endDate?: InputMaybe<DateTimeOperationFilterInput>;
  fileDownloadedAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  installationFee?: InputMaybe<DecimalOperationFilterInput>;
  or?: InputMaybe<Array<BookingFilterInput>>;
  ownerNotes?: InputMaybe<StringOperationFilterInput>;
  ownerPayoutAmount?: InputMaybe<DecimalOperationFilterInput>;
  payments?: InputMaybe<ListFilterInputTypeOfPaymentFilterInput>;
  payouts?: InputMaybe<ListFilterInputTypeOfPayoutFilterInput>;
  platformFeeAmount?: InputMaybe<DecimalOperationFilterInput>;
  platformFeePercent?: InputMaybe<DecimalOperationFilterInput>;
  pricePerDay?: InputMaybe<DecimalOperationFilterInput>;
  proof?: InputMaybe<BookingProofFilterInput>;
  rejectedAt?: InputMaybe<DateTimeOperationFilterInput>;
  rejectionReason?: InputMaybe<StringOperationFilterInput>;
  reviews?: InputMaybe<ListFilterInputTypeOfReviewFilterInput>;
  space?: InputMaybe<SpaceFilterInput>;
  spaceId?: InputMaybe<UuidOperationFilterInput>;
  startDate?: InputMaybe<DateTimeOperationFilterInput>;
  status?: InputMaybe<BookingStatusOperationFilterInput>;
  subtotalAmount?: InputMaybe<DecimalOperationFilterInput>;
  totalAmount?: InputMaybe<DecimalOperationFilterInput>;
  totalDays?: InputMaybe<IntOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
};

export type BookingProof = {
  __typename: 'BookingProof';
  autoApproveAt: Scalars['DateTime']['output'];
  booking: Booking;
  bookingId: Scalars['UUID']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['UUID']['output'];
  photos: Array<Scalars['String']['output']>;
  rejectionReason: Maybe<Scalars['String']['output']>;
  reviewedAt: Maybe<Scalars['DateTime']['output']>;
  reviewedByUser: Maybe<User>;
  reviewedByUserId: Maybe<Scalars['UUID']['output']>;
  status: ProofStatus;
  submittedAt: Scalars['DateTime']['output'];
};

export type BookingProofFilterInput = {
  and?: InputMaybe<Array<BookingProofFilterInput>>;
  autoApproveAt?: InputMaybe<DateTimeOperationFilterInput>;
  booking?: InputMaybe<BookingFilterInput>;
  bookingId?: InputMaybe<UuidOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  or?: InputMaybe<Array<BookingProofFilterInput>>;
  photos?: InputMaybe<ListStringOperationFilterInput>;
  rejectionReason?: InputMaybe<StringOperationFilterInput>;
  reviewedAt?: InputMaybe<DateTimeOperationFilterInput>;
  reviewedByUser?: InputMaybe<UserFilterInput>;
  reviewedByUserId?: InputMaybe<UuidOperationFilterInput>;
  status?: InputMaybe<ProofStatusOperationFilterInput>;
  submittedAt?: InputMaybe<DateTimeOperationFilterInput>;
};

export type BookingProofSortInput = {
  autoApproveAt?: InputMaybe<SortEnumType>;
  booking?: InputMaybe<BookingSortInput>;
  bookingId?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  rejectionReason?: InputMaybe<SortEnumType>;
  reviewedAt?: InputMaybe<SortEnumType>;
  reviewedByUser?: InputMaybe<UserSortInput>;
  reviewedByUserId?: InputMaybe<SortEnumType>;
  status?: InputMaybe<SortEnumType>;
  submittedAt?: InputMaybe<SortEnumType>;
};

export type BookingSortInput = {
  advertiserNotes?: InputMaybe<SortEnumType>;
  campaign?: InputMaybe<CampaignSortInput>;
  campaignId?: InputMaybe<SortEnumType>;
  cancellationReason?: InputMaybe<SortEnumType>;
  cancelledAt?: InputMaybe<SortEnumType>;
  cancelledByUser?: InputMaybe<UserSortInput>;
  cancelledByUserId?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  dispute?: InputMaybe<BookingDisputeSortInput>;
  endDate?: InputMaybe<SortEnumType>;
  fileDownloadedAt?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  installationFee?: InputMaybe<SortEnumType>;
  ownerNotes?: InputMaybe<SortEnumType>;
  ownerPayoutAmount?: InputMaybe<SortEnumType>;
  platformFeeAmount?: InputMaybe<SortEnumType>;
  platformFeePercent?: InputMaybe<SortEnumType>;
  pricePerDay?: InputMaybe<SortEnumType>;
  proof?: InputMaybe<BookingProofSortInput>;
  rejectedAt?: InputMaybe<SortEnumType>;
  rejectionReason?: InputMaybe<SortEnumType>;
  space?: InputMaybe<SpaceSortInput>;
  spaceId?: InputMaybe<SortEnumType>;
  startDate?: InputMaybe<SortEnumType>;
  status?: InputMaybe<SortEnumType>;
  subtotalAmount?: InputMaybe<SortEnumType>;
  totalAmount?: InputMaybe<SortEnumType>;
  totalDays?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
};

export enum BookingStatus {
  Approved = 'APPROVED',
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Disputed = 'DISPUTED',
  FileDownloaded = 'FILE_DOWNLOADED',
  Installed = 'INSTALLED',
  Paid = 'PAID',
  PendingApproval = 'PENDING_APPROVAL',
  Rejected = 'REJECTED',
  Verified = 'VERIFIED'
}

export type BookingStatusOperationFilterInput = {
  eq?: InputMaybe<BookingStatus>;
  in?: InputMaybe<Array<BookingStatus>>;
  neq?: InputMaybe<BookingStatus>;
  nin?: InputMaybe<Array<BookingStatus>>;
};

/** A connection to a list of items. */
export type BookingsConnection = {
  __typename: 'BookingsConnection';
  /** A list of edges. */
  edges: Maybe<Array<BookingsEdge>>;
  /** A flattened list of the nodes. */
  nodes: Maybe<Array<Booking>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type BookingsEdge = {
  __typename: 'BookingsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Booking;
};

/** A connection to a list of items. */
export type BookingsRequiringActionConnection = {
  __typename: 'BookingsRequiringActionConnection';
  /** A list of edges. */
  edges: Maybe<Array<BookingsRequiringActionEdge>>;
  /** A flattened list of the nodes. */
  nodes: Maybe<Array<Booking>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type BookingsRequiringActionEdge = {
  __typename: 'BookingsRequiringActionEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Booking;
};

export type BooleanOperationFilterInput = {
  eq?: InputMaybe<Scalars['Boolean']['input']>;
  neq?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Campaign = {
  __typename: 'Campaign';
  advertiser: Maybe<AdvertiserProfile>;
  advertiserProfile: AdvertiserProfile;
  advertiserProfileId: Scalars['UUID']['output'];
  bookings: Maybe<BookingsConnection>;
  createdAt: Scalars['DateTime']['output'];
  description: Maybe<Scalars['String']['output']>;
  endDate: Maybe<Scalars['DateTime']['output']>;
  goals: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  imageUrl: Scalars['String']['output'];
  name: Scalars['String']['output'];
  spacesCount: Scalars['Int']['output'];
  startDate: Maybe<Scalars['DateTime']['output']>;
  status: CampaignStatus;
  targetAudience: Maybe<Scalars['String']['output']>;
  totalBudget: Maybe<Scalars['Decimal']['output']>;
  totalSpend: Scalars['Decimal']['output'];
};


export type CampaignBookingsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<BookingSortInput>>;
  where?: InputMaybe<BookingFilterInput>;
};

export type CampaignFilterInput = {
  advertiserProfile?: InputMaybe<AdvertiserProfileFilterInput>;
  advertiserProfileId?: InputMaybe<UuidOperationFilterInput>;
  and?: InputMaybe<Array<CampaignFilterInput>>;
  bookings?: InputMaybe<ListFilterInputTypeOfBookingFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
  endDate?: InputMaybe<DateTimeOperationFilterInput>;
  goals?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  imageUrl?: InputMaybe<StringOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<CampaignFilterInput>>;
  startDate?: InputMaybe<DateTimeOperationFilterInput>;
  status?: InputMaybe<CampaignStatusOperationFilterInput>;
  targetAudience?: InputMaybe<StringOperationFilterInput>;
  totalBudget?: InputMaybe<DecimalOperationFilterInput>;
};

export type CampaignSortInput = {
  advertiserProfile?: InputMaybe<AdvertiserProfileSortInput>;
  advertiserProfileId?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  description?: InputMaybe<SortEnumType>;
  endDate?: InputMaybe<SortEnumType>;
  goals?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  imageUrl?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  startDate?: InputMaybe<SortEnumType>;
  status?: InputMaybe<SortEnumType>;
  targetAudience?: InputMaybe<SortEnumType>;
  totalBudget?: InputMaybe<SortEnumType>;
};

export enum CampaignStatus {
  Active = 'ACTIVE',
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Draft = 'DRAFT',
  Submitted = 'SUBMITTED'
}

export type CampaignStatusOperationFilterInput = {
  eq?: InputMaybe<CampaignStatus>;
  in?: InputMaybe<Array<CampaignStatus>>;
  neq?: InputMaybe<CampaignStatus>;
  nin?: InputMaybe<Array<CampaignStatus>>;
};

/** A connection to a list of items. */
export type CampaignsConnection = {
  __typename: 'CampaignsConnection';
  /** A list of edges. */
  edges: Maybe<Array<CampaignsEdge>>;
  /** A flattened list of the nodes. */
  nodes: Maybe<Array<Campaign>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type CampaignsEdge = {
  __typename: 'CampaignsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Campaign;
};

export type CancelBookingError = ForbiddenError | InvalidStatusTransitionError | NotFoundError;

export type CancelBookingInput = {
  id: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
};

export type CancelBookingPayload = {
  __typename: 'CancelBookingPayload';
  booking: Maybe<Booking>;
  errors: Maybe<Array<CancelBookingError>>;
};

export type CancelCampaignError = ForbiddenError | NotFoundError;

export type CancelCampaignInput = {
  id: Scalars['ID']['input'];
};

export type CancelCampaignPayload = {
  __typename: 'CancelCampaignPayload';
  campaign: Maybe<Campaign>;
  errors: Maybe<Array<CancelCampaignError>>;
};

export type ChangePasswordError = NotFoundError | ValidationError;

export type ChangePasswordInput = {
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};

export type ChangePasswordPayload = {
  __typename: 'ChangePasswordPayload';
  errors: Maybe<Array<ChangePasswordError>>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type ConfirmPaymentError = NotFoundError | PaymentError;

export type ConfirmPaymentInput = {
  paymentIntentId: Scalars['String']['input'];
};

export type ConfirmPaymentPayload = {
  __typename: 'ConfirmPaymentPayload';
  errors: Maybe<Array<ConfirmPaymentError>>;
  payment: Maybe<Payment>;
};

export type ConfirmSetupIntentError = NotFoundError | PaymentError;

export type ConfirmSetupIntentInput = {
  setupIntentId: Scalars['String']['input'];
};

export type ConfirmSetupIntentPayload = {
  __typename: 'ConfirmSetupIntentPayload';
  errors: Maybe<Array<ConfirmSetupIntentError>>;
  paymentMethod: Maybe<SavedPaymentMethod>;
};

export type ConflictError = Error & {
  __typename: 'ConflictError';
  code: Scalars['String']['output'];
  message: Scalars['String']['output'];
  reason: Scalars['String']['output'];
  resource: Scalars['String']['output'];
};

export type ConnectStripeAccountError = NotFoundError | PaymentError;

export type ConnectStripeAccountPayload = {
  __typename: 'ConnectStripeAccountPayload';
  accountId: Maybe<Scalars['String']['output']>;
  errors: Maybe<Array<ConnectStripeAccountError>>;
  onboardingUrl: Maybe<Scalars['String']['output']>;
};

export type Conversation = {
  __typename: 'Conversation';
  booking: Maybe<Booking>;
  bookingId: Maybe<Scalars['UUID']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['UUID']['output'];
  messages: Maybe<MessagesConnection>;
  participants: Array<ConversationParticipant>;
  updatedAt: Scalars['DateTime']['output'];
};


export type ConversationMessagesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<MessageSortInput>>;
  where?: InputMaybe<MessageFilterInput>;
};

export type ConversationFilterInput = {
  and?: InputMaybe<Array<ConversationFilterInput>>;
  booking?: InputMaybe<BookingFilterInput>;
  bookingId?: InputMaybe<UuidOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  messages?: InputMaybe<ListFilterInputTypeOfMessageFilterInput>;
  or?: InputMaybe<Array<ConversationFilterInput>>;
  participants?: InputMaybe<ListFilterInputTypeOfConversationParticipantFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
};

export type ConversationParticipant = {
  __typename: 'ConversationParticipant';
  conversation: Conversation;
  conversationId: Scalars['UUID']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['UUID']['output'];
  joinedAt: Scalars['DateTime']['output'];
  lastReadAt: Maybe<Scalars['DateTime']['output']>;
  user: User;
  userId: Scalars['UUID']['output'];
};

export type ConversationParticipantFilterInput = {
  and?: InputMaybe<Array<ConversationParticipantFilterInput>>;
  conversation?: InputMaybe<ConversationFilterInput>;
  conversationId?: InputMaybe<UuidOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  joinedAt?: InputMaybe<DateTimeOperationFilterInput>;
  lastReadAt?: InputMaybe<DateTimeOperationFilterInput>;
  or?: InputMaybe<Array<ConversationParticipantFilterInput>>;
  user?: InputMaybe<UserFilterInput>;
  userId?: InputMaybe<UuidOperationFilterInput>;
};

export type ConversationSortInput = {
  booking?: InputMaybe<BookingSortInput>;
  bookingId?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
};

export type CreateBookingConversationError = NotFoundError;

export type CreateBookingConversationInput = {
  bookingId: Scalars['ID']['input'];
};

export type CreateBookingConversationPayload = {
  __typename: 'CreateBookingConversationPayload';
  conversation: Maybe<Conversation>;
  errors: Maybe<Array<CreateBookingConversationError>>;
};

export type CreateBookingError = ConflictError | NotFoundError | ValidationError;

export type CreateBookingInput = {
  advertiserNotes?: InputMaybe<Scalars['String']['input']>;
  endDate: Scalars['DateTime']['input'];
  spaceId: Scalars['UUID']['input'];
  startDate: Scalars['DateTime']['input'];
};

export type CreateBookingPayload = {
  __typename: 'CreateBookingPayload';
  booking: Maybe<Booking>;
  errors: Maybe<Array<CreateBookingError>>;
};

export type CreateCampaignError = NotFoundError;

export type CreateCampaignInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  goals?: InputMaybe<Scalars['String']['input']>;
  imageUrl: Scalars['String']['input'];
  name: Scalars['String']['input'];
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  targetAudience?: InputMaybe<Scalars['String']['input']>;
  totalBudget?: InputMaybe<Scalars['Decimal']['input']>;
};

export type CreateCampaignPayload = {
  __typename: 'CreateCampaignPayload';
  campaign: Maybe<Campaign>;
  errors: Maybe<Array<CreateCampaignError>>;
};

export type CreatePaymentIntentError = ConflictError | ForbiddenError | InvalidStatusTransitionError | NotFoundError;

export type CreatePaymentIntentInput = {
  bookingId: Scalars['ID']['input'];
};

export type CreatePaymentIntentPayload = {
  __typename: 'CreatePaymentIntentPayload';
  amount: Maybe<Scalars['Decimal']['output']>;
  clientSecret: Maybe<Scalars['String']['output']>;
  errors: Maybe<Array<CreatePaymentIntentError>>;
  paymentIntentId: Maybe<Scalars['String']['output']>;
};

export type CreatePricingRuleError = ForbiddenError | NotFoundError | ValidationError;

export type CreatePricingRuleInput = {
  daysOfWeek?: InputMaybe<Array<Scalars['Int']['input']>>;
  endDate?: InputMaybe<Scalars['LocalDate']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  priority: Scalars['Int']['input'];
  spaceId: Scalars['ID']['input'];
  startDate?: InputMaybe<Scalars['LocalDate']['input']>;
  type: PricingRuleType;
  value: Scalars['Decimal']['input'];
};

export type CreatePricingRulePayload = {
  __typename: 'CreatePricingRulePayload';
  errors: Maybe<Array<CreatePricingRuleError>>;
  pricingRule: Maybe<PricingRule>;
};

export type CreateReviewError = ConflictError | ForbiddenError | NotFoundError;

export type CreateReviewInput = {
  comment?: InputMaybe<Scalars['String']['input']>;
  rating: Scalars['Int']['input'];
};

export type CreateReviewPayload = {
  __typename: 'CreateReviewPayload';
  errors: Maybe<Array<CreateReviewError>>;
  review: Maybe<Review>;
};

export type CreateSetupIntentError = NotFoundError | PaymentError;

export type CreateSetupIntentPayload = {
  __typename: 'CreateSetupIntentPayload';
  clientSecret: Maybe<Scalars['String']['output']>;
  errors: Maybe<Array<CreateSetupIntentError>>;
  setupIntentId: Maybe<Scalars['String']['output']>;
};

export type CreateSpaceError = GeocodingError | NotFoundError | ValidationError;

export type CreateSpaceInput = {
  address: Scalars['String']['input'];
  availableFrom?: InputMaybe<Scalars['DateTime']['input']>;
  availableTo?: InputMaybe<Scalars['DateTime']['input']>;
  city: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  dimensions?: InputMaybe<Scalars['String']['input']>;
  dimensionsText?: InputMaybe<Scalars['String']['input']>;
  height?: InputMaybe<Scalars['Float']['input']>;
  images?: InputMaybe<Array<Scalars['String']['input']>>;
  installationFee?: InputMaybe<Scalars['Decimal']['input']>;
  latitude?: InputMaybe<Scalars['Float']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  maxDuration?: InputMaybe<Scalars['Int']['input']>;
  minDuration: Scalars['Int']['input'];
  pricePerDay: Scalars['Decimal']['input'];
  state: Scalars['String']['input'];
  title: Scalars['String']['input'];
  traffic?: InputMaybe<Scalars['String']['input']>;
  type: SpaceType;
  width?: InputMaybe<Scalars['Float']['input']>;
  zipCode?: InputMaybe<Scalars['String']['input']>;
};

export type CreateSpacePayload = {
  __typename: 'CreateSpacePayload';
  errors: Maybe<Array<CreateSpaceError>>;
  space: Maybe<Space>;
};

export type DailyStats = {
  __typename: 'DailyStats';
  bookings: Scalars['Int']['output'];
  date: Scalars['DateTime']['output'];
  earnings: Scalars['Decimal']['output'];
  spending: Scalars['Decimal']['output'];
};

export type DatePrice = {
  __typename: 'DatePrice';
  appliedRuleId: Maybe<Scalars['UUID']['output']>;
  appliedRuleLabel: Maybe<Scalars['String']['output']>;
  date: Scalars['LocalDate']['output'];
  effectivePrice: Scalars['Decimal']['output'];
};

export type DateTimeOperationFilterInput = {
  eq?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  neq?: InputMaybe<Scalars['DateTime']['input']>;
  ngt?: InputMaybe<Scalars['DateTime']['input']>;
  ngte?: InputMaybe<Scalars['DateTime']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  nlt?: InputMaybe<Scalars['DateTime']['input']>;
  nlte?: InputMaybe<Scalars['DateTime']['input']>;
};

export type DeactivateSpaceError = ConflictError | ForbiddenError | NotFoundError;

export type DeactivateSpaceInput = {
  id: Scalars['ID']['input'];
};

export type DeactivateSpacePayload = {
  __typename: 'DeactivateSpacePayload';
  errors: Maybe<Array<DeactivateSpaceError>>;
  space: Maybe<Space>;
};

export type DecimalOperationFilterInput = {
  eq?: InputMaybe<Scalars['Decimal']['input']>;
  gt?: InputMaybe<Scalars['Decimal']['input']>;
  gte?: InputMaybe<Scalars['Decimal']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Decimal']['input']>>>;
  lt?: InputMaybe<Scalars['Decimal']['input']>;
  lte?: InputMaybe<Scalars['Decimal']['input']>;
  neq?: InputMaybe<Scalars['Decimal']['input']>;
  ngt?: InputMaybe<Scalars['Decimal']['input']>;
  ngte?: InputMaybe<Scalars['Decimal']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['Decimal']['input']>>>;
  nlt?: InputMaybe<Scalars['Decimal']['input']>;
  nlte?: InputMaybe<Scalars['Decimal']['input']>;
};

export type DeleteCampaignError = ConflictError | ForbiddenError | NotFoundError;

export type DeleteCampaignInput = {
  id: Scalars['ID']['input'];
};

export type DeleteCampaignPayload = {
  __typename: 'DeleteCampaignPayload';
  errors: Maybe<Array<DeleteCampaignError>>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type DeleteMyAccountError = NotFoundError | ValidationError;

export type DeleteMyAccountInput = {
  password: Scalars['String']['input'];
};

export type DeleteMyAccountPayload = {
  __typename: 'DeleteMyAccountPayload';
  errors: Maybe<Array<DeleteMyAccountError>>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type DeleteNotificationInput = {
  id: Scalars['ID']['input'];
};

export type DeleteNotificationPayload = {
  __typename: 'DeleteNotificationPayload';
  success: Scalars['Boolean']['output'];
};

export type DeletePaymentMethodError = ForbiddenError | NotFoundError;

export type DeletePaymentMethodInput = {
  paymentMethodId: Scalars['UUID']['input'];
};

export type DeletePaymentMethodPayload = {
  __typename: 'DeletePaymentMethodPayload';
  errors: Maybe<Array<DeletePaymentMethodError>>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type DeletePricingRuleError = ForbiddenError | NotFoundError;

export type DeletePricingRuleInput = {
  id: Scalars['ID']['input'];
};

export type DeletePricingRulePayload = {
  __typename: 'DeletePricingRulePayload';
  deletedRuleId: Maybe<Scalars['UUID']['output']>;
  errors: Maybe<Array<DeletePricingRuleError>>;
};

export type DeleteReviewInput = {
  id: Scalars['ID']['input'];
};

export type DeleteReviewPayload = {
  __typename: 'DeleteReviewPayload';
  success: Scalars['Boolean']['output'];
};

export type DeleteSpaceError = ConflictError | ForbiddenError | NotFoundError;

export type DeleteSpaceInput = {
  id: Scalars['ID']['input'];
};

export type DeleteSpacePayload = {
  __typename: 'DeleteSpacePayload';
  errors: Maybe<Array<DeleteSpaceError>>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type DeleteUserError = NotFoundError;

export type DeleteUserInput = {
  id: Scalars['ID']['input'];
};

export type DeleteUserPayload = {
  __typename: 'DeleteUserPayload';
  errors: Maybe<Array<DeleteUserError>>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type DisconnectStripeAccountError = NotFoundError | PaymentError | ValidationError;

export type DisconnectStripeAccountPayload = {
  __typename: 'DisconnectStripeAccountPayload';
  errors: Maybe<Array<DisconnectStripeAccountError>>;
  profile: Maybe<SpaceOwnerProfile>;
};

export enum DisputeIssueType {
  DamageToCreative = 'DAMAGE_TO_CREATIVE',
  MisleadingListing = 'MISLEADING_LISTING',
  NotVisible = 'NOT_VISIBLE',
  PoorQuality = 'POOR_QUALITY',
  SafetyIssue = 'SAFETY_ISSUE',
  WrongLocation = 'WRONG_LOCATION'
}

export type DisputeIssueTypeOperationFilterInput = {
  eq?: InputMaybe<DisputeIssueType>;
  in?: InputMaybe<Array<DisputeIssueType>>;
  neq?: InputMaybe<DisputeIssueType>;
  nin?: InputMaybe<Array<DisputeIssueType>>;
};

export type EarningsDataPoint = {
  __typename: 'EarningsDataPoint';
  amount: Scalars['Decimal']['output'];
  date: Scalars['DateTime']['output'];
};

export type EarningsSummary = {
  __typename: 'EarningsSummary';
  availableBalance: Maybe<Scalars['Decimal']['output']>;
  lastMonthEarnings: Maybe<Scalars['Decimal']['output']>;
  pendingPayouts: Maybe<Scalars['Decimal']['output']>;
  thisMonthEarnings: Maybe<Scalars['Decimal']['output']>;
  totalEarnings: Maybe<Scalars['Decimal']['output']>;
};

export type EffectivePricePayload = {
  __typename: 'EffectivePricePayload';
  appliedRuleId: Maybe<Scalars['UUID']['output']>;
  appliedRuleLabel: Maybe<Scalars['String']['output']>;
  effectivePrice: Scalars['Decimal']['output'];
};

export type Error = {
  message: Scalars['String']['output'];
};

export type ExportBookingsInput = {
  searchText?: InputMaybe<Scalars['String']['input']>;
  startDateFrom?: InputMaybe<Scalars['DateTime']['input']>;
  startDateTo?: InputMaybe<Scalars['DateTime']['input']>;
  statuses?: InputMaybe<Array<BookingStatus>>;
};

export type ExportBookingsPayload = {
  __typename: 'ExportBookingsPayload';
  contentBase64: Scalars['String']['output'];
  contentType: Scalars['String']['output'];
  fileName: Scalars['String']['output'];
};

export type FloatOperationFilterInput = {
  eq?: InputMaybe<Scalars['Float']['input']>;
  gt?: InputMaybe<Scalars['Float']['input']>;
  gte?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  lt?: InputMaybe<Scalars['Float']['input']>;
  lte?: InputMaybe<Scalars['Float']['input']>;
  neq?: InputMaybe<Scalars['Float']['input']>;
  ngt?: InputMaybe<Scalars['Float']['input']>;
  ngte?: InputMaybe<Scalars['Float']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  nlt?: InputMaybe<Scalars['Float']['input']>;
  nlte?: InputMaybe<Scalars['Float']['input']>;
};

export type ForbiddenError = Error & {
  __typename: 'ForbiddenError';
  action: Scalars['String']['output'];
  code: Scalars['String']['output'];
  message: Scalars['String']['output'];
};

export type GeocodingError = Error & {
  __typename: 'GeocodingError';
  address: Scalars['String']['output'];
  code: Scalars['String']['output'];
  details: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
};

export enum Granularity {
  Day = 'DAY',
  Month = 'MONTH',
  Week = 'WEEK'
}

/** A connection to a list of items. */
export type IncomingBookingRequestsConnection = {
  __typename: 'IncomingBookingRequestsConnection';
  /** A list of edges. */
  edges: Maybe<Array<IncomingBookingRequestsEdge>>;
  /** A flattened list of the nodes. */
  nodes: Maybe<Array<Booking>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type IncomingBookingRequestsEdge = {
  __typename: 'IncomingBookingRequestsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Booking;
};

export type IntOperationFilterInput = {
  eq?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  neq?: InputMaybe<Scalars['Int']['input']>;
  ngt?: InputMaybe<Scalars['Int']['input']>;
  ngte?: InputMaybe<Scalars['Int']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  nlt?: InputMaybe<Scalars['Int']['input']>;
  nlte?: InputMaybe<Scalars['Int']['input']>;
};

export type InvalidStatusTransitionError = Error & {
  __typename: 'InvalidStatusTransitionError';
  code: Scalars['String']['output'];
  fromStatus: Scalars['String']['output'];
  message: Scalars['String']['output'];
  toStatus: Scalars['String']['output'];
};

export type KeyValuePairOfStringAndString__ = {
  __typename: 'KeyValuePairOfStringAndString__';
  key: Scalars['String']['output'];
  value: Array<Scalars['String']['output']>;
};

export type ListFilterInputTypeOfBlockedDateFilterInput = {
  all?: InputMaybe<BlockedDateFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<BlockedDateFilterInput>;
  some?: InputMaybe<BlockedDateFilterInput>;
};

export type ListFilterInputTypeOfBookingFilterInput = {
  all?: InputMaybe<BookingFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<BookingFilterInput>;
  some?: InputMaybe<BookingFilterInput>;
};

export type ListFilterInputTypeOfCampaignFilterInput = {
  all?: InputMaybe<CampaignFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<CampaignFilterInput>;
  some?: InputMaybe<CampaignFilterInput>;
};

export type ListFilterInputTypeOfConversationParticipantFilterInput = {
  all?: InputMaybe<ConversationParticipantFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<ConversationParticipantFilterInput>;
  some?: InputMaybe<ConversationParticipantFilterInput>;
};

export type ListFilterInputTypeOfManualPayoutFilterInput = {
  all?: InputMaybe<ManualPayoutFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<ManualPayoutFilterInput>;
  some?: InputMaybe<ManualPayoutFilterInput>;
};

export type ListFilterInputTypeOfMessageFilterInput = {
  all?: InputMaybe<MessageFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<MessageFilterInput>;
  some?: InputMaybe<MessageFilterInput>;
};

export type ListFilterInputTypeOfPaymentFilterInput = {
  all?: InputMaybe<PaymentFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<PaymentFilterInput>;
  some?: InputMaybe<PaymentFilterInput>;
};

export type ListFilterInputTypeOfPayoutFilterInput = {
  all?: InputMaybe<PayoutFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<PayoutFilterInput>;
  some?: InputMaybe<PayoutFilterInput>;
};

export type ListFilterInputTypeOfPricingRuleFilterInput = {
  all?: InputMaybe<PricingRuleFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<PricingRuleFilterInput>;
  some?: InputMaybe<PricingRuleFilterInput>;
};

export type ListFilterInputTypeOfRefundFilterInput = {
  all?: InputMaybe<RefundFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<RefundFilterInput>;
  some?: InputMaybe<RefundFilterInput>;
};

export type ListFilterInputTypeOfReviewFilterInput = {
  all?: InputMaybe<ReviewFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<ReviewFilterInput>;
  some?: InputMaybe<ReviewFilterInput>;
};

export type ListFilterInputTypeOfSavedPaymentMethodFilterInput = {
  all?: InputMaybe<SavedPaymentMethodFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<SavedPaymentMethodFilterInput>;
  some?: InputMaybe<SavedPaymentMethodFilterInput>;
};

export type ListFilterInputTypeOfSpaceFilterInput = {
  all?: InputMaybe<SpaceFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<SpaceFilterInput>;
  some?: InputMaybe<SpaceFilterInput>;
};

export type ListIntOperationFilterInput = {
  all?: InputMaybe<IntOperationFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<IntOperationFilterInput>;
  some?: InputMaybe<IntOperationFilterInput>;
};

export type ListStringOperationFilterInput = {
  all?: InputMaybe<StringOperationFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<StringOperationFilterInput>;
  some?: InputMaybe<StringOperationFilterInput>;
};

export type LocalDateOperationFilterInput = {
  eq?: InputMaybe<Scalars['LocalDate']['input']>;
  gt?: InputMaybe<Scalars['LocalDate']['input']>;
  gte?: InputMaybe<Scalars['LocalDate']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['LocalDate']['input']>>>;
  lt?: InputMaybe<Scalars['LocalDate']['input']>;
  lte?: InputMaybe<Scalars['LocalDate']['input']>;
  neq?: InputMaybe<Scalars['LocalDate']['input']>;
  ngt?: InputMaybe<Scalars['LocalDate']['input']>;
  ngte?: InputMaybe<Scalars['LocalDate']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['LocalDate']['input']>>>;
  nlt?: InputMaybe<Scalars['LocalDate']['input']>;
  nlte?: InputMaybe<Scalars['LocalDate']['input']>;
};

export type ManualPayout = {
  __typename: 'ManualPayout';
  amount: Scalars['Decimal']['output'];
  createdAt: Scalars['DateTime']['output'];
  failureReason: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  processedAt: Maybe<Scalars['DateTime']['output']>;
  spaceOwnerProfile: SpaceOwnerProfile;
  spaceOwnerProfileId: Scalars['UUID']['output'];
  status: ManualPayoutStatus;
  stripePayoutId: Maybe<Scalars['String']['output']>;
};

export type ManualPayoutFilterInput = {
  amount?: InputMaybe<DecimalOperationFilterInput>;
  and?: InputMaybe<Array<ManualPayoutFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  failureReason?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  or?: InputMaybe<Array<ManualPayoutFilterInput>>;
  processedAt?: InputMaybe<DateTimeOperationFilterInput>;
  spaceOwnerProfile?: InputMaybe<SpaceOwnerProfileFilterInput>;
  spaceOwnerProfileId?: InputMaybe<UuidOperationFilterInput>;
  status?: InputMaybe<ManualPayoutStatusOperationFilterInput>;
  stripePayoutId?: InputMaybe<StringOperationFilterInput>;
};

export enum ManualPayoutStatus {
  Completed = 'COMPLETED',
  Failed = 'FAILED',
  Pending = 'PENDING'
}

export type ManualPayoutStatusOperationFilterInput = {
  eq?: InputMaybe<ManualPayoutStatus>;
  in?: InputMaybe<Array<ManualPayoutStatus>>;
  neq?: InputMaybe<ManualPayoutStatus>;
  nin?: InputMaybe<Array<ManualPayoutStatus>>;
};

export type MarkAllNotificationsReadPayload = {
  __typename: 'MarkAllNotificationsReadPayload';
  count: Scalars['Int']['output'];
};

export type MarkConversationReadError = ForbiddenError;

export type MarkConversationReadInput = {
  conversationId: Scalars['ID']['input'];
};

export type MarkConversationReadPayload = {
  __typename: 'MarkConversationReadPayload';
  errors: Maybe<Array<MarkConversationReadError>>;
  participant: Maybe<ConversationParticipant>;
};

export type MarkFileDownloadedError = ForbiddenError | InvalidStatusTransitionError | NotFoundError;

export type MarkFileDownloadedInput = {
  id: Scalars['ID']['input'];
};

export type MarkFileDownloadedPayload = {
  __typename: 'MarkFileDownloadedPayload';
  booking: Maybe<Booking>;
  errors: Maybe<Array<MarkFileDownloadedError>>;
};

export type MarkInstalledError = ForbiddenError | InvalidStatusTransitionError | NotFoundError;

export type MarkInstalledInput = {
  id: Scalars['ID']['input'];
};

export type MarkInstalledPayload = {
  __typename: 'MarkInstalledPayload';
  booking: Maybe<Booking>;
  errors: Maybe<Array<MarkInstalledError>>;
};

export type MarkNotificationReadError = NotFoundError;

export type MarkNotificationReadInput = {
  id: Scalars['ID']['input'];
};

export type MarkNotificationReadPayload = {
  __typename: 'MarkNotificationReadPayload';
  errors: Maybe<Array<MarkNotificationReadError>>;
  notification: Maybe<Notification>;
};

export type Message = {
  __typename: 'Message';
  attachments: Maybe<Array<Scalars['String']['output']>>;
  content: Scalars['String']['output'];
  conversation: Conversation;
  conversationId: Scalars['UUID']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['UUID']['output'];
  senderUser: User;
  senderUserId: Scalars['UUID']['output'];
  type: MessageType;
};

export type MessageFilterInput = {
  and?: InputMaybe<Array<MessageFilterInput>>;
  attachments?: InputMaybe<ListStringOperationFilterInput>;
  content?: InputMaybe<StringOperationFilterInput>;
  conversation?: InputMaybe<ConversationFilterInput>;
  conversationId?: InputMaybe<UuidOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  or?: InputMaybe<Array<MessageFilterInput>>;
  senderUser?: InputMaybe<UserFilterInput>;
  senderUserId?: InputMaybe<UuidOperationFilterInput>;
  type?: InputMaybe<MessageTypeOperationFilterInput>;
};

export type MessageSortInput = {
  content?: InputMaybe<SortEnumType>;
  conversation?: InputMaybe<ConversationSortInput>;
  conversationId?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  senderUser?: InputMaybe<UserSortInput>;
  senderUserId?: InputMaybe<SortEnumType>;
  type?: InputMaybe<SortEnumType>;
};

export enum MessageType {
  CorrectionRequest = 'CORRECTION_REQUEST',
  ProofApproved = 'PROOF_APPROVED',
  ProofDisputed = 'PROOF_DISPUTED',
  ProofRejected = 'PROOF_REJECTED',
  ProofSubmission = 'PROOF_SUBMISSION',
  QualityConcern = 'QUALITY_CONCERN',
  System = 'SYSTEM',
  Text = 'TEXT'
}

export type MessageTypeOperationFilterInput = {
  eq?: InputMaybe<MessageType>;
  in?: InputMaybe<Array<MessageType>>;
  neq?: InputMaybe<MessageType>;
  nin?: InputMaybe<Array<MessageType>>;
};

/** A connection to a list of items. */
export type MessagesByConversationConnection = {
  __typename: 'MessagesByConversationConnection';
  /** A list of edges. */
  edges: Maybe<Array<MessagesByConversationEdge>>;
  /** A flattened list of the nodes. */
  nodes: Maybe<Array<Message>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type MessagesByConversationEdge = {
  __typename: 'MessagesByConversationEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Message;
};

/** A connection to a list of items. */
export type MessagesConnection = {
  __typename: 'MessagesConnection';
  /** A list of edges. */
  edges: Maybe<Array<MessagesEdge>>;
  /** A flattened list of the nodes. */
  nodes: Maybe<Array<Message>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type MessagesEdge = {
  __typename: 'MessagesEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Message;
};

export type MonthlyStats = {
  __typename: 'MonthlyStats';
  bookings: Scalars['Int']['output'];
  month: Scalars['String']['output'];
  revenue: Maybe<Scalars['Decimal']['output']>;
};

export type Mutation = {
  __typename: 'Mutation';
  approveBooking: ApproveBookingPayload;
  blockDates: BlockDatesPayload;
  cancelBooking: CancelBookingPayload;
  cancelCampaign: CancelCampaignPayload;
  changePassword: ChangePasswordPayload;
  confirmPayment: ConfirmPaymentPayload;
  confirmSetupIntent: ConfirmSetupIntentPayload;
  connectStripeAccount: ConnectStripeAccountPayload;
  createBooking: CreateBookingPayload;
  createBookingConversation: CreateBookingConversationPayload;
  createCampaign: CreateCampaignPayload;
  createPaymentIntent: CreatePaymentIntentPayload;
  createPricingRule: CreatePricingRulePayload;
  createReview: CreateReviewPayload;
  createSetupIntent: CreateSetupIntentPayload;
  createSpace: CreateSpacePayload;
  deactivateSpace: DeactivateSpacePayload;
  deleteCampaign: DeleteCampaignPayload;
  deleteMyAccount: DeleteMyAccountPayload;
  deleteNotification: DeleteNotificationPayload;
  deletePaymentMethod: DeletePaymentMethodPayload;
  deletePricingRule: DeletePricingRulePayload;
  deleteReview: DeleteReviewPayload;
  deleteSpace: DeleteSpacePayload;
  deleteUser: DeleteUserPayload;
  disconnectStripeAccount: DisconnectStripeAccountPayload;
  markAllNotificationsRead: MarkAllNotificationsReadPayload;
  markConversationRead: MarkConversationReadPayload;
  markFileDownloaded: MarkFileDownloadedPayload;
  markInstalled: MarkInstalledPayload;
  markNotificationRead: MarkNotificationReadPayload;
  notifyTyping: NotifyTypingPayload;
  processPayout: ProcessPayoutPayload;
  reactivateSpace: ReactivateSpacePayload;
  refreshStripeAccountStatus: RefreshStripeAccountStatusPayload;
  rejectBooking: RejectBookingPayload;
  requestManualPayout: RequestManualPayoutPayload;
  requestRefund: RequestRefundPayload;
  retryPayout: RetryPayoutPayload;
  sendMessage: SendMessagePayload;
  setDefaultPaymentMethod: SetDefaultPaymentMethodPayload;
  submitCampaign: SubmitCampaignPayload;
  submitProof: SubmitProofPayload;
  unblockDates: UnblockDatesPayload;
  updateAdvertiserProfile: UpdateAdvertiserProfilePayload;
  updateCampaign: UpdateCampaignPayload;
  updateCurrentUser: UpdateCurrentUserPayload;
  updateNotificationPreference: UpdateNotificationPreferencePayload;
  updatePricingRule: UpdatePricingRulePayload;
  updateReview: UpdateReviewPayload;
  updateSpace: UpdateSpacePayload;
  updateSpaceOwnerProfile: UpdateSpaceOwnerProfilePayload;
};


export type MutationApproveBookingArgs = {
  input: ApproveBookingInput;
};


export type MutationBlockDatesArgs = {
  input: BlockDatesInput;
};


export type MutationCancelBookingArgs = {
  input: CancelBookingInput;
};


export type MutationCancelCampaignArgs = {
  input: CancelCampaignInput;
};


export type MutationChangePasswordArgs = {
  input: ChangePasswordInput;
};


export type MutationConfirmPaymentArgs = {
  input: ConfirmPaymentInput;
};


export type MutationConfirmSetupIntentArgs = {
  input: ConfirmSetupIntentInput;
};


export type MutationCreateBookingArgs = {
  campaignId: Scalars['ID']['input'];
  input: CreateBookingInput;
};


export type MutationCreateBookingConversationArgs = {
  input: CreateBookingConversationInput;
};


export type MutationCreateCampaignArgs = {
  input: CreateCampaignInput;
};


export type MutationCreatePaymentIntentArgs = {
  input: CreatePaymentIntentInput;
};


export type MutationCreatePricingRuleArgs = {
  input: CreatePricingRuleInput;
};


export type MutationCreateReviewArgs = {
  bookingId: Scalars['ID']['input'];
  input: CreateReviewInput;
};


export type MutationCreateSpaceArgs = {
  input: CreateSpaceInput;
};


export type MutationDeactivateSpaceArgs = {
  input: DeactivateSpaceInput;
};


export type MutationDeleteCampaignArgs = {
  input: DeleteCampaignInput;
};


export type MutationDeleteMyAccountArgs = {
  input: DeleteMyAccountInput;
};


export type MutationDeleteNotificationArgs = {
  input: DeleteNotificationInput;
};


export type MutationDeletePaymentMethodArgs = {
  input: DeletePaymentMethodInput;
};


export type MutationDeletePricingRuleArgs = {
  input: DeletePricingRuleInput;
};


export type MutationDeleteReviewArgs = {
  input: DeleteReviewInput;
};


export type MutationDeleteSpaceArgs = {
  input: DeleteSpaceInput;
};


export type MutationDeleteUserArgs = {
  input: DeleteUserInput;
};


export type MutationMarkConversationReadArgs = {
  input: MarkConversationReadInput;
};


export type MutationMarkFileDownloadedArgs = {
  input: MarkFileDownloadedInput;
};


export type MutationMarkInstalledArgs = {
  input: MarkInstalledInput;
};


export type MutationMarkNotificationReadArgs = {
  input: MarkNotificationReadInput;
};


export type MutationNotifyTypingArgs = {
  input: NotifyTypingInput;
};


export type MutationProcessPayoutArgs = {
  input: ProcessPayoutInput;
};


export type MutationReactivateSpaceArgs = {
  input: ReactivateSpaceInput;
};


export type MutationRejectBookingArgs = {
  input: RejectBookingInput;
};


export type MutationRequestManualPayoutArgs = {
  input: RequestManualPayoutInput;
};


export type MutationRequestRefundArgs = {
  input: RequestRefundInput;
};


export type MutationRetryPayoutArgs = {
  input: RetryPayoutInput;
};


export type MutationSendMessageArgs = {
  input: SendMessageInput;
};


export type MutationSetDefaultPaymentMethodArgs = {
  input: SetDefaultPaymentMethodInput;
};


export type MutationSubmitCampaignArgs = {
  input: SubmitCampaignInput;
};


export type MutationSubmitProofArgs = {
  input: SubmitProofInput;
};


export type MutationUnblockDatesArgs = {
  input: UnblockDatesInput;
};


export type MutationUpdateAdvertiserProfileArgs = {
  input: UpdateAdvertiserProfileInput;
};


export type MutationUpdateCampaignArgs = {
  id: Scalars['ID']['input'];
  input: UpdateCampaignInput;
};


export type MutationUpdateCurrentUserArgs = {
  input: UpdateCurrentUserInput;
};


export type MutationUpdateNotificationPreferenceArgs = {
  input: UpdateNotificationPreferenceInput;
};


export type MutationUpdatePricingRuleArgs = {
  id: Scalars['ID']['input'];
  input: UpdatePricingRuleInput;
};


export type MutationUpdateReviewArgs = {
  id: Scalars['ID']['input'];
  input: UpdateReviewInput;
};


export type MutationUpdateSpaceArgs = {
  id: Scalars['ID']['input'];
  input: UpdateSpaceInput;
};


export type MutationUpdateSpaceOwnerProfileArgs = {
  input: UpdateSpaceOwnerProfileInput;
};

/** A connection to a list of items. */
export type MyBookingsAsAdvertiserConnection = {
  __typename: 'MyBookingsAsAdvertiserConnection';
  /** A list of edges. */
  edges: Maybe<Array<MyBookingsAsAdvertiserEdge>>;
  /** A flattened list of the nodes. */
  nodes: Maybe<Array<Booking>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type MyBookingsAsAdvertiserEdge = {
  __typename: 'MyBookingsAsAdvertiserEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Booking;
};

/** A connection to a list of items. */
export type MyBookingsAsOwnerConnection = {
  __typename: 'MyBookingsAsOwnerConnection';
  /** A list of edges. */
  edges: Maybe<Array<MyBookingsAsOwnerEdge>>;
  /** A flattened list of the nodes. */
  nodes: Maybe<Array<Booking>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type MyBookingsAsOwnerEdge = {
  __typename: 'MyBookingsAsOwnerEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Booking;
};

/** A connection to a list of items. */
export type MyCampaignsConnection = {
  __typename: 'MyCampaignsConnection';
  /** A list of edges. */
  edges: Maybe<Array<MyCampaignsEdge>>;
  /** A flattened list of the nodes. */
  nodes: Maybe<Array<Campaign>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type MyCampaignsEdge = {
  __typename: 'MyCampaignsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Campaign;
};

/** A connection to a list of items. */
export type MyConversationsConnection = {
  __typename: 'MyConversationsConnection';
  /** A list of edges. */
  edges: Maybe<Array<MyConversationsEdge>>;
  /** A flattened list of the nodes. */
  nodes: Maybe<Array<Conversation>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type MyConversationsEdge = {
  __typename: 'MyConversationsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Conversation;
};

/** A connection to a list of items. */
export type MyNotificationsConnection = {
  __typename: 'MyNotificationsConnection';
  /** A list of edges. */
  edges: Maybe<Array<MyNotificationsEdge>>;
  /** A flattened list of the nodes. */
  nodes: Maybe<Array<Notification>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type MyNotificationsEdge = {
  __typename: 'MyNotificationsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Notification;
};

/** A connection to a list of items. */
export type MyPayoutsConnection = {
  __typename: 'MyPayoutsConnection';
  /** A list of edges. */
  edges: Maybe<Array<MyPayoutsEdge>>;
  /** A flattened list of the nodes. */
  nodes: Maybe<Array<Payout>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type MyPayoutsEdge = {
  __typename: 'MyPayoutsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Payout;
};

/** A connection to a list of items. */
export type MyReviewsConnection = {
  __typename: 'MyReviewsConnection';
  /** A list of edges. */
  edges: Maybe<Array<MyReviewsEdge>>;
  /** A flattened list of the nodes. */
  nodes: Maybe<Array<Review>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type MyReviewsEdge = {
  __typename: 'MyReviewsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Review;
};

/** A connection to a list of items. */
export type MySpacesConnection = {
  __typename: 'MySpacesConnection';
  /** A list of edges. */
  edges: Maybe<Array<MySpacesEdge>>;
  /** A flattened list of the nodes. */
  nodes: Maybe<Array<Space>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type MySpacesEdge = {
  __typename: 'MySpacesEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Space;
};

export type NotFoundError = Error & {
  __typename: 'NotFoundError';
  code: Scalars['String']['output'];
  entityId: Scalars['UUID']['output'];
  entityType: Scalars['String']['output'];
  message: Scalars['String']['output'];
};

export type Notification = {
  __typename: 'Notification';
  body: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  entityId: Maybe<Scalars['UUID']['output']>;
  entityType: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  isRead: Scalars['Boolean']['output'];
  readAt: Maybe<Scalars['DateTime']['output']>;
  title: Scalars['String']['output'];
  type: NotificationType;
  user: User;
  userId: Scalars['UUID']['output'];
};

export type NotificationFilterInput = {
  and?: InputMaybe<Array<NotificationFilterInput>>;
  body?: InputMaybe<StringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  entityId?: InputMaybe<UuidOperationFilterInput>;
  entityType?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  isRead?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<NotificationFilterInput>>;
  readAt?: InputMaybe<DateTimeOperationFilterInput>;
  title?: InputMaybe<StringOperationFilterInput>;
  type?: InputMaybe<NotificationTypeOperationFilterInput>;
  user?: InputMaybe<UserFilterInput>;
  userId?: InputMaybe<UuidOperationFilterInput>;
};

export type NotificationPreference = {
  __typename: 'NotificationPreference';
  createdAt: Scalars['DateTime']['output'];
  emailEnabled: Scalars['Boolean']['output'];
  id: Scalars['UUID']['output'];
  inAppEnabled: Scalars['Boolean']['output'];
  notificationType: NotificationType;
  pushEnabled: Scalars['Boolean']['output'];
  user: User;
  userId: Scalars['UUID']['output'];
};

export type NotificationSortInput = {
  body?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  entityId?: InputMaybe<SortEnumType>;
  entityType?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  isRead?: InputMaybe<SortEnumType>;
  readAt?: InputMaybe<SortEnumType>;
  title?: InputMaybe<SortEnumType>;
  type?: InputMaybe<SortEnumType>;
  user?: InputMaybe<UserSortInput>;
  userId?: InputMaybe<SortEnumType>;
};

export enum NotificationType {
  BookingApproved = 'BOOKING_APPROVED',
  BookingCancelled = 'BOOKING_CANCELLED',
  BookingRejected = 'BOOKING_REJECTED',
  BookingRequested = 'BOOKING_REQUESTED',
  DisputeFiled = 'DISPUTE_FILED',
  DisputeResolved = 'DISPUTE_RESOLVED',
  MessageReceived = 'MESSAGE_RECEIVED',
  PaymentFailed = 'PAYMENT_FAILED',
  PaymentReceived = 'PAYMENT_RECEIVED',
  PaymentReminder = 'PAYMENT_REMINDER',
  PayoutProcessed = 'PAYOUT_PROCESSED',
  ProofApproved = 'PROOF_APPROVED',
  ProofDisputed = 'PROOF_DISPUTED',
  ProofRejected = 'PROOF_REJECTED',
  ProofUploaded = 'PROOF_UPLOADED',
  RefundProcessed = 'REFUND_PROCESSED',
  SessionExpired = 'SESSION_EXPIRED',
  SpaceApproved = 'SPACE_APPROVED',
  SpaceReactivated = 'SPACE_REACTIVATED',
  SpaceRejected = 'SPACE_REJECTED',
  SpaceSuspended = 'SPACE_SUSPENDED',
  SystemUpdate = 'SYSTEM_UPDATE'
}

export type NotificationTypeOperationFilterInput = {
  eq?: InputMaybe<NotificationType>;
  in?: InputMaybe<Array<NotificationType>>;
  neq?: InputMaybe<NotificationType>;
  nin?: InputMaybe<Array<NotificationType>>;
};

export type NotifyTypingError = ForbiddenError;

export type NotifyTypingInput = {
  conversationId: Scalars['UUID']['input'];
  isTyping: Scalars['Boolean']['input'];
};

export type NotifyTypingPayload = {
  __typename: 'NotifyTypingPayload';
  boolean: Maybe<Scalars['Boolean']['output']>;
  errors: Maybe<Array<NotifyTypingError>>;
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor: Maybe<Scalars['String']['output']>;
  /** Indicates whether more edges exist following the set defined by the clients arguments. */
  hasNextPage: Scalars['Boolean']['output'];
  /** Indicates whether more edges exist prior the set defined by the clients arguments. */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor: Maybe<Scalars['String']['output']>;
};

export type Payment = {
  __typename: 'Payment';
  amount: Scalars['Decimal']['output'];
  booking: Booking;
  bookingId: Scalars['UUID']['output'];
  createdAt: Scalars['DateTime']['output'];
  failureReason: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  paidAt: Maybe<Scalars['DateTime']['output']>;
  refunds: Maybe<RefundsConnection>;
  status: PaymentStatus;
  stripeChargeId: Maybe<Scalars['String']['output']>;
  stripeFee: Maybe<Scalars['Decimal']['output']>;
  stripePaymentIntentId: Scalars['String']['output'];
  type: PaymentType;
};


export type PaymentRefundsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<RefundSortInput>>;
  where?: InputMaybe<RefundFilterInput>;
};

export type PaymentActivity = ActivityEvent & {
  __typename: 'PaymentActivity';
  id: Scalars['UUID']['output'];
  payment: Payment;
  timestamp: Scalars['DateTime']['output'];
  type: Scalars['String']['output'];
};

export type PaymentError = Error & {
  __typename: 'PaymentError';
  code: Scalars['String']['output'];
  message: Scalars['String']['output'];
  operation: Scalars['String']['output'];
  reason: Scalars['String']['output'];
};

export type PaymentFilterInput = {
  amount?: InputMaybe<DecimalOperationFilterInput>;
  and?: InputMaybe<Array<PaymentFilterInput>>;
  booking?: InputMaybe<BookingFilterInput>;
  bookingId?: InputMaybe<UuidOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  failureReason?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  or?: InputMaybe<Array<PaymentFilterInput>>;
  paidAt?: InputMaybe<DateTimeOperationFilterInput>;
  refunds?: InputMaybe<ListFilterInputTypeOfRefundFilterInput>;
  status?: InputMaybe<PaymentStatusOperationFilterInput>;
  stripeChargeId?: InputMaybe<StringOperationFilterInput>;
  stripeFee?: InputMaybe<DecimalOperationFilterInput>;
  stripePaymentIntentId?: InputMaybe<StringOperationFilterInput>;
  type?: InputMaybe<PaymentTypeOperationFilterInput>;
};

export type PaymentSortInput = {
  amount?: InputMaybe<SortEnumType>;
  booking?: InputMaybe<BookingSortInput>;
  bookingId?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  failureReason?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  paidAt?: InputMaybe<SortEnumType>;
  status?: InputMaybe<SortEnumType>;
  stripeChargeId?: InputMaybe<SortEnumType>;
  stripeFee?: InputMaybe<SortEnumType>;
  stripePaymentIntentId?: InputMaybe<SortEnumType>;
  type?: InputMaybe<SortEnumType>;
};

export enum PaymentStatus {
  Failed = 'FAILED',
  PartiallyRefunded = 'PARTIALLY_REFUNDED',
  Pending = 'PENDING',
  Refunded = 'REFUNDED',
  Succeeded = 'SUCCEEDED'
}

export type PaymentStatusOperationFilterInput = {
  eq?: InputMaybe<PaymentStatus>;
  in?: InputMaybe<Array<PaymentStatus>>;
  neq?: InputMaybe<PaymentStatus>;
  nin?: InputMaybe<Array<PaymentStatus>>;
};

export enum PaymentType {
  Balance = 'BALANCE',
  Deposit = 'DEPOSIT',
  Full = 'FULL'
}

export type PaymentTypeOperationFilterInput = {
  eq?: InputMaybe<PaymentType>;
  in?: InputMaybe<Array<PaymentType>>;
  neq?: InputMaybe<PaymentType>;
  nin?: InputMaybe<Array<PaymentType>>;
};

/** A connection to a list of items. */
export type PaymentsByBookingConnection = {
  __typename: 'PaymentsByBookingConnection';
  /** A list of edges. */
  edges: Maybe<Array<PaymentsByBookingEdge>>;
  /** A flattened list of the nodes. */
  nodes: Maybe<Array<Payment>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type PaymentsByBookingEdge = {
  __typename: 'PaymentsByBookingEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Payment;
};

export type Payout = {
  __typename: 'Payout';
  amount: Scalars['Decimal']['output'];
  attemptCount: Scalars['Int']['output'];
  booking: Booking;
  bookingId: Scalars['UUID']['output'];
  createdAt: Scalars['DateTime']['output'];
  failureReason: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  lastAttemptAt: Maybe<Scalars['DateTime']['output']>;
  processedAt: Maybe<Scalars['DateTime']['output']>;
  spaceOwnerProfile: SpaceOwnerProfile;
  spaceOwnerProfileId: Scalars['UUID']['output'];
  stage: PayoutStage;
  status: PayoutStatus;
  stripeTransferId: Maybe<Scalars['String']['output']>;
};

export type PayoutFilterInput = {
  amount?: InputMaybe<DecimalOperationFilterInput>;
  and?: InputMaybe<Array<PayoutFilterInput>>;
  attemptCount?: InputMaybe<IntOperationFilterInput>;
  booking?: InputMaybe<BookingFilterInput>;
  bookingId?: InputMaybe<UuidOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  failureReason?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  lastAttemptAt?: InputMaybe<DateTimeOperationFilterInput>;
  or?: InputMaybe<Array<PayoutFilterInput>>;
  processedAt?: InputMaybe<DateTimeOperationFilterInput>;
  spaceOwnerProfile?: InputMaybe<SpaceOwnerProfileFilterInput>;
  spaceOwnerProfileId?: InputMaybe<UuidOperationFilterInput>;
  stage?: InputMaybe<PayoutStageOperationFilterInput>;
  status?: InputMaybe<PayoutStatusOperationFilterInput>;
  stripeTransferId?: InputMaybe<StringOperationFilterInput>;
};

export enum PayoutSchedule {
  Biweekly = 'BIWEEKLY',
  Monthly = 'MONTHLY',
  Weekly = 'WEEKLY'
}

export type PayoutScheduleOperationFilterInput = {
  eq?: InputMaybe<PayoutSchedule>;
  in?: InputMaybe<Array<PayoutSchedule>>;
  neq?: InputMaybe<PayoutSchedule>;
  nin?: InputMaybe<Array<PayoutSchedule>>;
};

export type PayoutSortInput = {
  amount?: InputMaybe<SortEnumType>;
  attemptCount?: InputMaybe<SortEnumType>;
  booking?: InputMaybe<BookingSortInput>;
  bookingId?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  failureReason?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  lastAttemptAt?: InputMaybe<SortEnumType>;
  processedAt?: InputMaybe<SortEnumType>;
  spaceOwnerProfile?: InputMaybe<SpaceOwnerProfileSortInput>;
  spaceOwnerProfileId?: InputMaybe<SortEnumType>;
  stage?: InputMaybe<SortEnumType>;
  status?: InputMaybe<SortEnumType>;
  stripeTransferId?: InputMaybe<SortEnumType>;
};

export enum PayoutStage {
  Stage1 = 'STAGE1',
  Stage2 = 'STAGE2'
}

export type PayoutStageOperationFilterInput = {
  eq?: InputMaybe<PayoutStage>;
  in?: InputMaybe<Array<PayoutStage>>;
  neq?: InputMaybe<PayoutStage>;
  nin?: InputMaybe<Array<PayoutStage>>;
};

export enum PayoutStatus {
  Completed = 'COMPLETED',
  Failed = 'FAILED',
  PartiallyPaid = 'PARTIALLY_PAID',
  Pending = 'PENDING',
  Processing = 'PROCESSING'
}

export type PayoutStatusOperationFilterInput = {
  eq?: InputMaybe<PayoutStatus>;
  in?: InputMaybe<Array<PayoutStatus>>;
  neq?: InputMaybe<PayoutStatus>;
  nin?: InputMaybe<Array<PayoutStatus>>;
};

export type PerformerItem = {
  __typename: 'PerformerItem';
  change: Maybe<Scalars['Decimal']['output']>;
  id: Scalars['UUID']['output'];
  title: Scalars['String']['output'];
  value: Maybe<Scalars['Decimal']['output']>;
};

export type PeriodComparison = {
  __typename: 'PeriodComparison';
  current: PeriodData;
  previous: PeriodData;
};

export type PeriodData = {
  __typename: 'PeriodData';
  avgRating: Maybe<Scalars['Float']['output']>;
  bookings: Scalars['Int']['output'];
  completionRate: Maybe<Scalars['Decimal']['output']>;
  endDate: Scalars['DateTime']['output'];
  period: Scalars['String']['output'];
  revenue: Maybe<Scalars['Decimal']['output']>;
  startDate: Scalars['DateTime']['output'];
};

export type PricingRule = {
  __typename: 'PricingRule';
  createdAt: Scalars['DateTime']['output'];
  daysOfWeek: Maybe<Array<Scalars['Int']['output']>>;
  endDate: Maybe<Scalars['LocalDate']['output']>;
  id: Scalars['UUID']['output'];
  label: Maybe<Scalars['String']['output']>;
  priority: Scalars['Int']['output'];
  space: Space;
  spaceId: Scalars['UUID']['output'];
  startDate: Maybe<Scalars['LocalDate']['output']>;
  type: PricingRuleType;
  value: Scalars['Decimal']['output'];
};

export type PricingRuleFilterInput = {
  and?: InputMaybe<Array<PricingRuleFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  daysOfWeek?: InputMaybe<ListIntOperationFilterInput>;
  endDate?: InputMaybe<LocalDateOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  label?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<PricingRuleFilterInput>>;
  priority?: InputMaybe<IntOperationFilterInput>;
  space?: InputMaybe<SpaceFilterInput>;
  spaceId?: InputMaybe<UuidOperationFilterInput>;
  startDate?: InputMaybe<LocalDateOperationFilterInput>;
  type?: InputMaybe<PricingRuleTypeOperationFilterInput>;
  value?: InputMaybe<DecimalOperationFilterInput>;
};

export type PricingRuleSortInput = {
  createdAt?: InputMaybe<SortEnumType>;
  endDate?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  label?: InputMaybe<SortEnumType>;
  priority?: InputMaybe<SortEnumType>;
  space?: InputMaybe<SpaceSortInput>;
  spaceId?: InputMaybe<SortEnumType>;
  startDate?: InputMaybe<SortEnumType>;
  type?: InputMaybe<SortEnumType>;
  value?: InputMaybe<SortEnumType>;
};

export enum PricingRuleType {
  Fixed = 'FIXED',
  Multiplier = 'MULTIPLIER'
}

export type PricingRuleTypeOperationFilterInput = {
  eq?: InputMaybe<PricingRuleType>;
  in?: InputMaybe<Array<PricingRuleType>>;
  neq?: InputMaybe<PricingRuleType>;
  nin?: InputMaybe<Array<PricingRuleType>>;
};

/** A connection to a list of items. */
export type PricingRulesBySpaceConnection = {
  __typename: 'PricingRulesBySpaceConnection';
  /** A list of edges. */
  edges: Maybe<Array<PricingRulesBySpaceEdge>>;
  /** A flattened list of the nodes. */
  nodes: Maybe<Array<PricingRule>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type PricingRulesBySpaceEdge = {
  __typename: 'PricingRulesBySpaceEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: PricingRule;
};

export type ProcessPayoutError = ConflictError | NotFoundError | PaymentError;

export type ProcessPayoutInput = {
  bookingId: Scalars['ID']['input'];
  stage: PayoutStage;
};

export type ProcessPayoutPayload = {
  __typename: 'ProcessPayoutPayload';
  errors: Maybe<Array<ProcessPayoutError>>;
  payout: Maybe<Payout>;
};

export enum ProfileType {
  Advertiser = 'ADVERTISER',
  SpaceOwner = 'SPACE_OWNER'
}

export type ProfileTypeOperationFilterInput = {
  eq?: InputMaybe<ProfileType>;
  in?: InputMaybe<Array<ProfileType>>;
  neq?: InputMaybe<ProfileType>;
  nin?: InputMaybe<Array<ProfileType>>;
};

export type ProofActivity = ActivityEvent & {
  __typename: 'ProofActivity';
  id: Scalars['UUID']['output'];
  proof: BookingProof;
  timestamp: Scalars['DateTime']['output'];
  type: Scalars['String']['output'];
};

export enum ProofStatus {
  Approved = 'APPROVED',
  CorrectionRequested = 'CORRECTION_REQUESTED',
  Disputed = 'DISPUTED',
  Pending = 'PENDING',
  Rejected = 'REJECTED',
  UnderReview = 'UNDER_REVIEW'
}

export type ProofStatusOperationFilterInput = {
  eq?: InputMaybe<ProofStatus>;
  in?: InputMaybe<Array<ProofStatus>>;
  neq?: InputMaybe<ProofStatus>;
  nin?: InputMaybe<Array<ProofStatus>>;
};

export type Query = {
  __typename: 'Query';
  advertiserAnalytics: AdvertiserAnalytics;
  advertiserDailyStats: Array<DailyStats>;
  blockedDatesBySpace: Maybe<BlockedDatesBySpaceConnection>;
  bookingById: Maybe<Booking>;
  bookingsRequiringAction: Maybe<BookingsRequiringActionConnection>;
  campaignById: Maybe<Campaign>;
  earningsByDateRange: Array<EarningsDataPoint>;
  earningsSummary: EarningsSummary;
  effectivePriceByDate: EffectivePricePayload;
  exportBookingsAsCsv: ExportBookingsPayload;
  incomingBookingRequests: Maybe<IncomingBookingRequestsConnection>;
  me: Maybe<User>;
  messagesByConversation: Maybe<MessagesByConversationConnection>;
  myActivityFeed: Array<ActivityEvent>;
  myBookingsAsAdvertiser: Maybe<MyBookingsAsAdvertiserConnection>;
  myBookingsAsOwner: Maybe<MyBookingsAsOwnerConnection>;
  myCampaigns: Maybe<MyCampaignsConnection>;
  myConversations: Maybe<MyConversationsConnection>;
  myNotificationPreferences: Array<NotificationPreference>;
  myNotifications: Maybe<MyNotificationsConnection>;
  myPayouts: Maybe<MyPayoutsConnection>;
  myReviews: Maybe<MyReviewsConnection>;
  mySavedPaymentMethods: Array<SavedPaymentMethod>;
  mySpaces: Maybe<MySpacesConnection>;
  paymentById: Maybe<Payment>;
  paymentsByBooking: Maybe<PaymentsByBookingConnection>;
  payoutById: Maybe<Payout>;
  pricingRulesBySpace: Maybe<PricingRulesBySpaceConnection>;
  reviewByBooking: Maybe<Review>;
  reviewsBySpace: Maybe<ReviewsBySpaceConnection>;
  spaceById: Maybe<Space>;
  spaceOwnerAnalytics: SpaceOwnerAnalytics;
  spaceOwnerDailyStats: Array<DailyStats>;
  spaces: Maybe<SpacesConnection>;
  transactionsByBooking: Maybe<TransactionsByBookingConnection>;
  unreadConversationsCount: Scalars['Int']['output'];
  unreadNotificationsCount: Scalars['Int']['output'];
};


export type QueryAdvertiserAnalyticsArgs = {
  endDate: Scalars['DateTime']['input'];
  startDate: Scalars['DateTime']['input'];
};


export type QueryAdvertiserDailyStatsArgs = {
  endDate: Scalars['DateTime']['input'];
  startDate: Scalars['DateTime']['input'];
};


export type QueryBlockedDatesBySpaceArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['LocalDate']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<BlockedDateSortInput>>;
  spaceId: Scalars['ID']['input'];
  startDate?: InputMaybe<Scalars['LocalDate']['input']>;
  where?: InputMaybe<BlockedDateFilterInput>;
};


export type QueryBookingByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryBookingsRequiringActionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryCampaignByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEarningsByDateRangeArgs = {
  end: Scalars['DateTime']['input'];
  granularity: Granularity;
  start: Scalars['DateTime']['input'];
};


export type QueryEffectivePriceByDateArgs = {
  date: Scalars['LocalDate']['input'];
  spaceId: Scalars['ID']['input'];
};


export type QueryExportBookingsAsCsvArgs = {
  input?: InputMaybe<ExportBookingsInput>;
};


export type QueryIncomingBookingRequestsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<BookingSortInput>>;
};


export type QueryMessagesByConversationArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  conversationId: Scalars['ID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<MessageSortInput>>;
  where?: InputMaybe<MessageFilterInput>;
};


export type QueryMyActivityFeedArgs = {
  first: Scalars['Int']['input'];
};


export type QueryMyBookingsAsAdvertiserArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<BookingSortInput>>;
  where?: InputMaybe<BookingFilterInput>;
};


export type QueryMyBookingsAsOwnerArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<BookingSortInput>>;
  searchText?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<BookingFilterInput>;
};


export type QueryMyCampaignsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<CampaignSortInput>>;
  where?: InputMaybe<CampaignFilterInput>;
};


export type QueryMyConversationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<ConversationSortInput>>;
  where?: InputMaybe<ConversationFilterInput>;
};


export type QueryMyNotificationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<NotificationSortInput>>;
  where?: InputMaybe<NotificationFilterInput>;
};


export type QueryMyPayoutsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<PayoutSortInput>>;
  where?: InputMaybe<PayoutFilterInput>;
};


export type QueryMyReviewsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<ReviewSortInput>>;
};


export type QueryMySavedPaymentMethodsArgs = {
  order?: InputMaybe<Array<SavedPaymentMethodSortInput>>;
  where?: InputMaybe<SavedPaymentMethodFilterInput>;
};


export type QueryMySpacesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<SpaceSortInput>>;
  where?: InputMaybe<SpaceFilterInput>;
};


export type QueryPaymentByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPaymentsByBookingArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  bookingId: Scalars['ID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<PaymentSortInput>>;
  where?: InputMaybe<PaymentFilterInput>;
};


export type QueryPayoutByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPricingRulesBySpaceArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<PricingRuleSortInput>>;
  spaceId: Scalars['ID']['input'];
  where?: InputMaybe<PricingRuleFilterInput>;
};


export type QueryReviewByBookingArgs = {
  bookingId: Scalars['ID']['input'];
  reviewerType: ReviewerType;
};


export type QueryReviewsBySpaceArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<ReviewSortInput>>;
  spaceId: Scalars['ID']['input'];
};


export type QuerySpaceByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySpaceOwnerAnalyticsArgs = {
  endDate: Scalars['DateTime']['input'];
  startDate: Scalars['DateTime']['input'];
};


export type QuerySpaceOwnerDailyStatsArgs = {
  endDate: Scalars['DateTime']['input'];
  startDate: Scalars['DateTime']['input'];
};


export type QuerySpacesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<SpaceSortInput>>;
  where?: InputMaybe<SpaceFilterInput>;
};


export type QueryTransactionsByBookingArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  bookingId: Scalars['ID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<TransactionSortInput>>;
  where?: InputMaybe<TransactionFilterInput>;
};

export type RatingPerformerItem = {
  __typename: 'RatingPerformerItem';
  id: Scalars['UUID']['output'];
  reviews: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  value: Scalars['Float']['output'];
};

export type RatingTrendPoint = {
  __typename: 'RatingTrendPoint';
  month: Scalars['String']['output'];
  rating: Scalars['Float']['output'];
  reviews: Scalars['Int']['output'];
};

export type ReactivateSpaceError = ForbiddenError | NotFoundError;

export type ReactivateSpaceInput = {
  id: Scalars['ID']['input'];
};

export type ReactivateSpacePayload = {
  __typename: 'ReactivateSpacePayload';
  errors: Maybe<Array<ReactivateSpaceError>>;
  space: Maybe<Space>;
};

export type RefreshStripeAccountStatusError = NotFoundError | PaymentError | ValidationError;

export type RefreshStripeAccountStatusPayload = {
  __typename: 'RefreshStripeAccountStatusPayload';
  errors: Maybe<Array<RefreshStripeAccountStatusError>>;
  profile: Maybe<SpaceOwnerProfile>;
};

export type Refund = {
  __typename: 'Refund';
  amount: Scalars['Decimal']['output'];
  booking: Booking;
  bookingId: Scalars['UUID']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['UUID']['output'];
  payment: Payment;
  paymentId: Scalars['UUID']['output'];
  processedAt: Maybe<Scalars['DateTime']['output']>;
  reason: Scalars['String']['output'];
  status: RefundStatus;
  stripeRefundId: Maybe<Scalars['String']['output']>;
};

export type RefundFilterInput = {
  amount?: InputMaybe<DecimalOperationFilterInput>;
  and?: InputMaybe<Array<RefundFilterInput>>;
  booking?: InputMaybe<BookingFilterInput>;
  bookingId?: InputMaybe<UuidOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  or?: InputMaybe<Array<RefundFilterInput>>;
  payment?: InputMaybe<PaymentFilterInput>;
  paymentId?: InputMaybe<UuidOperationFilterInput>;
  processedAt?: InputMaybe<DateTimeOperationFilterInput>;
  reason?: InputMaybe<StringOperationFilterInput>;
  status?: InputMaybe<RefundStatusOperationFilterInput>;
  stripeRefundId?: InputMaybe<StringOperationFilterInput>;
};

export type RefundSortInput = {
  amount?: InputMaybe<SortEnumType>;
  booking?: InputMaybe<BookingSortInput>;
  bookingId?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  payment?: InputMaybe<PaymentSortInput>;
  paymentId?: InputMaybe<SortEnumType>;
  processedAt?: InputMaybe<SortEnumType>;
  reason?: InputMaybe<SortEnumType>;
  status?: InputMaybe<SortEnumType>;
  stripeRefundId?: InputMaybe<SortEnumType>;
};

export enum RefundStatus {
  Failed = 'FAILED',
  Pending = 'PENDING',
  Succeeded = 'SUCCEEDED'
}

export type RefundStatusOperationFilterInput = {
  eq?: InputMaybe<RefundStatus>;
  in?: InputMaybe<Array<RefundStatus>>;
  neq?: InputMaybe<RefundStatus>;
  nin?: InputMaybe<Array<RefundStatus>>;
};

/** A connection to a list of items. */
export type RefundsConnection = {
  __typename: 'RefundsConnection';
  /** A list of edges. */
  edges: Maybe<Array<RefundsEdge>>;
  /** A flattened list of the nodes. */
  nodes: Maybe<Array<Refund>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type RefundsEdge = {
  __typename: 'RefundsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Refund;
};

export type RejectBookingError = ForbiddenError | InvalidStatusTransitionError | NotFoundError;

export type RejectBookingInput = {
  id: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
};

export type RejectBookingPayload = {
  __typename: 'RejectBookingPayload';
  booking: Maybe<Booking>;
  errors: Maybe<Array<RejectBookingError>>;
};

export type RequestManualPayoutError = NotFoundError | PaymentError | ValidationError;

export type RequestManualPayoutInput = {
  amount?: InputMaybe<Scalars['Decimal']['input']>;
};

export type RequestManualPayoutPayload = {
  __typename: 'RequestManualPayoutPayload';
  errors: Maybe<Array<RequestManualPayoutError>>;
  manualPayout: Maybe<ManualPayout>;
};

export type RequestRefundError = InvalidStatusTransitionError | NotFoundError | PaymentError | ValidationError;

export type RequestRefundInput = {
  amount: Scalars['Decimal']['input'];
  paymentId: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
};

export type RequestRefundPayload = {
  __typename: 'RequestRefundPayload';
  errors: Maybe<Array<RequestRefundError>>;
  refund: Maybe<Refund>;
};

export type RetryPayoutError = InvalidStatusTransitionError | NotFoundError | PaymentError;

export type RetryPayoutInput = {
  payoutId: Scalars['ID']['input'];
};

export type RetryPayoutPayload = {
  __typename: 'RetryPayoutPayload';
  errors: Maybe<Array<RetryPayoutError>>;
  payout: Maybe<Payout>;
};

export type Review = {
  __typename: 'Review';
  booking: Booking;
  bookingId: Scalars['UUID']['output'];
  comment: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['UUID']['output'];
  rating: Scalars['Int']['output'];
  reviewer: Maybe<ReviewerInfo>;
  reviewerProfileId: Scalars['UUID']['output'];
  reviewerType: ReviewerType;
  space: Space;
  spaceId: Scalars['UUID']['output'];
};

export type ReviewFilterInput = {
  and?: InputMaybe<Array<ReviewFilterInput>>;
  booking?: InputMaybe<BookingFilterInput>;
  bookingId?: InputMaybe<UuidOperationFilterInput>;
  comment?: InputMaybe<StringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  or?: InputMaybe<Array<ReviewFilterInput>>;
  rating?: InputMaybe<IntOperationFilterInput>;
  reviewerProfileId?: InputMaybe<UuidOperationFilterInput>;
  reviewerType?: InputMaybe<ReviewerTypeOperationFilterInput>;
  space?: InputMaybe<SpaceFilterInput>;
  spaceId?: InputMaybe<UuidOperationFilterInput>;
};

export type ReviewSortInput = {
  booking?: InputMaybe<BookingSortInput>;
  bookingId?: InputMaybe<SortEnumType>;
  comment?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  rating?: InputMaybe<SortEnumType>;
  reviewerProfileId?: InputMaybe<SortEnumType>;
  reviewerType?: InputMaybe<SortEnumType>;
  space?: InputMaybe<SpaceSortInput>;
  spaceId?: InputMaybe<SortEnumType>;
};

export type ReviewerInfo = {
  __typename: 'ReviewerInfo';
  avatar: Maybe<Scalars['String']['output']>;
  companyName: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

export enum ReviewerType {
  Advertiser = 'ADVERTISER',
  SpaceOwner = 'SPACE_OWNER'
}

export type ReviewerTypeOperationFilterInput = {
  eq?: InputMaybe<ReviewerType>;
  in?: InputMaybe<Array<ReviewerType>>;
  neq?: InputMaybe<ReviewerType>;
  nin?: InputMaybe<Array<ReviewerType>>;
};

/** A connection to a list of items. */
export type ReviewsBySpaceConnection = {
  __typename: 'ReviewsBySpaceConnection';
  /** A list of edges. */
  edges: Maybe<Array<ReviewsBySpaceEdge>>;
  /** A flattened list of the nodes. */
  nodes: Maybe<Array<Review>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type ReviewsBySpaceEdge = {
  __typename: 'ReviewsBySpaceEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Review;
};

/** A connection to a list of items. */
export type ReviewsConnection = {
  __typename: 'ReviewsConnection';
  /** A list of edges. */
  edges: Maybe<Array<ReviewsEdge>>;
  /** A flattened list of the nodes. */
  nodes: Maybe<Array<Review>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type ReviewsEdge = {
  __typename: 'ReviewsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Review;
};

export type SavedPaymentMethod = {
  __typename: 'SavedPaymentMethod';
  advertiserProfile: AdvertiserProfile;
  advertiserProfileId: Scalars['UUID']['output'];
  brand: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  expMonth: Scalars['Int']['output'];
  expYear: Scalars['Int']['output'];
  id: Scalars['UUID']['output'];
  isDefault: Scalars['Boolean']['output'];
  last4: Scalars['String']['output'];
  stripePaymentMethodId: Scalars['String']['output'];
};

export type SavedPaymentMethodFilterInput = {
  advertiserProfile?: InputMaybe<AdvertiserProfileFilterInput>;
  advertiserProfileId?: InputMaybe<UuidOperationFilterInput>;
  and?: InputMaybe<Array<SavedPaymentMethodFilterInput>>;
  brand?: InputMaybe<StringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  expMonth?: InputMaybe<IntOperationFilterInput>;
  expYear?: InputMaybe<IntOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  isDefault?: InputMaybe<BooleanOperationFilterInput>;
  last4?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<SavedPaymentMethodFilterInput>>;
  stripePaymentMethodId?: InputMaybe<StringOperationFilterInput>;
};

export type SavedPaymentMethodSortInput = {
  advertiserProfile?: InputMaybe<AdvertiserProfileSortInput>;
  advertiserProfileId?: InputMaybe<SortEnumType>;
  brand?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  expMonth?: InputMaybe<SortEnumType>;
  expYear?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  isDefault?: InputMaybe<SortEnumType>;
  last4?: InputMaybe<SortEnumType>;
  stripePaymentMethodId?: InputMaybe<SortEnumType>;
};

export type SendMessageError = ForbiddenError;

export type SendMessageInput = {
  attachments?: InputMaybe<Array<Scalars['String']['input']>>;
  content: Scalars['String']['input'];
  conversationId: Scalars['ID']['input'];
  type?: InputMaybe<MessageType>;
};

export type SendMessagePayload = {
  __typename: 'SendMessagePayload';
  errors: Maybe<Array<SendMessageError>>;
  message: Maybe<Message>;
};

export type SetDefaultPaymentMethodError = ForbiddenError | NotFoundError;

export type SetDefaultPaymentMethodInput = {
  paymentMethodId: Scalars['UUID']['input'];
};

export type SetDefaultPaymentMethodPayload = {
  __typename: 'SetDefaultPaymentMethodPayload';
  errors: Maybe<Array<SetDefaultPaymentMethodError>>;
  paymentMethod: Maybe<SavedPaymentMethod>;
};

export enum SortEnumType {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Space = {
  __typename: 'Space';
  address: Scalars['String']['output'];
  availableFrom: Maybe<Scalars['DateTime']['output']>;
  availableTo: Maybe<Scalars['DateTime']['output']>;
  averageRating: Maybe<Scalars['Float']['output']>;
  blockedDates: Array<BlockedDate>;
  bookings: Maybe<BookingsConnection>;
  city: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  description: Maybe<Scalars['String']['output']>;
  dimensions: Maybe<Scalars['String']['output']>;
  dimensionsText: Maybe<Scalars['String']['output']>;
  effectivePrices: Array<DatePrice>;
  height: Maybe<Scalars['Float']['output']>;
  id: Scalars['UUID']['output'];
  images: Array<Scalars['String']['output']>;
  installationFee: Maybe<Scalars['Decimal']['output']>;
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  maxDuration: Maybe<Scalars['Int']['output']>;
  minDuration: Scalars['Int']['output'];
  owner: Maybe<SpaceOwnerProfile>;
  pricePerDay: Scalars['Decimal']['output'];
  pricingRules: Array<PricingRule>;
  rejectionReason: Maybe<Scalars['String']['output']>;
  reviews: Maybe<ReviewsConnection>;
  spaceOwnerProfile: SpaceOwnerProfile;
  spaceOwnerProfileId: Scalars['UUID']['output'];
  state: Scalars['String']['output'];
  status: SpaceStatus;
  title: Scalars['String']['output'];
  totalBookings: Scalars['Int']['output'];
  totalRevenue: Scalars['Decimal']['output'];
  traffic: Maybe<Scalars['String']['output']>;
  type: SpaceType;
  width: Maybe<Scalars['Float']['output']>;
  zipCode: Maybe<Scalars['String']['output']>;
};


export type SpaceBookingsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<BookingSortInput>>;
  where?: InputMaybe<BookingFilterInput>;
};


export type SpaceEffectivePricesArgs = {
  endDate: Scalars['LocalDate']['input'];
  startDate: Scalars['LocalDate']['input'];
};


export type SpaceReviewsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<ReviewSortInput>>;
  where?: InputMaybe<ReviewFilterInput>;
};

export type SpaceFilterInput = {
  address?: InputMaybe<StringOperationFilterInput>;
  and?: InputMaybe<Array<SpaceFilterInput>>;
  availableFrom?: InputMaybe<DateTimeOperationFilterInput>;
  availableTo?: InputMaybe<DateTimeOperationFilterInput>;
  averageRating?: InputMaybe<FloatOperationFilterInput>;
  blockedDates?: InputMaybe<ListFilterInputTypeOfBlockedDateFilterInput>;
  bookings?: InputMaybe<ListFilterInputTypeOfBookingFilterInput>;
  city?: InputMaybe<StringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
  dimensions?: InputMaybe<StringOperationFilterInput>;
  dimensionsText?: InputMaybe<StringOperationFilterInput>;
  height?: InputMaybe<FloatOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  images?: InputMaybe<ListStringOperationFilterInput>;
  installationFee?: InputMaybe<DecimalOperationFilterInput>;
  latitude?: InputMaybe<FloatOperationFilterInput>;
  longitude?: InputMaybe<FloatOperationFilterInput>;
  maxDuration?: InputMaybe<IntOperationFilterInput>;
  minDuration?: InputMaybe<IntOperationFilterInput>;
  or?: InputMaybe<Array<SpaceFilterInput>>;
  pricePerDay?: InputMaybe<DecimalOperationFilterInput>;
  pricingRules?: InputMaybe<ListFilterInputTypeOfPricingRuleFilterInput>;
  rejectionReason?: InputMaybe<StringOperationFilterInput>;
  reviews?: InputMaybe<ListFilterInputTypeOfReviewFilterInput>;
  spaceOwnerProfile?: InputMaybe<SpaceOwnerProfileFilterInput>;
  spaceOwnerProfileId?: InputMaybe<UuidOperationFilterInput>;
  state?: InputMaybe<StringOperationFilterInput>;
  status?: InputMaybe<SpaceStatusOperationFilterInput>;
  title?: InputMaybe<StringOperationFilterInput>;
  totalBookings?: InputMaybe<IntOperationFilterInput>;
  totalRevenue?: InputMaybe<DecimalOperationFilterInput>;
  traffic?: InputMaybe<StringOperationFilterInput>;
  type?: InputMaybe<SpaceTypeOperationFilterInput>;
  width?: InputMaybe<FloatOperationFilterInput>;
  zipCode?: InputMaybe<StringOperationFilterInput>;
};

export type SpaceOwnerAnalytics = {
  __typename: 'SpaceOwnerAnalytics';
  bookingHeatmap: Array<Array<Scalars['Int']['output']>>;
  endDate: Scalars['DateTime']['output'];
  monthlyStats: Array<MonthlyStats>;
  periodComparison: PeriodComparison;
  ratingTrends: Array<RatingTrendPoint>;
  spacePerformance: Array<SpacePerformanceItem>;
  startDate: Scalars['DateTime']['output'];
  statusDistribution: Array<StatusCount>;
  summary: SpaceOwnerSummary;
  topPerformers: SpaceOwnerTopPerformers;
  userId: Scalars['UUID']['output'];
};


export type SpaceOwnerAnalyticsMonthlyStatsArgs = {
  months: Scalars['Int']['input'];
};


export type SpaceOwnerAnalyticsRatingTrendsArgs = {
  months: Scalars['Int']['input'];
};


export type SpaceOwnerAnalyticsSpacePerformanceArgs = {
  first: Scalars['Int']['input'];
};

export type SpaceOwnerProfile = {
  __typename: 'SpaceOwnerProfile';
  averageResponseTime: Scalars['Int']['output'];
  businessName: Maybe<Scalars['String']['output']>;
  businessType: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['UUID']['output'];
  manualPayouts: Array<ManualPayout>;
  onboardingComplete: Scalars['Boolean']['output'];
  payoutSchedule: PayoutSchedule;
  payouts: Array<Payout>;
  responseRate: Scalars['Float']['output'];
  reviews: Maybe<ReviewsConnection>;
  spaces: Maybe<SpacesConnection>;
  stripeAccountDisconnectedAt: Maybe<Scalars['DateTime']['output']>;
  stripeAccountDisconnectedNotifiedAt: Maybe<Scalars['DateTime']['output']>;
  stripeAccountId: Maybe<Scalars['String']['output']>;
  stripeAccountStatus: Maybe<Scalars['String']['output']>;
  stripeLastAccountHealthCheck: Maybe<Scalars['DateTime']['output']>;
  user: User;
  userId: Scalars['UUID']['output'];
};


export type SpaceOwnerProfileReviewsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<ReviewSortInput>>;
  where?: InputMaybe<ReviewFilterInput>;
};


export type SpaceOwnerProfileSpacesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<SpaceSortInput>>;
  where?: InputMaybe<SpaceFilterInput>;
};

export type SpaceOwnerProfileFilterInput = {
  and?: InputMaybe<Array<SpaceOwnerProfileFilterInput>>;
  businessName?: InputMaybe<StringOperationFilterInput>;
  businessType?: InputMaybe<StringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  manualPayouts?: InputMaybe<ListFilterInputTypeOfManualPayoutFilterInput>;
  onboardingComplete?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<SpaceOwnerProfileFilterInput>>;
  payoutSchedule?: InputMaybe<PayoutScheduleOperationFilterInput>;
  payouts?: InputMaybe<ListFilterInputTypeOfPayoutFilterInput>;
  spaces?: InputMaybe<ListFilterInputTypeOfSpaceFilterInput>;
  stripeAccountDisconnectedAt?: InputMaybe<DateTimeOperationFilterInput>;
  stripeAccountDisconnectedNotifiedAt?: InputMaybe<DateTimeOperationFilterInput>;
  stripeAccountId?: InputMaybe<StringOperationFilterInput>;
  stripeAccountStatus?: InputMaybe<StringOperationFilterInput>;
  stripeLastAccountHealthCheck?: InputMaybe<DateTimeOperationFilterInput>;
  user?: InputMaybe<UserFilterInput>;
  userId?: InputMaybe<UuidOperationFilterInput>;
};

export type SpaceOwnerProfileSortInput = {
  businessName?: InputMaybe<SortEnumType>;
  businessType?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  onboardingComplete?: InputMaybe<SortEnumType>;
  payoutSchedule?: InputMaybe<SortEnumType>;
  stripeAccountDisconnectedAt?: InputMaybe<SortEnumType>;
  stripeAccountDisconnectedNotifiedAt?: InputMaybe<SortEnumType>;
  stripeAccountId?: InputMaybe<SortEnumType>;
  stripeAccountStatus?: InputMaybe<SortEnumType>;
  stripeLastAccountHealthCheck?: InputMaybe<SortEnumType>;
  user?: InputMaybe<UserSortInput>;
  userId?: InputMaybe<SortEnumType>;
};

export type SpaceOwnerSummary = {
  __typename: 'SpaceOwnerSummary';
  averageRating: Maybe<Scalars['Float']['output']>;
  avgBookingDuration: Maybe<Scalars['Decimal']['output']>;
  completionRate: Maybe<Scalars['Decimal']['output']>;
  forecastedRevenue: Maybe<Scalars['Decimal']['output']>;
  occupancyRate: Maybe<Scalars['Decimal']['output']>;
  previousAvgBookingDuration: Maybe<Scalars['Decimal']['output']>;
  previousOccupancyRate: Maybe<Scalars['Decimal']['output']>;
  previousRepeatAdvertiserRate: Maybe<Scalars['Decimal']['output']>;
  previousTotalBookings: Scalars['Int']['output'];
  previousTotalRevenue: Maybe<Scalars['Decimal']['output']>;
  repeatAdvertiserRate: Maybe<Scalars['Decimal']['output']>;
  totalBookings: Scalars['Int']['output'];
  totalRevenue: Maybe<Scalars['Decimal']['output']>;
};

export type SpaceOwnerTopPerformers = {
  __typename: 'SpaceOwnerTopPerformers';
  bestOccupancy: Maybe<PerformerItem>;
  bestRating: Maybe<RatingPerformerItem>;
  bestRevenue: Maybe<PerformerItem>;
  mostBookings: Maybe<PerformerItem>;
  needsAttention: Maybe<AttentionItem>;
};

export type SpacePerformanceItem = {
  __typename: 'SpacePerformanceItem';
  averageRating: Maybe<Scalars['Float']['output']>;
  id: Scalars['UUID']['output'];
  image: Maybe<Scalars['String']['output']>;
  occupancyRate: Maybe<Scalars['Decimal']['output']>;
  title: Scalars['String']['output'];
  totalBookings: Scalars['Int']['output'];
  totalRevenue: Maybe<Scalars['Decimal']['output']>;
};

export type SpaceSortInput = {
  address?: InputMaybe<SortEnumType>;
  availableFrom?: InputMaybe<SortEnumType>;
  availableTo?: InputMaybe<SortEnumType>;
  averageRating?: InputMaybe<SortEnumType>;
  city?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  description?: InputMaybe<SortEnumType>;
  dimensions?: InputMaybe<SortEnumType>;
  dimensionsText?: InputMaybe<SortEnumType>;
  height?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  installationFee?: InputMaybe<SortEnumType>;
  latitude?: InputMaybe<SortEnumType>;
  longitude?: InputMaybe<SortEnumType>;
  maxDuration?: InputMaybe<SortEnumType>;
  minDuration?: InputMaybe<SortEnumType>;
  pricePerDay?: InputMaybe<SortEnumType>;
  rejectionReason?: InputMaybe<SortEnumType>;
  spaceOwnerProfile?: InputMaybe<SpaceOwnerProfileSortInput>;
  spaceOwnerProfileId?: InputMaybe<SortEnumType>;
  state?: InputMaybe<SortEnumType>;
  status?: InputMaybe<SortEnumType>;
  title?: InputMaybe<SortEnumType>;
  totalBookings?: InputMaybe<SortEnumType>;
  totalRevenue?: InputMaybe<SortEnumType>;
  traffic?: InputMaybe<SortEnumType>;
  type?: InputMaybe<SortEnumType>;
  width?: InputMaybe<SortEnumType>;
  zipCode?: InputMaybe<SortEnumType>;
};

export enum SpaceStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  PendingApproval = 'PENDING_APPROVAL',
  Rejected = 'REJECTED',
  Suspended = 'SUSPENDED'
}

export type SpaceStatusOperationFilterInput = {
  eq?: InputMaybe<SpaceStatus>;
  in?: InputMaybe<Array<SpaceStatus>>;
  neq?: InputMaybe<SpaceStatus>;
  nin?: InputMaybe<Array<SpaceStatus>>;
};

export enum SpaceType {
  Billboard = 'BILLBOARD',
  DigitalDisplay = 'DIGITAL_DISPLAY',
  Other = 'OTHER',
  Storefront = 'STOREFRONT',
  Transit = 'TRANSIT',
  VehicleWrap = 'VEHICLE_WRAP',
  WindowDisplay = 'WINDOW_DISPLAY'
}

export type SpaceTypeOperationFilterInput = {
  eq?: InputMaybe<SpaceType>;
  in?: InputMaybe<Array<SpaceType>>;
  neq?: InputMaybe<SpaceType>;
  nin?: InputMaybe<Array<SpaceType>>;
};

/** A connection to a list of items. */
export type SpacesConnection = {
  __typename: 'SpacesConnection';
  /** A list of edges. */
  edges: Maybe<Array<SpacesEdge>>;
  /** A flattened list of the nodes. */
  nodes: Maybe<Array<Space>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type SpacesEdge = {
  __typename: 'SpacesEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Space;
};

export type StatusCount = {
  __typename: 'StatusCount';
  count: Scalars['Int']['output'];
  status: BookingStatus;
};

export type StringOperationFilterInput = {
  and?: InputMaybe<Array<StringOperationFilterInput>>;
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  eq?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ncontains?: InputMaybe<Scalars['String']['input']>;
  nendsWith?: InputMaybe<Scalars['String']['input']>;
  neq?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  nstartsWith?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<StringOperationFilterInput>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type SubmitCampaignError = ForbiddenError | InvalidStatusTransitionError | NotFoundError;

export type SubmitCampaignInput = {
  id: Scalars['ID']['input'];
};

export type SubmitCampaignPayload = {
  __typename: 'SubmitCampaignPayload';
  campaign: Maybe<Campaign>;
  errors: Maybe<Array<SubmitCampaignError>>;
};

export type SubmitProofError = ForbiddenError | InvalidStatusTransitionError | NotFoundError;

export type SubmitProofInput = {
  bookingId: Scalars['ID']['input'];
  photoUrls: Array<Scalars['String']['input']>;
};

export type SubmitProofPayload = {
  __typename: 'SubmitProofPayload';
  booking: Maybe<Booking>;
  errors: Maybe<Array<SubmitProofError>>;
};

export type Subscription = {
  __typename: 'Subscription';
  onBookingUpdate: Booking;
  onMessage: Message;
  onNotification: Notification;
  onProofUpdate: BookingProof;
  onTyping: TypingIndicator;
};


export type SubscriptionOnBookingUpdateArgs = {
  bookingId: Scalars['ID']['input'];
};


export type SubscriptionOnMessageArgs = {
  conversationId: Scalars['ID']['input'];
};


export type SubscriptionOnNotificationArgs = {
  userId: Scalars['ID']['input'];
};


export type SubscriptionOnProofUpdateArgs = {
  bookingId: Scalars['ID']['input'];
};


export type SubscriptionOnTypingArgs = {
  conversationId: Scalars['ID']['input'];
};

export type Transaction = {
  __typename: 'Transaction';
  amount: Scalars['Decimal']['output'];
  booking: Maybe<Booking>;
  bookingId: Maybe<Scalars['UUID']['output']>;
  createdAt: Scalars['DateTime']['output'];
  currency: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  referenceId: Scalars['UUID']['output'];
  referenceType: Scalars['String']['output'];
  type: TransactionType;
  user: Maybe<User>;
  userId: Maybe<Scalars['UUID']['output']>;
};

export type TransactionFilterInput = {
  amount?: InputMaybe<DecimalOperationFilterInput>;
  and?: InputMaybe<Array<TransactionFilterInput>>;
  booking?: InputMaybe<BookingFilterInput>;
  bookingId?: InputMaybe<UuidOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  currency?: InputMaybe<StringOperationFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  or?: InputMaybe<Array<TransactionFilterInput>>;
  referenceId?: InputMaybe<UuidOperationFilterInput>;
  referenceType?: InputMaybe<StringOperationFilterInput>;
  type?: InputMaybe<TransactionTypeOperationFilterInput>;
  user?: InputMaybe<UserFilterInput>;
  userId?: InputMaybe<UuidOperationFilterInput>;
};

export type TransactionSortInput = {
  amount?: InputMaybe<SortEnumType>;
  booking?: InputMaybe<BookingSortInput>;
  bookingId?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  currency?: InputMaybe<SortEnumType>;
  description?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  referenceId?: InputMaybe<SortEnumType>;
  referenceType?: InputMaybe<SortEnumType>;
  type?: InputMaybe<SortEnumType>;
  user?: InputMaybe<UserSortInput>;
  userId?: InputMaybe<SortEnumType>;
};

export enum TransactionType {
  Payment = 'PAYMENT',
  Payout = 'PAYOUT',
  PlatformFee = 'PLATFORM_FEE',
  Refund = 'REFUND'
}

export type TransactionTypeOperationFilterInput = {
  eq?: InputMaybe<TransactionType>;
  in?: InputMaybe<Array<TransactionType>>;
  neq?: InputMaybe<TransactionType>;
  nin?: InputMaybe<Array<TransactionType>>;
};

/** A connection to a list of items. */
export type TransactionsByBookingConnection = {
  __typename: 'TransactionsByBookingConnection';
  /** A list of edges. */
  edges: Maybe<Array<TransactionsByBookingEdge>>;
  /** A flattened list of the nodes. */
  nodes: Maybe<Array<Transaction>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type TransactionsByBookingEdge = {
  __typename: 'TransactionsByBookingEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Transaction;
};

export type TypingIndicator = {
  __typename: 'TypingIndicator';
  conversationId: Scalars['UUID']['output'];
  isTyping: Scalars['Boolean']['output'];
  timestamp: Scalars['DateTime']['output'];
  userAvatar: Maybe<Scalars['String']['output']>;
  userId: Scalars['UUID']['output'];
  userName: Scalars['String']['output'];
};

export type UnblockDatesError = ForbiddenError | NotFoundError | ValidationError;

export type UnblockDatesInput = {
  dates: Array<Scalars['LocalDate']['input']>;
  spaceId: Scalars['ID']['input'];
};

export type UnblockDatesPayload = {
  __typename: 'UnblockDatesPayload';
  errors: Maybe<Array<UnblockDatesError>>;
  unblockedCount: Maybe<Scalars['Int']['output']>;
};

export type UpdateAdvertiserProfileError = NotFoundError;

export type UpdateAdvertiserProfileInput = {
  companyName?: InputMaybe<Scalars['String']['input']>;
  industry?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateAdvertiserProfilePayload = {
  __typename: 'UpdateAdvertiserProfilePayload';
  advertiserProfile: Maybe<AdvertiserProfile>;
  errors: Maybe<Array<UpdateAdvertiserProfileError>>;
};

export type UpdateCampaignError = ForbiddenError | InvalidStatusTransitionError | NotFoundError;

export type UpdateCampaignInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  goals?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  targetAudience?: InputMaybe<Scalars['String']['input']>;
  totalBudget?: InputMaybe<Scalars['Decimal']['input']>;
};

export type UpdateCampaignPayload = {
  __typename: 'UpdateCampaignPayload';
  campaign: Maybe<Campaign>;
  errors: Maybe<Array<UpdateCampaignError>>;
};

export type UpdateCurrentUserError = NotFoundError;

export type UpdateCurrentUserInput = {
  input: UpdateUserInput;
};

export type UpdateCurrentUserPayload = {
  __typename: 'UpdateCurrentUserPayload';
  errors: Maybe<Array<UpdateCurrentUserError>>;
  user: Maybe<User>;
};

export type UpdateNotificationPreferenceInput = {
  emailEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  inAppEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  notificationType: NotificationType;
  pushEnabled?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateNotificationPreferencePayload = {
  __typename: 'UpdateNotificationPreferencePayload';
  preference: NotificationPreference;
};

export type UpdatePricingRuleError = ForbiddenError | NotFoundError | ValidationError;

export type UpdatePricingRuleInput = {
  daysOfWeek?: InputMaybe<Array<Scalars['Int']['input']>>;
  endDate?: InputMaybe<Scalars['LocalDate']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<Scalars['Int']['input']>;
  startDate?: InputMaybe<Scalars['LocalDate']['input']>;
  type?: InputMaybe<PricingRuleType>;
  value?: InputMaybe<Scalars['Decimal']['input']>;
};

export type UpdatePricingRulePayload = {
  __typename: 'UpdatePricingRulePayload';
  errors: Maybe<Array<UpdatePricingRuleError>>;
  pricingRule: Maybe<PricingRule>;
};

export type UpdateReviewError = ForbiddenError | NotFoundError | ValidationError;

export type UpdateReviewInput = {
  comment?: InputMaybe<Scalars['String']['input']>;
  rating?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateReviewPayload = {
  __typename: 'UpdateReviewPayload';
  errors: Maybe<Array<UpdateReviewError>>;
  review: Maybe<Review>;
};

export type UpdateSpaceError = ForbiddenError | GeocodingError | NotFoundError | ValidationError;

export type UpdateSpaceInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  availableFrom?: InputMaybe<Scalars['DateTime']['input']>;
  availableTo?: InputMaybe<Scalars['DateTime']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  images?: InputMaybe<Array<Scalars['String']['input']>>;
  installationFee?: InputMaybe<Scalars['Decimal']['input']>;
  latitude?: InputMaybe<Scalars['Float']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  maxDuration?: InputMaybe<Scalars['Int']['input']>;
  minDuration?: InputMaybe<Scalars['Int']['input']>;
  pricePerDay?: InputMaybe<Scalars['Decimal']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  traffic?: InputMaybe<Scalars['String']['input']>;
  zipCode?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateSpaceOwnerProfileError = NotFoundError;

export type UpdateSpaceOwnerProfileInput = {
  businessName?: InputMaybe<Scalars['String']['input']>;
  businessType?: InputMaybe<Scalars['String']['input']>;
  payoutSchedule?: InputMaybe<PayoutSchedule>;
};

export type UpdateSpaceOwnerProfilePayload = {
  __typename: 'UpdateSpaceOwnerProfilePayload';
  errors: Maybe<Array<UpdateSpaceOwnerProfileError>>;
  spaceOwnerProfile: Maybe<SpaceOwnerProfile>;
};

export type UpdateSpacePayload = {
  __typename: 'UpdateSpacePayload';
  errors: Maybe<Array<UpdateSpaceError>>;
  space: Maybe<Space>;
};

export type UpdateUserInput = {
  activeProfileType?: InputMaybe<ProfileType>;
  avatar?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename: 'User';
  activeProfileType: ProfileType;
  advertiserProfile: Maybe<AdvertiserProfile>;
  avatar: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  lastLoginAt: Maybe<Scalars['DateTime']['output']>;
  name: Scalars['String']['output'];
  password: Scalars['String']['output'];
  phone: Maybe<Scalars['String']['output']>;
  role: UserRole;
  spaceOwnerProfile: Maybe<SpaceOwnerProfile>;
  status: UserStatus;
};

export type UserFilterInput = {
  activeProfileType?: InputMaybe<ProfileTypeOperationFilterInput>;
  advertiserProfile?: InputMaybe<AdvertiserProfileFilterInput>;
  and?: InputMaybe<Array<UserFilterInput>>;
  avatar?: InputMaybe<StringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  email?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  lastLoginAt?: InputMaybe<DateTimeOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<UserFilterInput>>;
  password?: InputMaybe<StringOperationFilterInput>;
  phone?: InputMaybe<StringOperationFilterInput>;
  role?: InputMaybe<UserRoleOperationFilterInput>;
  spaceOwnerProfile?: InputMaybe<SpaceOwnerProfileFilterInput>;
  status?: InputMaybe<UserStatusOperationFilterInput>;
};

export enum UserRole {
  Admin = 'ADMIN',
  Marketing = 'MARKETING',
  User = 'USER'
}

export type UserRoleOperationFilterInput = {
  eq?: InputMaybe<UserRole>;
  in?: InputMaybe<Array<UserRole>>;
  neq?: InputMaybe<UserRole>;
  nin?: InputMaybe<Array<UserRole>>;
};

export type UserSortInput = {
  activeProfileType?: InputMaybe<SortEnumType>;
  advertiserProfile?: InputMaybe<AdvertiserProfileSortInput>;
  avatar?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  email?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  lastLoginAt?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  password?: InputMaybe<SortEnumType>;
  phone?: InputMaybe<SortEnumType>;
  role?: InputMaybe<SortEnumType>;
  spaceOwnerProfile?: InputMaybe<SpaceOwnerProfileSortInput>;
  status?: InputMaybe<SortEnumType>;
};

export enum UserStatus {
  Active = 'ACTIVE',
  Deleted = 'DELETED',
  Suspended = 'SUSPENDED'
}

export type UserStatusOperationFilterInput = {
  eq?: InputMaybe<UserStatus>;
  in?: InputMaybe<Array<UserStatus>>;
  neq?: InputMaybe<UserStatus>;
  nin?: InputMaybe<Array<UserStatus>>;
};

export type UuidOperationFilterInput = {
  eq?: InputMaybe<Scalars['UUID']['input']>;
  gt?: InputMaybe<Scalars['UUID']['input']>;
  gte?: InputMaybe<Scalars['UUID']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>;
  lt?: InputMaybe<Scalars['UUID']['input']>;
  lte?: InputMaybe<Scalars['UUID']['input']>;
  neq?: InputMaybe<Scalars['UUID']['input']>;
  ngt?: InputMaybe<Scalars['UUID']['input']>;
  ngte?: InputMaybe<Scalars['UUID']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>;
  nlt?: InputMaybe<Scalars['UUID']['input']>;
  nlte?: InputMaybe<Scalars['UUID']['input']>;
};

export type ValidationError = Error & {
  __typename: 'ValidationError';
  code: Scalars['String']['output'];
  errors: Array<KeyValuePairOfStringAndString__>;
  message: Scalars['String']['output'];
};

export type AnalyticsAdvertiserComparison_QueryFragmentFragment = { advertiserAnalytics: { __typename: 'AdvertiserAnalytics', periodComparison: { __typename: 'AdvertiserPeriodComparison', current: { __typename: 'AdvertiserPeriodData', period: string, startDate: string, endDate: string, bookings: number, spending: number | null, impressions: number, roi: number | null }, previous: { __typename: 'AdvertiserPeriodData', period: string, startDate: string, endDate: string, bookings: number, spending: number | null, impressions: number, roi: number | null } } } } & { ' $fragmentName'?: 'AnalyticsAdvertiserComparison_QueryFragmentFragment' };

export type AnalyticsAdvertiserMonthlyChart_QueryFragmentFragment = { advertiserAnalytics: { __typename: 'AdvertiserAnalytics', monthlyStats: Array<{ __typename: 'AdvertiserMonthlyStats', month: string, spending: number | null, impressions: number }> } } & { ' $fragmentName'?: 'AnalyticsAdvertiserMonthlyChart_QueryFragmentFragment' };

export type AnalyticsAdvertiserPerformanceTable_QueryFragmentFragment = { advertiserAnalytics: { __typename: 'AdvertiserAnalytics', spacePerformance: Array<{ __typename: 'AdvertiserSpacePerformance', id: string, title: string, image: string | null, totalBookings: number, totalSpend: number | null, impressions: number, roi: number | null }> } } & { ' $fragmentName'?: 'AnalyticsAdvertiserPerformanceTable_QueryFragmentFragment' };

export type AnalyticsAdvertiserSpendingChart_QueryFragmentFragment = { advertiserDailyStats: Array<{ __typename: 'DailyStats', date: string, spending: number }> } & { ' $fragmentName'?: 'AnalyticsAdvertiserSpendingChart_QueryFragmentFragment' };

export type AnalyticsAdvertiserStatusChart_QueryFragmentFragment = { advertiserAnalytics: { __typename: 'AdvertiserAnalytics', statusDistribution: Array<{ __typename: 'StatusCount', status: BookingStatus, count: number }> } } & { ' $fragmentName'?: 'AnalyticsAdvertiserStatusChart_QueryFragmentFragment' };

export type AnalyticsAdvertiserSummary_QueryFragmentFragment = { advertiserAnalytics: { __typename: 'AdvertiserAnalytics', summary: { __typename: 'AdvertiserSummary', totalSpend: number | null, previousTotalSpend: number | null, totalBookings: number, previousTotalBookings: number, totalImpressions: number, previousTotalImpressions: number, reach: number, previousReach: number, avgCostPerImpression: number | null, previousAvgCostPerImpression: number | null, roi: number | null, previousRoi: number | null, completionRate: number | null, previousCompletionRate: number | null } } } & { ' $fragmentName'?: 'AnalyticsAdvertiserSummary_QueryFragmentFragment' };

export type AnalyticsAdvertiserTopPerformers_QueryFragmentFragment = { advertiserAnalytics: { __typename: 'AdvertiserAnalytics', topPerformers: { __typename: 'AdvertiserTopPerformers', bestRoi: { __typename: 'PerformerItem', id: string, title: string, value: number | null, change: number | null } | null, mostImpressions: { __typename: 'PerformerItem', id: string, title: string, value: number | null, change: number | null } | null, bestValue: { __typename: 'PerformerItem', id: string, title: string, value: number | null, change: number | null } | null, mostBookings: { __typename: 'PerformerItem', id: string, title: string, value: number | null, change: number | null } | null, needsReview: { __typename: 'AdvertiserAttentionItem', id: string, title: string, roi: number | null, impressions: number } | null } } } & { ' $fragmentName'?: 'AnalyticsAdvertiserTopPerformers_QueryFragmentFragment' };

export type AdvertiserAnalyticsDataQueryVariables = Exact<{
  startDate: Scalars['DateTime']['input'];
  endDate: Scalars['DateTime']['input'];
}>;


export type AdvertiserAnalyticsDataQuery = { ' $fragmentRefs'?: { 'AnalyticsAdvertiserSummary_QueryFragmentFragment': AnalyticsAdvertiserSummary_QueryFragmentFragment;'AnalyticsAdvertiserSpendingChart_QueryFragmentFragment': AnalyticsAdvertiserSpendingChart_QueryFragmentFragment;'AnalyticsAdvertiserStatusChart_QueryFragmentFragment': AnalyticsAdvertiserStatusChart_QueryFragmentFragment;'AnalyticsAdvertiserMonthlyChart_QueryFragmentFragment': AnalyticsAdvertiserMonthlyChart_QueryFragmentFragment;'AnalyticsAdvertiserComparison_QueryFragmentFragment': AnalyticsAdvertiserComparison_QueryFragmentFragment;'AnalyticsAdvertiserTopPerformers_QueryFragmentFragment': AnalyticsAdvertiserTopPerformers_QueryFragmentFragment;'AnalyticsAdvertiserPerformanceTable_QueryFragmentFragment': AnalyticsAdvertiserPerformanceTable_QueryFragmentFragment } };

export type BookingCard_AdvertiserBookingFragmentFragment = { __typename: 'Booking', id: string, status: BookingStatus, startDate: string, endDate: string, totalAmount: number, space: { __typename: 'Space', title: string, images: Array<string>, city: string, state: string, owner: { __typename: 'SpaceOwnerProfile', businessName: string | null } | null } | null, campaign: { __typename: 'Campaign', name: string } | null } & { ' $fragmentName'?: 'BookingCard_AdvertiserBookingFragmentFragment' };

export type BookingsTable_AdvertiserBookingFragmentFragment = { __typename: 'Booking', id: string, status: BookingStatus, startDate: string, endDate: string, totalAmount: number, space: { __typename: 'Space', title: string, images: Array<string>, city: string, state: string, owner: { __typename: 'SpaceOwnerProfile', businessName: string | null } | null } | null, campaign: { __typename: 'Campaign', name: string } | null } & { ' $fragmentName'?: 'BookingsTable_AdvertiserBookingFragmentFragment' };

export type AdvertiserBookingsQueryVariables = Exact<{ [key: string]: never; }>;


export type AdvertiserBookingsQuery = { myBookingsAsAdvertiser: { __typename: 'MyBookingsAsAdvertiserConnection', nodes: Array<(
      { __typename: 'Booking', id: string }
      & { ' $fragmentRefs'?: { 'BookingCard_AdvertiserBookingFragmentFragment': BookingCard_AdvertiserBookingFragmentFragment;'BookingsTable_AdvertiserBookingFragmentFragment': BookingsTable_AdvertiserBookingFragmentFragment } }
    )> | null } | null };

export type CampaignCard_CampaignFragmentFragment = { __typename: 'Campaign', id: string, name: string, description: string | null, status: CampaignStatus, startDate: string | null, endDate: string | null, totalBudget: number | null, imageUrl: string, bookings: { __typename: 'BookingsConnection', nodes: Array<{ __typename: 'Booking', id: string }> | null } | null } & { ' $fragmentName'?: 'CampaignCard_CampaignFragmentFragment' };

export type CampaignsTable_CampaignFragmentFragment = { __typename: 'Campaign', id: string, name: string, description: string | null, status: CampaignStatus, startDate: string | null, endDate: string | null, totalBudget: number | null, imageUrl: string, bookings: { __typename: 'BookingsConnection', nodes: Array<{ __typename: 'Booking', id: string }> | null } | null } & { ' $fragmentName'?: 'CampaignsTable_CampaignFragmentFragment' };

export type AdvertiserCampaignsQueryVariables = Exact<{ [key: string]: never; }>;


export type AdvertiserCampaignsQuery = { myCampaigns: { __typename: 'MyCampaignsConnection', nodes: Array<(
      { __typename: 'Campaign', id: string }
      & { ' $fragmentRefs'?: { 'CampaignCard_CampaignFragmentFragment': CampaignCard_CampaignFragmentFragment;'CampaignsTable_CampaignFragmentFragment': CampaignsTable_CampaignFragmentFragment } }
    )> | null } | null };

export type DiscoverSpaceCard_SpaceFragmentFragment = { __typename: 'Space', id: string, title: string, description: string | null, city: string, state: string, images: Array<string>, type: SpaceType, pricePerDay: number } & { ' $fragmentName'?: 'DiscoverSpaceCard_SpaceFragmentFragment' };

export type DiscoverMap_SpaceFragmentFragment = { __typename: 'Space', id: string, title: string, address: string, city: string, state: string, zipCode: string | null, latitude: number, longitude: number, pricePerDay: number, type: SpaceType, images: Array<string>, width: number | null, height: number | null } & { ' $fragmentName'?: 'DiscoverMap_SpaceFragmentFragment' };

export type DiscoverTable_SpaceFragmentFragment = { __typename: 'Space', id: string, title: string, city: string, state: string, images: Array<string>, type: SpaceType, pricePerDay: number } & { ' $fragmentName'?: 'DiscoverTable_SpaceFragmentFragment' };

export type DiscoverSpacesQueryVariables = Exact<{ [key: string]: never; }>;


export type DiscoverSpacesQuery = { spaces: { __typename: 'SpacesConnection', nodes: Array<(
      { __typename: 'Space', id: string }
      & { ' $fragmentRefs'?: { 'DiscoverSpaceCard_SpaceFragmentFragment': DiscoverSpaceCard_SpaceFragmentFragment;'DiscoverTable_SpaceFragmentFragment': DiscoverTable_SpaceFragmentFragment;'DiscoverMap_SpaceFragmentFragment': DiscoverMap_SpaceFragmentFragment } }
    )> | null } | null };

export type AdvertiserOverviewActiveCampaignsCampaignCard_CampaignFragmentFragment = { __typename: 'Campaign', id: string, name: string, status: CampaignStatus, spacesCount: number, totalBudget: number | null, totalSpend: number, startDate: string | null, endDate: string | null } & { ' $fragmentName'?: 'AdvertiserOverviewActiveCampaignsCampaignCard_CampaignFragmentFragment' };

export type AdvertiserOverviewActiveCampaigns_QueryFragmentFragment = { myCampaigns: { __typename: 'MyCampaignsConnection', nodes: Array<(
      { __typename: 'Campaign', status: CampaignStatus }
      & { ' $fragmentRefs'?: { 'AdvertiserOverviewActiveCampaignsCampaignCard_CampaignFragmentFragment': AdvertiserOverviewActiveCampaignsCampaignCard_CampaignFragmentFragment } }
    )> | null } | null } & { ' $fragmentName'?: 'AdvertiserOverviewActiveCampaigns_QueryFragmentFragment' };

export type AdvertiserOverviewDeadlineWarningsDeadlineCard_BookingFragmentFragment = { __typename: 'Booking', id: string, space: { __typename: 'Space', title: string, owner: { __typename: 'SpaceOwnerProfile', user: { __typename: 'User', name: string, avatar: string | null } } | null } | null, campaign: { __typename: 'Campaign', name: string } | null, proof: { __typename: 'BookingProof', submittedAt: string } | null } & { ' $fragmentName'?: 'AdvertiserOverviewDeadlineWarningsDeadlineCard_BookingFragmentFragment' };

export type AdvertiserOverviewDeadlineWarnings_QueryFragmentFragment = { deadlineBookings: { __typename: 'MyBookingsAsAdvertiserConnection', nodes: Array<(
      { __typename: 'Booking' }
      & { ' $fragmentRefs'?: { 'AdvertiserOverviewDeadlineWarningsDeadlineCard_BookingFragmentFragment': AdvertiserOverviewDeadlineWarningsDeadlineCard_BookingFragmentFragment } }
    )> | null } | null } & { ' $fragmentName'?: 'AdvertiserOverviewDeadlineWarnings_QueryFragmentFragment' };

export type AdvertiserOverviewPendingApprovalsApprovalCard_BookingFragmentFragment = { __typename: 'Booking', id: string, space: { __typename: 'Space', title: string, spaceOwnerProfile: { __typename: 'SpaceOwnerProfile', user: { __typename: 'User', name: string, avatar: string | null } } } | null, proof: { __typename: 'BookingProof', photos: Array<string>, submittedAt: string } | null } & { ' $fragmentName'?: 'AdvertiserOverviewPendingApprovalsApprovalCard_BookingFragmentFragment' };

export type AdvertiserOverviewPendingApprovals_QueryFragmentFragment = { pendingApprovalsBookings: { __typename: 'MyBookingsAsAdvertiserConnection', nodes: Array<(
      { __typename: 'Booking' }
      & { ' $fragmentRefs'?: { 'AdvertiserOverviewPendingApprovalsApprovalCard_BookingFragmentFragment': AdvertiserOverviewPendingApprovalsApprovalCard_BookingFragmentFragment } }
    )> | null } | null } & { ' $fragmentName'?: 'AdvertiserOverviewPendingApprovals_QueryFragmentFragment' };

export type AdvertiserOverviewPendingPayments_QueryFragmentFragment = { pendingPayments: { __typename: 'MyBookingsAsAdvertiserConnection', nodes: Array<(
      { __typename: 'Booking' }
      & { ' $fragmentRefs'?: { 'AdvertiserOverviewPendingPaymentsPaymentCard_BookingFragmentFragment': AdvertiserOverviewPendingPaymentsPaymentCard_BookingFragmentFragment } }
    )> | null } | null } & { ' $fragmentName'?: 'AdvertiserOverviewPendingPayments_QueryFragmentFragment' };

export type AdvertiserOverviewPendingPaymentsPaymentCard_BookingFragmentFragment = { __typename: 'Booking', id: string, totalAmount: number, startDate: string, space: { __typename: 'Space', title: string, owner: { __typename: 'SpaceOwnerProfile', user: { __typename: 'User', name: string, avatar: string | null } } | null } | null, campaign: { __typename: 'Campaign', name: string } | null } & { ' $fragmentName'?: 'AdvertiserOverviewPendingPaymentsPaymentCard_BookingFragmentFragment' };

export type AdvertiserOverviewRecentActivity_QueryFragmentFragment = { myNotifications: { __typename: 'MyNotificationsConnection', nodes: Array<{ __typename: 'Notification', id: string, type: NotificationType, title: string, body: string, createdAt: string, isRead: boolean }> | null } | null } & { ' $fragmentName'?: 'AdvertiserOverviewRecentActivity_QueryFragmentFragment' };

export type AdvertiserOverviewSpendingChart_QueryFragmentFragment = { spendingChartBookings: { __typename: 'MyBookingsAsAdvertiserConnection', nodes: Array<{ __typename: 'Booking', payments: Array<{ __typename: 'Payment', amount: number, paidAt: string | null }> }> | null } | null } & { ' $fragmentName'?: 'AdvertiserOverviewSpendingChart_QueryFragmentFragment' };

export type AdvertiserOverviewStatCards_QueryFragmentFragment = { me: { __typename: 'User', advertiserProfile: { __typename: 'AdvertiserProfile', totalSpend: number } | null } | null, mySavedPaymentMethods: Array<{ __typename: 'SavedPaymentMethod', id: string, isDefault: boolean }>, activeCampaigns: { __typename: 'MyCampaignsConnection', nodes: Array<{ __typename: 'Campaign', id: string }> | null } | null, activeBookings: { __typename: 'MyBookingsAsAdvertiserConnection', totalCount: number } | null, pendingApprovals: { __typename: 'MyBookingsAsAdvertiserConnection', totalCount: number } | null, recentPayments: { __typename: 'MyBookingsAsAdvertiserConnection', nodes: Array<{ __typename: 'Booking', payments: Array<{ __typename: 'Payment', amount: number, paidAt: string | null }> }> | null } | null } & { ' $fragmentName'?: 'AdvertiserOverviewStatCards_QueryFragmentFragment' };

export type AdvertiserOverviewTopSpaces_QueryFragmentFragment = { topSpacesBookings: { __typename: 'MyBookingsAsAdvertiserConnection', nodes: Array<{ __typename: 'Booking', totalAmount: number, space: { __typename: 'Space', id: string, title: string, images: Array<string>, averageRating: number | null } | null }> | null } | null } & { ' $fragmentName'?: 'AdvertiserOverviewTopSpaces_QueryFragmentFragment' };

export type AdvertiserOverviewDataQueryVariables = Exact<{ [key: string]: never; }>;


export type AdvertiserOverviewDataQuery = { ' $fragmentRefs'?: { 'AdvertiserOverviewStatCards_QueryFragmentFragment': AdvertiserOverviewStatCards_QueryFragmentFragment;'AdvertiserOverviewDeadlineWarnings_QueryFragmentFragment': AdvertiserOverviewDeadlineWarnings_QueryFragmentFragment;'AdvertiserOverviewPendingPayments_QueryFragmentFragment': AdvertiserOverviewPendingPayments_QueryFragmentFragment;'AdvertiserOverviewPendingApprovals_QueryFragmentFragment': AdvertiserOverviewPendingApprovals_QueryFragmentFragment;'AdvertiserOverviewActiveCampaigns_QueryFragmentFragment': AdvertiserOverviewActiveCampaigns_QueryFragmentFragment;'AdvertiserOverviewTopSpaces_QueryFragmentFragment': AdvertiserOverviewTopSpaces_QueryFragmentFragment;'AdvertiserOverviewSpendingChart_QueryFragmentFragment': AdvertiserOverviewSpendingChart_QueryFragmentFragment;'AdvertiserOverviewRecentActivity_QueryFragmentFragment': AdvertiserOverviewRecentActivity_QueryFragmentFragment } };

export type AnalyticsBookingsChart_QueryFragmentFragment = { spaceOwnerDailyStats: Array<{ __typename: 'DailyStats', date: string, bookings: number }> } & { ' $fragmentName'?: 'AnalyticsBookingsChart_QueryFragmentFragment' };

export type AnalyticsComparison_QueryFragmentFragment = { spaceOwnerAnalytics: { __typename: 'SpaceOwnerAnalytics', periodComparison: { __typename: 'PeriodComparison', current: { __typename: 'PeriodData', period: string, startDate: string, endDate: string, bookings: number, revenue: number | null, avgRating: number | null, completionRate: number | null }, previous: { __typename: 'PeriodData', period: string, startDate: string, endDate: string, bookings: number, revenue: number | null, avgRating: number | null, completionRate: number | null } } } } & { ' $fragmentName'?: 'AnalyticsComparison_QueryFragmentFragment' };

export type AnalyticsHeatmapChart_QueryFragmentFragment = { spaceOwnerAnalytics: { __typename: 'SpaceOwnerAnalytics', bookingHeatmap: Array<Array<number>> } } & { ' $fragmentName'?: 'AnalyticsHeatmapChart_QueryFragmentFragment' };

export type AnalyticsMonthlyChart_QueryFragmentFragment = { spaceOwnerAnalytics: { __typename: 'SpaceOwnerAnalytics', monthlyStats: Array<{ __typename: 'MonthlyStats', month: string, revenue: number | null, bookings: number }> } } & { ' $fragmentName'?: 'AnalyticsMonthlyChart_QueryFragmentFragment' };

export type AnalyticsPerformanceTable_QueryFragmentFragment = { spaceOwnerAnalytics: { __typename: 'SpaceOwnerAnalytics', spacePerformance: Array<{ __typename: 'SpacePerformanceItem', id: string, title: string, image: string | null, totalBookings: number, totalRevenue: number | null, averageRating: number | null, occupancyRate: number | null }> } } & { ' $fragmentName'?: 'AnalyticsPerformanceTable_QueryFragmentFragment' };

export type AnalyticsRatingChart_QueryFragmentFragment = { spaceOwnerAnalytics: { __typename: 'SpaceOwnerAnalytics', ratingTrends: Array<{ __typename: 'RatingTrendPoint', month: string, rating: number, reviews: number }> } } & { ' $fragmentName'?: 'AnalyticsRatingChart_QueryFragmentFragment' };

export type AnalyticsRevenueChart_QueryFragmentFragment = { spaceOwnerAnalytics: { __typename: 'SpaceOwnerAnalytics', spacePerformance: Array<{ __typename: 'SpacePerformanceItem', id: string, title: string, totalRevenue: number | null }> } } & { ' $fragmentName'?: 'AnalyticsRevenueChart_QueryFragmentFragment' };

export type AnalyticsStatusChart_QueryFragmentFragment = { spaceOwnerAnalytics: { __typename: 'SpaceOwnerAnalytics', statusDistribution: Array<{ __typename: 'StatusCount', status: BookingStatus, count: number }> } } & { ' $fragmentName'?: 'AnalyticsStatusChart_QueryFragmentFragment' };

export type AnalyticsSummary_QueryFragmentFragment = { spaceOwnerAnalytics: { __typename: 'SpaceOwnerAnalytics', summary: { __typename: 'SpaceOwnerSummary', totalBookings: number, previousTotalBookings: number, totalRevenue: number | null, previousTotalRevenue: number | null, averageRating: number | null, completionRate: number | null, avgBookingDuration: number | null, previousAvgBookingDuration: number | null, occupancyRate: number | null, previousOccupancyRate: number | null, repeatAdvertiserRate: number | null, previousRepeatAdvertiserRate: number | null, forecastedRevenue: number | null } } } & { ' $fragmentName'?: 'AnalyticsSummary_QueryFragmentFragment' };

export type AnalyticsTopPerformers_QueryFragmentFragment = { spaceOwnerAnalytics: { __typename: 'SpaceOwnerAnalytics', topPerformers: { __typename: 'SpaceOwnerTopPerformers', bestRevenue: { __typename: 'PerformerItem', id: string, title: string, value: number | null, change: number | null } | null, bestRating: { __typename: 'RatingPerformerItem', id: string, title: string, value: number, reviews: number } | null, bestOccupancy: { __typename: 'PerformerItem', id: string, title: string, value: number | null, change: number | null } | null, mostBookings: { __typename: 'PerformerItem', id: string, title: string, value: number | null, change: number | null } | null, needsAttention: { __typename: 'AttentionItem', id: string, title: string, occupancy: number | null, bookings: number } | null } } } & { ' $fragmentName'?: 'AnalyticsTopPerformers_QueryFragmentFragment' };

export type AnalyticsDataQueryVariables = Exact<{
  startDate: Scalars['DateTime']['input'];
  endDate: Scalars['DateTime']['input'];
}>;


export type AnalyticsDataQuery = { ' $fragmentRefs'?: { 'AnalyticsSummary_QueryFragmentFragment': AnalyticsSummary_QueryFragmentFragment;'AnalyticsBookingsChart_QueryFragmentFragment': AnalyticsBookingsChart_QueryFragmentFragment;'AnalyticsStatusChart_QueryFragmentFragment': AnalyticsStatusChart_QueryFragmentFragment;'AnalyticsMonthlyChart_QueryFragmentFragment': AnalyticsMonthlyChart_QueryFragmentFragment;'AnalyticsRatingChart_QueryFragmentFragment': AnalyticsRatingChart_QueryFragmentFragment;'AnalyticsHeatmapChart_QueryFragmentFragment': AnalyticsHeatmapChart_QueryFragmentFragment;'AnalyticsComparison_QueryFragmentFragment': AnalyticsComparison_QueryFragmentFragment;'AnalyticsTopPerformers_QueryFragmentFragment': AnalyticsTopPerformers_QueryFragmentFragment;'AnalyticsRevenueChart_QueryFragmentFragment': AnalyticsRevenueChart_QueryFragmentFragment;'AnalyticsPerformanceTable_QueryFragmentFragment': AnalyticsPerformanceTable_QueryFragmentFragment } };

export type BookingCard_BookingFragmentFragment = { __typename: 'Booking', id: string, status: BookingStatus, startDate: string, endDate: string, ownerPayoutAmount: number, space: { __typename: 'Space', title: string, images: Array<string> } | null, campaign: { __typename: 'Campaign', name: string, advertiserProfile: { __typename: 'AdvertiserProfile', companyName: string | null } } | null } & { ' $fragmentName'?: 'BookingCard_BookingFragmentFragment' };

export type BookingsTable_BookingFragmentFragment = { __typename: 'Booking', id: string, status: BookingStatus, startDate: string, endDate: string, ownerPayoutAmount: number, space: { __typename: 'Space', title: string, images: Array<string> } | null, campaign: { __typename: 'Campaign', name: string, imageUrl: string, advertiserProfile: { __typename: 'AdvertiserProfile', companyName: string | null } } | null } & { ' $fragmentName'?: 'BookingsTable_BookingFragmentFragment' };

export type BookingDetailQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type BookingDetailQuery = { bookingById: { __typename: 'Booking', id: string, status: BookingStatus, startDate: string, endDate: string, createdAt: string, totalDays: number, pricePerDay: number, subtotalAmount: number, installationFee: number, platformFeeAmount: number, platformFeePercent: number, totalAmount: number, ownerPayoutAmount: number, ownerNotes: string | null, advertiserNotes: string | null, rejectionReason: string | null, rejectedAt: string | null, cancellationReason: string | null, cancelledAt: string | null, fileDownloadedAt: string | null, space: { __typename: 'Space', id: string, title: string, images: Array<string>, address: string, city: string, state: string, zipCode: string | null } | null, campaign: { __typename: 'Campaign', id: string, name: string, imageUrl: string, advertiserProfile: { __typename: 'AdvertiserProfile', companyName: string | null, user: { __typename: 'User', name: string, avatar: string | null } } } | null, proof: { __typename: 'BookingProof', id: string, status: ProofStatus, photos: Array<string>, submittedAt: string, autoApproveAt: string, rejectionReason: string | null } | null, dispute: { __typename: 'BookingDispute', id: string, issueType: DisputeIssueType, reason: string, photos: Array<string>, disputedAt: string, resolutionAction: string | null, resolutionNotes: string | null, resolvedAt: string | null } | null, payouts: Array<{ __typename: 'Payout', id: string, amount: number, stage: PayoutStage, status: PayoutStatus, processedAt: string | null }> } | null };

export type ApproveBookingMutationVariables = Exact<{
  input: ApproveBookingInput;
}>;


export type ApproveBookingMutation = { approveBooking: { __typename: 'ApproveBookingPayload', booking: { __typename: 'Booking', id: string, status: BookingStatus } | null, errors: Array<
      | { __typename: 'ForbiddenError', message: string }
      | { __typename: 'InvalidStatusTransitionError', message: string }
      | { __typename: 'NotFoundError', message: string }
    > | null } };

export type RejectBookingMutationVariables = Exact<{
  input: RejectBookingInput;
}>;


export type RejectBookingMutation = { rejectBooking: { __typename: 'RejectBookingPayload', booking: { __typename: 'Booking', id: string, status: BookingStatus } | null, errors: Array<
      | { __typename: 'ForbiddenError', message: string }
      | { __typename: 'InvalidStatusTransitionError', message: string }
      | { __typename: 'NotFoundError', message: string }
    > | null } };

export type CancelBookingMutationVariables = Exact<{
  input: CancelBookingInput;
}>;


export type CancelBookingMutation = { cancelBooking: { __typename: 'CancelBookingPayload', booking: { __typename: 'Booking', id: string, status: BookingStatus } | null, errors: Array<
      | { __typename: 'ForbiddenError', message: string }
      | { __typename: 'InvalidStatusTransitionError', message: string }
      | { __typename: 'NotFoundError', message: string }
    > | null } };

export type MarkFileDownloadedMutationVariables = Exact<{
  input: MarkFileDownloadedInput;
}>;


export type MarkFileDownloadedMutation = { markFileDownloaded: { __typename: 'MarkFileDownloadedPayload', booking: { __typename: 'Booking', id: string, status: BookingStatus, fileDownloadedAt: string | null } | null, errors: Array<
      | { __typename: 'ForbiddenError', message: string }
      | { __typename: 'InvalidStatusTransitionError', message: string }
      | { __typename: 'NotFoundError', message: string }
    > | null } };

export type MarkInstalledMutationVariables = Exact<{
  input: MarkInstalledInput;
}>;


export type MarkInstalledMutation = { markInstalled: { __typename: 'MarkInstalledPayload', booking: { __typename: 'Booking', id: string, status: BookingStatus } | null, errors: Array<
      | { __typename: 'ForbiddenError', message: string }
      | { __typename: 'InvalidStatusTransitionError', message: string }
      | { __typename: 'NotFoundError', message: string }
    > | null } };

export type SubmitProofMutationVariables = Exact<{
  input: SubmitProofInput;
}>;


export type SubmitProofMutation = { submitProof: { __typename: 'SubmitProofPayload', booking: { __typename: 'Booking', id: string, status: BookingStatus } | null, errors: Array<
      | { __typename: 'ForbiddenError', message: string }
      | { __typename: 'InvalidStatusTransitionError', message: string }
      | { __typename: 'NotFoundError', message: string }
    > | null } };

export type CreateBookingConversationMutationVariables = Exact<{
  input: CreateBookingConversationInput;
}>;


export type CreateBookingConversationMutation = { createBookingConversation: { __typename: 'CreateBookingConversationPayload', conversation: { __typename: 'Conversation', id: string } | null, errors: Array<{ __typename: 'NotFoundError', message: string }> | null } };

export type SpaceOwnerBookingsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<BookingFilterInput>;
  order?: InputMaybe<Array<BookingSortInput> | BookingSortInput>;
  searchText?: InputMaybe<Scalars['String']['input']>;
}>;


export type SpaceOwnerBookingsQuery = { myBookingsAsOwner: { __typename: 'MyBookingsAsOwnerConnection', totalCount: number, nodes: Array<(
      { __typename: 'Booking', id: string }
      & { ' $fragmentRefs'?: { 'BookingCard_BookingFragmentFragment': BookingCard_BookingFragmentFragment;'BookingsTable_BookingFragmentFragment': BookingsTable_BookingFragmentFragment } }
    )> | null, pageInfo: { __typename: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null, endCursor: string | null } } | null };

export type CalendarBlockDatesMutationVariables = Exact<{
  input: BlockDatesInput;
}>;


export type CalendarBlockDatesMutation = { blockDates: { __typename: 'BlockDatesPayload', blockedDates: Array<{ __typename: 'BlockedDate', id: string, date: unknown }> | null, errors: Array<
      | { __typename: 'ConflictError', message: string }
      | { __typename: 'ForbiddenError', message: string }
      | { __typename: 'NotFoundError', message: string }
      | { __typename: 'ValidationError', message: string }
    > | null } };

export type CalendarUnblockDatesMutationVariables = Exact<{
  input: UnblockDatesInput;
}>;


export type CalendarUnblockDatesMutation = { unblockDates: { __typename: 'UnblockDatesPayload', unblockedCount: number | null, errors: Array<
      | { __typename: 'ForbiddenError', message: string }
      | { __typename: 'NotFoundError', message: string }
      | { __typename: 'ValidationError', message: string }
    > | null } };

export type CalendarSpacesQueryVariables = Exact<{ [key: string]: never; }>;


export type CalendarSpacesQuery = { mySpaces: { __typename: 'MySpacesConnection', nodes: Array<{ __typename: 'Space', id: string, title: string, blockedDates: Array<{ __typename: 'BlockedDate', id: string, date: unknown, reason: string | null }> }> | null } | null };

export type CalendarBookingsQueryVariables = Exact<{
  startDate: Scalars['DateTime']['input'];
  endDate: Scalars['DateTime']['input'];
}>;


export type CalendarBookingsQuery = { myBookingsAsOwner: { __typename: 'MyBookingsAsOwnerConnection', nodes: Array<{ __typename: 'Booking', id: string, spaceId: string, status: BookingStatus, startDate: string, endDate: string, totalAmount: number, campaign: { __typename: 'Campaign', name: string, advertiserProfile: { __typename: 'AdvertiserProfile', companyName: string | null } } | null }> | null } | null };

export type BalanceCards_EarningsSummaryFragmentFragment = { __typename: 'EarningsSummary', availableBalance: number | null, pendingPayouts: number | null, thisMonthEarnings: number | null, lastMonthEarnings: number | null, totalEarnings: number | null } & { ' $fragmentName'?: 'BalanceCards_EarningsSummaryFragmentFragment' };

export type RequestManualPayoutMutationVariables = Exact<{
  input: RequestManualPayoutInput;
}>;


export type RequestManualPayoutMutation = { requestManualPayout: { __typename: 'RequestManualPayoutPayload', manualPayout: { __typename: 'ManualPayout', id: string, amount: number, status: ManualPayoutStatus } | null, errors: Array<
      | { __typename: 'NotFoundError', message: string }
      | { __typename: 'PaymentError', message: string }
      | { __typename: 'ValidationError', message: string }
    > | null } };

export type SpaceOwnerEarningsQueryVariables = Exact<{ [key: string]: never; }>;


export type SpaceOwnerEarningsQuery = { me: { __typename: 'User', spaceOwnerProfile: { __typename: 'SpaceOwnerProfile', stripeAccountStatus: string | null } | null } | null, earningsSummary: (
    { __typename: 'EarningsSummary' }
    & { ' $fragmentRefs'?: { 'BalanceCards_EarningsSummaryFragmentFragment': BalanceCards_EarningsSummaryFragmentFragment } }
  ), myPayouts: { __typename: 'MyPayoutsConnection', nodes: Array<(
      { __typename: 'Payout', id: string, amount: number, processedAt: string | null }
      & { ' $fragmentRefs'?: { 'PayoutsTable_PayoutFragmentFragment': PayoutsTable_PayoutFragmentFragment } }
    )> | null } | null };

export type PayoutsTable_PayoutFragmentFragment = { __typename: 'Payout', id: string, amount: number, stage: PayoutStage, status: PayoutStatus, processedAt: string | null, booking: { __typename: 'Booking', id: string, space: { __typename: 'Space', title: string } | null } } & { ' $fragmentName'?: 'PayoutsTable_PayoutFragmentFragment' };

export type SpaceOwnerPayoutsHistoryQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<PayoutFilterInput>;
  order?: InputMaybe<Array<PayoutSortInput> | PayoutSortInput>;
}>;


export type SpaceOwnerPayoutsHistoryQuery = { myPayouts: { __typename: 'MyPayoutsConnection', nodes: Array<(
      { __typename: 'Payout', id: string }
      & { ' $fragmentRefs'?: { 'PayoutsHistoryTable_PayoutFragmentFragment': PayoutsHistoryTable_PayoutFragmentFragment } }
    )> | null, pageInfo: { __typename: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null, endCursor: string | null } } | null };

export type PayoutsHistoryTable_PayoutFragmentFragment = { __typename: 'Payout', id: string, amount: number, stage: PayoutStage, status: PayoutStatus, processedAt: string | null, failureReason: string | null, attemptCount: number, booking: { __typename: 'Booking', id: string, space: { __typename: 'Space', title: string } | null } } & { ' $fragmentName'?: 'PayoutsHistoryTable_PayoutFragmentFragment' };

export type RetryPayoutMutationVariables = Exact<{
  input: RetryPayoutInput;
}>;


export type RetryPayoutMutation = { retryPayout: { __typename: 'RetryPayoutPayload', payout: { __typename: 'Payout', id: string, status: PayoutStatus } | null, errors: Array<
      | { __typename: 'InvalidStatusTransitionError', message: string }
      | { __typename: 'NotFoundError', message: string }
      | { __typename: 'PaymentError', message: string }
    > | null } };

export type SpaceCard_SpaceFragmentFragment = { __typename: 'Space', id: string, title: string, description: string | null, city: string, state: string, images: Array<string>, type: SpaceType, status: SpaceStatus, createdAt: string } & { ' $fragmentName'?: 'SpaceCard_SpaceFragmentFragment' };

export type ListingsMap_SpaceFragmentFragment = { __typename: 'Space', id: string, title: string, latitude: number, longitude: number, pricePerDay: number } & { ' $fragmentName'?: 'ListingsMap_SpaceFragmentFragment' };

export type ListingsTable_SpaceFragmentFragment = { __typename: 'Space', id: string, title: string, city: string, state: string, images: Array<string>, type: SpaceType, status: SpaceStatus, createdAt: string } & { ' $fragmentName'?: 'ListingsTable_SpaceFragmentFragment' };

export type SpaceBookingsQueryVariables = Exact<{
  spaceId: Scalars['UUID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
}>;


export type SpaceBookingsQuery = { myBookingsAsOwner: { __typename: 'MyBookingsAsOwnerConnection', nodes: Array<{ __typename: 'Booking', id: string, status: BookingStatus, startDate: string, endDate: string, totalAmount: number, campaign: { __typename: 'Campaign', name: string, advertiserProfile: { __typename: 'AdvertiserProfile', companyName: string | null } } | null }> | null } | null };

export type SpaceBlockedDatesQueryVariables = Exact<{
  spaceId: Scalars['ID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
}>;


export type SpaceBlockedDatesQuery = { blockedDatesBySpace: { __typename: 'BlockedDatesBySpaceConnection', nodes: Array<{ __typename: 'BlockedDate', id: string, date: unknown }> | null } | null };

export type BlockDatesMutationVariables = Exact<{
  input: BlockDatesInput;
}>;


export type BlockDatesMutation = { blockDates: { __typename: 'BlockDatesPayload', blockedDates: Array<{ __typename: 'BlockedDate', id: string, date: unknown }> | null, errors: Array<
      | { __typename: 'ConflictError', message: string }
      | { __typename: 'ForbiddenError', message: string }
      | { __typename: 'NotFoundError', message: string }
      | { __typename: 'ValidationError', message: string }
    > | null } };

export type UnblockDatesMutationVariables = Exact<{
  input: UnblockDatesInput;
}>;


export type UnblockDatesMutation = { unblockDates: { __typename: 'UnblockDatesPayload', unblockedCount: number | null, errors: Array<
      | { __typename: 'ForbiddenError', message: string }
      | { __typename: 'NotFoundError', message: string }
      | { __typename: 'ValidationError', message: string }
    > | null } };

export type Details_SpaceFragmentFragment = { __typename: 'Space', id: string, description: string | null, type: SpaceType, address: string, city: string, state: string, zipCode: string | null, traffic: string | null, pricePerDay: number, installationFee: number | null, minDuration: number, maxDuration: number | null, width: number | null, height: number | null, dimensionsText: string | null, availableFrom: string | null, availableTo: string | null } & { ' $fragmentName'?: 'Details_SpaceFragmentFragment' };

export type Gallery_SpaceFragmentFragment = { __typename: 'Space', id: string, title: string, images: Array<string> } & { ' $fragmentName'?: 'Gallery_SpaceFragmentFragment' };

export type Header_SpaceFragmentFragment = { __typename: 'Space', id: string, title: string, status: SpaceStatus } & { ' $fragmentName'?: 'Header_SpaceFragmentFragment' };

export type SpaceDetailQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type SpaceDetailQuery = { spaceById: (
    { __typename: 'Space', id: string, averageRating: number | null }
    & { ' $fragmentRefs'?: { 'Header_SpaceFragmentFragment': Header_SpaceFragmentFragment;'Gallery_SpaceFragmentFragment': Gallery_SpaceFragmentFragment;'Details_SpaceFragmentFragment': Details_SpaceFragmentFragment;'Performance_SpaceFragmentFragment': Performance_SpaceFragmentFragment } }
  ) | null };

export type Performance_SpaceFragmentFragment = { __typename: 'Space', totalBookings: number, totalRevenue: number, averageRating: number | null } & { ' $fragmentName'?: 'Performance_SpaceFragmentFragment' };

export type SpaceReviewsQueryVariables = Exact<{
  spaceId: Scalars['ID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
}>;


export type SpaceReviewsQuery = { reviewsBySpace: { __typename: 'ReviewsBySpaceConnection', nodes: Array<{ __typename: 'Review', id: string, rating: number, comment: string | null, createdAt: string, reviewer: { __typename: 'ReviewerInfo', name: string, avatar: string | null } | null }> | null } | null };

export type CreateSpaceMutationVariables = Exact<{
  input: CreateSpaceInput;
}>;


export type CreateSpaceMutation = { createSpace: { __typename: 'CreateSpacePayload', space: { __typename: 'Space', id: string } | null, errors: Array<
      | { __typename: 'GeocodingError', message: string }
      | { __typename: 'NotFoundError', message: string }
      | { __typename: 'ValidationError', message: string }
    > | null } };

export type UpdateSpaceMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateSpaceInput;
}>;


export type UpdateSpaceMutation = { updateSpace: { __typename: 'UpdateSpacePayload', space: { __typename: 'Space', id: string } | null, errors: Array<
      | { __typename: 'ForbiddenError', message: string }
      | { __typename: 'GeocodingError', message: string }
      | { __typename: 'NotFoundError', message: string }
      | { __typename: 'ValidationError', message: string }
    > | null } };

export type UpdateSpaceImagesMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateSpaceInput;
}>;


export type UpdateSpaceImagesMutation = { updateSpace: { __typename: 'UpdateSpacePayload', space: { __typename: 'Space', id: string, images: Array<string> } | null, errors: Array<
      | { __typename: 'ForbiddenError', message: string }
      | { __typename: 'GeocodingError', message: string }
      | { __typename: 'NotFoundError', message: string }
      | { __typename: 'ValidationError', message: string }
    > | null } };

export type DeactivateSpaceMutationVariables = Exact<{
  input: DeactivateSpaceInput;
}>;


export type DeactivateSpaceMutation = { deactivateSpace: { __typename: 'DeactivateSpacePayload', space: { __typename: 'Space', id: string, status: SpaceStatus } | null, errors: Array<
      | { __typename: 'ConflictError', message: string }
      | { __typename: 'ForbiddenError', message: string }
      | { __typename: 'NotFoundError', message: string }
    > | null } };

export type ReactivateSpaceMutationVariables = Exact<{
  input: ReactivateSpaceInput;
}>;


export type ReactivateSpaceMutation = { reactivateSpace: { __typename: 'ReactivateSpacePayload', space: { __typename: 'Space', id: string, status: SpaceStatus } | null, errors: Array<
      | { __typename: 'ForbiddenError', message: string }
      | { __typename: 'NotFoundError', message: string }
    > | null } };

export type DeleteSpaceMutationVariables = Exact<{
  input: DeleteSpaceInput;
}>;


export type DeleteSpaceMutation = { deleteSpace: { __typename: 'DeleteSpacePayload', success: boolean | null, errors: Array<
      | { __typename: 'ConflictError', message: string }
      | { __typename: 'ForbiddenError', message: string }
      | { __typename: 'NotFoundError', message: string }
    > | null } };

export type BulkDeactivateSpaceMutationVariables = Exact<{
  input: DeactivateSpaceInput;
}>;


export type BulkDeactivateSpaceMutation = { deactivateSpace: { __typename: 'DeactivateSpacePayload', space: { __typename: 'Space', id: string } | null, errors: Array<
      | { __typename: 'ConflictError', message: string }
      | { __typename: 'ForbiddenError', message: string }
      | { __typename: 'NotFoundError', message: string }
    > | null } };

export type BulkDeleteSpaceMutationVariables = Exact<{
  input: DeleteSpaceInput;
}>;


export type BulkDeleteSpaceMutation = { deleteSpace: { __typename: 'DeleteSpacePayload', success: boolean | null, errors: Array<
      | { __typename: 'ConflictError', message: string }
      | { __typename: 'ForbiddenError', message: string }
      | { __typename: 'NotFoundError', message: string }
    > | null } };

export type SpaceOwnerListingsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Array<SpaceSortInput> | SpaceSortInput>;
  where?: InputMaybe<SpaceFilterInput>;
  gridView: Scalars['Boolean']['input'];
  tableView: Scalars['Boolean']['input'];
  mapView: Scalars['Boolean']['input'];
}>;


export type SpaceOwnerListingsQuery = { mySpaces: { __typename: 'MySpacesConnection', nodes: Array<(
      { __typename: 'Space', id: string }
      & { ' $fragmentRefs'?: { 'SpaceCard_SpaceFragmentFragment': SpaceCard_SpaceFragmentFragment;'ListingsTable_SpaceFragmentFragment': ListingsTable_SpaceFragmentFragment;'ListingsMap_SpaceFragmentFragment': ListingsMap_SpaceFragmentFragment } }
    )> | null, pageInfo: { __typename: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null, endCursor: string | null } } | null };

export type OverviewActiveBookingsBookingCard_BookingFragmentFragment = { __typename: 'Booking', id: string, status: BookingStatus, startDate: string, endDate: string, campaign: { __typename: 'Campaign', advertiser: { __typename: 'AdvertiserProfile', user: { __typename: 'User', name: string } } | null } | null, space: { __typename: 'Space', id: string, title: string } | null } & { ' $fragmentName'?: 'OverviewActiveBookingsBookingCard_BookingFragmentFragment' };

export type OverviewActiveBookings_QueryFragmentFragment = { myBookingsAsOwner: { __typename: 'MyBookingsAsOwnerConnection', nodes: Array<(
      { __typename: 'Booking' }
      & { ' $fragmentRefs'?: { 'OverviewActiveBookingsBookingCard_BookingFragmentFragment': OverviewActiveBookingsBookingCard_BookingFragmentFragment } }
    )> | null } | null } & { ' $fragmentName'?: 'OverviewActiveBookings_QueryFragmentFragment' };

export type OverviewActivityChart_QueryFragmentFragment = { myPayouts: { __typename: 'MyPayoutsConnection', nodes: Array<{ __typename: 'Payout', amount: number, processedAt: string | null }> | null } | null } & { ' $fragmentName'?: 'OverviewActivityChart_QueryFragmentFragment' };

export type OverviewDeadlineWarningsDeadlineCard_BookingFragmentFragment = { __typename: 'Booking', id: string, status: BookingStatus, startDate: string, endDate: string, space: { __typename: 'Space', title: string } | null, campaign: { __typename: 'Campaign', name: string, advertiser: { __typename: 'AdvertiserProfile', user: { __typename: 'User', name: string, avatar: string | null } } | null } | null } & { ' $fragmentName'?: 'OverviewDeadlineWarningsDeadlineCard_BookingFragmentFragment' };

export type OverviewDeadlineWarnings_QueryFragmentFragment = { deadlineBookings: { __typename: 'MyBookingsAsOwnerConnection', nodes: Array<(
      { __typename: 'Booking' }
      & { ' $fragmentRefs'?: { 'OverviewDeadlineWarningsDeadlineCard_BookingFragmentFragment': OverviewDeadlineWarningsDeadlineCard_BookingFragmentFragment } }
    )> | null } | null } & { ' $fragmentName'?: 'OverviewDeadlineWarnings_QueryFragmentFragment' };

export type OverviewPendingRequests_QueryFragmentFragment = { incomingBookingRequests: { __typename: 'IncomingBookingRequestsConnection', nodes: Array<(
      { __typename: 'Booking' }
      & { ' $fragmentRefs'?: { 'OverviewPendingRequestsRequestCard_BookingFragmentFragment': OverviewPendingRequestsRequestCard_BookingFragmentFragment } }
    )> | null } | null } & { ' $fragmentName'?: 'OverviewPendingRequests_QueryFragmentFragment' };

export type OverviewPendingRequestsRequestCard_BookingFragmentFragment = { __typename: 'Booking', id: string, startDate: string, endDate: string, totalAmount: number, createdAt: string, campaign: { __typename: 'Campaign', advertiser: { __typename: 'AdvertiserProfile', user: { __typename: 'User', name: string, avatar: string | null } } | null } | null, space: { __typename: 'Space', id: string, title: string } | null } & { ' $fragmentName'?: 'OverviewPendingRequestsRequestCard_BookingFragmentFragment' };

export type OverviewRecentActivity_QueryFragmentFragment = { myNotifications: { __typename: 'MyNotificationsConnection', nodes: Array<{ __typename: 'Notification', id: string, type: NotificationType, title: string, body: string, createdAt: string, isRead: boolean }> | null } | null } & { ' $fragmentName'?: 'OverviewRecentActivity_QueryFragmentFragment' };

export type OverviewStatCards_QueryFragmentFragment = { me: { __typename: 'User', spaceOwnerProfile: { __typename: 'SpaceOwnerProfile', stripeAccountStatus: string | null } | null } | null, earningsSummary: { __typename: 'EarningsSummary', availableBalance: number | null, pendingPayouts: number | null, thisMonthEarnings: number | null, lastMonthEarnings: number | null }, activeBookings: { __typename: 'MyBookingsAsOwnerConnection', totalCount: number } | null, mySpaces: { __typename: 'MySpacesConnection', totalCount: number } | null } & { ' $fragmentName'?: 'OverviewStatCards_QueryFragmentFragment' };

export type OverviewTopSpaces_QueryFragmentFragment = { me: { __typename: 'User', spaceOwnerProfile: { __typename: 'SpaceOwnerProfile', spaces: { __typename: 'SpacesConnection', nodes: Array<(
          { __typename: 'Space' }
          & { ' $fragmentRefs'?: { 'OverviewTopSpacesSpaceCard_SpaceFragmentFragment': OverviewTopSpacesSpaceCard_SpaceFragmentFragment } }
        )> | null } | null } | null } | null } & { ' $fragmentName'?: 'OverviewTopSpaces_QueryFragmentFragment' };

export type OverviewTopSpacesSpaceCard_SpaceFragmentFragment = { __typename: 'Space', id: string, title: string, images: Array<string>, totalBookings: number, totalRevenue: number, averageRating: number | null, status: SpaceStatus } & { ' $fragmentName'?: 'OverviewTopSpacesSpaceCard_SpaceFragmentFragment' };

export type OverviewUpcomingPayouts_QueryFragmentFragment = { upcomingPayouts: { __typename: 'MyPayoutsConnection', nodes: Array<(
      { __typename: 'Payout' }
      & { ' $fragmentRefs'?: { 'OverviewUpcomingPayoutsPayoutCard_PayoutFragmentFragment': OverviewUpcomingPayoutsPayoutCard_PayoutFragmentFragment } }
    )> | null } | null } & { ' $fragmentName'?: 'OverviewUpcomingPayouts_QueryFragmentFragment' };

export type OverviewUpcomingPayoutsPayoutCard_PayoutFragmentFragment = { __typename: 'Payout', id: string, amount: number, stage: PayoutStage, status: PayoutStatus, createdAt: string, booking: { __typename: 'Booking', space: { __typename: 'Space', title: string } | null } } & { ' $fragmentName'?: 'OverviewUpcomingPayoutsPayoutCard_PayoutFragmentFragment' };

export type OverviewDataQueryVariables = Exact<{ [key: string]: never; }>;


export type OverviewDataQuery = { ' $fragmentRefs'?: { 'OverviewStatCards_QueryFragmentFragment': OverviewStatCards_QueryFragmentFragment;'OverviewDeadlineWarnings_QueryFragmentFragment': OverviewDeadlineWarnings_QueryFragmentFragment;'OverviewPendingRequests_QueryFragmentFragment': OverviewPendingRequests_QueryFragmentFragment;'OverviewActiveBookings_QueryFragmentFragment': OverviewActiveBookings_QueryFragmentFragment;'OverviewTopSpaces_QueryFragmentFragment': OverviewTopSpaces_QueryFragmentFragment;'OverviewUpcomingPayouts_QueryFragmentFragment': OverviewUpcomingPayouts_QueryFragmentFragment;'OverviewActivityChart_QueryFragmentFragment': OverviewActivityChart_QueryFragmentFragment;'OverviewRecentActivity_QueryFragmentFragment': OverviewRecentActivity_QueryFragmentFragment } };

export type DashboardUserQueryVariables = Exact<{ [key: string]: never; }>;


export type DashboardUserQuery = { me: (
    { __typename: 'User', id: string }
    & { ' $fragmentRefs'?: { 'NavigationSection_UserFragmentFragment': NavigationSection_UserFragmentFragment;'UserSection_UserFragmentFragment': UserSection_UserFragmentFragment;'RoleBasedView_UserFragmentFragment': RoleBasedView_UserFragmentFragment } }
  ) | null };

export type SendMessageMutationVariables = Exact<{
  input: SendMessageInput;
}>;


export type SendMessageMutation = { sendMessage: { __typename: 'SendMessagePayload', message: { __typename: 'Message', id: string, content: string, type: MessageType, attachments: Array<string> | null, createdAt: string, senderUser: { __typename: 'User', id: string, name: string, avatar: string | null } } | null, errors: Array<{ __typename: 'ForbiddenError', message: string }> | null } };

export type MarkConversationReadMutationVariables = Exact<{
  input: MarkConversationReadInput;
}>;


export type MarkConversationReadMutation = { markConversationRead: { __typename: 'MarkConversationReadPayload', participant: { __typename: 'ConversationParticipant', id: string, lastReadAt: string | null } | null, errors: Array<{ __typename: 'ForbiddenError', message: string }> | null } };

export type LoadEarlierMessagesQueryVariables = Exact<{
  conversationId: Scalars['ID']['input'];
  before?: InputMaybe<Scalars['String']['input']>;
}>;


export type LoadEarlierMessagesQuery = { messagesByConversation: { __typename: 'MessagesByConversationConnection', nodes: Array<{ __typename: 'Message', id: string, content: string, type: MessageType, attachments: Array<string> | null, createdAt: string, senderUser: { __typename: 'User', id: string, name: string, avatar: string | null } }> | null, pageInfo: { __typename: 'PageInfo', hasPreviousPage: boolean, startCursor: string | null } } | null };

export type NotifyTypingMutationVariables = Exact<{
  input: NotifyTypingInput;
}>;


export type NotifyTypingMutation = { notifyTyping: { __typename: 'NotifyTypingPayload', boolean: boolean | null } };

export type MessageBubble_MessageFragmentFragment = { __typename: 'Message', id: string, content: string, type: MessageType, attachments: Array<string> | null, createdAt: string, senderUser: { __typename: 'User', id: string, name: string, avatar: string | null } } & { ' $fragmentName'?: 'MessageBubble_MessageFragmentFragment' };

export type OnMessageSubscriptionVariables = Exact<{
  conversationId: Scalars['ID']['input'];
}>;


export type OnMessageSubscription = { onMessage: { __typename: 'Message', id: string, content: string, type: MessageType, attachments: Array<string> | null, createdAt: string, senderUser: { __typename: 'User', id: string, name: string, avatar: string | null } } };

export type OnTypingSubscriptionVariables = Exact<{
  conversationId: Scalars['ID']['input'];
}>;


export type OnTypingSubscription = { onTyping: { __typename: 'TypingIndicator', conversationId: string, userId: string, userName: string, userAvatar: string | null, isTyping: boolean, timestamp: string } };

export type ThreadHeader_ConversationFragmentFragment = { __typename: 'Conversation', id: string, booking: { __typename: 'Booking', id: string, status: BookingStatus, startDate: string, endDate: string, totalAmount: number, pricePerDay: number, totalDays: number, installationFee: number, space: { __typename: 'Space', id: string, title: string, images: Array<string>, address: string, city: string, state: string } | null } | null } & { ' $fragmentName'?: 'ThreadHeader_ConversationFragmentFragment' };

export type MessagesDataQueryVariables = Exact<{ [key: string]: never; }>;


export type MessagesDataQuery = { unreadConversationsCount: number, me: { __typename: 'User', id: string } | null, myConversations: { __typename: 'MyConversationsConnection', nodes: Array<(
      { __typename: 'Conversation' }
      & { ' $fragmentRefs'?: { 'ConversationItem_ConversationFragmentFragment': ConversationItem_ConversationFragmentFragment } }
    )> | null } | null };

export type ThreadDataQueryVariables = Exact<{
  conversationId: Scalars['ID']['input'];
}>;


export type ThreadDataQuery = { unreadConversationsCount: number, me: { __typename: 'User', id: string } | null, myConversations: { __typename: 'MyConversationsConnection', nodes: Array<(
      { __typename: 'Conversation' }
      & { ' $fragmentRefs'?: { 'ConversationItem_ConversationFragmentFragment': ConversationItem_ConversationFragmentFragment;'ThreadHeader_ConversationFragmentFragment': ThreadHeader_ConversationFragmentFragment } }
    )> | null } | null, messagesByConversation: { __typename: 'MessagesByConversationConnection', nodes: Array<(
      { __typename: 'Message' }
      & { ' $fragmentRefs'?: { 'MessageBubble_MessageFragmentFragment': MessageBubble_MessageFragmentFragment } }
    )> | null, pageInfo: { __typename: 'PageInfo', hasPreviousPage: boolean, startCursor: string | null } } | null };

export type ConversationItem_ConversationFragmentFragment = { __typename: 'Conversation', id: string, updatedAt: string, booking: { __typename: 'Booking', id: string, status: BookingStatus, space: { __typename: 'Space', id: string, title: string } | null } | null, participants: Array<{ __typename: 'ConversationParticipant', lastReadAt: string | null, user: { __typename: 'User', id: string, name: string, avatar: string | null } }>, messages: { __typename: 'MessagesConnection', nodes: Array<{ __typename: 'Message', id: string, content: string, type: MessageType, createdAt: string, senderUser: { __typename: 'User', id: string } }> | null } | null } & { ' $fragmentName'?: 'ConversationItem_ConversationFragmentFragment' };

export type NavigationSection_UserFragmentFragment = { __typename: 'User', role: UserRole, activeProfileType: ProfileType } & { ' $fragmentName'?: 'NavigationSection_UserFragmentFragment' };

export type OnNotificationSubscriptionVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type OnNotificationSubscription = { onNotification: { __typename: 'Notification', id: string, title: string, body: string, type: NotificationType, isRead: boolean, createdAt: string, entityId: string | null, entityType: string | null } };

export type MarkNotificationReadMutationVariables = Exact<{
  input: MarkNotificationReadInput;
}>;


export type MarkNotificationReadMutation = { markNotificationRead: { __typename: 'MarkNotificationReadPayload', notification: { __typename: 'Notification', id: string, isRead: boolean, readAt: string | null } | null, errors: Array<{ __typename: 'NotFoundError', message: string }> | null } };

export type MarkAllNotificationsReadMutationVariables = Exact<{ [key: string]: never; }>;


export type MarkAllNotificationsReadMutation = { markAllNotificationsRead: { __typename: 'MarkAllNotificationsReadPayload', count: number } };

export type DeleteNotificationMutationVariables = Exact<{
  input: DeleteNotificationInput;
}>;


export type DeleteNotificationMutation = { deleteNotification: { __typename: 'DeleteNotificationPayload', success: boolean } };

export type LoadMoreNotificationsQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']['input']>;
  isRead?: InputMaybe<Scalars['Boolean']['input']>;
  type?: InputMaybe<NotificationType>;
}>;


export type LoadMoreNotificationsQuery = { myNotifications: { __typename: 'MyNotificationsConnection', nodes: Array<{ __typename: 'Notification', id: string, title: string, body: string, type: NotificationType, isRead: boolean, readAt: string | null, createdAt: string, entityId: string | null, entityType: string | null }> | null, pageInfo: { __typename: 'PageInfo', hasNextPage: boolean, endCursor: string | null } } | null };

export type NotificationsPageQueryVariables = Exact<{ [key: string]: never; }>;


export type NotificationsPageQuery = { unreadNotificationsCount: number, me: { __typename: 'User', id: string } | null, myNotifications: { __typename: 'MyNotificationsConnection', nodes: Array<{ __typename: 'Notification', id: string, title: string, body: string, type: NotificationType, isRead: boolean, createdAt: string, readAt: string | null, entityId: string | null, entityType: string | null }> | null, pageInfo: { __typename: 'PageInfo', hasNextPage: boolean, endCursor: string | null } } | null };

export type About_UserFragmentFragment = { __typename: 'User', name: string, activeProfileType: ProfileType, spaceOwnerProfile: { __typename: 'SpaceOwnerProfile', businessName: string | null, businessType: string | null, onboardingComplete: boolean, responseRate: number, averageResponseTime: number, spaces: { __typename: 'SpacesConnection', nodes: Array<{ __typename: 'Space', id: string }> | null } | null } | null, advertiserProfile: { __typename: 'AdvertiserProfile', companyName: string | null, industry: string | null, website: string | null, onboardingComplete: boolean, campaigns: { __typename: 'CampaignsConnection', nodes: Array<{ __typename: 'Campaign', status: CampaignStatus }> | null } | null } | null } & { ' $fragmentName'?: 'About_UserFragmentFragment' };

export type Activity_UserFragmentFragment = { __typename: 'User', name: string, activeProfileType: ProfileType, spaceOwnerProfile: { __typename: 'SpaceOwnerProfile', reviews: { __typename: 'ReviewsConnection', nodes: Array<{ __typename: 'Review', id: string, rating: number, comment: string | null, createdAt: string, reviewer: { __typename: 'ReviewerInfo', name: string, avatar: string | null, companyName: string | null } | null }> | null } | null } | null, advertiserProfile: { __typename: 'AdvertiserProfile', campaigns: { __typename: 'CampaignsConnection', nodes: Array<{ __typename: 'Campaign', id: string, name: string, status: CampaignStatus, startDate: string | null, endDate: string | null, totalSpend: number, spacesCount: number }> | null } | null } | null } & { ' $fragmentName'?: 'Activity_UserFragmentFragment' };

export type Info_UserFragmentFragment = { __typename: 'User', name: string, avatar: string | null, activeProfileType: ProfileType, spaceOwnerProfile: { __typename: 'SpaceOwnerProfile', createdAt: string, spaces: { __typename: 'SpacesConnection', nodes: Array<{ __typename: 'Space', averageRating: number | null }> | null } | null, reviews: { __typename: 'ReviewsConnection', nodes: Array<{ __typename: 'Review', id: string }> | null } | null } | null, advertiserProfile: { __typename: 'AdvertiserProfile', createdAt: string, totalSpend: number, campaigns: { __typename: 'CampaignsConnection', nodes: Array<{ __typename: 'Campaign', id: string }> | null } | null } | null } & { ' $fragmentName'?: 'Info_UserFragmentFragment' };

export type ProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type ProfileQuery = { me: (
    { __typename: 'User', id: string, name: string }
    & { ' $fragmentRefs'?: { 'ProfileLayout_UserFragmentFragment': ProfileLayout_UserFragmentFragment;'Info_UserFragmentFragment': Info_UserFragmentFragment;'About_UserFragmentFragment': About_UserFragmentFragment;'Activity_UserFragmentFragment': Activity_UserFragmentFragment } }
  ) | null };

export type ProfileLayout_UserFragmentFragment = { __typename: 'User', role: UserRole } & { ' $fragmentName'?: 'ProfileLayout_UserFragmentFragment' };

export type RoleBasedView_UserFragmentFragment = { __typename: 'User', role: UserRole, activeProfileType: ProfileType } & { ' $fragmentName'?: 'RoleBasedView_UserFragmentFragment' };

export type AccountSettings_UserFragmentFragment = { __typename: 'User', createdAt: string, lastLoginAt: string | null, activeProfileType: ProfileType } & { ' $fragmentName'?: 'AccountSettings_UserFragmentFragment' };

export type BusinessSettings_UserFragmentFragment = { __typename: 'User', activeProfileType: ProfileType, spaceOwnerProfile: { __typename: 'SpaceOwnerProfile', businessName: string | null, businessType: string | null, payoutSchedule: PayoutSchedule } | null, advertiserProfile: { __typename: 'AdvertiserProfile', companyName: string | null, industry: string | null, website: string | null } | null } & { ' $fragmentName'?: 'BusinessSettings_UserFragmentFragment' };

export type NotificationSettings_UserFragmentFragment = { __typename: 'User', activeProfileType: ProfileType } & { ' $fragmentName'?: 'NotificationSettings_UserFragmentFragment' };

export type PaymentSettings_UserFragmentFragment = { __typename: 'User', activeProfileType: ProfileType } & { ' $fragmentName'?: 'PaymentSettings_UserFragmentFragment' };

export type PayoutSettings_UserFragmentFragment = { __typename: 'User', activeProfileType: ProfileType, spaceOwnerProfile: { __typename: 'SpaceOwnerProfile', stripeAccountId: string | null, stripeAccountStatus: string | null } | null } & { ' $fragmentName'?: 'PayoutSettings_UserFragmentFragment' };

export type ProfileSettings_UserFragmentFragment = { __typename: 'User', name: string, email: string, phone: string | null, avatar: string | null, activeProfileType: ProfileType } & { ' $fragmentName'?: 'ProfileSettings_UserFragmentFragment' };

export type SettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type SettingsQuery = { me: (
    { __typename: 'User', id: string, email: string, name: string, avatar: string | null, phone: string | null, createdAt: string, lastLoginAt: string | null, activeProfileType: ProfileType }
    & { ' $fragmentRefs'?: { 'SettingsLayout_UserFragmentFragment': SettingsLayout_UserFragmentFragment;'ProfileSettings_UserFragmentFragment': ProfileSettings_UserFragmentFragment;'BusinessSettings_UserFragmentFragment': BusinessSettings_UserFragmentFragment;'PayoutSettings_UserFragmentFragment': PayoutSettings_UserFragmentFragment;'AccountSettings_UserFragmentFragment': AccountSettings_UserFragmentFragment } }
  ) | null, myNotificationPreferences: Array<{ __typename: 'NotificationPreference', id: string, notificationType: NotificationType, inAppEnabled: boolean, emailEnabled: boolean, pushEnabled: boolean }> };

export type GetSavedPaymentMethodsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSavedPaymentMethodsQuery = { mySavedPaymentMethods: Array<{ __typename: 'SavedPaymentMethod', id: string, brand: string, last4: string, expMonth: number, expYear: number, isDefault: boolean, createdAt: string }> };

export type SettingsLayout_UserFragmentFragment = { __typename: 'User', role: UserRole } & { ' $fragmentName'?: 'SettingsLayout_UserFragmentFragment' };

export type GetCurrentUserForSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserForSettingsQuery = { me: { __typename: 'User', id: string, avatar: string | null, spaceOwnerProfile: { __typename: 'SpaceOwnerProfile', id: string } | null, advertiserProfile: { __typename: 'AdvertiserProfile', id: string } | null } | null };

export type UpdateUserProfileMutationVariables = Exact<{
  input: UpdateCurrentUserInput;
}>;


export type UpdateUserProfileMutation = { updateCurrentUser: { __typename: 'UpdateCurrentUserPayload', user: { __typename: 'User', id: string } | null } };

export type UpdateSpaceOwnerBusinessInfoMutationVariables = Exact<{
  input: UpdateSpaceOwnerProfileInput;
}>;


export type UpdateSpaceOwnerBusinessInfoMutation = { updateSpaceOwnerProfile: { __typename: 'UpdateSpaceOwnerProfilePayload', spaceOwnerProfile: { __typename: 'SpaceOwnerProfile', id: string } | null } };

export type UpdateAdvertiserBusinessInfoMutationVariables = Exact<{
  input: UpdateAdvertiserProfileInput;
}>;


export type UpdateAdvertiserBusinessInfoMutation = { updateAdvertiserProfile: { __typename: 'UpdateAdvertiserProfilePayload', advertiserProfile: { __typename: 'AdvertiserProfile', id: string } | null } };

export type UpdateNotificationPreferenceMutationVariables = Exact<{
  input: UpdateNotificationPreferenceInput;
}>;


export type UpdateNotificationPreferenceMutation = { updateNotificationPreference: { __typename: 'UpdateNotificationPreferencePayload', preference: { __typename: 'NotificationPreference', id: string, notificationType: NotificationType, inAppEnabled: boolean, emailEnabled: boolean, pushEnabled: boolean } } };

export type ConnectStripeAccountMutationVariables = Exact<{ [key: string]: never; }>;


export type ConnectStripeAccountMutation = { connectStripeAccount: { __typename: 'ConnectStripeAccountPayload', accountId: string | null, onboardingUrl: string | null, errors: Array<
      | { __typename: 'NotFoundError', message: string }
      | { __typename: 'PaymentError', message: string }
    > | null } };

export type DisconnectStripeAccountMutationVariables = Exact<{ [key: string]: never; }>;


export type DisconnectStripeAccountMutation = { disconnectStripeAccount: { __typename: 'DisconnectStripeAccountPayload', profile: { __typename: 'SpaceOwnerProfile', id: string, stripeAccountId: string | null, stripeAccountStatus: string | null } | null, errors: Array<
      | { __typename: 'NotFoundError', message: string }
      | { __typename: 'PaymentError', message: string }
      | { __typename: 'ValidationError', message: string }
    > | null } };

export type RefreshStripeAccountStatusMutationVariables = Exact<{ [key: string]: never; }>;


export type RefreshStripeAccountStatusMutation = { refreshStripeAccountStatus: { __typename: 'RefreshStripeAccountStatusPayload', profile: { __typename: 'SpaceOwnerProfile', id: string, stripeAccountStatus: string | null } | null, errors: Array<
      | { __typename: 'NotFoundError', message: string }
      | { __typename: 'PaymentError', message: string }
      | { __typename: 'ValidationError', message: string }
    > | null } };

export type DeleteMyAccountMutationVariables = Exact<{
  input: DeleteMyAccountInput;
}>;


export type DeleteMyAccountMutation = { deleteMyAccount: { __typename: 'DeleteMyAccountPayload', success: boolean | null, errors: Array<
      | { __typename: 'NotFoundError', message: string }
      | { __typename: 'ValidationError', message: string }
    > | null } };

export type UpdateUserAvatarMutationVariables = Exact<{
  input: UpdateCurrentUserInput;
}>;


export type UpdateUserAvatarMutation = { updateCurrentUser: { __typename: 'UpdateCurrentUserPayload', user: { __typename: 'User', id: string, avatar: string | null } | null } };

export type ChangePasswordMutationVariables = Exact<{
  input: ChangePasswordInput;
}>;


export type ChangePasswordMutation = { changePassword: { __typename: 'ChangePasswordPayload', success: boolean | null, errors: Array<
      | { __typename: 'NotFoundError', message: string }
      | { __typename: 'ValidationError', message: string }
    > | null } };

export type CreateSetupIntentMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateSetupIntentMutation = { createSetupIntent: { __typename: 'CreateSetupIntentPayload', clientSecret: string | null, setupIntentId: string | null, errors: Array<
      | { __typename: 'NotFoundError', message: string }
      | { __typename: 'PaymentError', message: string }
    > | null } };

export type ConfirmSetupIntentMutationVariables = Exact<{
  input: ConfirmSetupIntentInput;
}>;


export type ConfirmSetupIntentMutation = { confirmSetupIntent: { __typename: 'ConfirmSetupIntentPayload', paymentMethod: { __typename: 'SavedPaymentMethod', id: string } | null, errors: Array<
      | { __typename: 'NotFoundError', message: string }
      | { __typename: 'PaymentError', message: string }
    > | null } };

export type SetDefaultPaymentMethodMutationVariables = Exact<{
  input: SetDefaultPaymentMethodInput;
}>;


export type SetDefaultPaymentMethodMutation = { setDefaultPaymentMethod: { __typename: 'SetDefaultPaymentMethodPayload', paymentMethod: { __typename: 'SavedPaymentMethod', id: string, isDefault: boolean } | null, errors: Array<
      | { __typename: 'ForbiddenError', message: string }
      | { __typename: 'NotFoundError', message: string }
    > | null } };

export type DeletePaymentMethodMutationVariables = Exact<{
  input: DeletePaymentMethodInput;
}>;


export type DeletePaymentMethodMutation = { deletePaymentMethod: { __typename: 'DeletePaymentMethodPayload', success: boolean | null, errors: Array<
      | { __typename: 'ForbiddenError', message: string }
      | { __typename: 'NotFoundError', message: string }
    > | null } };

export type Gallery_SharedSpaceFragmentFragment = { __typename: 'Space', title: string, images: Array<string> } & { ' $fragmentName'?: 'Gallery_SharedSpaceFragmentFragment' };

export type Header_SharedSpaceFragmentFragment = { __typename: 'Space', title: string, status: SpaceStatus, type: SpaceType } & { ' $fragmentName'?: 'Header_SharedSpaceFragmentFragment' };

export type OwnerCard_SpaceFragmentFragment = { __typename: 'Space', spaceOwnerProfile: { __typename: 'SpaceOwnerProfile', businessName: string | null, user: { __typename: 'User', name: string, avatar: string | null } } } & { ' $fragmentName'?: 'OwnerCard_SpaceFragmentFragment' };

export type SharedSpaceDetailQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type SharedSpaceDetailQuery = { spaceById: (
    { __typename: 'Space', id: string }
    & { ' $fragmentRefs'?: { 'Header_SharedSpaceFragmentFragment': Header_SharedSpaceFragmentFragment;'Gallery_SharedSpaceFragmentFragment': Gallery_SharedSpaceFragmentFragment;'SpaceInfo_SpaceFragmentFragment': SpaceInfo_SpaceFragmentFragment;'PricingCard_SpaceFragmentFragment': PricingCard_SpaceFragmentFragment;'OwnerCard_SpaceFragmentFragment': OwnerCard_SpaceFragmentFragment } }
  ) | null };

export type PricingCard_SpaceFragmentFragment = { __typename: 'Space', pricePerDay: number, installationFee: number | null, minDuration: number, maxDuration: number | null } & { ' $fragmentName'?: 'PricingCard_SpaceFragmentFragment' };

export type SpaceInfo_SpaceFragmentFragment = { __typename: 'Space', description: string | null, address: string, city: string, state: string, zipCode: string | null, width: number | null, height: number | null, dimensionsText: string | null, traffic: string | null, availableFrom: string | null, availableTo: string | null, averageRating: number | null, totalBookings: number } & { ' $fragmentName'?: 'SpaceInfo_SpaceFragmentFragment' };

export type UserSection_UserFragmentFragment = { __typename: 'User', email: string, name: string, avatar: string | null, activeProfileType: ProfileType } & { ' $fragmentName'?: 'UserSection_UserFragmentFragment' };

export type SwitchProfileMutationVariables = Exact<{
  input: UpdateCurrentUserInput;
}>;


export type SwitchProfileMutation = { updateCurrentUser: { __typename: 'UpdateCurrentUserPayload', user: { __typename: 'User', id: string, activeProfileType: ProfileType } | null, errors: Array<{ __typename: 'NotFoundError', message: string }> | null } };

export const AnalyticsAdvertiserComparison_QueryFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnalyticsAdvertiserComparison_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"advertiserAnalytics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"periodComparison"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"current"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"bookings"}},{"kind":"Field","name":{"kind":"Name","value":"spending"}},{"kind":"Field","name":{"kind":"Name","value":"impressions"}},{"kind":"Field","name":{"kind":"Name","value":"roi"}}]}},{"kind":"Field","name":{"kind":"Name","value":"previous"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"bookings"}},{"kind":"Field","name":{"kind":"Name","value":"spending"}},{"kind":"Field","name":{"kind":"Name","value":"impressions"}},{"kind":"Field","name":{"kind":"Name","value":"roi"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AnalyticsAdvertiserComparison_QueryFragmentFragment, unknown>;
export const AnalyticsAdvertiserMonthlyChart_QueryFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnalyticsAdvertiserMonthlyChart_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"advertiserAnalytics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"monthlyStats"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"months"},"value":{"kind":"IntValue","value":"12"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"spending"}},{"kind":"Field","name":{"kind":"Name","value":"impressions"}}]}}]}}]}}]} as unknown as DocumentNode<AnalyticsAdvertiserMonthlyChart_QueryFragmentFragment, unknown>;
export const AnalyticsAdvertiserPerformanceTable_QueryFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnalyticsAdvertiserPerformanceTable_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"advertiserAnalytics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spacePerformance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"totalBookings"}},{"kind":"Field","name":{"kind":"Name","value":"totalSpend"}},{"kind":"Field","name":{"kind":"Name","value":"impressions"}},{"kind":"Field","name":{"kind":"Name","value":"roi"}}]}}]}}]}}]} as unknown as DocumentNode<AnalyticsAdvertiserPerformanceTable_QueryFragmentFragment, unknown>;
export const AnalyticsAdvertiserSpendingChart_QueryFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnalyticsAdvertiserSpendingChart_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"advertiserDailyStats"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"spending"}}]}}]}}]} as unknown as DocumentNode<AnalyticsAdvertiserSpendingChart_QueryFragmentFragment, unknown>;
export const AnalyticsAdvertiserStatusChart_QueryFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnalyticsAdvertiserStatusChart_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"advertiserAnalytics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"statusDistribution"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<AnalyticsAdvertiserStatusChart_QueryFragmentFragment, unknown>;
export const AnalyticsAdvertiserSummary_QueryFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnalyticsAdvertiserSummary_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"advertiserAnalytics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"summary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalSpend"}},{"kind":"Field","name":{"kind":"Name","value":"previousTotalSpend"}},{"kind":"Field","name":{"kind":"Name","value":"totalBookings"}},{"kind":"Field","name":{"kind":"Name","value":"previousTotalBookings"}},{"kind":"Field","name":{"kind":"Name","value":"totalImpressions"}},{"kind":"Field","name":{"kind":"Name","value":"previousTotalImpressions"}},{"kind":"Field","name":{"kind":"Name","value":"reach"}},{"kind":"Field","name":{"kind":"Name","value":"previousReach"}},{"kind":"Field","name":{"kind":"Name","value":"avgCostPerImpression"}},{"kind":"Field","name":{"kind":"Name","value":"previousAvgCostPerImpression"}},{"kind":"Field","name":{"kind":"Name","value":"roi"}},{"kind":"Field","name":{"kind":"Name","value":"previousRoi"}},{"kind":"Field","name":{"kind":"Name","value":"completionRate"}},{"kind":"Field","name":{"kind":"Name","value":"previousCompletionRate"}}]}}]}}]}}]} as unknown as DocumentNode<AnalyticsAdvertiserSummary_QueryFragmentFragment, unknown>;
export const AnalyticsAdvertiserTopPerformers_QueryFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnalyticsAdvertiserTopPerformers_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"advertiserAnalytics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"topPerformers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bestRoi"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"change"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mostImpressions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"change"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bestValue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"change"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mostBookings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"change"}}]}},{"kind":"Field","name":{"kind":"Name","value":"needsReview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"roi"}},{"kind":"Field","name":{"kind":"Name","value":"impressions"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AnalyticsAdvertiserTopPerformers_QueryFragmentFragment, unknown>;
export const BookingCard_AdvertiserBookingFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookingCard_AdvertiserBookingFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Booking"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"businessName"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"campaign"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<BookingCard_AdvertiserBookingFragmentFragment, unknown>;
export const BookingsTable_AdvertiserBookingFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookingsTable_AdvertiserBookingFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Booking"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"businessName"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"campaign"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<BookingsTable_AdvertiserBookingFragmentFragment, unknown>;
export const CampaignCard_CampaignFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CampaignCard_CampaignFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Campaign"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"totalBudget"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"bookings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CampaignCard_CampaignFragmentFragment, unknown>;
export const CampaignsTable_CampaignFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CampaignsTable_CampaignFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Campaign"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"totalBudget"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"bookings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CampaignsTable_CampaignFragmentFragment, unknown>;
export const DiscoverSpaceCard_SpaceFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiscoverSpaceCard_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerDay"}}]}}]} as unknown as DocumentNode<DiscoverSpaceCard_SpaceFragmentFragment, unknown>;
export const DiscoverMap_SpaceFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiscoverMap_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerDay"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]} as unknown as DocumentNode<DiscoverMap_SpaceFragmentFragment, unknown>;
export const DiscoverTable_SpaceFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiscoverTable_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerDay"}}]}}]} as unknown as DocumentNode<DiscoverTable_SpaceFragmentFragment, unknown>;
export const AdvertiserOverviewActiveCampaignsCampaignCard_CampaignFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdvertiserOverviewActiveCampaignsCampaignCard_CampaignFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Campaign"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"spacesCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalBudget"}},{"kind":"Field","name":{"kind":"Name","value":"totalSpend"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}}]}}]} as unknown as DocumentNode<AdvertiserOverviewActiveCampaignsCampaignCard_CampaignFragmentFragment, unknown>;
export const AdvertiserOverviewActiveCampaigns_QueryFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdvertiserOverviewActiveCampaigns_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myCampaigns"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"4"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"in"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"ACTIVE"},{"kind":"EnumValue","value":"SUBMITTED"}]}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AdvertiserOverviewActiveCampaignsCampaignCard_CampaignFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdvertiserOverviewActiveCampaignsCampaignCard_CampaignFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Campaign"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"spacesCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalBudget"}},{"kind":"Field","name":{"kind":"Name","value":"totalSpend"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}}]}}]} as unknown as DocumentNode<AdvertiserOverviewActiveCampaigns_QueryFragmentFragment, unknown>;
export const AdvertiserOverviewDeadlineWarningsDeadlineCard_BookingFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdvertiserOverviewDeadlineWarningsDeadlineCard_BookingFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Booking"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"campaign"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"proof"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}}]}}]}}]} as unknown as DocumentNode<AdvertiserOverviewDeadlineWarningsDeadlineCard_BookingFragmentFragment, unknown>;
export const AdvertiserOverviewDeadlineWarnings_QueryFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdvertiserOverviewDeadlineWarnings_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"deadlineBookings"},"name":{"kind":"Name","value":"myBookingsAsAdvertiser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"5"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"EnumValue","value":"VERIFIED"}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"proof"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"submittedAt"},"value":{"kind":"EnumValue","value":"ASC"}}]}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AdvertiserOverviewDeadlineWarningsDeadlineCard_BookingFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdvertiserOverviewDeadlineWarningsDeadlineCard_BookingFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Booking"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"campaign"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"proof"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}}]}}]}}]} as unknown as DocumentNode<AdvertiserOverviewDeadlineWarnings_QueryFragmentFragment, unknown>;
export const AdvertiserOverviewPendingApprovalsApprovalCard_BookingFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdvertiserOverviewPendingApprovalsApprovalCard_BookingFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Booking"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"proof"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"photos"}},{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}}]}}]}}]} as unknown as DocumentNode<AdvertiserOverviewPendingApprovalsApprovalCard_BookingFragmentFragment, unknown>;
export const AdvertiserOverviewPendingApprovals_QueryFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdvertiserOverviewPendingApprovals_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"pendingApprovalsBookings"},"name":{"kind":"Name","value":"myBookingsAsAdvertiser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"3"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"EnumValue","value":"VERIFIED"}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AdvertiserOverviewPendingApprovalsApprovalCard_BookingFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdvertiserOverviewPendingApprovalsApprovalCard_BookingFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Booking"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"proof"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"photos"}},{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}}]}}]}}]} as unknown as DocumentNode<AdvertiserOverviewPendingApprovals_QueryFragmentFragment, unknown>;
export const AdvertiserOverviewPendingPaymentsPaymentCard_BookingFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdvertiserOverviewPendingPaymentsPaymentCard_BookingFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Booking"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"campaign"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<AdvertiserOverviewPendingPaymentsPaymentCard_BookingFragmentFragment, unknown>;
export const AdvertiserOverviewPendingPayments_QueryFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdvertiserOverviewPendingPayments_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"pendingPayments"},"name":{"kind":"Name","value":"myBookingsAsAdvertiser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"5"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"EnumValue","value":"APPROVED"}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"ASC"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AdvertiserOverviewPendingPaymentsPaymentCard_BookingFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdvertiserOverviewPendingPaymentsPaymentCard_BookingFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Booking"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"campaign"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<AdvertiserOverviewPendingPayments_QueryFragmentFragment, unknown>;
export const AdvertiserOverviewRecentActivity_QueryFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdvertiserOverviewRecentActivity_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myNotifications"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"10"}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isRead"}}]}}]}}]}}]} as unknown as DocumentNode<AdvertiserOverviewRecentActivity_QueryFragmentFragment, unknown>;
export const AdvertiserOverviewSpendingChart_QueryFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdvertiserOverviewSpendingChart_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"spendingChartBookings"},"name":{"kind":"Name","value":"myBookingsAsAdvertiser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"20"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"in"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"PAID"},{"kind":"EnumValue","value":"FILE_DOWNLOADED"},{"kind":"EnumValue","value":"INSTALLED"},{"kind":"EnumValue","value":"VERIFIED"},{"kind":"EnumValue","value":"COMPLETED"}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"payments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"EnumValue","value":"SUCCEEDED"}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"paidAt"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AdvertiserOverviewSpendingChart_QueryFragmentFragment, unknown>;
export const AdvertiserOverviewStatCards_QueryFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdvertiserOverviewStatCards_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"advertiserProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalSpend"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"mySavedPaymentMethods"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"activeCampaigns"},"name":{"kind":"Name","value":"myCampaigns"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"in"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"ACTIVE"},{"kind":"EnumValue","value":"SUBMITTED"}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"activeBookings"},"name":{"kind":"Name","value":"myBookingsAsAdvertiser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"in"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"PAID"},{"kind":"EnumValue","value":"FILE_DOWNLOADED"},{"kind":"EnumValue","value":"INSTALLED"},{"kind":"EnumValue","value":"VERIFIED"}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"pendingApprovals"},"name":{"kind":"Name","value":"myBookingsAsAdvertiser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"EnumValue","value":"VERIFIED"}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"recentPayments"},"name":{"kind":"Name","value":"myBookingsAsAdvertiser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"50"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"in"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"PAID"},{"kind":"EnumValue","value":"FILE_DOWNLOADED"},{"kind":"EnumValue","value":"INSTALLED"},{"kind":"EnumValue","value":"VERIFIED"},{"kind":"EnumValue","value":"COMPLETED"}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"payments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"EnumValue","value":"SUCCEEDED"}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"paidAt"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AdvertiserOverviewStatCards_QueryFragmentFragment, unknown>;
export const AdvertiserOverviewTopSpaces_QueryFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdvertiserOverviewTopSpaces_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"topSpacesBookings"},"name":{"kind":"Name","value":"myBookingsAsAdvertiser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"20"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"in"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"COMPLETED"},{"kind":"EnumValue","value":"VERIFIED"},{"kind":"EnumValue","value":"INSTALLED"}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"averageRating"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AdvertiserOverviewTopSpaces_QueryFragmentFragment, unknown>;
export const AnalyticsBookingsChart_QueryFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnalyticsBookingsChart_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerDailyStats"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"bookings"}}]}}]}}]} as unknown as DocumentNode<AnalyticsBookingsChart_QueryFragmentFragment, unknown>;
export const AnalyticsComparison_QueryFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnalyticsComparison_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerAnalytics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"periodComparison"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"current"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"bookings"}},{"kind":"Field","name":{"kind":"Name","value":"revenue"}},{"kind":"Field","name":{"kind":"Name","value":"avgRating"}},{"kind":"Field","name":{"kind":"Name","value":"completionRate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"previous"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"bookings"}},{"kind":"Field","name":{"kind":"Name","value":"revenue"}},{"kind":"Field","name":{"kind":"Name","value":"avgRating"}},{"kind":"Field","name":{"kind":"Name","value":"completionRate"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AnalyticsComparison_QueryFragmentFragment, unknown>;
export const AnalyticsHeatmapChart_QueryFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnalyticsHeatmapChart_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerAnalytics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookingHeatmap"}}]}}]}}]} as unknown as DocumentNode<AnalyticsHeatmapChart_QueryFragmentFragment, unknown>;
export const AnalyticsMonthlyChart_QueryFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnalyticsMonthlyChart_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerAnalytics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"monthlyStats"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"months"},"value":{"kind":"IntValue","value":"12"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"revenue"}},{"kind":"Field","name":{"kind":"Name","value":"bookings"}}]}}]}}]}}]} as unknown as DocumentNode<AnalyticsMonthlyChart_QueryFragmentFragment, unknown>;
export const AnalyticsPerformanceTable_QueryFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnalyticsPerformanceTable_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerAnalytics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spacePerformance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"totalBookings"}},{"kind":"Field","name":{"kind":"Name","value":"totalRevenue"}},{"kind":"Field","name":{"kind":"Name","value":"averageRating"}},{"kind":"Field","name":{"kind":"Name","value":"occupancyRate"}}]}}]}}]}}]} as unknown as DocumentNode<AnalyticsPerformanceTable_QueryFragmentFragment, unknown>;
export const AnalyticsRatingChart_QueryFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnalyticsRatingChart_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerAnalytics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ratingTrends"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"months"},"value":{"kind":"IntValue","value":"12"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"reviews"}}]}}]}}]}}]} as unknown as DocumentNode<AnalyticsRatingChart_QueryFragmentFragment, unknown>;
export const AnalyticsRevenueChart_QueryFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnalyticsRevenueChart_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerAnalytics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spacePerformance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"totalRevenue"}}]}}]}}]}}]} as unknown as DocumentNode<AnalyticsRevenueChart_QueryFragmentFragment, unknown>;
export const AnalyticsStatusChart_QueryFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnalyticsStatusChart_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerAnalytics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"statusDistribution"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<AnalyticsStatusChart_QueryFragmentFragment, unknown>;
export const AnalyticsSummary_QueryFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnalyticsSummary_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerAnalytics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"summary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalBookings"}},{"kind":"Field","name":{"kind":"Name","value":"previousTotalBookings"}},{"kind":"Field","name":{"kind":"Name","value":"totalRevenue"}},{"kind":"Field","name":{"kind":"Name","value":"previousTotalRevenue"}},{"kind":"Field","name":{"kind":"Name","value":"averageRating"}},{"kind":"Field","name":{"kind":"Name","value":"completionRate"}},{"kind":"Field","name":{"kind":"Name","value":"avgBookingDuration"}},{"kind":"Field","name":{"kind":"Name","value":"previousAvgBookingDuration"}},{"kind":"Field","name":{"kind":"Name","value":"occupancyRate"}},{"kind":"Field","name":{"kind":"Name","value":"previousOccupancyRate"}},{"kind":"Field","name":{"kind":"Name","value":"repeatAdvertiserRate"}},{"kind":"Field","name":{"kind":"Name","value":"previousRepeatAdvertiserRate"}},{"kind":"Field","name":{"kind":"Name","value":"forecastedRevenue"}}]}}]}}]}}]} as unknown as DocumentNode<AnalyticsSummary_QueryFragmentFragment, unknown>;
export const AnalyticsTopPerformers_QueryFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnalyticsTopPerformers_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerAnalytics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"topPerformers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bestRevenue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"change"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bestRating"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"reviews"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bestOccupancy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"change"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mostBookings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"change"}}]}},{"kind":"Field","name":{"kind":"Name","value":"needsAttention"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"occupancy"}},{"kind":"Field","name":{"kind":"Name","value":"bookings"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AnalyticsTopPerformers_QueryFragmentFragment, unknown>;
export const BookingCard_BookingFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookingCard_BookingFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Booking"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"ownerPayoutAmount"}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"images"}}]}},{"kind":"Field","name":{"kind":"Name","value":"campaign"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"advertiserProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"companyName"}}]}}]}}]}}]} as unknown as DocumentNode<BookingCard_BookingFragmentFragment, unknown>;
export const BookingsTable_BookingFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookingsTable_BookingFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Booking"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"ownerPayoutAmount"}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"images"}}]}},{"kind":"Field","name":{"kind":"Name","value":"campaign"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"advertiserProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"companyName"}}]}}]}}]}}]} as unknown as DocumentNode<BookingsTable_BookingFragmentFragment, unknown>;
export const BalanceCards_EarningsSummaryFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BalanceCards_EarningsSummaryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EarningsSummary"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"availableBalance"}},{"kind":"Field","name":{"kind":"Name","value":"pendingPayouts"}},{"kind":"Field","name":{"kind":"Name","value":"thisMonthEarnings"}},{"kind":"Field","name":{"kind":"Name","value":"lastMonthEarnings"}},{"kind":"Field","name":{"kind":"Name","value":"totalEarnings"}}]}}]} as unknown as DocumentNode<BalanceCards_EarningsSummaryFragmentFragment, unknown>;
export const PayoutsTable_PayoutFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayoutsTable_PayoutFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Payout"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"stage"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"processedAt"}},{"kind":"Field","name":{"kind":"Name","value":"booking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]} as unknown as DocumentNode<PayoutsTable_PayoutFragmentFragment, unknown>;
export const PayoutsHistoryTable_PayoutFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayoutsHistoryTable_PayoutFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Payout"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"stage"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"processedAt"}},{"kind":"Field","name":{"kind":"Name","value":"failureReason"}},{"kind":"Field","name":{"kind":"Name","value":"attemptCount"}},{"kind":"Field","name":{"kind":"Name","value":"booking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]} as unknown as DocumentNode<PayoutsHistoryTable_PayoutFragmentFragment, unknown>;
export const SpaceCard_SpaceFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SpaceCard_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<SpaceCard_SpaceFragmentFragment, unknown>;
export const ListingsMap_SpaceFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListingsMap_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerDay"}}]}}]} as unknown as DocumentNode<ListingsMap_SpaceFragmentFragment, unknown>;
export const ListingsTable_SpaceFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListingsTable_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<ListingsTable_SpaceFragmentFragment, unknown>;
export const Details_SpaceFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Details_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}},{"kind":"Field","name":{"kind":"Name","value":"traffic"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerDay"}},{"kind":"Field","name":{"kind":"Name","value":"installationFee"}},{"kind":"Field","name":{"kind":"Name","value":"minDuration"}},{"kind":"Field","name":{"kind":"Name","value":"maxDuration"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"dimensionsText"}},{"kind":"Field","name":{"kind":"Name","value":"availableFrom"}},{"kind":"Field","name":{"kind":"Name","value":"availableTo"}}]}}]} as unknown as DocumentNode<Details_SpaceFragmentFragment, unknown>;
export const Gallery_SpaceFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Gallery_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"images"}}]}}]} as unknown as DocumentNode<Gallery_SpaceFragmentFragment, unknown>;
export const Header_SpaceFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Header_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]} as unknown as DocumentNode<Header_SpaceFragmentFragment, unknown>;
export const Performance_SpaceFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Performance_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalBookings"}},{"kind":"Field","name":{"kind":"Name","value":"totalRevenue"}},{"kind":"Field","name":{"kind":"Name","value":"averageRating"}}]}}]} as unknown as DocumentNode<Performance_SpaceFragmentFragment, unknown>;
export const OverviewActiveBookingsBookingCard_BookingFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OverviewActiveBookingsBookingCard_BookingFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Booking"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"campaign"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"advertiser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}}]}}]} as unknown as DocumentNode<OverviewActiveBookingsBookingCard_BookingFragmentFragment, unknown>;
export const OverviewActiveBookings_QueryFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OverviewActiveBookings_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myBookingsAsOwner"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"5"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"in"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"PAID"},{"kind":"EnumValue","value":"FILE_DOWNLOADED"},{"kind":"EnumValue","value":"INSTALLED"}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OverviewActiveBookingsBookingCard_BookingFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OverviewActiveBookingsBookingCard_BookingFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Booking"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"campaign"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"advertiser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}}]}}]} as unknown as DocumentNode<OverviewActiveBookings_QueryFragmentFragment, unknown>;
export const OverviewActivityChart_QueryFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OverviewActivityChart_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myPayouts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"20"}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"processedAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"processedAt"}}]}}]}}]}}]} as unknown as DocumentNode<OverviewActivityChart_QueryFragmentFragment, unknown>;
export const OverviewDeadlineWarningsDeadlineCard_BookingFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OverviewDeadlineWarningsDeadlineCard_BookingFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Booking"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"campaign"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"advertiser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}}]}}]} as unknown as DocumentNode<OverviewDeadlineWarningsDeadlineCard_BookingFragmentFragment, unknown>;
export const OverviewDeadlineWarnings_QueryFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OverviewDeadlineWarnings_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"deadlineBookings"},"name":{"kind":"Name","value":"myBookingsAsOwner"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"5"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"in"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"FILE_DOWNLOADED"},{"kind":"EnumValue","value":"INSTALLED"}]}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"endDate"},"value":{"kind":"EnumValue","value":"ASC"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OverviewDeadlineWarningsDeadlineCard_BookingFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OverviewDeadlineWarningsDeadlineCard_BookingFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Booking"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"campaign"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"advertiser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}}]}}]} as unknown as DocumentNode<OverviewDeadlineWarnings_QueryFragmentFragment, unknown>;
export const OverviewPendingRequestsRequestCard_BookingFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OverviewPendingRequestsRequestCard_BookingFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Booking"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"campaign"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"advertiser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<OverviewPendingRequestsRequestCard_BookingFragmentFragment, unknown>;
export const OverviewPendingRequests_QueryFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OverviewPendingRequests_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incomingBookingRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"5"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OverviewPendingRequestsRequestCard_BookingFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OverviewPendingRequestsRequestCard_BookingFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Booking"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"campaign"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"advertiser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<OverviewPendingRequests_QueryFragmentFragment, unknown>;
export const OverviewRecentActivity_QueryFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OverviewRecentActivity_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myNotifications"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"10"}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isRead"}}]}}]}}]}}]} as unknown as DocumentNode<OverviewRecentActivity_QueryFragmentFragment, unknown>;
export const OverviewStatCards_QueryFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OverviewStatCards_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stripeAccountStatus"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"earningsSummary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"availableBalance"}},{"kind":"Field","name":{"kind":"Name","value":"pendingPayouts"}},{"kind":"Field","name":{"kind":"Name","value":"thisMonthEarnings"}},{"kind":"Field","name":{"kind":"Name","value":"lastMonthEarnings"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"activeBookings"},"name":{"kind":"Name","value":"myBookingsAsOwner"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"in"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"PAID"},{"kind":"EnumValue","value":"FILE_DOWNLOADED"},{"kind":"EnumValue","value":"INSTALLED"},{"kind":"EnumValue","value":"VERIFIED"}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mySpaces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<OverviewStatCards_QueryFragmentFragment, unknown>;
export const OverviewTopSpacesSpaceCard_SpaceFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OverviewTopSpacesSpaceCard_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"totalBookings"}},{"kind":"Field","name":{"kind":"Name","value":"totalRevenue"}},{"kind":"Field","name":{"kind":"Name","value":"averageRating"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]} as unknown as DocumentNode<OverviewTopSpacesSpaceCard_SpaceFragmentFragment, unknown>;
export const OverviewTopSpaces_QueryFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OverviewTopSpaces_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spaces"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"5"}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"totalRevenue"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OverviewTopSpacesSpaceCard_SpaceFragment"}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OverviewTopSpacesSpaceCard_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"totalBookings"}},{"kind":"Field","name":{"kind":"Name","value":"totalRevenue"}},{"kind":"Field","name":{"kind":"Name","value":"averageRating"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]} as unknown as DocumentNode<OverviewTopSpaces_QueryFragmentFragment, unknown>;
export const OverviewUpcomingPayoutsPayoutCard_PayoutFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OverviewUpcomingPayoutsPayoutCard_PayoutFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Payout"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"stage"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"booking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]} as unknown as DocumentNode<OverviewUpcomingPayoutsPayoutCard_PayoutFragmentFragment, unknown>;
export const OverviewUpcomingPayouts_QueryFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OverviewUpcomingPayouts_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"upcomingPayouts"},"name":{"kind":"Name","value":"myPayouts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"5"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"in"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"PENDING"},{"kind":"EnumValue","value":"PROCESSING"}]}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"ASC"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OverviewUpcomingPayoutsPayoutCard_PayoutFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OverviewUpcomingPayoutsPayoutCard_PayoutFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Payout"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"stage"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"booking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]} as unknown as DocumentNode<OverviewUpcomingPayouts_QueryFragmentFragment, unknown>;
export const MessageBubble_MessageFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MessageBubble_MessageFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Message"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"senderUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]} as unknown as DocumentNode<MessageBubble_MessageFragmentFragment, unknown>;
export const ThreadHeader_ConversationFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ThreadHeader_ConversationFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Conversation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"booking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerDay"}},{"kind":"Field","name":{"kind":"Name","value":"totalDays"}},{"kind":"Field","name":{"kind":"Name","value":"installationFee"}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}}]}}]}}]} as unknown as DocumentNode<ThreadHeader_ConversationFragmentFragment, unknown>;
export const ConversationItem_ConversationFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ConversationItem_ConversationFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Conversation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"booking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"participants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lastReadAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"messages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1"}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"senderUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ConversationItem_ConversationFragmentFragment, unknown>;
export const NavigationSection_UserFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NavigationSection_UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"activeProfileType"}}]}}]} as unknown as DocumentNode<NavigationSection_UserFragmentFragment, unknown>;
export const About_UserFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"About_UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"activeProfileType"}},{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"businessName"}},{"kind":"Field","name":{"kind":"Name","value":"businessType"}},{"kind":"Field","name":{"kind":"Name","value":"onboardingComplete"}},{"kind":"Field","name":{"kind":"Name","value":"responseRate"}},{"kind":"Field","name":{"kind":"Name","value":"averageResponseTime"}},{"kind":"Field","name":{"kind":"Name","value":"spaces"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"advertiserProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"companyName"}},{"kind":"Field","name":{"kind":"Name","value":"industry"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"onboardingComplete"}},{"kind":"Field","name":{"kind":"Name","value":"campaigns"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"10"}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]}}]} as unknown as DocumentNode<About_UserFragmentFragment, unknown>;
export const Activity_UserFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Activity_UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"activeProfileType"}},{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reviews"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"10"}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"reviewer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"companyName"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"advertiserProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"campaigns"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"10"}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"totalSpend"}},{"kind":"Field","name":{"kind":"Name","value":"spacesCount"}}]}}]}}]}}]}}]} as unknown as DocumentNode<Activity_UserFragmentFragment, unknown>;
export const Info_UserFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Info_UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"activeProfileType"}},{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"spaces"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"averageRating"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"reviews"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"10"}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"advertiserProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"totalSpend"}},{"kind":"Field","name":{"kind":"Name","value":"campaigns"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"10"}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]} as unknown as DocumentNode<Info_UserFragmentFragment, unknown>;
export const ProfileLayout_UserFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfileLayout_UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]} as unknown as DocumentNode<ProfileLayout_UserFragmentFragment, unknown>;
export const RoleBasedView_UserFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoleBasedView_UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"activeProfileType"}}]}}]} as unknown as DocumentNode<RoleBasedView_UserFragmentFragment, unknown>;
export const AccountSettings_UserFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AccountSettings_UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastLoginAt"}},{"kind":"Field","name":{"kind":"Name","value":"activeProfileType"}}]}}]} as unknown as DocumentNode<AccountSettings_UserFragmentFragment, unknown>;
export const BusinessSettings_UserFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BusinessSettings_UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activeProfileType"}},{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"businessName"}},{"kind":"Field","name":{"kind":"Name","value":"businessType"}},{"kind":"Field","name":{"kind":"Name","value":"payoutSchedule"}}]}},{"kind":"Field","name":{"kind":"Name","value":"advertiserProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"companyName"}},{"kind":"Field","name":{"kind":"Name","value":"industry"}},{"kind":"Field","name":{"kind":"Name","value":"website"}}]}}]}}]} as unknown as DocumentNode<BusinessSettings_UserFragmentFragment, unknown>;
export const NotificationSettings_UserFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotificationSettings_UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activeProfileType"}}]}}]} as unknown as DocumentNode<NotificationSettings_UserFragmentFragment, unknown>;
export const PaymentSettings_UserFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PaymentSettings_UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activeProfileType"}}]}}]} as unknown as DocumentNode<PaymentSettings_UserFragmentFragment, unknown>;
export const PayoutSettings_UserFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayoutSettings_UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activeProfileType"}},{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stripeAccountId"}},{"kind":"Field","name":{"kind":"Name","value":"stripeAccountStatus"}}]}}]}}]} as unknown as DocumentNode<PayoutSettings_UserFragmentFragment, unknown>;
export const ProfileSettings_UserFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfileSettings_UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"activeProfileType"}}]}}]} as unknown as DocumentNode<ProfileSettings_UserFragmentFragment, unknown>;
export const SettingsLayout_UserFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SettingsLayout_UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]} as unknown as DocumentNode<SettingsLayout_UserFragmentFragment, unknown>;
export const Gallery_SharedSpaceFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Gallery_SharedSpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"images"}}]}}]} as unknown as DocumentNode<Gallery_SharedSpaceFragmentFragment, unknown>;
export const Header_SharedSpaceFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Header_SharedSpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<Header_SharedSpaceFragmentFragment, unknown>;
export const OwnerCard_SpaceFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OwnerCard_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"businessName"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}}]} as unknown as DocumentNode<OwnerCard_SpaceFragmentFragment, unknown>;
export const PricingCard_SpaceFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PricingCard_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pricePerDay"}},{"kind":"Field","name":{"kind":"Name","value":"installationFee"}},{"kind":"Field","name":{"kind":"Name","value":"minDuration"}},{"kind":"Field","name":{"kind":"Name","value":"maxDuration"}}]}}]} as unknown as DocumentNode<PricingCard_SpaceFragmentFragment, unknown>;
export const SpaceInfo_SpaceFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SpaceInfo_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"dimensionsText"}},{"kind":"Field","name":{"kind":"Name","value":"traffic"}},{"kind":"Field","name":{"kind":"Name","value":"availableFrom"}},{"kind":"Field","name":{"kind":"Name","value":"availableTo"}},{"kind":"Field","name":{"kind":"Name","value":"averageRating"}},{"kind":"Field","name":{"kind":"Name","value":"totalBookings"}}]}}]} as unknown as DocumentNode<SpaceInfo_SpaceFragmentFragment, unknown>;
export const UserSection_UserFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserSection_UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"activeProfileType"}}]}}]} as unknown as DocumentNode<UserSection_UserFragmentFragment, unknown>;
export const AdvertiserAnalyticsDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AdvertiserAnalyticsData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AnalyticsAdvertiserSummary_QueryFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AnalyticsAdvertiserSpendingChart_QueryFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AnalyticsAdvertiserStatusChart_QueryFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AnalyticsAdvertiserMonthlyChart_QueryFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AnalyticsAdvertiserComparison_QueryFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AnalyticsAdvertiserTopPerformers_QueryFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AnalyticsAdvertiserPerformanceTable_QueryFragment"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnalyticsAdvertiserSummary_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"advertiserAnalytics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"summary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalSpend"}},{"kind":"Field","name":{"kind":"Name","value":"previousTotalSpend"}},{"kind":"Field","name":{"kind":"Name","value":"totalBookings"}},{"kind":"Field","name":{"kind":"Name","value":"previousTotalBookings"}},{"kind":"Field","name":{"kind":"Name","value":"totalImpressions"}},{"kind":"Field","name":{"kind":"Name","value":"previousTotalImpressions"}},{"kind":"Field","name":{"kind":"Name","value":"reach"}},{"kind":"Field","name":{"kind":"Name","value":"previousReach"}},{"kind":"Field","name":{"kind":"Name","value":"avgCostPerImpression"}},{"kind":"Field","name":{"kind":"Name","value":"previousAvgCostPerImpression"}},{"kind":"Field","name":{"kind":"Name","value":"roi"}},{"kind":"Field","name":{"kind":"Name","value":"previousRoi"}},{"kind":"Field","name":{"kind":"Name","value":"completionRate"}},{"kind":"Field","name":{"kind":"Name","value":"previousCompletionRate"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnalyticsAdvertiserSpendingChart_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"advertiserDailyStats"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"spending"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnalyticsAdvertiserStatusChart_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"advertiserAnalytics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"statusDistribution"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnalyticsAdvertiserMonthlyChart_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"advertiserAnalytics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"monthlyStats"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"months"},"value":{"kind":"IntValue","value":"12"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"spending"}},{"kind":"Field","name":{"kind":"Name","value":"impressions"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnalyticsAdvertiserComparison_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"advertiserAnalytics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"periodComparison"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"current"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"bookings"}},{"kind":"Field","name":{"kind":"Name","value":"spending"}},{"kind":"Field","name":{"kind":"Name","value":"impressions"}},{"kind":"Field","name":{"kind":"Name","value":"roi"}}]}},{"kind":"Field","name":{"kind":"Name","value":"previous"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"bookings"}},{"kind":"Field","name":{"kind":"Name","value":"spending"}},{"kind":"Field","name":{"kind":"Name","value":"impressions"}},{"kind":"Field","name":{"kind":"Name","value":"roi"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnalyticsAdvertiserTopPerformers_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"advertiserAnalytics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"topPerformers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bestRoi"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"change"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mostImpressions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"change"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bestValue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"change"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mostBookings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"change"}}]}},{"kind":"Field","name":{"kind":"Name","value":"needsReview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"roi"}},{"kind":"Field","name":{"kind":"Name","value":"impressions"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnalyticsAdvertiserPerformanceTable_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"advertiserAnalytics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spacePerformance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"totalBookings"}},{"kind":"Field","name":{"kind":"Name","value":"totalSpend"}},{"kind":"Field","name":{"kind":"Name","value":"impressions"}},{"kind":"Field","name":{"kind":"Name","value":"roi"}}]}}]}}]}}]} as unknown as DocumentNode<AdvertiserAnalyticsDataQuery, AdvertiserAnalyticsDataQueryVariables>;
export const AdvertiserBookingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AdvertiserBookings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myBookingsAsAdvertiser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"BookingCard_AdvertiserBookingFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"BookingsTable_AdvertiserBookingFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookingCard_AdvertiserBookingFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Booking"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"businessName"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"campaign"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookingsTable_AdvertiserBookingFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Booking"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"businessName"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"campaign"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<AdvertiserBookingsQuery, AdvertiserBookingsQueryVariables>;
export const AdvertiserCampaignsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AdvertiserCampaigns"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myCampaigns"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CampaignCard_CampaignFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CampaignsTable_CampaignFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CampaignCard_CampaignFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Campaign"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"totalBudget"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"bookings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CampaignsTable_CampaignFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Campaign"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"totalBudget"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"bookings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<AdvertiserCampaignsQuery, AdvertiserCampaignsQueryVariables>;
export const DiscoverSpacesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DiscoverSpaces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spaces"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"32"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"EnumValue","value":"ACTIVE"}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"DiscoverSpaceCard_SpaceFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"DiscoverTable_SpaceFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"DiscoverMap_SpaceFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiscoverSpaceCard_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerDay"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiscoverTable_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerDay"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiscoverMap_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerDay"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]} as unknown as DocumentNode<DiscoverSpacesQuery, DiscoverSpacesQueryVariables>;
export const AdvertiserOverviewDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AdvertiserOverviewData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AdvertiserOverviewStatCards_QueryFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AdvertiserOverviewDeadlineWarnings_QueryFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AdvertiserOverviewPendingPayments_QueryFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AdvertiserOverviewPendingApprovals_QueryFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AdvertiserOverviewActiveCampaigns_QueryFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AdvertiserOverviewTopSpaces_QueryFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AdvertiserOverviewSpendingChart_QueryFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AdvertiserOverviewRecentActivity_QueryFragment"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdvertiserOverviewDeadlineWarningsDeadlineCard_BookingFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Booking"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"campaign"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"proof"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdvertiserOverviewPendingPaymentsPaymentCard_BookingFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Booking"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"campaign"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdvertiserOverviewPendingApprovalsApprovalCard_BookingFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Booking"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"proof"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"photos"}},{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdvertiserOverviewActiveCampaignsCampaignCard_CampaignFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Campaign"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"spacesCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalBudget"}},{"kind":"Field","name":{"kind":"Name","value":"totalSpend"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdvertiserOverviewStatCards_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"advertiserProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalSpend"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"mySavedPaymentMethods"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"activeCampaigns"},"name":{"kind":"Name","value":"myCampaigns"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"in"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"ACTIVE"},{"kind":"EnumValue","value":"SUBMITTED"}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"activeBookings"},"name":{"kind":"Name","value":"myBookingsAsAdvertiser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"in"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"PAID"},{"kind":"EnumValue","value":"FILE_DOWNLOADED"},{"kind":"EnumValue","value":"INSTALLED"},{"kind":"EnumValue","value":"VERIFIED"}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"pendingApprovals"},"name":{"kind":"Name","value":"myBookingsAsAdvertiser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"EnumValue","value":"VERIFIED"}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"recentPayments"},"name":{"kind":"Name","value":"myBookingsAsAdvertiser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"50"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"in"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"PAID"},{"kind":"EnumValue","value":"FILE_DOWNLOADED"},{"kind":"EnumValue","value":"INSTALLED"},{"kind":"EnumValue","value":"VERIFIED"},{"kind":"EnumValue","value":"COMPLETED"}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"payments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"EnumValue","value":"SUCCEEDED"}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"paidAt"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdvertiserOverviewDeadlineWarnings_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"deadlineBookings"},"name":{"kind":"Name","value":"myBookingsAsAdvertiser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"5"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"EnumValue","value":"VERIFIED"}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"proof"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"submittedAt"},"value":{"kind":"EnumValue","value":"ASC"}}]}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AdvertiserOverviewDeadlineWarningsDeadlineCard_BookingFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdvertiserOverviewPendingPayments_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"pendingPayments"},"name":{"kind":"Name","value":"myBookingsAsAdvertiser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"5"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"EnumValue","value":"APPROVED"}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"ASC"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AdvertiserOverviewPendingPaymentsPaymentCard_BookingFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdvertiserOverviewPendingApprovals_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"pendingApprovalsBookings"},"name":{"kind":"Name","value":"myBookingsAsAdvertiser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"3"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"EnumValue","value":"VERIFIED"}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AdvertiserOverviewPendingApprovalsApprovalCard_BookingFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdvertiserOverviewActiveCampaigns_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myCampaigns"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"4"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"in"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"ACTIVE"},{"kind":"EnumValue","value":"SUBMITTED"}]}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AdvertiserOverviewActiveCampaignsCampaignCard_CampaignFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdvertiserOverviewTopSpaces_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"topSpacesBookings"},"name":{"kind":"Name","value":"myBookingsAsAdvertiser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"20"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"in"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"COMPLETED"},{"kind":"EnumValue","value":"VERIFIED"},{"kind":"EnumValue","value":"INSTALLED"}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"averageRating"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdvertiserOverviewSpendingChart_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"spendingChartBookings"},"name":{"kind":"Name","value":"myBookingsAsAdvertiser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"20"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"in"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"PAID"},{"kind":"EnumValue","value":"FILE_DOWNLOADED"},{"kind":"EnumValue","value":"INSTALLED"},{"kind":"EnumValue","value":"VERIFIED"},{"kind":"EnumValue","value":"COMPLETED"}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"payments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"EnumValue","value":"SUCCEEDED"}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"paidAt"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdvertiserOverviewRecentActivity_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myNotifications"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"10"}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isRead"}}]}}]}}]}}]} as unknown as DocumentNode<AdvertiserOverviewDataQuery, AdvertiserOverviewDataQueryVariables>;
export const AnalyticsDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AnalyticsData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AnalyticsSummary_QueryFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AnalyticsBookingsChart_QueryFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AnalyticsStatusChart_QueryFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AnalyticsMonthlyChart_QueryFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AnalyticsRatingChart_QueryFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AnalyticsHeatmapChart_QueryFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AnalyticsComparison_QueryFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AnalyticsTopPerformers_QueryFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AnalyticsRevenueChart_QueryFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AnalyticsPerformanceTable_QueryFragment"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnalyticsSummary_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerAnalytics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"summary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalBookings"}},{"kind":"Field","name":{"kind":"Name","value":"previousTotalBookings"}},{"kind":"Field","name":{"kind":"Name","value":"totalRevenue"}},{"kind":"Field","name":{"kind":"Name","value":"previousTotalRevenue"}},{"kind":"Field","name":{"kind":"Name","value":"averageRating"}},{"kind":"Field","name":{"kind":"Name","value":"completionRate"}},{"kind":"Field","name":{"kind":"Name","value":"avgBookingDuration"}},{"kind":"Field","name":{"kind":"Name","value":"previousAvgBookingDuration"}},{"kind":"Field","name":{"kind":"Name","value":"occupancyRate"}},{"kind":"Field","name":{"kind":"Name","value":"previousOccupancyRate"}},{"kind":"Field","name":{"kind":"Name","value":"repeatAdvertiserRate"}},{"kind":"Field","name":{"kind":"Name","value":"previousRepeatAdvertiserRate"}},{"kind":"Field","name":{"kind":"Name","value":"forecastedRevenue"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnalyticsBookingsChart_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerDailyStats"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"bookings"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnalyticsStatusChart_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerAnalytics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"statusDistribution"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnalyticsMonthlyChart_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerAnalytics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"monthlyStats"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"months"},"value":{"kind":"IntValue","value":"12"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"revenue"}},{"kind":"Field","name":{"kind":"Name","value":"bookings"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnalyticsRatingChart_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerAnalytics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ratingTrends"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"months"},"value":{"kind":"IntValue","value":"12"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"reviews"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnalyticsHeatmapChart_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerAnalytics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookingHeatmap"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnalyticsComparison_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerAnalytics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"periodComparison"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"current"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"bookings"}},{"kind":"Field","name":{"kind":"Name","value":"revenue"}},{"kind":"Field","name":{"kind":"Name","value":"avgRating"}},{"kind":"Field","name":{"kind":"Name","value":"completionRate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"previous"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"bookings"}},{"kind":"Field","name":{"kind":"Name","value":"revenue"}},{"kind":"Field","name":{"kind":"Name","value":"avgRating"}},{"kind":"Field","name":{"kind":"Name","value":"completionRate"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnalyticsTopPerformers_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerAnalytics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"topPerformers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bestRevenue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"change"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bestRating"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"reviews"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bestOccupancy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"change"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mostBookings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"change"}}]}},{"kind":"Field","name":{"kind":"Name","value":"needsAttention"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"occupancy"}},{"kind":"Field","name":{"kind":"Name","value":"bookings"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnalyticsRevenueChart_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerAnalytics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spacePerformance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"totalRevenue"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnalyticsPerformanceTable_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerAnalytics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spacePerformance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"totalBookings"}},{"kind":"Field","name":{"kind":"Name","value":"totalRevenue"}},{"kind":"Field","name":{"kind":"Name","value":"averageRating"}},{"kind":"Field","name":{"kind":"Name","value":"occupancyRate"}}]}}]}}]}}]} as unknown as DocumentNode<AnalyticsDataQuery, AnalyticsDataQueryVariables>;
export const BookingDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BookingDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookingById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"totalDays"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerDay"}},{"kind":"Field","name":{"kind":"Name","value":"subtotalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"installationFee"}},{"kind":"Field","name":{"kind":"Name","value":"platformFeeAmount"}},{"kind":"Field","name":{"kind":"Name","value":"platformFeePercent"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"ownerPayoutAmount"}},{"kind":"Field","name":{"kind":"Name","value":"ownerNotes"}},{"kind":"Field","name":{"kind":"Name","value":"advertiserNotes"}},{"kind":"Field","name":{"kind":"Name","value":"rejectionReason"}},{"kind":"Field","name":{"kind":"Name","value":"rejectedAt"}},{"kind":"Field","name":{"kind":"Name","value":"cancellationReason"}},{"kind":"Field","name":{"kind":"Name","value":"cancelledAt"}},{"kind":"Field","name":{"kind":"Name","value":"fileDownloadedAt"}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"campaign"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"advertiserProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"companyName"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"proof"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"photos"}},{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}},{"kind":"Field","name":{"kind":"Name","value":"autoApproveAt"}},{"kind":"Field","name":{"kind":"Name","value":"rejectionReason"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dispute"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"issueType"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"photos"}},{"kind":"Field","name":{"kind":"Name","value":"disputedAt"}},{"kind":"Field","name":{"kind":"Name","value":"resolutionAction"}},{"kind":"Field","name":{"kind":"Name","value":"resolutionNotes"}},{"kind":"Field","name":{"kind":"Name","value":"resolvedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payouts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"stage"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"processedAt"}}]}}]}}]}}]} as unknown as DocumentNode<BookingDetailQuery, BookingDetailQueryVariables>;
export const ApproveBookingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ApproveBooking"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ApproveBookingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"approveBooking"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"booking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ApproveBookingMutation, ApproveBookingMutationVariables>;
export const RejectBookingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RejectBooking"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RejectBookingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rejectBooking"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"booking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<RejectBookingMutation, RejectBookingMutationVariables>;
export const CancelBookingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CancelBooking"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CancelBookingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cancelBooking"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"booking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CancelBookingMutation, CancelBookingMutationVariables>;
export const MarkFileDownloadedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MarkFileDownloaded"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MarkFileDownloadedInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"markFileDownloaded"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"booking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"fileDownloadedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<MarkFileDownloadedMutation, MarkFileDownloadedMutationVariables>;
export const MarkInstalledDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MarkInstalled"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MarkInstalledInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"markInstalled"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"booking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<MarkInstalledMutation, MarkInstalledMutationVariables>;
export const SubmitProofDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SubmitProof"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SubmitProofInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"submitProof"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"booking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<SubmitProofMutation, SubmitProofMutationVariables>;
export const CreateBookingConversationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateBookingConversation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateBookingConversationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createBookingConversation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"conversation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateBookingConversationMutation, CreateBookingConversationMutationVariables>;
export const SpaceOwnerBookingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SpaceOwnerBookings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"BookingFilterInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BookingSortInput"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchText"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myBookingsAsOwner"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchText"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchText"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"BookingCard_BookingFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"BookingsTable_BookingFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookingCard_BookingFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Booking"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"ownerPayoutAmount"}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"images"}}]}},{"kind":"Field","name":{"kind":"Name","value":"campaign"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"advertiserProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"companyName"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookingsTable_BookingFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Booking"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"ownerPayoutAmount"}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"images"}}]}},{"kind":"Field","name":{"kind":"Name","value":"campaign"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"advertiserProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"companyName"}}]}}]}}]}}]} as unknown as DocumentNode<SpaceOwnerBookingsQuery, SpaceOwnerBookingsQueryVariables>;
export const CalendarBlockDatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CalendarBlockDates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BlockDatesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"blockDates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"blockedDates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CalendarBlockDatesMutation, CalendarBlockDatesMutationVariables>;
export const CalendarUnblockDatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CalendarUnblockDates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UnblockDatesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unblockDates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unblockedCount"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CalendarUnblockDatesMutation, CalendarUnblockDatesMutationVariables>;
export const CalendarSpacesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CalendarSpaces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mySpaces"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"50"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"EnumValue","value":"ACTIVE"}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"blockedDates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CalendarSpacesQuery, CalendarSpacesQueryVariables>;
export const CalendarBookingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CalendarBookings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myBookingsAsOwner"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"50"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"startDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"endDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"nin"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"REJECTED"},{"kind":"EnumValue","value":"CANCELLED"}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"spaceId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"campaign"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"advertiserProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"companyName"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<CalendarBookingsQuery, CalendarBookingsQueryVariables>;
export const RequestManualPayoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RequestManualPayout"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RequestManualPayoutInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestManualPayout"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"manualPayout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<RequestManualPayoutMutation, RequestManualPayoutMutationVariables>;
export const SpaceOwnerEarningsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SpaceOwnerEarnings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stripeAccountStatus"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"earningsSummary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BalanceCards_EarningsSummaryFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"myPayouts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"processedAt"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PayoutsTable_PayoutFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BalanceCards_EarningsSummaryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EarningsSummary"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"availableBalance"}},{"kind":"Field","name":{"kind":"Name","value":"pendingPayouts"}},{"kind":"Field","name":{"kind":"Name","value":"thisMonthEarnings"}},{"kind":"Field","name":{"kind":"Name","value":"lastMonthEarnings"}},{"kind":"Field","name":{"kind":"Name","value":"totalEarnings"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayoutsTable_PayoutFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Payout"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"stage"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"processedAt"}},{"kind":"Field","name":{"kind":"Name","value":"booking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]} as unknown as DocumentNode<SpaceOwnerEarningsQuery, SpaceOwnerEarningsQueryVariables>;
export const SpaceOwnerPayoutsHistoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SpaceOwnerPayoutsHistory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PayoutFilterInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PayoutSortInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myPayouts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PayoutsHistoryTable_PayoutFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayoutsHistoryTable_PayoutFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Payout"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"stage"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"processedAt"}},{"kind":"Field","name":{"kind":"Name","value":"failureReason"}},{"kind":"Field","name":{"kind":"Name","value":"attemptCount"}},{"kind":"Field","name":{"kind":"Name","value":"booking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]} as unknown as DocumentNode<SpaceOwnerPayoutsHistoryQuery, SpaceOwnerPayoutsHistoryQueryVariables>;
export const RetryPayoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RetryPayout"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RetryPayoutInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"retryPayout"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"payout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<RetryPayoutMutation, RetryPayoutMutationVariables>;
export const SpaceBookingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SpaceBookings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"spaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myBookingsAsOwner"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"spaceId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"spaceId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"startDate"},"value":{"kind":"EnumValue","value":"DESC"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"campaign"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"advertiserProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"companyName"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<SpaceBookingsQuery, SpaceBookingsQueryVariables>;
export const SpaceBlockedDatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SpaceBlockedDates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"spaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"blockedDatesBySpace"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"spaceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"spaceId"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}}]}}]}}]}}]} as unknown as DocumentNode<SpaceBlockedDatesQuery, SpaceBlockedDatesQueryVariables>;
export const BlockDatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BlockDates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BlockDatesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"blockDates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"blockedDates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<BlockDatesMutation, BlockDatesMutationVariables>;
export const UnblockDatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnblockDates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UnblockDatesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unblockDates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unblockedCount"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UnblockDatesMutation, UnblockDatesMutationVariables>;
export const SpaceDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SpaceDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spaceById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"averageRating"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Header_SpaceFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Gallery_SpaceFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Details_SpaceFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Performance_SpaceFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Header_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Gallery_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"images"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Details_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}},{"kind":"Field","name":{"kind":"Name","value":"traffic"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerDay"}},{"kind":"Field","name":{"kind":"Name","value":"installationFee"}},{"kind":"Field","name":{"kind":"Name","value":"minDuration"}},{"kind":"Field","name":{"kind":"Name","value":"maxDuration"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"dimensionsText"}},{"kind":"Field","name":{"kind":"Name","value":"availableFrom"}},{"kind":"Field","name":{"kind":"Name","value":"availableTo"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Performance_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalBookings"}},{"kind":"Field","name":{"kind":"Name","value":"totalRevenue"}},{"kind":"Field","name":{"kind":"Name","value":"averageRating"}}]}}]} as unknown as DocumentNode<SpaceDetailQuery, SpaceDetailQueryVariables>;
export const SpaceReviewsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SpaceReviews"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"spaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reviewsBySpace"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"spaceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"spaceId"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"reviewer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}}]}}]} as unknown as DocumentNode<SpaceReviewsQuery, SpaceReviewsQueryVariables>;
export const CreateSpaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSpace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateSpaceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSpace"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateSpaceMutation, CreateSpaceMutationVariables>;
export const UpdateSpaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSpace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateSpaceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSpace"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateSpaceMutation, UpdateSpaceMutationVariables>;
export const UpdateSpaceImagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSpaceImages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateSpaceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSpace"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"images"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateSpaceImagesMutation, UpdateSpaceImagesMutationVariables>;
export const DeactivateSpaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeactivateSpace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeactivateSpaceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deactivateSpace"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DeactivateSpaceMutation, DeactivateSpaceMutationVariables>;
export const ReactivateSpaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ReactivateSpace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReactivateSpaceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reactivateSpace"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ReactivateSpaceMutation, ReactivateSpaceMutationVariables>;
export const DeleteSpaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteSpace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteSpaceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteSpace"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DeleteSpaceMutation, DeleteSpaceMutationVariables>;
export const BulkDeactivateSpaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BulkDeactivateSpace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeactivateSpaceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deactivateSpace"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<BulkDeactivateSpaceMutation, BulkDeactivateSpaceMutationVariables>;
export const BulkDeleteSpaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BulkDeleteSpace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteSpaceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteSpace"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<BulkDeleteSpaceMutation, BulkDeleteSpaceMutationVariables>;
export const SpaceOwnerListingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SpaceOwnerListings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SpaceSortInput"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SpaceFilterInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gridView"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tableView"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mapView"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mySpaces"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"SpaceCard_SpaceFragment"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"include"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"if"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gridView"}}}]}]},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListingsTable_SpaceFragment"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"include"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"if"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tableView"}}}]}]},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListingsMap_SpaceFragment"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"include"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"if"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mapView"}}}]}]}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SpaceCard_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListingsTable_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListingsMap_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerDay"}}]}}]} as unknown as DocumentNode<SpaceOwnerListingsQuery, SpaceOwnerListingsQueryVariables>;
export const OverviewDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OverviewData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OverviewStatCards_QueryFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"OverviewDeadlineWarnings_QueryFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"OverviewPendingRequests_QueryFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"OverviewActiveBookings_QueryFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"OverviewTopSpaces_QueryFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"OverviewUpcomingPayouts_QueryFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"OverviewActivityChart_QueryFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"OverviewRecentActivity_QueryFragment"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OverviewDeadlineWarningsDeadlineCard_BookingFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Booking"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"campaign"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"advertiser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OverviewPendingRequestsRequestCard_BookingFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Booking"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"campaign"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"advertiser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OverviewActiveBookingsBookingCard_BookingFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Booking"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"campaign"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"advertiser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OverviewTopSpacesSpaceCard_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"totalBookings"}},{"kind":"Field","name":{"kind":"Name","value":"totalRevenue"}},{"kind":"Field","name":{"kind":"Name","value":"averageRating"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OverviewUpcomingPayoutsPayoutCard_PayoutFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Payout"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"stage"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"booking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OverviewStatCards_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stripeAccountStatus"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"earningsSummary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"availableBalance"}},{"kind":"Field","name":{"kind":"Name","value":"pendingPayouts"}},{"kind":"Field","name":{"kind":"Name","value":"thisMonthEarnings"}},{"kind":"Field","name":{"kind":"Name","value":"lastMonthEarnings"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"activeBookings"},"name":{"kind":"Name","value":"myBookingsAsOwner"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"in"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"PAID"},{"kind":"EnumValue","value":"FILE_DOWNLOADED"},{"kind":"EnumValue","value":"INSTALLED"},{"kind":"EnumValue","value":"VERIFIED"}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mySpaces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OverviewDeadlineWarnings_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"deadlineBookings"},"name":{"kind":"Name","value":"myBookingsAsOwner"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"5"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"in"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"FILE_DOWNLOADED"},{"kind":"EnumValue","value":"INSTALLED"}]}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"endDate"},"value":{"kind":"EnumValue","value":"ASC"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OverviewDeadlineWarningsDeadlineCard_BookingFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OverviewPendingRequests_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incomingBookingRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"5"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OverviewPendingRequestsRequestCard_BookingFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OverviewActiveBookings_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myBookingsAsOwner"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"5"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"in"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"PAID"},{"kind":"EnumValue","value":"FILE_DOWNLOADED"},{"kind":"EnumValue","value":"INSTALLED"}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OverviewActiveBookingsBookingCard_BookingFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OverviewTopSpaces_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spaces"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"5"}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"totalRevenue"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OverviewTopSpacesSpaceCard_SpaceFragment"}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OverviewUpcomingPayouts_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"upcomingPayouts"},"name":{"kind":"Name","value":"myPayouts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"5"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"in"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"PENDING"},{"kind":"EnumValue","value":"PROCESSING"}]}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"ASC"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OverviewUpcomingPayoutsPayoutCard_PayoutFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OverviewActivityChart_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myPayouts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"20"}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"processedAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"processedAt"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OverviewRecentActivity_QueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myNotifications"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"10"}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isRead"}}]}}]}}]}}]} as unknown as DocumentNode<OverviewDataQuery, OverviewDataQueryVariables>;
export const DashboardUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DashboardUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"NavigationSection_UserFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserSection_UserFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RoleBasedView_UserFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NavigationSection_UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"activeProfileType"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserSection_UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"activeProfileType"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoleBasedView_UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"activeProfileType"}}]}}]} as unknown as DocumentNode<DashboardUserQuery, DashboardUserQueryVariables>;
export const SendMessageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendMessage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SendMessageInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendMessage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"senderUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ForbiddenError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<SendMessageMutation, SendMessageMutationVariables>;
export const MarkConversationReadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MarkConversationRead"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MarkConversationReadInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"markConversationRead"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"participant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lastReadAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ForbiddenError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<MarkConversationReadMutation, MarkConversationReadMutationVariables>;
export const LoadEarlierMessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LoadEarlierMessages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messagesByConversation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"conversationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"IntValue","value":"50"}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"ASC"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"senderUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}}]}}]} as unknown as DocumentNode<LoadEarlierMessagesQuery, LoadEarlierMessagesQueryVariables>;
export const NotifyTypingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"NotifyTyping"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NotifyTypingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notifyTyping"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}}]}}]}}]} as unknown as DocumentNode<NotifyTypingMutation, NotifyTypingMutationVariables>;
export const OnMessageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"OnMessage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onMessage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"conversationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"senderUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}}]} as unknown as DocumentNode<OnMessageSubscription, OnMessageSubscriptionVariables>;
export const OnTypingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"OnTyping"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onTyping"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"conversationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"conversationId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"userAvatar"}},{"kind":"Field","name":{"kind":"Name","value":"isTyping"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}}]} as unknown as DocumentNode<OnTypingSubscription, OnTypingSubscriptionVariables>;
export const MessagesDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MessagesData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"myConversations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"50"}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"updatedAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ConversationItem_ConversationFragment"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"unreadConversationsCount"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ConversationItem_ConversationFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Conversation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"booking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"participants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lastReadAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"messages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1"}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"senderUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]} as unknown as DocumentNode<MessagesDataQuery, MessagesDataQueryVariables>;
export const ThreadDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ThreadData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"myConversations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"50"}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"updatedAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ConversationItem_ConversationFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ThreadHeader_ConversationFragment"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"unreadConversationsCount"}},{"kind":"Field","name":{"kind":"Name","value":"messagesByConversation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"conversationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"50"}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"ASC"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MessageBubble_MessageFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ConversationItem_ConversationFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Conversation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"booking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"participants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lastReadAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"messages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1"}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"senderUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ThreadHeader_ConversationFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Conversation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"booking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerDay"}},{"kind":"Field","name":{"kind":"Name","value":"totalDays"}},{"kind":"Field","name":{"kind":"Name","value":"installationFee"}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MessageBubble_MessageFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Message"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"senderUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]} as unknown as DocumentNode<ThreadDataQuery, ThreadDataQueryVariables>;
export const OnNotificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"OnNotification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onNotification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"isRead"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}}]}}]}}]} as unknown as DocumentNode<OnNotificationSubscription, OnNotificationSubscriptionVariables>;
export const MarkNotificationReadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MarkNotificationRead"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MarkNotificationReadInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"markNotificationRead"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isRead"}},{"kind":"Field","name":{"kind":"Name","value":"readAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<MarkNotificationReadMutation, MarkNotificationReadMutationVariables>;
export const MarkAllNotificationsReadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MarkAllNotificationsRead"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"markAllNotificationsRead"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]} as unknown as DocumentNode<MarkAllNotificationsReadMutation, MarkAllNotificationsReadMutationVariables>;
export const DeleteNotificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteNotification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteNotificationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteNotification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteNotificationMutation, DeleteNotificationMutationVariables>;
export const LoadMoreNotificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LoadMoreNotifications"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isRead"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myNotifications"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"20"}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"and"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"isRead"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isRead"}}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"type"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}]}}]}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"isRead"}},{"kind":"Field","name":{"kind":"Name","value":"readAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}}]}}]}}]} as unknown as DocumentNode<LoadMoreNotificationsQuery, LoadMoreNotificationsQueryVariables>;
export const NotificationsPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"NotificationsPage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"myNotifications"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"20"}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"isRead"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"readAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"unreadNotificationsCount"}}]}}]} as unknown as DocumentNode<NotificationsPageQuery, NotificationsPageQueryVariables>;
export const ProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProfileLayout_UserFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Info_UserFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"About_UserFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Activity_UserFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfileLayout_UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Info_UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"activeProfileType"}},{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"spaces"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"averageRating"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"reviews"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"10"}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"advertiserProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"totalSpend"}},{"kind":"Field","name":{"kind":"Name","value":"campaigns"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"10"}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"About_UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"activeProfileType"}},{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"businessName"}},{"kind":"Field","name":{"kind":"Name","value":"businessType"}},{"kind":"Field","name":{"kind":"Name","value":"onboardingComplete"}},{"kind":"Field","name":{"kind":"Name","value":"responseRate"}},{"kind":"Field","name":{"kind":"Name","value":"averageResponseTime"}},{"kind":"Field","name":{"kind":"Name","value":"spaces"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"advertiserProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"companyName"}},{"kind":"Field","name":{"kind":"Name","value":"industry"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"onboardingComplete"}},{"kind":"Field","name":{"kind":"Name","value":"campaigns"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"10"}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Activity_UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"activeProfileType"}},{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reviews"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"10"}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"reviewer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"companyName"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"advertiserProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"campaigns"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"10"}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"totalSpend"}},{"kind":"Field","name":{"kind":"Name","value":"spacesCount"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ProfileQuery, ProfileQueryVariables>;
export const SettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastLoginAt"}},{"kind":"Field","name":{"kind":"Name","value":"activeProfileType"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"SettingsLayout_UserFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProfileSettings_UserFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"BusinessSettings_UserFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PayoutSettings_UserFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AccountSettings_UserFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"myNotificationPreferences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"notificationType"}},{"kind":"Field","name":{"kind":"Name","value":"inAppEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"emailEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"pushEnabled"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SettingsLayout_UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfileSettings_UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"activeProfileType"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BusinessSettings_UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activeProfileType"}},{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"businessName"}},{"kind":"Field","name":{"kind":"Name","value":"businessType"}},{"kind":"Field","name":{"kind":"Name","value":"payoutSchedule"}}]}},{"kind":"Field","name":{"kind":"Name","value":"advertiserProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"companyName"}},{"kind":"Field","name":{"kind":"Name","value":"industry"}},{"kind":"Field","name":{"kind":"Name","value":"website"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayoutSettings_UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activeProfileType"}},{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stripeAccountId"}},{"kind":"Field","name":{"kind":"Name","value":"stripeAccountStatus"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AccountSettings_UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastLoginAt"}},{"kind":"Field","name":{"kind":"Name","value":"activeProfileType"}}]}}]} as unknown as DocumentNode<SettingsQuery, SettingsQueryVariables>;
export const GetSavedPaymentMethodsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSavedPaymentMethods"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mySavedPaymentMethods"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"last4"}},{"kind":"Field","name":{"kind":"Name","value":"expMonth"}},{"kind":"Field","name":{"kind":"Name","value":"expYear"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<GetSavedPaymentMethodsQuery, GetSavedPaymentMethodsQueryVariables>;
export const GetCurrentUserForSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCurrentUserForSettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"advertiserProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<GetCurrentUserForSettingsQuery, GetCurrentUserForSettingsQueryVariables>;
export const UpdateUserProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUserProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCurrentUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCurrentUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>;
export const UpdateSpaceOwnerBusinessInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSpaceOwnerBusinessInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateSpaceOwnerProfileInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSpaceOwnerProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateSpaceOwnerBusinessInfoMutation, UpdateSpaceOwnerBusinessInfoMutationVariables>;
export const UpdateAdvertiserBusinessInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateAdvertiserBusinessInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateAdvertiserProfileInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateAdvertiserProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"advertiserProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateAdvertiserBusinessInfoMutation, UpdateAdvertiserBusinessInfoMutationVariables>;
export const UpdateNotificationPreferenceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateNotificationPreference"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateNotificationPreferenceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateNotificationPreference"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"preference"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"notificationType"}},{"kind":"Field","name":{"kind":"Name","value":"inAppEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"emailEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"pushEnabled"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateNotificationPreferenceMutation, UpdateNotificationPreferenceMutationVariables>;
export const ConnectStripeAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ConnectStripeAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"connectStripeAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"onboardingUrl"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ConnectStripeAccountMutation, ConnectStripeAccountMutationVariables>;
export const DisconnectStripeAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DisconnectStripeAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disconnectStripeAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stripeAccountId"}},{"kind":"Field","name":{"kind":"Name","value":"stripeAccountStatus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DisconnectStripeAccountMutation, DisconnectStripeAccountMutationVariables>;
export const RefreshStripeAccountStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RefreshStripeAccountStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshStripeAccountStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stripeAccountStatus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<RefreshStripeAccountStatusMutation, RefreshStripeAccountStatusMutationVariables>;
export const DeleteMyAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteMyAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteMyAccountInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteMyAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DeleteMyAccountMutation, DeleteMyAccountMutationVariables>;
export const UpdateUserAvatarDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUserAvatar"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCurrentUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCurrentUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateUserAvatarMutation, UpdateUserAvatarMutationVariables>;
export const ChangePasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ChangePassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChangePasswordInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changePassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const CreateSetupIntentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSetupIntent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSetupIntent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clientSecret"}},{"kind":"Field","name":{"kind":"Name","value":"setupIntentId"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateSetupIntentMutation, CreateSetupIntentMutationVariables>;
export const ConfirmSetupIntentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ConfirmSetupIntent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ConfirmSetupIntentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"confirmSetupIntent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paymentMethod"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ConfirmSetupIntentMutation, ConfirmSetupIntentMutationVariables>;
export const SetDefaultPaymentMethodDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetDefaultPaymentMethod"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SetDefaultPaymentMethodInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setDefaultPaymentMethod"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paymentMethod"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<SetDefaultPaymentMethodMutation, SetDefaultPaymentMethodMutationVariables>;
export const DeletePaymentMethodDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeletePaymentMethod"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeletePaymentMethodInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePaymentMethod"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DeletePaymentMethodMutation, DeletePaymentMethodMutationVariables>;
export const SharedSpaceDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SharedSpaceDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spaceById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Header_SharedSpaceFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Gallery_SharedSpaceFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"SpaceInfo_SpaceFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PricingCard_SpaceFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"OwnerCard_SpaceFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Header_SharedSpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Gallery_SharedSpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"images"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SpaceInfo_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"dimensionsText"}},{"kind":"Field","name":{"kind":"Name","value":"traffic"}},{"kind":"Field","name":{"kind":"Name","value":"availableFrom"}},{"kind":"Field","name":{"kind":"Name","value":"availableTo"}},{"kind":"Field","name":{"kind":"Name","value":"averageRating"}},{"kind":"Field","name":{"kind":"Name","value":"totalBookings"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PricingCard_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pricePerDay"}},{"kind":"Field","name":{"kind":"Name","value":"installationFee"}},{"kind":"Field","name":{"kind":"Name","value":"minDuration"}},{"kind":"Field","name":{"kind":"Name","value":"maxDuration"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OwnerCard_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"businessName"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}}]} as unknown as DocumentNode<SharedSpaceDetailQuery, SharedSpaceDetailQueryVariables>;
export const SwitchProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SwitchProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCurrentUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCurrentUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"activeProfileType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<SwitchProfileMutation, SwitchProfileMutationVariables>;