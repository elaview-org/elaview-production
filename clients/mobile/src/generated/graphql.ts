import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | undefined | null;
export type InputMaybe<T> = T | undefined | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: unknown; output: unknown; }
  Decimal: { input: unknown; output: unknown; }
  UUID: { input: unknown; output: unknown; }
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

export type AdvertiserProfileInput = {
  campaigns: Array<CampaignInput>;
  companyName?: InputMaybe<Scalars['String']['input']>;
  createdAt: Scalars['DateTime']['input'];
  id: Scalars['UUID']['input'];
  industry?: InputMaybe<Scalars['String']['input']>;
  onboardingComplete: Scalars['Boolean']['input'];
  stripeAccountDisconnectedAt?: InputMaybe<Scalars['DateTime']['input']>;
  stripeAccountDisconnectedNotifiedAt?: InputMaybe<Scalars['DateTime']['input']>;
  stripeAccountId?: InputMaybe<Scalars['String']['input']>;
  stripeAccountStatus?: InputMaybe<Scalars['String']['input']>;
  stripeLastAccountHealthCheck?: InputMaybe<Scalars['DateTime']['input']>;
  user: UserInput;
  userId: Scalars['UUID']['input'];
  website?: InputMaybe<Scalars['String']['input']>;
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

export type Booking = {
  __typename: 'Booking';
  advertiserNotes: Maybe<Scalars['String']['output']>;
  campaign: Campaign;
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
  space: Space;
  spaceId: Scalars['UUID']['output'];
  startDate: Scalars['DateTime']['output'];
  status: BookingStatus;
  subtotalAmount: Scalars['Decimal']['output'];
  totalAmount: Scalars['Decimal']['output'];
  totalDays: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
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

export type BookingDisputeInput = {
  booking: BookingInput;
  bookingId: Scalars['UUID']['input'];
  createdAt: Scalars['DateTime']['input'];
  disputedAt: Scalars['DateTime']['input'];
  disputedByUser: UserInput;
  disputedByUserId: Scalars['UUID']['input'];
  id: Scalars['UUID']['input'];
  issueType: DisputeIssueType;
  photos: Array<Scalars['String']['input']>;
  reason: Scalars['String']['input'];
  resolutionAction?: InputMaybe<Scalars['String']['input']>;
  resolutionNotes?: InputMaybe<Scalars['String']['input']>;
  resolvedAt?: InputMaybe<Scalars['DateTime']['input']>;
  resolvedByUser?: InputMaybe<UserInput>;
  resolvedByUserId?: InputMaybe<Scalars['UUID']['input']>;
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

export type BookingInput = {
  advertiserNotes?: InputMaybe<Scalars['String']['input']>;
  campaign: CampaignInput;
  campaignId: Scalars['UUID']['input'];
  cancellationReason?: InputMaybe<Scalars['String']['input']>;
  cancelledAt?: InputMaybe<Scalars['DateTime']['input']>;
  cancelledByUser?: InputMaybe<UserInput>;
  cancelledByUserId?: InputMaybe<Scalars['UUID']['input']>;
  createdAt: Scalars['DateTime']['input'];
  dispute?: InputMaybe<BookingDisputeInput>;
  endDate: Scalars['DateTime']['input'];
  fileDownloadedAt?: InputMaybe<Scalars['DateTime']['input']>;
  id: Scalars['UUID']['input'];
  installationFee: Scalars['Decimal']['input'];
  ownerNotes?: InputMaybe<Scalars['String']['input']>;
  ownerPayoutAmount: Scalars['Decimal']['input'];
  payments: Array<PaymentInput>;
  payouts: Array<PayoutInput>;
  platformFeeAmount: Scalars['Decimal']['input'];
  platformFeePercent: Scalars['Decimal']['input'];
  pricePerDay: Scalars['Decimal']['input'];
  proof?: InputMaybe<BookingProofInput>;
  rejectedAt?: InputMaybe<Scalars['DateTime']['input']>;
  rejectionReason?: InputMaybe<Scalars['String']['input']>;
  reviews: Array<ReviewInput>;
  space: SpaceInput;
  spaceId: Scalars['UUID']['input'];
  startDate: Scalars['DateTime']['input'];
  status: BookingStatus;
  subtotalAmount: Scalars['Decimal']['input'];
  totalAmount: Scalars['Decimal']['input'];
  totalDays: Scalars['Int']['input'];
  updatedAt: Scalars['DateTime']['input'];
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

export type BookingProofInput = {
  autoApproveAt: Scalars['DateTime']['input'];
  booking: BookingInput;
  bookingId: Scalars['UUID']['input'];
  createdAt: Scalars['DateTime']['input'];
  id: Scalars['UUID']['input'];
  photos: Array<Scalars['String']['input']>;
  rejectionReason?: InputMaybe<Scalars['String']['input']>;
  reviewedAt?: InputMaybe<Scalars['DateTime']['input']>;
  reviewedByUser?: InputMaybe<UserInput>;
  reviewedByUserId?: InputMaybe<Scalars['UUID']['input']>;
  status: ProofStatus;
  submittedAt: Scalars['DateTime']['input'];
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

export type BooleanOperationFilterInput = {
  eq?: InputMaybe<Scalars['Boolean']['input']>;
  neq?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Campaign = {
  __typename: 'Campaign';
  advertiserProfile: AdvertiserProfile;
  advertiserProfileId: Scalars['UUID']['output'];
  bookings: Array<Booking>;
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

export type CampaignInput = {
  advertiserProfile: AdvertiserProfileInput;
  advertiserProfileId: Scalars['UUID']['input'];
  bookings: Array<BookingInput>;
  createdAt: Scalars['DateTime']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  goals?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
  imageUrl: Scalars['String']['input'];
  name: Scalars['String']['input'];
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  status: CampaignStatus;
  targetAudience?: InputMaybe<Scalars['String']['input']>;
  totalBudget?: InputMaybe<Scalars['Decimal']['input']>;
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

export type Mutation = {
  __typename: 'Mutation';
  createSpace: CreateSpacePayload;
  deleteSpace: DeleteSpacePayload;
  updateCurrentUser: UpdateCurrentUserPayload;
};


export type MutationCreateSpaceArgs = {
  input: CreateSpaceInput;
};


export type MutationDeleteSpaceArgs = {
  input: DeleteSpaceInput;
};


export type MutationUpdateCurrentUserArgs = {
  input: UpdateCurrentUserInput;
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
  refunds: Array<Refund>;
  status: PaymentStatus;
  stripeChargeId: Maybe<Scalars['String']['output']>;
  stripeFee: Maybe<Scalars['Decimal']['output']>;
  stripePaymentIntentId: Scalars['String']['output'];
  type: PaymentType;
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

export type PaymentInput = {
  amount: Scalars['Decimal']['input'];
  booking: BookingInput;
  bookingId: Scalars['UUID']['input'];
  createdAt: Scalars['DateTime']['input'];
  failureReason?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
  paidAt?: InputMaybe<Scalars['DateTime']['input']>;
  refunds: Array<RefundInput>;
  status: PaymentStatus;
  stripeChargeId?: InputMaybe<Scalars['String']['input']>;
  stripeFee?: InputMaybe<Scalars['Decimal']['input']>;
  stripePaymentIntentId: Scalars['String']['input'];
  type: PaymentType;
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

export type PayoutInput = {
  amount: Scalars['Decimal']['input'];
  attemptCount: Scalars['Int']['input'];
  booking: BookingInput;
  bookingId: Scalars['UUID']['input'];
  createdAt: Scalars['DateTime']['input'];
  failureReason?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
  lastAttemptAt?: InputMaybe<Scalars['DateTime']['input']>;
  processedAt?: InputMaybe<Scalars['DateTime']['input']>;
  spaceOwnerProfile: SpaceOwnerProfileInput;
  spaceOwnerProfileId: Scalars['UUID']['input'];
  stage: PayoutStage;
  status: PayoutStatus;
  stripeTransferId?: InputMaybe<Scalars['String']['input']>;
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
  currentUser: Maybe<User>;
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

export type RefundInput = {
  amount: Scalars['Decimal']['input'];
  booking: BookingInput;
  bookingId: Scalars['UUID']['input'];
  createdAt: Scalars['DateTime']['input'];
  id: Scalars['UUID']['input'];
  payment: PaymentInput;
  paymentId: Scalars['UUID']['input'];
  processedAt?: InputMaybe<Scalars['DateTime']['input']>;
  reason: Scalars['String']['input'];
  status: RefundStatus;
  stripeRefundId?: InputMaybe<Scalars['String']['input']>;
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

export type ReviewInput = {
  booking: BookingInput;
  bookingId: Scalars['UUID']['input'];
  comment?: InputMaybe<Scalars['String']['input']>;
  createdAt: Scalars['DateTime']['input'];
  id: Scalars['UUID']['input'];
  rating: Scalars['Int']['input'];
  reviewerProfileId: Scalars['UUID']['input'];
  reviewerType: ReviewerType;
  space: SpaceInput;
  spaceId: Scalars['UUID']['input'];
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
  id: Scalars['UUID']['output'];
  images: Array<Scalars['String']['output']>;
  installationFee: Maybe<Scalars['Decimal']['output']>;
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  maxDuration: Maybe<Scalars['Int']['output']>;
  minDuration: Scalars['Int']['output'];
  pricePerDay: Scalars['Decimal']['output'];
  rejectionReason: Maybe<Scalars['String']['output']>;
  reviews: Array<Review>;
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

export type SpaceInput = {
  address: Scalars['String']['input'];
  availableFrom?: InputMaybe<Scalars['DateTime']['input']>;
  availableTo?: InputMaybe<Scalars['DateTime']['input']>;
  averageRating?: InputMaybe<Scalars['Float']['input']>;
  bookings: Array<BookingInput>;
  city: Scalars['String']['input'];
  createdAt: Scalars['DateTime']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  dimensions?: InputMaybe<Scalars['String']['input']>;
  dimensionsText?: InputMaybe<Scalars['String']['input']>;
  height?: InputMaybe<Scalars['Float']['input']>;
  id: Scalars['UUID']['input'];
  images: Array<Scalars['String']['input']>;
  installationFee?: InputMaybe<Scalars['Decimal']['input']>;
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
  maxDuration?: InputMaybe<Scalars['Int']['input']>;
  minDuration: Scalars['Int']['input'];
  pricePerDay: Scalars['Decimal']['input'];
  rejectionReason?: InputMaybe<Scalars['String']['input']>;
  reviews: Array<ReviewInput>;
  spaceOwnerProfile: SpaceOwnerProfileInput;
  spaceOwnerProfileId: Scalars['UUID']['input'];
  state: Scalars['String']['input'];
  status: SpaceStatus;
  title: Scalars['String']['input'];
  totalBookings: Scalars['Int']['input'];
  totalRevenue: Scalars['Decimal']['input'];
  traffic?: InputMaybe<Scalars['String']['input']>;
  type: SpaceType;
  width?: InputMaybe<Scalars['Float']['input']>;
  zipCode?: InputMaybe<Scalars['String']['input']>;
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

export type SpaceOwnerProfileInput = {
  businessName?: InputMaybe<Scalars['String']['input']>;
  businessType?: InputMaybe<Scalars['String']['input']>;
  createdAt: Scalars['DateTime']['input'];
  id: Scalars['UUID']['input'];
  onboardingComplete: Scalars['Boolean']['input'];
  payoutSchedule: PayoutSchedule;
  payouts: Array<PayoutInput>;
  spaces: Array<SpaceInput>;
  stripeAccountDisconnectedAt?: InputMaybe<Scalars['DateTime']['input']>;
  stripeAccountDisconnectedNotifiedAt?: InputMaybe<Scalars['DateTime']['input']>;
  stripeAccountId?: InputMaybe<Scalars['String']['input']>;
  stripeAccountStatus?: InputMaybe<Scalars['String']['input']>;
  stripeLastAccountHealthCheck?: InputMaybe<Scalars['DateTime']['input']>;
  user: UserInput;
  userId: Scalars['UUID']['input'];
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

export type UpdateCurrentUserInput = {
  updatedUser: UserInput;
};

export type UpdateCurrentUserPayload = {
  __typename: 'UpdateCurrentUserPayload';
  user: Maybe<User>;
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

export type UserInput = {
  activeProfileType: ProfileType;
  advertiserProfile?: InputMaybe<AdvertiserProfileInput>;
  avatar?: InputMaybe<Scalars['String']['input']>;
  createdAt: Scalars['DateTime']['input'];
  email: Scalars['String']['input'];
  id: Scalars['UUID']['input'];
  lastLoginAt?: InputMaybe<Scalars['DateTime']['input']>;
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  role: UserRole;
  spaceOwnerProfile?: InputMaybe<SpaceOwnerProfileInput>;
  status: UserStatus;
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

export type GetSpacesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSpacesQuery = { spaces: { __typename: 'SpacesConnection', nodes: Array<{ __typename: 'Space', id: unknown, title: string }> | undefined | null } | undefined | null };


export const GetSpacesDocument = gql`
    query GetSpaces {
  spaces {
    nodes {
      id
      title
    }
  }
}
    `;

/**
 * __useGetSpacesQuery__
 *
 * To run a query within a React component, call `useGetSpacesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSpacesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSpacesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSpacesQuery(baseOptions?: Apollo.QueryHookOptions<GetSpacesQuery, GetSpacesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSpacesQuery, GetSpacesQueryVariables>(GetSpacesDocument, options);
      }
export function useGetSpacesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSpacesQuery, GetSpacesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSpacesQuery, GetSpacesQueryVariables>(GetSpacesDocument, options);
        }
// @ts-ignore
export function useGetSpacesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetSpacesQuery, GetSpacesQueryVariables>): Apollo.UseSuspenseQueryResult<GetSpacesQuery, GetSpacesQueryVariables>;
export function useGetSpacesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSpacesQuery, GetSpacesQueryVariables>): Apollo.UseSuspenseQueryResult<GetSpacesQuery | undefined, GetSpacesQueryVariables>;
export function useGetSpacesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSpacesQuery, GetSpacesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSpacesQuery, GetSpacesQueryVariables>(GetSpacesDocument, options);
        }
export type GetSpacesQueryHookResult = ReturnType<typeof useGetSpacesQuery>;
export type GetSpacesLazyQueryHookResult = ReturnType<typeof useGetSpacesLazyQuery>;
export type GetSpacesSuspenseQueryHookResult = ReturnType<typeof useGetSpacesSuspenseQuery>;
export type GetSpacesQueryResult = Apollo.QueryResult<GetSpacesQuery, GetSpacesQueryVariables>;