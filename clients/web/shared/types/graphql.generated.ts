export type Maybe<T> = T | undefined | null;
export type InputMaybe<T> = T | undefined | null;
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
  DateTime: { input: unknown; output: unknown; }
  Decimal: { input: unknown; output: unknown; }
  JSON: { input: unknown; output: unknown; }
};

export type AdvertiserProfile = {
  __typename: 'AdvertiserProfile';
  companyName: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  industry: Maybe<Scalars['String']['output']>;
  stripeCustomerId: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  user: User;
  userId: Scalars['String']['output'];
  website: Maybe<Scalars['String']['output']>;
};

export type AdvertiserProfileFilterInput = {
  and?: InputMaybe<Array<AdvertiserProfileFilterInput>>;
  companyName?: InputMaybe<StringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  industry?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<AdvertiserProfileFilterInput>>;
  stripeCustomerId?: InputMaybe<StringOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  user?: InputMaybe<UserFilterInput>;
  userId?: InputMaybe<StringOperationFilterInput>;
  website?: InputMaybe<StringOperationFilterInput>;
};

export type AdvertiserProfileSortInput = {
  companyName?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  industry?: InputMaybe<SortEnumType>;
  stripeCustomerId?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
  user?: InputMaybe<UserSortInput>;
  userId?: InputMaybe<SortEnumType>;
  website?: InputMaybe<SortEnumType>;
};

export type Booking = {
  __typename: 'Booking';
  adminNotes: Maybe<Scalars['String']['output']>;
  advertiserNotes: Maybe<Scalars['String']['output']>;
  balanceAmount: Maybe<Scalars['Decimal']['output']>;
  balanceChargeAttempts: Scalars['Int']['output'];
  balanceChargeError: Maybe<Scalars['String']['output']>;
  balanceChargeId: Maybe<Scalars['String']['output']>;
  balanceDueDate: Maybe<Scalars['DateTime']['output']>;
  balancePaidAt: Maybe<Scalars['DateTime']['output']>;
  balanceStripeChargeId: Maybe<Scalars['String']['output']>;
  campaign: Campaign;
  campaignId: Scalars['String']['output'];
  cancellationReason: Maybe<Scalars['String']['output']>;
  cancelledAt: Maybe<Scalars['DateTime']['output']>;
  cancelledBy: Maybe<Scalars['String']['output']>;
  checkpointTransferIds: Array<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  depositAmount: Maybe<Scalars['Decimal']['output']>;
  depositChargeId: Maybe<Scalars['String']['output']>;
  depositPaidAt: Maybe<Scalars['DateTime']['output']>;
  depositStripeChargeId: Maybe<Scalars['String']['output']>;
  disputePhotos: Array<Scalars['String']['output']>;
  disputeReason: Maybe<Scalars['String']['output']>;
  disputeType: Maybe<DisputeIssueType>;
  disputedAt: Maybe<Scalars['DateTime']['output']>;
  disputedBy: Maybe<Scalars['String']['output']>;
  endDate: Scalars['DateTime']['output'];
  finalPayoutAmount: Maybe<Scalars['Decimal']['output']>;
  finalPayoutDate: Maybe<Scalars['DateTime']['output']>;
  finalPayoutProcessed: Scalars['Boolean']['output'];
  finalTransferId: Maybe<Scalars['String']['output']>;
  finalTransferredAt: Maybe<Scalars['DateTime']['output']>;
  firstPayoutAmount: Maybe<Scalars['Decimal']['output']>;
  firstPayoutDate: Maybe<Scalars['DateTime']['output']>;
  firstPayoutProcessed: Scalars['Boolean']['output'];
  firstRentalTransferId: Maybe<Scalars['String']['output']>;
  firstRentalTransferredAt: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  installationFeeTransferId: Maybe<Scalars['String']['output']>;
  installationFeeTransferredAt: Maybe<Scalars['DateTime']['output']>;
  isTestData: Scalars['Boolean']['output'];
  lastBalanceChargeAttempt: Maybe<Scalars['DateTime']['output']>;
  lastPayoutAttempt: Maybe<Scalars['DateTime']['output']>;
  messages: Array<Message>;
  missedVerifications: Scalars['Int']['output'];
  nextVerificationDue: Maybe<Scalars['DateTime']['output']>;
  ownerNotes: Maybe<Scalars['String']['output']>;
  paidAt: Maybe<Scalars['DateTime']['output']>;
  paymentType: PaymentType;
  payoutAttempts: Scalars['Int']['output'];
  payoutError: Maybe<Scalars['String']['output']>;
  payoutProcessedAt: Maybe<Scalars['DateTime']['output']>;
  payoutStatus: Maybe<PayoutStatus>;
  pendingPayoutReason: Maybe<Scalars['String']['output']>;
  platformFee: Scalars['Decimal']['output'];
  pricePerDay: Scalars['Decimal']['output'];
  proofApprovedAt: Maybe<Scalars['DateTime']['output']>;
  proofApprovedBy: Maybe<Scalars['String']['output']>;
  proofMessageId: Maybe<Scalars['String']['output']>;
  proofPhotos: Array<Scalars['String']['output']>;
  proofStatus: Maybe<ProofStatus>;
  proofUploadedAt: Maybe<Scalars['DateTime']['output']>;
  qualityGuaranteePeriod: Maybe<Scalars['DateTime']['output']>;
  refundAmount: Maybe<Scalars['Decimal']['output']>;
  refundHistory: Maybe<JsonDocument>;
  refundProcessedAt: Maybe<Scalars['DateTime']['output']>;
  refundedAt: Maybe<Scalars['DateTime']['output']>;
  reservedUntil: Maybe<Scalars['DateTime']['output']>;
  resolutionAction: Maybe<Scalars['String']['output']>;
  resolutionNotes: Maybe<Scalars['String']['output']>;
  resolvedAt: Maybe<Scalars['DateTime']['output']>;
  resolvedBy: Maybe<Scalars['String']['output']>;
  review: Maybe<Review>;
  space: Space;
  spaceId: Scalars['String']['output'];
  spaceOwnerAmount: Scalars['Decimal']['output'];
  startDate: Scalars['DateTime']['output'];
  status: BookingStatus;
  stripeChargeId: Maybe<Scalars['String']['output']>;
  stripeFee: Maybe<Scalars['Decimal']['output']>;
  stripePaymentIntentId: Maybe<Scalars['String']['output']>;
  stripeRefundId: Maybe<Scalars['String']['output']>;
  stripeTransferId: Maybe<Scalars['String']['output']>;
  totalAmount: Scalars['Decimal']['output'];
  totalDays: Scalars['Int']['output'];
  totalWithFees: Maybe<Scalars['Decimal']['output']>;
  transferAmount: Maybe<Scalars['Decimal']['output']>;
  transferredAt: Maybe<Scalars['DateTime']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  verificationPhotos: Maybe<JsonDocument>;
  verificationSchedule: Maybe<JsonDocument>;
};

export type BookingFilterInput = {
  adminNotes?: InputMaybe<StringOperationFilterInput>;
  advertiserNotes?: InputMaybe<StringOperationFilterInput>;
  and?: InputMaybe<Array<BookingFilterInput>>;
  balanceAmount?: InputMaybe<DecimalOperationFilterInput>;
  balanceChargeAttempts?: InputMaybe<IntOperationFilterInput>;
  balanceChargeError?: InputMaybe<StringOperationFilterInput>;
  balanceChargeId?: InputMaybe<StringOperationFilterInput>;
  balanceDueDate?: InputMaybe<DateTimeOperationFilterInput>;
  balancePaidAt?: InputMaybe<DateTimeOperationFilterInput>;
  balanceStripeChargeId?: InputMaybe<StringOperationFilterInput>;
  campaign?: InputMaybe<CampaignFilterInput>;
  campaignId?: InputMaybe<StringOperationFilterInput>;
  cancellationReason?: InputMaybe<StringOperationFilterInput>;
  cancelledAt?: InputMaybe<DateTimeOperationFilterInput>;
  cancelledBy?: InputMaybe<StringOperationFilterInput>;
  checkpointTransferIds?: InputMaybe<ListStringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  depositAmount?: InputMaybe<DecimalOperationFilterInput>;
  depositChargeId?: InputMaybe<StringOperationFilterInput>;
  depositPaidAt?: InputMaybe<DateTimeOperationFilterInput>;
  depositStripeChargeId?: InputMaybe<StringOperationFilterInput>;
  disputePhotos?: InputMaybe<ListStringOperationFilterInput>;
  disputeReason?: InputMaybe<StringOperationFilterInput>;
  disputeType?: InputMaybe<NullableOfDisputeIssueTypeOperationFilterInput>;
  disputedAt?: InputMaybe<DateTimeOperationFilterInput>;
  disputedBy?: InputMaybe<StringOperationFilterInput>;
  endDate?: InputMaybe<DateTimeOperationFilterInput>;
  finalPayoutAmount?: InputMaybe<DecimalOperationFilterInput>;
  finalPayoutDate?: InputMaybe<DateTimeOperationFilterInput>;
  finalPayoutProcessed?: InputMaybe<BooleanOperationFilterInput>;
  finalTransferId?: InputMaybe<StringOperationFilterInput>;
  finalTransferredAt?: InputMaybe<DateTimeOperationFilterInput>;
  firstPayoutAmount?: InputMaybe<DecimalOperationFilterInput>;
  firstPayoutDate?: InputMaybe<DateTimeOperationFilterInput>;
  firstPayoutProcessed?: InputMaybe<BooleanOperationFilterInput>;
  firstRentalTransferId?: InputMaybe<StringOperationFilterInput>;
  firstRentalTransferredAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  installationFeeTransferId?: InputMaybe<StringOperationFilterInput>;
  installationFeeTransferredAt?: InputMaybe<DateTimeOperationFilterInput>;
  isTestData?: InputMaybe<BooleanOperationFilterInput>;
  lastBalanceChargeAttempt?: InputMaybe<DateTimeOperationFilterInput>;
  lastPayoutAttempt?: InputMaybe<DateTimeOperationFilterInput>;
  messages?: InputMaybe<ListFilterInputTypeOfMessageFilterInput>;
  missedVerifications?: InputMaybe<IntOperationFilterInput>;
  nextVerificationDue?: InputMaybe<DateTimeOperationFilterInput>;
  or?: InputMaybe<Array<BookingFilterInput>>;
  ownerNotes?: InputMaybe<StringOperationFilterInput>;
  paidAt?: InputMaybe<DateTimeOperationFilterInput>;
  paymentType?: InputMaybe<PaymentTypeOperationFilterInput>;
  payoutAttempts?: InputMaybe<IntOperationFilterInput>;
  payoutError?: InputMaybe<StringOperationFilterInput>;
  payoutProcessedAt?: InputMaybe<DateTimeOperationFilterInput>;
  payoutStatus?: InputMaybe<NullableOfPayoutStatusOperationFilterInput>;
  pendingPayoutReason?: InputMaybe<StringOperationFilterInput>;
  platformFee?: InputMaybe<DecimalOperationFilterInput>;
  pricePerDay?: InputMaybe<DecimalOperationFilterInput>;
  proofApprovedAt?: InputMaybe<DateTimeOperationFilterInput>;
  proofApprovedBy?: InputMaybe<StringOperationFilterInput>;
  proofMessageId?: InputMaybe<StringOperationFilterInput>;
  proofPhotos?: InputMaybe<ListStringOperationFilterInput>;
  proofStatus?: InputMaybe<NullableOfProofStatusOperationFilterInput>;
  proofUploadedAt?: InputMaybe<DateTimeOperationFilterInput>;
  qualityGuaranteePeriod?: InputMaybe<DateTimeOperationFilterInput>;
  refundAmount?: InputMaybe<DecimalOperationFilterInput>;
  refundHistory?: InputMaybe<JsonDocumentFilterInput>;
  refundProcessedAt?: InputMaybe<DateTimeOperationFilterInput>;
  refundedAt?: InputMaybe<DateTimeOperationFilterInput>;
  reservedUntil?: InputMaybe<DateTimeOperationFilterInput>;
  resolutionAction?: InputMaybe<StringOperationFilterInput>;
  resolutionNotes?: InputMaybe<StringOperationFilterInput>;
  resolvedAt?: InputMaybe<DateTimeOperationFilterInput>;
  resolvedBy?: InputMaybe<StringOperationFilterInput>;
  review?: InputMaybe<ReviewFilterInput>;
  space?: InputMaybe<SpaceFilterInput>;
  spaceId?: InputMaybe<StringOperationFilterInput>;
  spaceOwnerAmount?: InputMaybe<DecimalOperationFilterInput>;
  startDate?: InputMaybe<DateTimeOperationFilterInput>;
  status?: InputMaybe<BookingStatusOperationFilterInput>;
  stripeChargeId?: InputMaybe<StringOperationFilterInput>;
  stripeFee?: InputMaybe<DecimalOperationFilterInput>;
  stripePaymentIntentId?: InputMaybe<StringOperationFilterInput>;
  stripeRefundId?: InputMaybe<StringOperationFilterInput>;
  stripeTransferId?: InputMaybe<StringOperationFilterInput>;
  totalAmount?: InputMaybe<DecimalOperationFilterInput>;
  totalDays?: InputMaybe<IntOperationFilterInput>;
  totalWithFees?: InputMaybe<DecimalOperationFilterInput>;
  transferAmount?: InputMaybe<DecimalOperationFilterInput>;
  transferredAt?: InputMaybe<DateTimeOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  verificationPhotos?: InputMaybe<JsonDocumentFilterInput>;
  verificationSchedule?: InputMaybe<JsonDocumentFilterInput>;
};

export enum BookingStatus {
  Active = 'ACTIVE',
  Approved = 'APPROVED',
  AwaitingProof = 'AWAITING_PROOF',
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Confirmed = 'CONFIRMED',
  Disputed = 'DISPUTED',
  PendingApproval = 'PENDING_APPROVAL',
  PendingBalance = 'PENDING_BALANCE',
  Rejected = 'REJECTED'
}

export type BookingStatusOperationFilterInput = {
  eq?: InputMaybe<BookingStatus>;
  in?: InputMaybe<Array<BookingStatus>>;
  neq?: InputMaybe<BookingStatus>;
  nin?: InputMaybe<Array<BookingStatus>>;
};

export type BooleanOperationFilterInput = {
  eq?: InputMaybe<Scalars['Boolean']['input']>;
  neq?: InputMaybe<Scalars['Boolean']['input']>;
};

export enum BugCategory {
  Authentication = 'AUTHENTICATION',
  Booking = 'BOOKING',
  Campaign = 'CAMPAIGN',
  DataIntegrity = 'DATA_INTEGRITY',
  Messaging = 'MESSAGING',
  Notifications = 'NOTIFICATIONS',
  Other = 'OTHER',
  Payment = 'PAYMENT',
  Performance = 'PERFORMANCE',
  SpaceManagement = 'SPACE_MANAGEMENT',
  UiUx = 'UI_UX'
}

export type BugCategoryOperationFilterInput = {
  eq?: InputMaybe<BugCategory>;
  in?: InputMaybe<Array<BugCategory>>;
  neq?: InputMaybe<BugCategory>;
  nin?: InputMaybe<Array<BugCategory>>;
};

export type BugReport = {
  __typename: 'BugReport';
  adminNotes: Maybe<Scalars['String']['output']>;
  category: BugCategory;
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['String']['output'];
  linkedBugId: Maybe<Scalars['String']['output']>;
  pageUrl: Maybe<Scalars['String']['output']>;
  processedAt: Maybe<Scalars['DateTime']['output']>;
  processedBy: Maybe<Scalars['String']['output']>;
  screenshots: Array<Scalars['String']['output']>;
  severity: BugSeverity;
  status: BugStatus;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: Maybe<User>;
  userAgent: Maybe<Scalars['String']['output']>;
  userId: Maybe<Scalars['String']['output']>;
};

export type BugReportFilterInput = {
  adminNotes?: InputMaybe<StringOperationFilterInput>;
  and?: InputMaybe<Array<BugReportFilterInput>>;
  category?: InputMaybe<BugCategoryOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  linkedBugId?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<BugReportFilterInput>>;
  pageUrl?: InputMaybe<StringOperationFilterInput>;
  processedAt?: InputMaybe<DateTimeOperationFilterInput>;
  processedBy?: InputMaybe<StringOperationFilterInput>;
  screenshots?: InputMaybe<ListStringOperationFilterInput>;
  severity?: InputMaybe<BugSeverityOperationFilterInput>;
  status?: InputMaybe<BugStatusOperationFilterInput>;
  title?: InputMaybe<StringOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  user?: InputMaybe<UserFilterInput>;
  userAgent?: InputMaybe<StringOperationFilterInput>;
  userId?: InputMaybe<StringOperationFilterInput>;
};

export enum BugSeverity {
  Critical = 'CRITICAL',
  High = 'HIGH',
  Low = 'LOW',
  Medium = 'MEDIUM'
}

export type BugSeverityOperationFilterInput = {
  eq?: InputMaybe<BugSeverity>;
  in?: InputMaybe<Array<BugSeverity>>;
  neq?: InputMaybe<BugSeverity>;
  nin?: InputMaybe<Array<BugSeverity>>;
};

export enum BugStatus {
  Confirmed = 'CONFIRMED',
  Duplicate = 'DUPLICATE',
  Fixed = 'FIXED',
  InProgress = 'IN_PROGRESS',
  New = 'NEW',
  WontFix = 'WONT_FIX'
}

export type BugStatusOperationFilterInput = {
  eq?: InputMaybe<BugStatus>;
  in?: InputMaybe<Array<BugStatus>>;
  neq?: InputMaybe<BugStatus>;
  nin?: InputMaybe<Array<BugStatus>>;
};

export type Campaign = {
  __typename: 'Campaign';
  advertiser: User;
  advertiserId: Scalars['String']['output'];
  bookings: Array<Booking>;
  createdAt: Scalars['DateTime']['output'];
  description: Maybe<Scalars['String']['output']>;
  endDate: Maybe<Scalars['DateTime']['output']>;
  goals: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  imageUrl: Scalars['String']['output'];
  messages: Array<Message>;
  name: Scalars['String']['output'];
  startDate: Maybe<Scalars['DateTime']['output']>;
  status: CampaignStatus;
  targetAudience: Maybe<Scalars['String']['output']>;
  totalBudget: Maybe<Scalars['Decimal']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type CampaignFilterInput = {
  advertiser?: InputMaybe<UserFilterInput>;
  advertiserId?: InputMaybe<StringOperationFilterInput>;
  and?: InputMaybe<Array<CampaignFilterInput>>;
  bookings?: InputMaybe<ListFilterInputTypeOfBookingFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
  endDate?: InputMaybe<DateTimeOperationFilterInput>;
  goals?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  imageUrl?: InputMaybe<StringOperationFilterInput>;
  messages?: InputMaybe<ListFilterInputTypeOfMessageFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<CampaignFilterInput>>;
  startDate?: InputMaybe<DateTimeOperationFilterInput>;
  status?: InputMaybe<CampaignStatusOperationFilterInput>;
  targetAudience?: InputMaybe<StringOperationFilterInput>;
  totalBudget?: InputMaybe<DecimalOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
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
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
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
  space: Maybe<Space>;
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

export type DeleteSpaceInput = {
  id: Scalars['ID']['input'];
};

export type DeleteSpacePayload = {
  __typename: 'DeleteSpacePayload';
  space: Maybe<Space>;
};

export type DeviceSession = {
  __typename: 'DeviceSession';
  current: Scalars['Boolean']['output'];
  device: Scalars['String']['output'];
  id: Scalars['String']['output'];
  lastActive: Scalars['DateTime']['output'];
  location: Scalars['String']['output'];
};

export enum DisputeIssueType {
  DamageToCreative = 'DAMAGE_TO_CREATIVE',
  MisleadingListing = 'MISLEADING_LISTING',
  NotVisible = 'NOT_VISIBLE',
  PoorQuality = 'POOR_QUALITY',
  SafetyIssue = 'SAFETY_ISSUE',
  WrongLocation = 'WRONG_LOCATION'
}

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

export type JsonDocument = {
  __typename: 'JsonDocument';
  rootElement: Scalars['JSON']['output'];
};

export type JsonDocumentFilterInput = {
  and?: InputMaybe<Array<JsonDocumentFilterInput>>;
  or?: InputMaybe<Array<JsonDocumentFilterInput>>;
  rootElement?: InputMaybe<JsonElementFilterInput>;
};

export type JsonElementFilterInput = {
  and?: InputMaybe<Array<JsonElementFilterInput>>;
  or?: InputMaybe<Array<JsonElementFilterInput>>;
  valueKind?: InputMaybe<JsonValueKindOperationFilterInput>;
};

export enum JsonValueKind {
  Array = 'ARRAY',
  False = 'FALSE',
  Null = 'NULL',
  Number = 'NUMBER',
  Object = 'OBJECT',
  String = 'STRING',
  True = 'TRUE',
  Undefined = 'UNDEFINED'
}

export type JsonValueKindOperationFilterInput = {
  eq?: InputMaybe<JsonValueKind>;
  in?: InputMaybe<Array<JsonValueKind>>;
  neq?: InputMaybe<JsonValueKind>;
  nin?: InputMaybe<Array<JsonValueKind>>;
};

export type ListFilterInputTypeOfBookingFilterInput = {
  all?: InputMaybe<BookingFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<BookingFilterInput>;
  some?: InputMaybe<BookingFilterInput>;
};

export type ListFilterInputTypeOfBugReportFilterInput = {
  all?: InputMaybe<BugReportFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<BugReportFilterInput>;
  some?: InputMaybe<BugReportFilterInput>;
};

export type ListFilterInputTypeOfCampaignFilterInput = {
  all?: InputMaybe<CampaignFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<CampaignFilterInput>;
  some?: InputMaybe<CampaignFilterInput>;
};

export type ListFilterInputTypeOfMessageFilterInput = {
  all?: InputMaybe<MessageFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<MessageFilterInput>;
  some?: InputMaybe<MessageFilterInput>;
};

export type ListFilterInputTypeOfNotificationFilterInput = {
  all?: InputMaybe<NotificationFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<NotificationFilterInput>;
  some?: InputMaybe<NotificationFilterInput>;
};

export type ListFilterInputTypeOfReviewFilterInput = {
  all?: InputMaybe<ReviewFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<ReviewFilterInput>;
  some?: InputMaybe<ReviewFilterInput>;
};

export type ListFilterInputTypeOfSpaceFilterInput = {
  all?: InputMaybe<SpaceFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<SpaceFilterInput>;
  some?: InputMaybe<SpaceFilterInput>;
};

export type ListStringOperationFilterInput = {
  all?: InputMaybe<StringOperationFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<StringOperationFilterInput>;
  some?: InputMaybe<StringOperationFilterInput>;
};

export type Message = {
  __typename: 'Message';
  attachments: Array<Scalars['String']['output']>;
  attemptedResolution: Maybe<Scalars['String']['output']>;
  autoApprovedAt: Maybe<Scalars['DateTime']['output']>;
  booking: Maybe<Booking>;
  bookingId: Maybe<Scalars['String']['output']>;
  campaign: Campaign;
  campaignId: Scalars['String']['output'];
  content: Scalars['String']['output'];
  correctionDetails: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  disputeReason: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isRead: Scalars['Boolean']['output'];
  issueType: Maybe<DisputeIssueType>;
  messageType: MessageType;
  proofApprovedAt: Maybe<Scalars['DateTime']['output']>;
  proofApprovedBy: Maybe<Scalars['String']['output']>;
  proofDisputedAt: Maybe<Scalars['DateTime']['output']>;
  proofStatus: Maybe<ProofStatus>;
  sender: User;
  senderId: Scalars['String']['output'];
};

export type MessageFilterInput = {
  and?: InputMaybe<Array<MessageFilterInput>>;
  attachments?: InputMaybe<ListStringOperationFilterInput>;
  attemptedResolution?: InputMaybe<StringOperationFilterInput>;
  autoApprovedAt?: InputMaybe<DateTimeOperationFilterInput>;
  booking?: InputMaybe<BookingFilterInput>;
  bookingId?: InputMaybe<StringOperationFilterInput>;
  campaign?: InputMaybe<CampaignFilterInput>;
  campaignId?: InputMaybe<StringOperationFilterInput>;
  content?: InputMaybe<StringOperationFilterInput>;
  correctionDetails?: InputMaybe<StringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  disputeReason?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  isRead?: InputMaybe<BooleanOperationFilterInput>;
  issueType?: InputMaybe<NullableOfDisputeIssueTypeOperationFilterInput>;
  messageType?: InputMaybe<MessageTypeOperationFilterInput>;
  or?: InputMaybe<Array<MessageFilterInput>>;
  proofApprovedAt?: InputMaybe<DateTimeOperationFilterInput>;
  proofApprovedBy?: InputMaybe<StringOperationFilterInput>;
  proofDisputedAt?: InputMaybe<DateTimeOperationFilterInput>;
  proofStatus?: InputMaybe<NullableOfProofStatusOperationFilterInput>;
  sender?: InputMaybe<UserFilterInput>;
  senderId?: InputMaybe<StringOperationFilterInput>;
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

export type Mutation = {
  __typename: 'Mutation';
  createSpace: CreateSpacePayload;
  deleteSpace: DeleteSpacePayload;
};


export type MutationCreateSpaceArgs = {
  input: CreateSpaceInput;
};


export type MutationDeleteSpaceArgs = {
  input: DeleteSpaceInput;
};

export type Notification = {
  __typename: 'Notification';
  bookingId: Maybe<Scalars['String']['output']>;
  campaignId: Maybe<Scalars['String']['output']>;
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  isRead: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
  type: NotificationType;
  user: User;
  userId: Scalars['String']['output'];
};

export type NotificationFilterInput = {
  and?: InputMaybe<Array<NotificationFilterInput>>;
  bookingId?: InputMaybe<StringOperationFilterInput>;
  campaignId?: InputMaybe<StringOperationFilterInput>;
  content?: InputMaybe<StringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  isRead?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<NotificationFilterInput>>;
  title?: InputMaybe<StringOperationFilterInput>;
  type?: InputMaybe<NotificationTypeOperationFilterInput>;
  user?: InputMaybe<UserFilterInput>;
  userId?: InputMaybe<StringOperationFilterInput>;
};

export type NotificationSettings = {
  __typename: 'NotificationSettings';
  bookingApprovals: Scalars['Boolean']['output'];
  bookingRequests: Scalars['Boolean']['output'];
  campaignUpdates: Scalars['Boolean']['output'];
  emailDigest: Scalars['String']['output'];
  marketingEmails: Scalars['Boolean']['output'];
  paymentReceipts: Scalars['Boolean']['output'];
  systemNotifications: Scalars['Boolean']['output'];
};

export enum NotificationType {
  BookingApproved = 'BOOKING_APPROVED',
  BookingCancelled = 'BOOKING_CANCELLED',
  BookingRejected = 'BOOKING_REJECTED',
  BookingRequested = 'BOOKING_REQUESTED',
  DisputeFiled = 'DISPUTE_FILED',
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

export type NullableOfDisputeIssueTypeOperationFilterInput = {
  eq?: InputMaybe<DisputeIssueType>;
  in?: InputMaybe<Array<InputMaybe<DisputeIssueType>>>;
  neq?: InputMaybe<DisputeIssueType>;
  nin?: InputMaybe<Array<InputMaybe<DisputeIssueType>>>;
};

export type NullableOfPayoutStatusOperationFilterInput = {
  eq?: InputMaybe<PayoutStatus>;
  in?: InputMaybe<Array<InputMaybe<PayoutStatus>>>;
  neq?: InputMaybe<PayoutStatus>;
  nin?: InputMaybe<Array<InputMaybe<PayoutStatus>>>;
};

export type NullableOfProofStatusOperationFilterInput = {
  eq?: InputMaybe<ProofStatus>;
  in?: InputMaybe<Array<InputMaybe<ProofStatus>>>;
  neq?: InputMaybe<ProofStatus>;
  nin?: InputMaybe<Array<InputMaybe<ProofStatus>>>;
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

export enum PaymentType {
  Deposit = 'DEPOSIT',
  Immediate = 'IMMEDIATE'
}

export type PaymentTypeOperationFilterInput = {
  eq?: InputMaybe<PaymentType>;
  in?: InputMaybe<Array<PaymentType>>;
  neq?: InputMaybe<PaymentType>;
  nin?: InputMaybe<Array<PaymentType>>;
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

export enum PayoutStatus {
  Completed = 'COMPLETED',
  Failed = 'FAILED',
  PartiallyPaid = 'PARTIALLY_PAID',
  Pending = 'PENDING',
  Processing = 'PROCESSING'
}

export enum ProofStatus {
  Approved = 'APPROVED',
  CorrectionRequested = 'CORRECTION_REQUESTED',
  Disputed = 'DISPUTED',
  Pending = 'PENDING',
  Rejected = 'REJECTED',
  UnderReview = 'UNDER_REVIEW'
}

export type Query = {
  __typename: 'Query';
  currentUser: Maybe<User>;
  notificationSettings: NotificationSettings;
  securitySettings: SecuritySettings;
  spaceById: Maybe<Space>;
  spaces: Maybe<SpacesConnection>;
  userById: Maybe<User>;
  users: Maybe<UsersConnection>;
};


export type QuerySpaceByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySpacesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<SpaceSortInput>>;
  where?: InputMaybe<SpaceFilterInput>;
};


export type QueryUserByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUsersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<UserSortInput>>;
  where?: InputMaybe<UserFilterInput>;
};

export type Review = {
  __typename: 'Review';
  booking: Booking;
  bookingId: Scalars['String']['output'];
  comment: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  rating: Scalars['Int']['output'];
  reviewerType: ReviewerType;
  space: Space;
  spaceId: Scalars['String']['output'];
};

export type ReviewFilterInput = {
  and?: InputMaybe<Array<ReviewFilterInput>>;
  booking?: InputMaybe<BookingFilterInput>;
  bookingId?: InputMaybe<StringOperationFilterInput>;
  comment?: InputMaybe<StringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<ReviewFilterInput>>;
  rating?: InputMaybe<IntOperationFilterInput>;
  reviewerType?: InputMaybe<ReviewerTypeOperationFilterInput>;
  space?: InputMaybe<SpaceFilterInput>;
  spaceId?: InputMaybe<StringOperationFilterInput>;
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

export type SecuritySettings = {
  __typename: 'SecuritySettings';
  deviceSessions: Array<DeviceSession>;
  loginNotifications: Scalars['Boolean']['output'];
  twoFactorEnabled: Scalars['Boolean']['output'];
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
  bookings: Array<Booking>;
  city: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  description: Maybe<Scalars['String']['output']>;
  dimensions: Maybe<Scalars['String']['output']>;
  dimensionsText: Maybe<Scalars['String']['output']>;
  height: Maybe<Scalars['Float']['output']>;
  id: Scalars['String']['output'];
  images: Array<Scalars['String']['output']>;
  installationFee: Maybe<Scalars['Decimal']['output']>;
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  maxDuration: Maybe<Scalars['Int']['output']>;
  minDuration: Scalars['Int']['output'];
  owner: User;
  ownerId: Scalars['String']['output'];
  pricePerDay: Scalars['Decimal']['output'];
  quadtreeDepth: Maybe<Scalars['Int']['output']>;
  quadtreeNodeId: Maybe<Scalars['String']['output']>;
  rejectionReason: Maybe<Scalars['String']['output']>;
  reviews: Array<Review>;
  state: Scalars['String']['output'];
  status: SpaceStatus;
  title: Scalars['String']['output'];
  totalBookings: Scalars['Int']['output'];
  totalRevenue: Scalars['Decimal']['output'];
  traffic: Maybe<Scalars['String']['output']>;
  type: SpaceType;
  updatedAt: Scalars['DateTime']['output'];
  width: Maybe<Scalars['Float']['output']>;
  zipCode: Maybe<Scalars['String']['output']>;
};

export type SpaceFilterInput = {
  address?: InputMaybe<StringOperationFilterInput>;
  and?: InputMaybe<Array<SpaceFilterInput>>;
  availableFrom?: InputMaybe<DateTimeOperationFilterInput>;
  availableTo?: InputMaybe<DateTimeOperationFilterInput>;
  averageRating?: InputMaybe<FloatOperationFilterInput>;
  bookings?: InputMaybe<ListFilterInputTypeOfBookingFilterInput>;
  city?: InputMaybe<StringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
  dimensions?: InputMaybe<StringOperationFilterInput>;
  dimensionsText?: InputMaybe<StringOperationFilterInput>;
  height?: InputMaybe<FloatOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  images?: InputMaybe<ListStringOperationFilterInput>;
  installationFee?: InputMaybe<DecimalOperationFilterInput>;
  latitude?: InputMaybe<FloatOperationFilterInput>;
  longitude?: InputMaybe<FloatOperationFilterInput>;
  maxDuration?: InputMaybe<IntOperationFilterInput>;
  minDuration?: InputMaybe<IntOperationFilterInput>;
  or?: InputMaybe<Array<SpaceFilterInput>>;
  owner?: InputMaybe<UserFilterInput>;
  ownerId?: InputMaybe<StringOperationFilterInput>;
  pricePerDay?: InputMaybe<DecimalOperationFilterInput>;
  quadtreeDepth?: InputMaybe<IntOperationFilterInput>;
  quadtreeNodeId?: InputMaybe<StringOperationFilterInput>;
  rejectionReason?: InputMaybe<StringOperationFilterInput>;
  reviews?: InputMaybe<ListFilterInputTypeOfReviewFilterInput>;
  state?: InputMaybe<StringOperationFilterInput>;
  status?: InputMaybe<SpaceStatusOperationFilterInput>;
  title?: InputMaybe<StringOperationFilterInput>;
  totalBookings?: InputMaybe<IntOperationFilterInput>;
  totalRevenue?: InputMaybe<DecimalOperationFilterInput>;
  traffic?: InputMaybe<StringOperationFilterInput>;
  type?: InputMaybe<SpaceTypeOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  width?: InputMaybe<FloatOperationFilterInput>;
  zipCode?: InputMaybe<StringOperationFilterInput>;
};

export type SpaceOwnerProfile = {
  __typename: 'SpaceOwnerProfile';
  accountDisconnectedAt: Maybe<Scalars['DateTime']['output']>;
  accountDisconnectedNotifiedAt: Maybe<Scalars['DateTime']['output']>;
  businessName: Maybe<Scalars['String']['output']>;
  businessType: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  lastAccountHealthCheck: Maybe<Scalars['DateTime']['output']>;
  onboardingComplete: Scalars['Boolean']['output'];
  payoutSchedule: PayoutSchedule;
  stripeAccountId: Maybe<Scalars['String']['output']>;
  stripeAccountStatus: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  user: User;
  userId: Scalars['String']['output'];
};

export type SpaceOwnerProfileFilterInput = {
  accountDisconnectedAt?: InputMaybe<DateTimeOperationFilterInput>;
  accountDisconnectedNotifiedAt?: InputMaybe<DateTimeOperationFilterInput>;
  and?: InputMaybe<Array<SpaceOwnerProfileFilterInput>>;
  businessName?: InputMaybe<StringOperationFilterInput>;
  businessType?: InputMaybe<StringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  lastAccountHealthCheck?: InputMaybe<DateTimeOperationFilterInput>;
  onboardingComplete?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<SpaceOwnerProfileFilterInput>>;
  payoutSchedule?: InputMaybe<PayoutScheduleOperationFilterInput>;
  stripeAccountId?: InputMaybe<StringOperationFilterInput>;
  stripeAccountStatus?: InputMaybe<StringOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  user?: InputMaybe<UserFilterInput>;
  userId?: InputMaybe<StringOperationFilterInput>;
};

export type SpaceOwnerProfileSortInput = {
  accountDisconnectedAt?: InputMaybe<SortEnumType>;
  accountDisconnectedNotifiedAt?: InputMaybe<SortEnumType>;
  businessName?: InputMaybe<SortEnumType>;
  businessType?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  lastAccountHealthCheck?: InputMaybe<SortEnumType>;
  onboardingComplete?: InputMaybe<SortEnumType>;
  payoutSchedule?: InputMaybe<SortEnumType>;
  stripeAccountId?: InputMaybe<SortEnumType>;
  stripeAccountStatus?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
  user?: InputMaybe<UserSortInput>;
  userId?: InputMaybe<SortEnumType>;
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
  owner?: InputMaybe<UserSortInput>;
  ownerId?: InputMaybe<SortEnumType>;
  pricePerDay?: InputMaybe<SortEnumType>;
  quadtreeDepth?: InputMaybe<SortEnumType>;
  quadtreeNodeId?: InputMaybe<SortEnumType>;
  rejectionReason?: InputMaybe<SortEnumType>;
  state?: InputMaybe<SortEnumType>;
  status?: InputMaybe<SortEnumType>;
  title?: InputMaybe<SortEnumType>;
  totalBookings?: InputMaybe<SortEnumType>;
  totalRevenue?: InputMaybe<SortEnumType>;
  traffic?: InputMaybe<SortEnumType>;
  type?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
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
};

/** An edge in a connection. */
export type SpacesEdge = {
  __typename: 'SpacesEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Space;
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

export type User = {
  __typename: 'User';
  advertiserProfile: Maybe<AdvertiserProfile>;
  avatar: Maybe<Scalars['String']['output']>;
  bugReports: Array<BugReport>;
  campaigns: Array<Campaign>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Maybe<Scalars['String']['output']>;
  lastLoginAt: Maybe<Scalars['DateTime']['output']>;
  name: Maybe<Scalars['String']['output']>;
  notifications: Array<Notification>;
  ownedSpaces: Array<Space>;
  password: Scalars['String']['output'];
  phone: Maybe<Scalars['String']['output']>;
  role: UserRole;
  sentMessages: Array<Message>;
  spaceOwnerProfile: Maybe<SpaceOwnerProfile>;
  status: UserStatus;
  updatedAt: Scalars['DateTime']['output'];
};

export type UserFilterInput = {
  advertiserProfile?: InputMaybe<AdvertiserProfileFilterInput>;
  and?: InputMaybe<Array<UserFilterInput>>;
  avatar?: InputMaybe<StringOperationFilterInput>;
  bugReports?: InputMaybe<ListFilterInputTypeOfBugReportFilterInput>;
  campaigns?: InputMaybe<ListFilterInputTypeOfCampaignFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  email?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  lastLoginAt?: InputMaybe<DateTimeOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  notifications?: InputMaybe<ListFilterInputTypeOfNotificationFilterInput>;
  or?: InputMaybe<Array<UserFilterInput>>;
  ownedSpaces?: InputMaybe<ListFilterInputTypeOfSpaceFilterInput>;
  password?: InputMaybe<StringOperationFilterInput>;
  phone?: InputMaybe<StringOperationFilterInput>;
  role?: InputMaybe<UserRoleOperationFilterInput>;
  sentMessages?: InputMaybe<ListFilterInputTypeOfMessageFilterInput>;
  spaceOwnerProfile?: InputMaybe<SpaceOwnerProfileFilterInput>;
  status?: InputMaybe<UserStatusOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
};

export enum UserRole {
  Admin = 'ADMIN',
  Advertiser = 'ADVERTISER',
  Marketing = 'MARKETING',
  SpaceOwner = 'SPACE_OWNER'
}

export type UserRoleOperationFilterInput = {
  eq?: InputMaybe<UserRole>;
  in?: InputMaybe<Array<UserRole>>;
  neq?: InputMaybe<UserRole>;
  nin?: InputMaybe<Array<UserRole>>;
};

export type UserSortInput = {
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
  updatedAt?: InputMaybe<SortEnumType>;
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

/** A connection to a list of items. */
export type UsersConnection = {
  __typename: 'UsersConnection';
  /** A list of edges. */
  edges: Maybe<Array<UsersEdge>>;
  /** A flattened list of the nodes. */
  nodes: Maybe<Array<User>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type UsersEdge = {
  __typename: 'UsersEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: User;
};
