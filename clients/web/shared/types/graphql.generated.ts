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

export enum BugSeverity {
  Critical = 'CRITICAL',
  High = 'HIGH',
  Low = 'LOW',
  Medium = 'MEDIUM'
}

export enum BugStatus {
  Confirmed = 'CONFIRMED',
  Duplicate = 'DUPLICATE',
  Fixed = 'FIXED',
  InProgress = 'IN_PROGRESS',
  New = 'NEW',
  WontFix = 'WONT_FIX'
}

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

export enum CampaignStatus {
  Active = 'ACTIVE',
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Draft = 'DRAFT',
  Submitted = 'SUBMITTED'
}

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

export type JsonDocument = {
  __typename: 'JsonDocument';
  rootElement: Scalars['JSON']['output'];
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

export enum PaymentType {
  Deposit = 'DEPOSIT',
  Immediate = 'IMMEDIATE'
}

export enum PayoutSchedule {
  Biweekly = 'BIWEEKLY',
  Monthly = 'MONTHLY',
  Weekly = 'WEEKLY'
}

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
  userById: Maybe<User>;
};


export type QueryUserByIdArgs = {
  id: Scalars['String']['input'];
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

export enum ReviewerType {
  Advertiser = 'ADVERTISER',
  SpaceOwner = 'SPACE_OWNER'
}

export type SecuritySettings = {
  __typename: 'SecuritySettings';
  deviceSessions: Array<DeviceSession>;
  loginNotifications: Scalars['Boolean']['output'];
  twoFactorEnabled: Scalars['Boolean']['output'];
};

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

export enum SpaceStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  PendingApproval = 'PENDING_APPROVAL',
  Rejected = 'REJECTED',
  Suspended = 'SUSPENDED'
}

export enum SpaceType {
  Billboard = 'BILLBOARD',
  DigitalDisplay = 'DIGITAL_DISPLAY',
  Other = 'OTHER',
  Storefront = 'STOREFRONT',
  Transit = 'TRANSIT',
  VehicleWrap = 'VEHICLE_WRAP',
  WindowDisplay = 'WINDOW_DISPLAY'
}

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

export enum UserRole {
  Admin = 'ADMIN',
  Advertiser = 'ADVERTISER',
  Marketing = 'MARKETING',
  SpaceOwner = 'SPACE_OWNER'
}

export enum UserStatus {
  Active = 'ACTIVE',
  Deleted = 'DELETED',
  Suspended = 'SUSPENDED'
}
