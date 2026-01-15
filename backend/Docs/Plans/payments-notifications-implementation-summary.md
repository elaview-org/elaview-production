# Payments and Notifications Implementation Summary

## Overview

Implemented complete `Features/Payments` and `Features/Notifications` following the Marketplace pattern where each
entity type has its own set of files (Service, Repository, Queries, Mutations, Payloads, Extensions).

## Files Created

### Features/Payments (24 files)

| File                      | Description                                                    |
|---------------------------|----------------------------------------------------------------|
| PaymentService.cs         | Payment intent creation, confirmation, core payment logic      |
| PaymentRepository.cs      | Payment data access with DataLoader                            |
| PaymentQueries.cs         | `paymentById`, `paymentsByBooking` queries                     |
| PaymentMutations.cs       | `createPaymentIntent`, `confirmPayment` mutations              |
| PaymentPayloads.cs        | `CreatePaymentIntentPayload`, `ConfirmPaymentPayload`          |
| PaymentExtensions.cs      | Payment refunds extension                                      |
| PayoutService.cs          | Payout processing, retry logic, earnings summary               |
| PayoutRepository.cs       | Payout data access with DataLoaders                            |
| PayoutQueries.cs          | `myPayouts`, `payoutById`, `earningsSummary` queries           |
| PayoutMutations.cs        | `processPayout`, `retryPayout` mutations (Admin only)          |
| PayoutPayloads.cs         | `ProcessPayoutPayload`, `RetryPayoutPayload`                   |
| PayoutExtensions.cs       | EarningsSummary decimal type extensions                        |
| RefundService.cs          | Refund request processing with Stripe                          |
| RefundRepository.cs       | Refund data access with DataLoaders                            |
| RefundMutations.cs        | `requestRefund` mutation (Admin only)                          |
| RefundPayloads.cs         | `RequestRefundPayload`                                         |
| TransactionService.cs     | Transaction ledger queries                                     |
| TransactionRepository.cs  | Transaction data access with DataLoader                        |
| TransactionQueries.cs     | `transactionsByBooking` query (Admin only)                     |
| StripeConnectService.cs   | Stripe Connect account creation and status refresh             |
| StripeConnectMutations.cs | `connectStripeAccount`, `refreshStripeAccountStatus` mutations |
| StripeConnectPayloads.cs  | `ConnectStripeAccountPayload`, `RefreshStripeAccountPayload`   |

### Features/Notifications (20 files)

| File                         | Description                                                                                              |
|------------------------------|----------------------------------------------------------------------------------------------------------|
| NotificationService.cs       | Notification CRUD, preferences, sending notifications                                                    |
| NotificationRepository.cs    | Notification and preference data access                                                                  |
| NotificationQueries.cs       | `myNotifications`, `notificationById`, `unreadNotificationsCount`, `myNotificationPreferences`           |
| NotificationMutations.cs     | `markNotificationRead`, `markAllNotificationsRead`, `deleteNotification`, `updateNotificationPreference` |
| NotificationPayloads.cs      | Notification mutation payloads                                                                           |
| NotificationInputs.cs        | `UpdateNotificationPreferenceInput`                                                                      |
| NotificationExtensions.cs    | Conversation extensions (messages, participants)                                                         |
| NotificationSubscriptions.cs | `onNotification`, `onMessage`, `onBookingUpdate`, `onProofUpdate` subscriptions                          |
| ConversationService.cs       | Conversation CRUD, booking conversation creation                                                         |
| ConversationRepository.cs    | Conversation data access with DataLoaders                                                                |
| ConversationQueries.cs       | `myConversations`, `conversationById`, `unreadConversationsCount`                                        |
| ConversationMutations.cs     | `createBookingConversation`, `markConversationRead`                                                      |
| ConversationPayloads.cs      | `CreateConversationPayload`, `MarkConversationReadPayload`                                               |
| MessageService.cs            | Message sending with notifications                                                                       |
| MessageRepository.cs         | Message data access with DataLoaders                                                                     |
| MessageQueries.cs            | `messagesByConversation` query                                                                           |
| MessageMutations.cs          | `sendMessage` mutation                                                                                   |
| MessagePayloads.cs           | `SendMessagePayload`                                                                                     |

### Tests/Shared/Factories

| File                   | Description                                                                                    |
|------------------------|------------------------------------------------------------------------------------------------|
| PaymentFactory.cs      | Payment, Payout, Refund, Transaction factories                                                 |
| NotificationFactory.cs | Notification, NotificationPreference, Conversation, Message, ConversationParticipant factories |

### Tests/Shared/Models

| File                     | Description                             |
|--------------------------|-----------------------------------------|
| PaymentResponses.cs      | GraphQL response DTOs for payments      |
| NotificationResponses.cs | GraphQL response DTOs for notifications |

### Tests/Integration

| File                          | Description                                                                                                     |
|-------------------------------|-----------------------------------------------------------------------------------------------------------------|
| PaymentQueriesTests.cs        | 5 integration tests for payment queries                                                                         |
| PaymentMutationsTests.cs      | 12 integration tests for payment mutations (auth, validation, ownership)                                        |
| PaymentAdminMutationsTests.cs | 10 integration tests for admin-only payment mutations (processPayout, retryPayout, requestRefund, transactions) |
| NotificationQueriesTests.cs   | 12 integration tests for notification/conversation queries                                                      |
| NotificationMutationsTests.cs | 8 integration tests for notification/message mutations                                                          |
| ConversationTests.cs          | 9 integration tests for conversation creation and messaging                                                     |
| SubscriptionTests.cs          | 7 integration tests for GraphQL subscription schema and topic events                                            |

## Architecture

All features follow the established pattern:

```
GraphQL Resolver → Service → Repository → DataLoader → Database
```

- Resolvers delegate to services
- Services handle business logic and authorization
- Repositories wrap DataLoaders for batched queries
- Type aliases used to resolve Stripe.Payout/Refund vs entity conflicts

## Required Manual Setup

### 1. Service Registration in Bootstrap/Services.cs

Add the following service registrations:

```csharp
// Payments
services.AddScoped<IPaymentService, PaymentService>();
services.AddScoped<IPaymentRepository, PaymentRepository>();
services.AddScoped<IPayoutService, PayoutService>();
services.AddScoped<IPayoutRepository, PayoutRepository>();
services.AddScoped<IRefundService, RefundService>();
services.AddScoped<IRefundRepository, RefundRepository>();
services.AddScoped<ITransactionService, TransactionService>();
services.AddScoped<ITransactionRepository, TransactionRepository>();
services.AddScoped<IStripeConnectService, StripeConnectService>();

// Notifications
services.AddScoped<INotificationService, NotificationService>();
services.AddScoped<INotificationRepository, NotificationRepository>();
services.AddScoped<INotificationPreferenceRepository, NotificationPreferenceRepository>();
services.AddScoped<IConversationService, ConversationService>();
services.AddScoped<IConversationRepository, ConversationRepository>();
services.AddScoped<IMessageService, MessageService>();
services.AddScoped<IMessageRepository, MessageRepository>();
```

### 2. Environment Variables Required

Stripe API is configured via environment variables:

| Variable                             | Description                                                                                     |
|--------------------------------------|-------------------------------------------------------------------------------------------------|
| `STRIPE_SECRET_KEY`                  | Stripe API secret key (set via Doppler)                                                         |
| `ELAVIEW_STRIPE_CONNECT_REFRESH_URL` | URL for Connect onboarding refresh (default: `http://localhost:3000/settings/payments/refresh`) |
| `ELAVIEW_STRIPE_CONNECT_RETURN_URL`  | URL for Connect onboarding return (default: `http://localhost:3000/settings/payments/complete`) |

### 3. HotChocolate GraphQL Registration

Ensure the query/mutation types are picked up. If using assembly scanning, they should be automatic. Otherwise add:

```csharp
.AddQueryType()
.AddMutationType()
.AddSubscriptionType()
```

With the partial classes being detected from Features namespace.

## Stripe Integration Details

### Payment Flow

1. `createPaymentIntent` - Creates Stripe PaymentIntent, stores pending Payment record
2. `confirmPayment` - Verifies PaymentIntent succeeded, updates Payment and Booking status, creates Transaction

### Payout Flow (Two-Stage)

1. Stage1 (30% + InstallationFee) - Triggered when owner downloads creative
2. Stage2 (70% remaining) - Triggered when proof approved or 48hr auto-approve

Payouts use Stripe Transfers to connected accounts.

### Stripe Connect

- `connectStripeAccount` - Creates Express account, returns onboarding URL
- `refreshStripeAccountStatus` - Updates account status (active/pending/incomplete)

## Subscription Topics

| Topic                       | Event                       |
|-----------------------------|-----------------------------|
| `notifications:{userId}`    | New notification for user   |
| `messages:{conversationId}` | New message in conversation |
| `bookings:{bookingId}`      | Booking status change       |
| `proofs:{bookingId}`        | Proof submission/review     |

## Build Status

- All code compiles successfully with `dotnet build`
- 10 NuGet vulnerability warnings (existing Azure.Identity and JWT packages)
- 0 compilation errors

## Test Coverage

63 integration tests written covering:

### Payment Tests (27 tests)

- Payment queries (paymentById, paymentsByBooking, myPayouts, earningsSummary)
- Payment mutations (createPaymentIntent, confirmPayment) with auth/validation errors
- Stripe Connect mutations (connectStripeAccount, refreshStripeAccountStatus)
- Admin mutations (processPayout, retryPayout, requestRefund) with validation
- Transaction queries (transactionsByBooking) with admin authorization

### Notification Tests (36 tests)

- Notification queries (myNotifications, notificationById, unreadCount, preferences)
- Notification mutations (mark read, mark all read, delete, update preferences)
- Conversation queries (myConversations, conversationById, unreadConversationsCount)
- Conversation mutations (createBookingConversation, markConversationRead)
- Message queries and mutations (messagesByConversation, sendMessage)
- Subscription schema introspection and topic event testing
- Authorization checks (unauthenticated, non-participant, other user's resources)

### Edge Cases Covered

- Unauthenticated access returns AUTH_NOT_AUTHENTICATED
- Accessing other user's resources returns error or null
- Admin-only endpoints reject non-admin users
- Invalid entity IDs return appropriate errors
- Duplicate operations handled correctly (e.g., same booking conversation)

## Notes

- Used Stripe.net v50.0.0 as specified
- Type aliases (`EntityPayout`, `EntityRefund`, `StripeRefundService`) resolve naming conflicts with Stripe namespace
- All factories use object initializers for init-only properties
- Following existing IntegrationTestBase patterns for seeding data in tests
