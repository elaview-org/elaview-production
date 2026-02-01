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
  UUID: { input: string; output: string; }
};

export type AdvertiserProfile = {
  __typename: 'AdvertiserProfile';
  campaigns: Maybe<CampaignsConnection>;
  companyName: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['UUID']['output'];
  industry: Maybe<Scalars['String']['output']>;
  onboardingComplete: Scalars['Boolean']['output'];
  stripeAccountDisconnectedAt: Maybe<Scalars['DateTime']['output']>;
  stripeAccountDisconnectedNotifiedAt: Maybe<Scalars['DateTime']['output']>;
  stripeAccountId: Maybe<Scalars['String']['output']>;
  stripeAccountStatus: Maybe<Scalars['String']['output']>;
  stripeLastAccountHealthCheck: Maybe<Scalars['DateTime']['output']>;
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
  stripeAccountDisconnectedAt?: InputMaybe<DateTimeOperationFilterInput>;
  stripeAccountDisconnectedNotifiedAt?: InputMaybe<DateTimeOperationFilterInput>;
  stripeAccountId?: InputMaybe<StringOperationFilterInput>;
  stripeAccountStatus?: InputMaybe<StringOperationFilterInput>;
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
  stripeLastAccountHealthCheck?: InputMaybe<SortEnumType>;
  user?: InputMaybe<UserSortInput>;
  userId?: InputMaybe<SortEnumType>;
  website?: InputMaybe<SortEnumType>;
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
  startDate: Maybe<Scalars['DateTime']['output']>;
  status: CampaignStatus;
  targetAudience: Maybe<Scalars['String']['output']>;
  totalBudget: Maybe<Scalars['Decimal']['output']>;
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

export type ConfirmPaymentError = NotFoundError | PaymentError;

export type ConfirmPaymentInput = {
  paymentIntentId: Scalars['String']['input'];
};

export type ConfirmPaymentPayload = {
  __typename: 'ConfirmPaymentPayload';
  errors: Maybe<Array<ConfirmPaymentError>>;
  payment: Maybe<Payment>;
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

export type CreateBookingError = NotFoundError | ValidationError;

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

export type CreatePaymentIntentError = InvalidStatusTransitionError | NotFoundError;

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

export type CreateSpaceError = NotFoundError;

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
  errors: Maybe<Array<CreateSpaceError>>;
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

export type DeactivateSpaceError = ForbiddenError | NotFoundError;

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

export type DeleteNotificationInput = {
  id: Scalars['ID']['input'];
};

export type DeleteNotificationPayload = {
  __typename: 'DeleteNotificationPayload';
  success: Scalars['Boolean']['output'];
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

export type EarningsSummary = {
  __typename: 'EarningsSummary';
  availableBalance: Maybe<Scalars['Decimal']['output']>;
  lastMonthEarnings: Maybe<Scalars['Decimal']['output']>;
  pendingPayouts: Maybe<Scalars['Decimal']['output']>;
  thisMonthEarnings: Maybe<Scalars['Decimal']['output']>;
  totalEarnings: Maybe<Scalars['Decimal']['output']>;
};

export type Error = {
  message: Scalars['String']['output'];
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

export type Mutation = {
  __typename: 'Mutation';
  approveBooking: ApproveBookingPayload;
  cancelBooking: CancelBookingPayload;
  cancelCampaign: CancelCampaignPayload;
  confirmPayment: ConfirmPaymentPayload;
  connectStripeAccount: ConnectStripeAccountPayload;
  createBooking: CreateBookingPayload;
  createBookingConversation: CreateBookingConversationPayload;
  createCampaign: CreateCampaignPayload;
  createPaymentIntent: CreatePaymentIntentPayload;
  createReview: CreateReviewPayload;
  createSpace: CreateSpacePayload;
  deactivateSpace: DeactivateSpacePayload;
  deleteCampaign: DeleteCampaignPayload;
  deleteNotification: DeleteNotificationPayload;
  deleteReview: DeleteReviewPayload;
  deleteSpace: DeleteSpacePayload;
  deleteUser: DeleteUserPayload;
  markAllNotificationsRead: MarkAllNotificationsReadPayload;
  markConversationRead: MarkConversationReadPayload;
  markFileDownloaded: MarkFileDownloadedPayload;
  markInstalled: MarkInstalledPayload;
  markNotificationRead: MarkNotificationReadPayload;
  processPayout: ProcessPayoutPayload;
  reactivateSpace: ReactivateSpacePayload;
  refreshStripeAccountStatus: RefreshStripeAccountStatusPayload;
  rejectBooking: RejectBookingPayload;
  requestRefund: RequestRefundPayload;
  retryPayout: RetryPayoutPayload;
  sendMessage: SendMessagePayload;
  submitCampaign: SubmitCampaignPayload;
  updateAdvertiserProfile: UpdateAdvertiserProfilePayload;
  updateCampaign: UpdateCampaignPayload;
  updateCurrentUser: UpdateCurrentUserPayload;
  updateNotificationPreference: UpdateNotificationPreferencePayload;
  updateReview: UpdateReviewPayload;
  updateSpace: UpdateSpacePayload;
  updateSpaceOwnerProfile: UpdateSpaceOwnerProfilePayload;
};


export type MutationApproveBookingArgs = {
  input: ApproveBookingInput;
};


export type MutationCancelBookingArgs = {
  input: CancelBookingInput;
};


export type MutationCancelCampaignArgs = {
  input: CancelCampaignInput;
};


export type MutationConfirmPaymentArgs = {
  input: ConfirmPaymentInput;
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


export type MutationDeleteNotificationArgs = {
  input: DeleteNotificationInput;
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


export type MutationProcessPayoutArgs = {
  input: ProcessPayoutInput;
};


export type MutationReactivateSpaceArgs = {
  input: ReactivateSpaceInput;
};


export type MutationRejectBookingArgs = {
  input: RejectBookingInput;
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


export type MutationSubmitCampaignArgs = {
  input: SubmitCampaignInput;
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
  bookingById: Maybe<Booking>;
  bookingsRequiringAction: Maybe<BookingsRequiringActionConnection>;
  campaignById: Maybe<Campaign>;
  earningsSummary: EarningsSummary;
  incomingBookingRequests: Maybe<IncomingBookingRequestsConnection>;
  me: Maybe<User>;
  messagesByConversation: Maybe<MessagesByConversationConnection>;
  myBookingsAsAdvertiser: Maybe<MyBookingsAsAdvertiserConnection>;
  myBookingsAsOwner: Maybe<MyBookingsAsOwnerConnection>;
  myCampaigns: Maybe<MyCampaignsConnection>;
  myConversations: Maybe<MyConversationsConnection>;
  myNotificationPreferences: Array<NotificationPreference>;
  myNotifications: Maybe<MyNotificationsConnection>;
  myPayouts: Maybe<MyPayoutsConnection>;
  myReviews: Maybe<MyReviewsConnection>;
  mySpaces: Maybe<MySpacesConnection>;
  paymentById: Maybe<Payment>;
  paymentsByBooking: Maybe<PaymentsByBookingConnection>;
  payoutById: Maybe<Payout>;
  reviewByBooking: Maybe<Review>;
  reviewsBySpace: Maybe<ReviewsBySpaceConnection>;
  spaceById: Maybe<Space>;
  spaces: Maybe<SpacesConnection>;
  transactionsByBooking: Maybe<TransactionsByBookingConnection>;
  unreadConversationsCount: Scalars['Int']['output'];
  unreadNotificationsCount: Scalars['Int']['output'];
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
  bookings: Maybe<BookingsConnection>;
  city: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  description: Maybe<Scalars['String']['output']>;
  dimensions: Maybe<Scalars['String']['output']>;
  dimensionsText: Maybe<Scalars['String']['output']>;
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

export type SpaceOwnerProfile = {
  __typename: 'SpaceOwnerProfile';
  businessName: Maybe<Scalars['String']['output']>;
  businessType: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['UUID']['output'];
  onboardingComplete: Scalars['Boolean']['output'];
  payoutSchedule: PayoutSchedule;
  payouts: Array<Payout>;
  spaces: Maybe<SpacesConnection>;
  stripeAccountDisconnectedAt: Maybe<Scalars['DateTime']['output']>;
  stripeAccountDisconnectedNotifiedAt: Maybe<Scalars['DateTime']['output']>;
  stripeAccountId: Maybe<Scalars['String']['output']>;
  stripeAccountStatus: Maybe<Scalars['String']['output']>;
  stripeLastAccountHealthCheck: Maybe<Scalars['DateTime']['output']>;
  user: User;
  userId: Scalars['UUID']['output'];
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

export type SubmitCampaignError = ForbiddenError | InvalidStatusTransitionError | NotFoundError;

export type SubmitCampaignInput = {
  id: Scalars['ID']['input'];
};

export type SubmitCampaignPayload = {
  __typename: 'SubmitCampaignPayload';
  campaign: Maybe<Campaign>;
  errors: Maybe<Array<SubmitCampaignError>>;
};

export type Subscription = {
  __typename: 'Subscription';
  onBookingUpdate: Booking;
  onMessage: Message;
  onNotification: Notification;
  onProofUpdate: BookingProof;
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

export type UpdateSpaceError = ForbiddenError | NotFoundError;

export type UpdateSpaceInput = {
  availableFrom?: InputMaybe<Scalars['DateTime']['input']>;
  availableTo?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  images?: InputMaybe<Array<Scalars['String']['input']>>;
  installationFee?: InputMaybe<Scalars['Decimal']['input']>;
  maxDuration?: InputMaybe<Scalars['Int']['input']>;
  minDuration?: InputMaybe<Scalars['Int']['input']>;
  pricePerDay?: InputMaybe<Scalars['Decimal']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  traffic?: InputMaybe<Scalars['String']['input']>;
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

export type AdvertiserSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type AdvertiserSettingsQuery = { me: { __typename: 'User', id: string, email: string, name: string, avatar: string | null, phone: string | null, createdAt: string, lastLoginAt: string | null, activeProfileType: ProfileType, advertiserProfile: { __typename: 'AdvertiserProfile', id: string, companyName: string | null, industry: string | null, website: string | null, onboardingComplete: boolean } | null } | null, myNotificationPreferences: Array<{ __typename: 'NotificationPreference', id: string, notificationType: NotificationType, inAppEnabled: boolean, emailEnabled: boolean, pushEnabled: boolean }> };

export type GetAdvertiserForSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAdvertiserForSettingsQuery = { me: { __typename: 'User', id: string, avatar: string | null, advertiserProfile: { __typename: 'AdvertiserProfile', id: string } | null } | null };

export type UpdateAdvertiserUserProfileMutationVariables = Exact<{
  input: UpdateCurrentUserInput;
}>;


export type UpdateAdvertiserUserProfileMutation = { updateCurrentUser: { __typename: 'UpdateCurrentUserPayload', user: { __typename: 'User', id: string } | null } };

export type UpdateAdvertiserBusinessInfoMutationVariables = Exact<{
  input: UpdateAdvertiserProfileInput;
}>;


export type UpdateAdvertiserBusinessInfoMutation = { updateAdvertiserProfile: { __typename: 'UpdateAdvertiserProfilePayload', advertiserProfile: { __typename: 'AdvertiserProfile', id: string } | null } };

export type BookingCard_BookingFragmentFragment = { __typename: 'Booking', id: string, status: BookingStatus, startDate: string, endDate: string, ownerPayoutAmount: number, space: { __typename: 'Space', title: string, images: Array<string> } | null, campaign: { __typename: 'Campaign', name: string, advertiserProfile: { __typename: 'AdvertiserProfile', companyName: string | null } } | null } & { ' $fragmentName'?: 'BookingCard_BookingFragmentFragment' };

export type BookingsTable_BookingFragmentFragment = { __typename: 'Booking', id: string, status: BookingStatus, startDate: string, endDate: string, ownerPayoutAmount: number, space: { __typename: 'Space', title: string, images: Array<string> } | null, campaign: { __typename: 'Campaign', name: string, advertiserProfile: { __typename: 'AdvertiserProfile', companyName: string | null } } | null } & { ' $fragmentName'?: 'BookingsTable_BookingFragmentFragment' };

export type SpaceOwnerBookingsQueryVariables = Exact<{ [key: string]: never; }>;


export type SpaceOwnerBookingsQuery = { myBookingsAsOwner: { __typename: 'MyBookingsAsOwnerConnection', nodes: Array<(
      { __typename: 'Booking', id: string }
      & { ' $fragmentRefs'?: { 'BookingCard_BookingFragmentFragment': BookingCard_BookingFragmentFragment;'BookingsTable_BookingFragmentFragment': BookingsTable_BookingFragmentFragment } }
    )> | null } | null };

export type BalanceCards_EarningsSummaryFragmentFragment = { __typename: 'EarningsSummary', availableBalance: number | null, pendingPayouts: number | null, thisMonthEarnings: number | null, lastMonthEarnings: number | null, totalEarnings: number | null } & { ' $fragmentName'?: 'BalanceCards_EarningsSummaryFragmentFragment' };

export type SpaceOwnerEarningsQueryVariables = Exact<{ [key: string]: never; }>;


export type SpaceOwnerEarningsQuery = { earningsSummary: (
    { __typename: 'EarningsSummary' }
    & { ' $fragmentRefs'?: { 'BalanceCards_EarningsSummaryFragmentFragment': BalanceCards_EarningsSummaryFragmentFragment } }
  ), myPayouts: { __typename: 'MyPayoutsConnection', nodes: Array<(
      { __typename: 'Payout', id: string, amount: number, processedAt: string | null }
      & { ' $fragmentRefs'?: { 'PayoutsTable_PayoutFragmentFragment': PayoutsTable_PayoutFragmentFragment } }
    )> | null } | null };

export type PayoutsTable_PayoutFragmentFragment = { __typename: 'Payout', id: string, amount: number, stage: PayoutStage, status: PayoutStatus, processedAt: string | null, booking: { __typename: 'Booking', id: string, space: { __typename: 'Space', title: string } | null } } & { ' $fragmentName'?: 'PayoutsTable_PayoutFragmentFragment' };

export type SpaceCard_SpaceFragmentFragment = { __typename: 'Space', id: string, title: string, description: string | null, city: string, state: string, images: Array<string>, type: SpaceType, status: SpaceStatus, createdAt: string } & { ' $fragmentName'?: 'SpaceCard_SpaceFragmentFragment' };

export type ListingsTable_SpaceFragmentFragment = { __typename: 'Space', id: string, title: string, city: string, state: string, images: Array<string>, type: SpaceType, status: SpaceStatus, createdAt: string } & { ' $fragmentName'?: 'ListingsTable_SpaceFragmentFragment' };

export type Details_SpaceFragmentFragment = { __typename: 'Space', id: string, description: string | null, type: SpaceType, address: string, city: string, state: string, zipCode: string | null, traffic: string | null, pricePerDay: number, installationFee: number | null, minDuration: number, maxDuration: number | null, width: number | null, height: number | null, dimensionsText: string | null, availableFrom: string | null, availableTo: string | null } & { ' $fragmentName'?: 'Details_SpaceFragmentFragment' };

export type Gallery_SpaceFragmentFragment = { __typename: 'Space', id: string, title: string, images: Array<string> } & { ' $fragmentName'?: 'Gallery_SpaceFragmentFragment' };

export type Header_SpaceFragmentFragment = { __typename: 'Space', title: string, status: SpaceStatus } & { ' $fragmentName'?: 'Header_SpaceFragmentFragment' };

export type SpaceDetailQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type SpaceDetailQuery = { spaceById: (
    { __typename: 'Space', id: string }
    & { ' $fragmentRefs'?: { 'Header_SpaceFragmentFragment': Header_SpaceFragmentFragment;'Gallery_SpaceFragmentFragment': Gallery_SpaceFragmentFragment;'Details_SpaceFragmentFragment': Details_SpaceFragmentFragment;'Performance_SpaceFragmentFragment': Performance_SpaceFragmentFragment } }
  ) | null };

export type Performance_SpaceFragmentFragment = { __typename: 'Space', totalBookings: number, totalRevenue: number, averageRating: number | null } & { ' $fragmentName'?: 'Performance_SpaceFragmentFragment' };

export type SpaceOwnerListingsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Array<SpaceSortInput> | SpaceSortInput>;
  where?: InputMaybe<SpaceFilterInput>;
  gridView: Scalars['Boolean']['input'];
  tableView: Scalars['Boolean']['input'];
}>;


export type SpaceOwnerListingsQuery = { mySpaces: { __typename: 'MySpacesConnection', nodes: Array<(
      { __typename: 'Space', id: string }
      & { ' $fragmentRefs'?: { 'SpaceCard_SpaceFragmentFragment': SpaceCard_SpaceFragmentFragment;'ListingsTable_SpaceFragmentFragment': ListingsTable_SpaceFragmentFragment } }
    )> | null, pageInfo: { __typename: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null, endCursor: string | null } } | null };

export type AboutSection_UserFragmentFragment = { __typename: 'User', name: string, spaceOwnerProfile: { __typename: 'SpaceOwnerProfile', businessName: string | null, businessType: string | null, onboardingComplete: boolean, spaces: { __typename: 'SpacesConnection', nodes: Array<{ __typename: 'Space', id: string }> | null } | null } | null } & { ' $fragmentName'?: 'AboutSection_UserFragmentFragment' };

export type SpaceOwnerProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type SpaceOwnerProfileQuery = { me: (
    { __typename: 'User', name: string }
    & { ' $fragmentRefs'?: { 'ProfileCard_UserFragmentFragment': ProfileCard_UserFragmentFragment;'AboutSection_UserFragmentFragment': AboutSection_UserFragmentFragment } }
  ) | null };

export type ProfileCard_UserFragmentFragment = { __typename: 'User', name: string, avatar: string | null, spaceOwnerProfile: { __typename: 'SpaceOwnerProfile', createdAt: string, spaces: { __typename: 'SpacesConnection', nodes: Array<{ __typename: 'Space', averageRating: number | null, reviews: { __typename: 'ReviewsConnection', nodes: Array<{ __typename: 'Review', id: string }> | null } | null }> | null } | null } | null } & { ' $fragmentName'?: 'ProfileCard_UserFragmentFragment' };

export type SpaceOwnerSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type SpaceOwnerSettingsQuery = { me: { __typename: 'User', id: string, email: string, name: string, avatar: string | null, phone: string | null, createdAt: string, lastLoginAt: string | null, activeProfileType: ProfileType, spaceOwnerProfile: { __typename: 'SpaceOwnerProfile', id: string, businessName: string | null, businessType: string | null, payoutSchedule: PayoutSchedule, onboardingComplete: boolean, stripeAccountId: string | null, stripeAccountStatus: string | null } | null } | null, myNotificationPreferences: Array<{ __typename: 'NotificationPreference', id: string, notificationType: NotificationType, inAppEnabled: boolean, emailEnabled: boolean, pushEnabled: boolean }> };

export type GetSpaceOwnerForSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSpaceOwnerForSettingsQuery = { me: { __typename: 'User', id: string, avatar: string | null, spaceOwnerProfile: { __typename: 'SpaceOwnerProfile', id: string } | null } | null };

export type UpdateSpaceOwnerProfileMutationVariables = Exact<{
  input: UpdateCurrentUserInput;
}>;


export type UpdateSpaceOwnerProfileMutation = { updateCurrentUser: { __typename: 'UpdateCurrentUserPayload', user: { __typename: 'User', id: string } | null } };

export type UpdateSpaceOwnerBusinessInfoMutationVariables = Exact<{
  input: UpdateSpaceOwnerProfileInput;
}>;


export type UpdateSpaceOwnerBusinessInfoMutation = { updateSpaceOwnerProfile: { __typename: 'UpdateSpaceOwnerProfilePayload', spaceOwnerProfile: { __typename: 'SpaceOwnerProfile', id: string } | null } };

export type DashboardUserQueryVariables = Exact<{ [key: string]: never; }>;


export type DashboardUserQuery = { me: (
    { __typename: 'User', id: string }
    & { ' $fragmentRefs'?: { 'NavigationSection_UserFragmentFragment': NavigationSection_UserFragmentFragment;'UserSection_UserFragmentFragment': UserSection_UserFragmentFragment;'RoleBasedView_UserFragmentFragment': RoleBasedView_UserFragmentFragment } }
  ) | null };

export type NavigationSection_UserFragmentFragment = { __typename: 'User', role: UserRole, activeProfileType: ProfileType } & { ' $fragmentName'?: 'NavigationSection_UserFragmentFragment' };

export type RoleBasedView_UserFragmentFragment = { __typename: 'User', role: UserRole, activeProfileType: ProfileType } & { ' $fragmentName'?: 'RoleBasedView_UserFragmentFragment' };

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

export const BookingCard_AdvertiserBookingFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookingCard_AdvertiserBookingFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Booking"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"businessName"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"campaign"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<BookingCard_AdvertiserBookingFragmentFragment, unknown>;
export const BookingsTable_AdvertiserBookingFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookingsTable_AdvertiserBookingFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Booking"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"businessName"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"campaign"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<BookingsTable_AdvertiserBookingFragmentFragment, unknown>;
export const CampaignCard_CampaignFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CampaignCard_CampaignFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Campaign"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"totalBudget"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"bookings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CampaignCard_CampaignFragmentFragment, unknown>;
export const CampaignsTable_CampaignFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CampaignsTable_CampaignFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Campaign"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"totalBudget"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"bookings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CampaignsTable_CampaignFragmentFragment, unknown>;
export const DiscoverSpaceCard_SpaceFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiscoverSpaceCard_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerDay"}}]}}]} as unknown as DocumentNode<DiscoverSpaceCard_SpaceFragmentFragment, unknown>;
export const DiscoverMap_SpaceFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiscoverMap_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerDay"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]} as unknown as DocumentNode<DiscoverMap_SpaceFragmentFragment, unknown>;
export const DiscoverTable_SpaceFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiscoverTable_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerDay"}}]}}]} as unknown as DocumentNode<DiscoverTable_SpaceFragmentFragment, unknown>;
export const BookingCard_BookingFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookingCard_BookingFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Booking"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"ownerPayoutAmount"}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"images"}}]}},{"kind":"Field","name":{"kind":"Name","value":"campaign"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"advertiserProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"companyName"}}]}}]}}]}}]} as unknown as DocumentNode<BookingCard_BookingFragmentFragment, unknown>;
export const BookingsTable_BookingFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookingsTable_BookingFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Booking"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"ownerPayoutAmount"}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"images"}}]}},{"kind":"Field","name":{"kind":"Name","value":"campaign"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"advertiserProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"companyName"}}]}}]}}]}}]} as unknown as DocumentNode<BookingsTable_BookingFragmentFragment, unknown>;
export const BalanceCards_EarningsSummaryFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BalanceCards_EarningsSummaryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EarningsSummary"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"availableBalance"}},{"kind":"Field","name":{"kind":"Name","value":"pendingPayouts"}},{"kind":"Field","name":{"kind":"Name","value":"thisMonthEarnings"}},{"kind":"Field","name":{"kind":"Name","value":"lastMonthEarnings"}},{"kind":"Field","name":{"kind":"Name","value":"totalEarnings"}}]}}]} as unknown as DocumentNode<BalanceCards_EarningsSummaryFragmentFragment, unknown>;
export const PayoutsTable_PayoutFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayoutsTable_PayoutFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Payout"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"stage"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"processedAt"}},{"kind":"Field","name":{"kind":"Name","value":"booking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]} as unknown as DocumentNode<PayoutsTable_PayoutFragmentFragment, unknown>;
export const SpaceCard_SpaceFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SpaceCard_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<SpaceCard_SpaceFragmentFragment, unknown>;
export const ListingsTable_SpaceFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListingsTable_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<ListingsTable_SpaceFragmentFragment, unknown>;
export const Details_SpaceFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Details_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}},{"kind":"Field","name":{"kind":"Name","value":"traffic"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerDay"}},{"kind":"Field","name":{"kind":"Name","value":"installationFee"}},{"kind":"Field","name":{"kind":"Name","value":"minDuration"}},{"kind":"Field","name":{"kind":"Name","value":"maxDuration"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"dimensionsText"}},{"kind":"Field","name":{"kind":"Name","value":"availableFrom"}},{"kind":"Field","name":{"kind":"Name","value":"availableTo"}}]}}]} as unknown as DocumentNode<Details_SpaceFragmentFragment, unknown>;
export const Gallery_SpaceFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Gallery_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"images"}}]}}]} as unknown as DocumentNode<Gallery_SpaceFragmentFragment, unknown>;
export const Header_SpaceFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Header_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]} as unknown as DocumentNode<Header_SpaceFragmentFragment, unknown>;
export const Performance_SpaceFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Performance_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalBookings"}},{"kind":"Field","name":{"kind":"Name","value":"totalRevenue"}},{"kind":"Field","name":{"kind":"Name","value":"averageRating"}}]}}]} as unknown as DocumentNode<Performance_SpaceFragmentFragment, unknown>;
export const AboutSection_UserFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AboutSection_UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"businessName"}},{"kind":"Field","name":{"kind":"Name","value":"businessType"}},{"kind":"Field","name":{"kind":"Name","value":"onboardingComplete"}},{"kind":"Field","name":{"kind":"Name","value":"spaces"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AboutSection_UserFragmentFragment, unknown>;
export const ProfileCard_UserFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfileCard_UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"spaces"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"averageRating"}},{"kind":"Field","name":{"kind":"Name","value":"reviews"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<ProfileCard_UserFragmentFragment, unknown>;
export const NavigationSection_UserFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NavigationSection_UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"activeProfileType"}}]}}]} as unknown as DocumentNode<NavigationSection_UserFragmentFragment, unknown>;
export const RoleBasedView_UserFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoleBasedView_UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"activeProfileType"}}]}}]} as unknown as DocumentNode<RoleBasedView_UserFragmentFragment, unknown>;
export const Gallery_SharedSpaceFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Gallery_SharedSpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"images"}}]}}]} as unknown as DocumentNode<Gallery_SharedSpaceFragmentFragment, unknown>;
export const Header_SharedSpaceFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Header_SharedSpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<Header_SharedSpaceFragmentFragment, unknown>;
export const OwnerCard_SpaceFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OwnerCard_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"businessName"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}}]} as unknown as DocumentNode<OwnerCard_SpaceFragmentFragment, unknown>;
export const PricingCard_SpaceFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PricingCard_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pricePerDay"}},{"kind":"Field","name":{"kind":"Name","value":"installationFee"}},{"kind":"Field","name":{"kind":"Name","value":"minDuration"}},{"kind":"Field","name":{"kind":"Name","value":"maxDuration"}}]}}]} as unknown as DocumentNode<PricingCard_SpaceFragmentFragment, unknown>;
export const SpaceInfo_SpaceFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SpaceInfo_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"dimensionsText"}},{"kind":"Field","name":{"kind":"Name","value":"traffic"}},{"kind":"Field","name":{"kind":"Name","value":"availableFrom"}},{"kind":"Field","name":{"kind":"Name","value":"availableTo"}},{"kind":"Field","name":{"kind":"Name","value":"averageRating"}},{"kind":"Field","name":{"kind":"Name","value":"totalBookings"}}]}}]} as unknown as DocumentNode<SpaceInfo_SpaceFragmentFragment, unknown>;
export const UserSection_UserFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserSection_UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"activeProfileType"}}]}}]} as unknown as DocumentNode<UserSection_UserFragmentFragment, unknown>;
export const AdvertiserBookingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AdvertiserBookings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myBookingsAsAdvertiser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"BookingCard_AdvertiserBookingFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"BookingsTable_AdvertiserBookingFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookingCard_AdvertiserBookingFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Booking"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"businessName"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"campaign"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookingsTable_AdvertiserBookingFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Booking"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"businessName"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"campaign"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<AdvertiserBookingsQuery, AdvertiserBookingsQueryVariables>;
export const AdvertiserCampaignsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AdvertiserCampaigns"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myCampaigns"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CampaignCard_CampaignFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CampaignsTable_CampaignFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CampaignCard_CampaignFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Campaign"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"totalBudget"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"bookings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CampaignsTable_CampaignFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Campaign"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"totalBudget"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"bookings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<AdvertiserCampaignsQuery, AdvertiserCampaignsQueryVariables>;
export const DiscoverSpacesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DiscoverSpaces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spaces"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"32"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"EnumValue","value":"ACTIVE"}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"DiscoverSpaceCard_SpaceFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"DiscoverTable_SpaceFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"DiscoverMap_SpaceFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiscoverSpaceCard_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerDay"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiscoverTable_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerDay"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiscoverMap_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerDay"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]} as unknown as DocumentNode<DiscoverSpacesQuery, DiscoverSpacesQueryVariables>;
export const AdvertiserSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AdvertiserSettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastLoginAt"}},{"kind":"Field","name":{"kind":"Name","value":"activeProfileType"}},{"kind":"Field","name":{"kind":"Name","value":"advertiserProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"companyName"}},{"kind":"Field","name":{"kind":"Name","value":"industry"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"onboardingComplete"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"myNotificationPreferences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"notificationType"}},{"kind":"Field","name":{"kind":"Name","value":"inAppEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"emailEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"pushEnabled"}}]}}]}}]} as unknown as DocumentNode<AdvertiserSettingsQuery, AdvertiserSettingsQueryVariables>;
export const GetAdvertiserForSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAdvertiserForSettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"advertiserProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<GetAdvertiserForSettingsQuery, GetAdvertiserForSettingsQueryVariables>;
export const UpdateAdvertiserUserProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateAdvertiserUserProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCurrentUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCurrentUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateAdvertiserUserProfileMutation, UpdateAdvertiserUserProfileMutationVariables>;
export const UpdateAdvertiserBusinessInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateAdvertiserBusinessInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateAdvertiserProfileInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateAdvertiserProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"advertiserProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateAdvertiserBusinessInfoMutation, UpdateAdvertiserBusinessInfoMutationVariables>;
export const SpaceOwnerBookingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SpaceOwnerBookings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myBookingsAsOwner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"BookingCard_BookingFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"BookingsTable_BookingFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookingCard_BookingFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Booking"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"ownerPayoutAmount"}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"images"}}]}},{"kind":"Field","name":{"kind":"Name","value":"campaign"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"advertiserProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"companyName"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookingsTable_BookingFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Booking"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"ownerPayoutAmount"}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"images"}}]}},{"kind":"Field","name":{"kind":"Name","value":"campaign"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"advertiserProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"companyName"}}]}}]}}]}}]} as unknown as DocumentNode<SpaceOwnerBookingsQuery, SpaceOwnerBookingsQueryVariables>;
export const SpaceOwnerEarningsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SpaceOwnerEarnings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"earningsSummary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BalanceCards_EarningsSummaryFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"myPayouts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"processedAt"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PayoutsTable_PayoutFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BalanceCards_EarningsSummaryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EarningsSummary"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"availableBalance"}},{"kind":"Field","name":{"kind":"Name","value":"pendingPayouts"}},{"kind":"Field","name":{"kind":"Name","value":"thisMonthEarnings"}},{"kind":"Field","name":{"kind":"Name","value":"lastMonthEarnings"}},{"kind":"Field","name":{"kind":"Name","value":"totalEarnings"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayoutsTable_PayoutFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Payout"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"stage"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"processedAt"}},{"kind":"Field","name":{"kind":"Name","value":"booking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]} as unknown as DocumentNode<SpaceOwnerEarningsQuery, SpaceOwnerEarningsQueryVariables>;
export const SpaceDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SpaceDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spaceById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Header_SpaceFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Gallery_SpaceFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Details_SpaceFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Performance_SpaceFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Header_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Gallery_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"images"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Details_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}},{"kind":"Field","name":{"kind":"Name","value":"traffic"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerDay"}},{"kind":"Field","name":{"kind":"Name","value":"installationFee"}},{"kind":"Field","name":{"kind":"Name","value":"minDuration"}},{"kind":"Field","name":{"kind":"Name","value":"maxDuration"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"dimensionsText"}},{"kind":"Field","name":{"kind":"Name","value":"availableFrom"}},{"kind":"Field","name":{"kind":"Name","value":"availableTo"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Performance_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalBookings"}},{"kind":"Field","name":{"kind":"Name","value":"totalRevenue"}},{"kind":"Field","name":{"kind":"Name","value":"averageRating"}}]}}]} as unknown as DocumentNode<SpaceDetailQuery, SpaceDetailQueryVariables>;
export const SpaceOwnerListingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SpaceOwnerListings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SpaceSortInput"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SpaceFilterInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gridView"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tableView"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mySpaces"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"SpaceCard_SpaceFragment"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"include"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"if"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gridView"}}}]}]},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListingsTable_SpaceFragment"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"include"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"if"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tableView"}}}]}]}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SpaceCard_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListingsTable_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<SpaceOwnerListingsQuery, SpaceOwnerListingsQueryVariables>;
export const SpaceOwnerProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SpaceOwnerProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProfileCard_UserFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AboutSection_UserFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfileCard_UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"spaces"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"averageRating"}},{"kind":"Field","name":{"kind":"Name","value":"reviews"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AboutSection_UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"businessName"}},{"kind":"Field","name":{"kind":"Name","value":"businessType"}},{"kind":"Field","name":{"kind":"Name","value":"onboardingComplete"}},{"kind":"Field","name":{"kind":"Name","value":"spaces"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]} as unknown as DocumentNode<SpaceOwnerProfileQuery, SpaceOwnerProfileQueryVariables>;
export const SpaceOwnerSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SpaceOwnerSettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastLoginAt"}},{"kind":"Field","name":{"kind":"Name","value":"activeProfileType"}},{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"businessName"}},{"kind":"Field","name":{"kind":"Name","value":"businessType"}},{"kind":"Field","name":{"kind":"Name","value":"payoutSchedule"}},{"kind":"Field","name":{"kind":"Name","value":"onboardingComplete"}},{"kind":"Field","name":{"kind":"Name","value":"stripeAccountId"}},{"kind":"Field","name":{"kind":"Name","value":"stripeAccountStatus"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"myNotificationPreferences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"notificationType"}},{"kind":"Field","name":{"kind":"Name","value":"inAppEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"emailEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"pushEnabled"}}]}}]}}]} as unknown as DocumentNode<SpaceOwnerSettingsQuery, SpaceOwnerSettingsQueryVariables>;
export const GetSpaceOwnerForSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSpaceOwnerForSettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<GetSpaceOwnerForSettingsQuery, GetSpaceOwnerForSettingsQueryVariables>;
export const UpdateSpaceOwnerProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSpaceOwnerProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCurrentUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCurrentUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateSpaceOwnerProfileMutation, UpdateSpaceOwnerProfileMutationVariables>;
export const UpdateSpaceOwnerBusinessInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSpaceOwnerBusinessInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateSpaceOwnerProfileInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSpaceOwnerProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateSpaceOwnerBusinessInfoMutation, UpdateSpaceOwnerBusinessInfoMutationVariables>;
export const DashboardUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DashboardUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"NavigationSection_UserFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserSection_UserFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RoleBasedView_UserFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NavigationSection_UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"activeProfileType"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserSection_UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"activeProfileType"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoleBasedView_UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"activeProfileType"}}]}}]} as unknown as DocumentNode<DashboardUserQuery, DashboardUserQueryVariables>;
export const SharedSpaceDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SharedSpaceDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spaceById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Header_SharedSpaceFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Gallery_SharedSpaceFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"SpaceInfo_SpaceFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PricingCard_SpaceFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"OwnerCard_SpaceFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Header_SharedSpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Gallery_SharedSpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"images"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SpaceInfo_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"dimensionsText"}},{"kind":"Field","name":{"kind":"Name","value":"traffic"}},{"kind":"Field","name":{"kind":"Name","value":"availableFrom"}},{"kind":"Field","name":{"kind":"Name","value":"availableTo"}},{"kind":"Field","name":{"kind":"Name","value":"averageRating"}},{"kind":"Field","name":{"kind":"Name","value":"totalBookings"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PricingCard_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pricePerDay"}},{"kind":"Field","name":{"kind":"Name","value":"installationFee"}},{"kind":"Field","name":{"kind":"Name","value":"minDuration"}},{"kind":"Field","name":{"kind":"Name","value":"maxDuration"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OwnerCard_SpaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Space"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spaceOwnerProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"businessName"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}}]} as unknown as DocumentNode<SharedSpaceDetailQuery, SharedSpaceDetailQueryVariables>;
export const SwitchProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SwitchProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCurrentUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCurrentUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"activeProfileType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<SwitchProfileMutation, SwitchProfileMutationVariables>;