/**
 * Test data factories for creating realistic mock GraphQL responses.
 * Each factory returns complete, typed objects matching generated GraphQL types.
 * Uses simple utility functions instead of faker to keep dependencies minimal.
 */

import {
  type User,
  type UserRole,
  type UserStatus,
  ProfileType,
  PayoutSchedule,
  type Space,
  type SpaceType,
  type SpaceStatus,
  type Booking,
  type BookingStatus,
  type Campaign,
  type CampaignStatus,
  type Notification,
  type NotificationType,
  type Message,
  type MessageType,
  type Conversation,
  type Payment,
  type PaymentStatus,
  type PaymentType,
  type Payout,
  type PayoutStatus,
  type PayoutStage,
} from "@/types/gql/graphql";

/**
 * DeepPartial that preserves __typename as required (since codegen uses nonOptionalTypename).
 */
type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: P extends "__typename" ? T[P] : DeepPartial<T[P]>;
    }
  : T;

// Simple utility functions for generating test data
function randomId(): string {
  return "id-" + Math.random().toString(36).substr(2, 9);
}

function randomEmail(): string {
  return `user-${Math.random().toString(36).substr(2, 5)}@test.com`;
}

function randomName(): string {
  const firstNames = [
    "John",
    "Jane",
    "Mike",
    "Sarah",
    "Alex",
    "Emma",
    "Chris",
    "Lisa",
  ];
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
  ];
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
}

function randomPrice(): number {
  return Math.floor(Math.random() * 4900) + 100;
}

function randomPastDate(): string {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 365));
  return date.toISOString();
}

function randomFutureDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + Math.floor(Math.random() * 365));
  return date.toISOString();
}

function randomRecentDate(): string {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));
  return date.toISOString();
}

/**
 * Creates a mock User
 */
export function createMockUser(overrides?: DeepPartial<User>): User {
  const id = randomId();
  return {
    __typename: "User",
    id,
    email: randomEmail(),
    name: randomName(),
    phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
    role: "USER" as UserRole,
    status: "ACTIVE" as UserStatus,
    activeProfileType: ProfileType.Advertiser,
    createdAt: randomPastDate(),
    lastLoginAt: randomRecentDate(),
    password: "", // Never exposed in frontend
    advertiserProfile: null,
    spaceOwnerProfile: null,
    ...overrides,
  } as User;
}

/**
 * Creates a mock Space
 */
export function createMockSpace(overrides?: DeepPartial<Space>): Space {
  const id = randomId();
  return {
    __typename: "Space",
    id,
    title: `Space ${Math.floor(Math.random() * 1000)}`,
    description: "A beautiful storefront window with high foot traffic",
    address: `${Math.floor(Math.random() * 9000) + 1000} Main St`,
    city: "San Francisco",
    state: "CA",
    zipCode: "94105",
    latitude: 37.77 + Math.random() * 0.05,
    longitude: -122.41 + Math.random() * 0.05,
    type: "STOREFRONT" as SpaceType,
    status: "ACTIVE" as SpaceStatus,
    images: [
      `https://images.unsplash.com/photo-1${Math.floor(Math.random() * 1000000)}`,
      `https://images.unsplash.com/photo-1${Math.floor(Math.random() * 1000000)}`,
    ],
    pricePerDay: randomPrice(),
    installationFee: Math.floor(Math.random() * 90) + 10,
    minDuration: 7,
    maxDuration: 365,
    width: Math.floor(Math.random() * 25) + 5,
    height: Math.floor(Math.random() * 8) + 2,
    dimensions: `${Math.floor(Math.random() * 25) + 5}x${Math.floor(Math.random() * 8) + 2}`,
    dimensionsText: "Large storefront window",
    traffic: "High foot traffic",
    createdAt: randomPastDate(),
    updatedAt: randomRecentDate(),
    availableFrom: randomFutureDate(),
    availableTo: null,
    rejectionReason: null,
    averageRating: Math.random() * 5,
    totalBookings: Math.floor(Math.random() * 100),
    totalRevenue: Math.floor(Math.random() * 100000),
    blockedDates: [],
    bookings: null,
    reviews: null,
    pricingRules: [],
    effectivePrices: [],
    spaceOwnerProfile: {
      __typename: "SpaceOwnerProfile",
      id: randomId(),
      createdAt: randomPastDate(),
      onboardingComplete: true,
      businessName: `Business ${Math.floor(Math.random() * 1000)}`,
      businessType: "RETAIL",
      responseRate: 0.95,
      averageResponseTime: 24,
      payoutSchedule: PayoutSchedule.Weekly,
      stripeAccountId: "acct_xxxxx",
      stripeAccountStatus: "ACTIVE",
      stripeLastAccountHealthCheck: randomRecentDate(),
      stripeAccountDisconnectedAt: null,
      stripeAccountDisconnectedNotifiedAt: null,
      user: createMockUser({ activeProfileType: ProfileType.SpaceOwner }),
      userId: randomId(),
      spaces: null,
      reviews: null,
      payouts: [],
      manualPayouts: [],
    },
    spaceOwnerProfileId: randomId(),
    owner: null,
    ...overrides,
  } as Space;
}

/**
 * Creates a mock Booking
 */
export function createMockBooking(overrides?: DeepPartial<Booking>): Booking {
  const id = randomId();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30));
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 83) + 7);
  const totalDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const pricePerDay = 500;
  const subtotalAmount = totalDays * pricePerDay;
  const platformFeePercent = 0.1;
  const platformFeeAmount = subtotalAmount * platformFeePercent;
  const installationFee = 25;
  const totalAmount = subtotalAmount + platformFeeAmount + installationFee;

  return {
    __typename: "Booking",
    id,
    status: "APPROVED" as BookingStatus,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    totalDays,
    createdAt: randomPastDate(),
    updatedAt: randomRecentDate(),
    pricePerDay,
    subtotalAmount,
    platformFeeAmount,
    platformFeePercent,
    installationFee,
    totalAmount,
    ownerPayoutAmount: subtotalAmount * 0.85,
    advertiserNotes: null,
    ownerNotes: null,
    fileDownloadedAt: null,
    rejectedAt: null,
    rejectionReason: null,
    cancelledAt: null,
    cancellationReason: null,
    campaignId: randomId(),
    spaceId: randomId(),
    campaign: null,
    space: null,
    proof: null,
    dispute: null,
    payments: [],
    payouts: [],
    reviews: [],
    cancelledByUserId: null,
    cancelledByUser: null,
    ...overrides,
  } as Booking;
}

/**
 * Creates a mock Campaign
 */
export function createMockCampaign(
  overrides?: DeepPartial<Campaign>
): Campaign {
  const id = randomId();
  return {
    __typename: "Campaign",
    id,
    name: `Campaign ${Math.floor(Math.random() * 1000)}`,
    status: "ACTIVE" as CampaignStatus,
    imageUrl: `https://images.unsplash.com/photo-1${Math.floor(Math.random() * 1000000)}`,
    description: "An excellent marketing campaign",
    goals: "Increase brand awareness",
    targetAudience: "18-35 year old professionals",
    createdAt: randomPastDate(),
    updatedAt: randomRecentDate(),
    startDate: randomFutureDate(),
    endDate: randomFutureDate(),
    totalBudget: Math.floor(Math.random() * 49000) + 1000,
    totalSpend: Math.floor(Math.random() * 15000),
    spacesCount: Math.floor(Math.random() * 20) + 1,
    advertiser: null,
    advertiserProfile: {
      __typename: "AdvertiserProfile",
      id: randomId(),
      createdAt: randomPastDate(),
      onboardingComplete: true,
      companyName: `Company ${Math.floor(Math.random() * 1000)}`,
      industry: "Technology",
      website: "https://example.com",
      totalSpend: Math.floor(Math.random() * 100000),
      stripeAccountId: "acct_xxxxx",
      stripeAccountStatus: "ACTIVE",
      stripeLastAccountHealthCheck: randomRecentDate(),
      stripeAccountDisconnectedAt: null,
      stripeAccountDisconnectedNotifiedAt: null,
      stripeCustomerId: "cus_xxxxx",
      user: createMockUser({ activeProfileType: ProfileType.Advertiser }),
      userId: randomId(),
      campaigns: null,
      savedPaymentMethods: [],
    },
    advertiserProfileId: randomId(),
    bookings: null,
    ...overrides,
  } as Campaign;
}

/**
 * Creates a mock Notification
 */
export function createMockNotification(
  overrides?: DeepPartial<Notification>
): Notification {
  const id = randomId();
  return {
    __typename: "Notification",
    id,
    title: "Booking approved",
    body: "Your booking has been approved by the space owner.",
    type: "BOOKING_APPROVED" as NotificationType,
    isRead: false,
    readAt: null,
    createdAt: randomRecentDate(),
    entityId: randomId(),
    entityType: "Booking",
    userId: randomId(),
    user: createMockUser(),
    ...overrides,
  } as Notification;
}

/**
 * Creates a mock Message
 */
export function createMockMessage(overrides?: DeepPartial<Message>): Message {
  const id = randomId();
  return {
    __typename: "Message",
    id,
    content: "This is a test message",
    type: "TEXT" as MessageType,
    attachments: [],
    createdAt: randomRecentDate(),
    conversationId: randomId(),
    senderUserId: randomId(),
    conversation: createMockConversation(),
    senderUser: createMockUser(),
    ...overrides,
  } as Message;
}

/**
 * Creates a mock Conversation
 */
export function createMockConversation(
  overrides?: DeepPartial<Conversation>
): Conversation {
  const id = randomId();
  return {
    __typename: "Conversation",
    id,
    bookingId: randomId(),
    booking: createMockBooking(),
    createdAt: randomPastDate(),
    updatedAt: randomRecentDate(),
    messages: null,
    participants: [],
    ...overrides,
  } as Conversation;
}

/**
 * Creates a mock Payment
 */
export function createMockPayment(overrides?: DeepPartial<Payment>): Payment {
  const id = randomId();
  return {
    __typename: "Payment",
    id,
    amount: Math.floor(Math.random() * 9000) + 1000,
    status: "SUCCEEDED" as PaymentStatus,
    type: "FULL" as PaymentType,
    createdAt: randomPastDate(),
    paidAt: randomRecentDate(),
    failureReason: null,
    receiptUrl: null,
    stripePaymentIntentId: `pi_${randomId()}`,
    stripeChargeId: `ch_${randomId()}`,
    stripeFee: Math.floor(Math.random() * 490) + 10,
    bookingId: randomId(),
    booking: createMockBooking(),
    refunds: null,
    ...overrides,
  } as Payment;
}

/**
 * Creates a mock Payout
 */
export function createMockPayout(overrides?: DeepPartial<Payout>): Payout {
  const id = randomId();
  return {
    __typename: "Payout",
    id,
    amount: Math.floor(Math.random() * 4900) + 100,
    status: "COMPLETED" as PayoutStatus,
    stage: "STAGE_2" as PayoutStage,
    createdAt: randomPastDate(),
    processedAt: randomRecentDate(),
    failureReason: null,
    attemptCount: 1,
    lastAttemptAt: randomRecentDate(),
    stripeTransferId: `tr_${randomId()}`,
    bookingId: randomId(),
    booking: createMockBooking(),
    spaceOwnerProfileId: randomId(),
    spaceOwnerProfile: {
      __typename: "SpaceOwnerProfile",
      id: randomId(),
      createdAt: randomPastDate(),
      onboardingComplete: true,
      businessName: `Business ${Math.floor(Math.random() * 1000)}`,
      businessType: "RETAIL",
      responseRate: 0.95,
      averageResponseTime: 24,
      payoutSchedule: PayoutSchedule.Weekly,
      stripeAccountId: "acct_xxxxx",
      stripeAccountStatus: "ACTIVE",
      stripeLastAccountHealthCheck: randomRecentDate(),
      stripeAccountDisconnectedAt: null,
      stripeAccountDisconnectedNotifiedAt: null,
      user: createMockUser({ activeProfileType: ProfileType.SpaceOwner }),
      userId: randomId(),
      spaces: null,
      reviews: null,
      payouts: [],
      manualPayouts: [],
    },
    ...overrides,
  } as Payout;
}
