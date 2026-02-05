/* eslint-disable */
import * as types from "./graphql";
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
  "\n  fragment BookingCard_AdvertiserBookingFragment on Booking {\n    id\n    status\n    startDate\n    endDate\n    totalAmount\n    space {\n      title\n      images\n      city\n      state\n      owner {\n        businessName\n      }\n    }\n    campaign {\n      name\n    }\n  }\n": typeof types.BookingCard_AdvertiserBookingFragmentFragmentDoc;
  "\n  fragment BookingsTable_AdvertiserBookingFragment on Booking {\n    id\n    status\n    startDate\n    endDate\n    totalAmount\n    space {\n      title\n      images\n      city\n      state\n      owner {\n        businessName\n      }\n    }\n    campaign {\n      name\n    }\n  }\n": typeof types.BookingsTable_AdvertiserBookingFragmentFragmentDoc;
  "\n      query AdvertiserBookings {\n        myBookingsAsAdvertiser {\n          nodes {\n            id\n            ...BookingCard_AdvertiserBookingFragment\n            ...BookingsTable_AdvertiserBookingFragment\n          }\n        }\n      }\n    ": typeof types.AdvertiserBookingsDocument;
  "\n  fragment CampaignCard_CampaignFragment on Campaign {\n    id\n    name\n    description\n    status\n    startDate\n    endDate\n    totalBudget\n    imageUrl\n    bookings {\n      nodes {\n        id\n      }\n    }\n  }\n": typeof types.CampaignCard_CampaignFragmentFragmentDoc;
  "\n  fragment CampaignsTable_CampaignFragment on Campaign {\n    id\n    name\n    description\n    status\n    startDate\n    endDate\n    totalBudget\n    imageUrl\n    bookings {\n      nodes {\n        id\n      }\n    }\n  }\n": typeof types.CampaignsTable_CampaignFragmentFragmentDoc;
  "\n      query AdvertiserCampaigns {\n        myCampaigns {\n          nodes {\n            id\n            ...CampaignCard_CampaignFragment\n            ...CampaignsTable_CampaignFragment\n          }\n        }\n      }\n    ": typeof types.AdvertiserCampaignsDocument;
  "\n  fragment DiscoverSpaceCard_SpaceFragment on Space {\n    id\n    title\n    description\n    city\n    state\n    images\n    type\n    pricePerDay\n  }\n": typeof types.DiscoverSpaceCard_SpaceFragmentFragmentDoc;
  "\n  fragment DiscoverMap_SpaceFragment on Space {\n    id\n    title\n    address\n    city\n    state\n    zipCode\n    latitude\n    longitude\n    pricePerDay\n    type\n    images\n    width\n    height\n  }\n": typeof types.DiscoverMap_SpaceFragmentFragmentDoc;
  "\n  fragment DiscoverTable_SpaceFragment on Space {\n    id\n    title\n    city\n    state\n    images\n    type\n    pricePerDay\n  }\n": typeof types.DiscoverTable_SpaceFragmentFragmentDoc;
  "\n          query DiscoverSpaces {\n            spaces(first: 32, where: { status: { eq: ACTIVE } }) {\n              nodes {\n                id\n                ...DiscoverSpaceCard_SpaceFragment\n                ...DiscoverTable_SpaceFragment\n                ...DiscoverMap_SpaceFragment\n              }\n            }\n          }\n        ": typeof types.DiscoverSpacesDocument;
  "\n  fragment BookingCard_BookingFragment on Booking {\n    id\n    status\n    startDate\n    endDate\n    ownerPayoutAmount\n    space {\n      title\n      images\n    }\n    campaign {\n      name\n      advertiserProfile {\n        companyName\n      }\n    }\n  }\n": typeof types.BookingCard_BookingFragmentFragmentDoc;
  "\n  fragment BookingsTable_BookingFragment on Booking {\n    id\n    status\n    startDate\n    endDate\n    ownerPayoutAmount\n    space {\n      title\n      images\n    }\n    campaign {\n      name\n      advertiserProfile {\n        companyName\n      }\n    }\n  }\n": typeof types.BookingsTable_BookingFragmentFragmentDoc;
  "\n          query SpaceOwnerBookings {\n            myBookingsAsOwner {\n              nodes {\n                id\n                ...BookingCard_BookingFragment\n                ...BookingsTable_BookingFragment\n              }\n            }\n          }\n        ": typeof types.SpaceOwnerBookingsDocument;
  "\n  fragment BalanceCards_EarningsSummaryFragment on EarningsSummary {\n    availableBalance\n    pendingPayouts\n    thisMonthEarnings\n    lastMonthEarnings\n    totalEarnings\n  }\n": typeof types.BalanceCards_EarningsSummaryFragmentFragmentDoc;
  "\n        query SpaceOwnerEarnings {\n          earningsSummary {\n            ...BalanceCards_EarningsSummaryFragment\n          }\n          myPayouts {\n            nodes {\n              id\n              amount\n              processedAt\n              ...PayoutsTable_PayoutFragment\n            }\n          }\n        }\n      ": typeof types.SpaceOwnerEarningsDocument;
  "\n  fragment PayoutsTable_PayoutFragment on Payout {\n    id\n    amount\n    stage\n    status\n    processedAt\n    booking {\n      id\n      space {\n        title\n      }\n    }\n  }\n": typeof types.PayoutsTable_PayoutFragmentFragmentDoc;
  "\n  fragment SpaceCard_SpaceFragment on Space {\n    id\n    title\n    description\n    city\n    state\n    images\n    type\n    status\n    createdAt\n  }\n": typeof types.SpaceCard_SpaceFragmentFragmentDoc;
  "\n  fragment ListingsTable_SpaceFragment on Space {\n    id\n    title\n    city\n    state\n    images\n    type\n    status\n    createdAt\n  }\n": typeof types.ListingsTable_SpaceFragmentFragmentDoc;
  "\n  fragment Details_SpaceFragment on Space {\n    id\n    description\n    type\n    address\n    city\n    state\n    zipCode\n    traffic\n    pricePerDay\n    installationFee\n    minDuration\n    maxDuration\n    width\n    height\n    dimensionsText\n    availableFrom\n    availableTo\n  }\n": typeof types.Details_SpaceFragmentFragmentDoc;
  "\n  fragment Gallery_SpaceFragment on Space {\n    id\n    title\n    images\n  }\n": typeof types.Gallery_SpaceFragmentFragmentDoc;
  "\n  fragment Header_SpaceFragment on Space {\n    title\n    status\n  }\n": typeof types.Header_SpaceFragmentFragmentDoc;
  "\n        query SpaceDetail($id: ID!) {\n          spaceById(id: $id) {\n            id\n            ...Header_SpaceFragment\n            ...Gallery_SpaceFragment\n            ...Details_SpaceFragment\n            ...Performance_SpaceFragment\n          }\n        }\n      ": typeof types.SpaceDetailDocument;
  "\n  fragment Performance_SpaceFragment on Space {\n    totalBookings\n    totalRevenue\n    averageRating\n  }\n": typeof types.Performance_SpaceFragmentFragmentDoc;
  "\n        query SpaceOwnerListings(\n          $first: Int\n          $last: Int\n          $after: String\n          $before: String\n          $order: [SpaceSortInput!]\n          $where: SpaceFilterInput\n          $gridView: Boolean!\n          $tableView: Boolean!\n        ) {\n          mySpaces(\n            first: $first\n            last: $last\n            after: $after\n            before: $before\n            order: $order\n            where: $where\n          ) {\n            nodes {\n              id\n              ...SpaceCard_SpaceFragment @include(if: $gridView)\n              ...ListingsTable_SpaceFragment @include(if: $tableView)\n            }\n            pageInfo {\n              hasNextPage\n              hasPreviousPage\n              startCursor\n              endCursor\n            }\n          }\n        }\n      ": typeof types.SpaceOwnerListingsDocument;
  "\n  fragment OverviewActiveBookingsBookingCard_BookingFragment on Booking {\n    id\n    status\n    campaign {\n      advertiser {\n        user {\n          name\n        }\n      }\n    }\n    space {\n      id\n      title\n    }\n    startDate\n    endDate\n  }\n": typeof types.OverviewActiveBookingsBookingCard_BookingFragmentFragmentDoc;
  "\n  fragment OverviewActiveBookings_QueryFragment on Query {\n    myBookingsAsOwner(\n      first: 5\n      where: { status: { in: [PAID, FILE_DOWNLOADED, INSTALLED] } }\n    ) {\n      nodes {\n        ...OverviewActiveBookingsBookingCard_BookingFragment\n      }\n    }\n  }\n": typeof types.OverviewActiveBookings_QueryFragmentFragmentDoc;
  "\n  fragment OverviewPendingRequests_QueryFragment on Query {\n    incomingBookingRequests(first: 5) {\n      nodes {\n        ...OverviewPendingRequestsRequestCard_BookingFragment\n      }\n    }\n  }\n": typeof types.OverviewPendingRequests_QueryFragmentFragmentDoc;
  "\n  fragment OverviewPendingRequestsRequestCard_BookingFragment on Booking {\n    id\n    campaign {\n      advertiser {\n        user {\n          name\n          avatar\n        }\n      }\n    }\n    space {\n      id\n      title\n    }\n    startDate\n    endDate\n    totalAmount\n    createdAt\n  }\n": typeof types.OverviewPendingRequestsRequestCard_BookingFragmentFragmentDoc;
  "\n  fragment OverviewStatCards_QueryFragment on Query {\n    earningsSummary {\n      availableBalance\n      pendingPayouts\n      thisMonthEarnings\n      lastMonthEarnings\n    }\n  }\n": typeof types.OverviewStatCards_QueryFragmentFragmentDoc;
  "\n  fragment OverviewTopSpaces_QueryFragment on Query {\n    me {\n      spaceOwnerProfile {\n        spaces(first: 5, order: { totalRevenue: DESC }) {\n          nodes {\n            ...OverviewTopSpacesSpaceCard_SpaceFragment\n          }\n        }\n      }\n    }\n  }\n": typeof types.OverviewTopSpaces_QueryFragmentFragmentDoc;
  "\n  fragment OverviewTopSpacesSpaceCard_SpaceFragment on Space {\n    id\n    title\n    images\n    totalBookings\n    totalRevenue\n    averageRating\n    status\n  }\n": typeof types.OverviewTopSpacesSpaceCard_SpaceFragmentFragmentDoc;
  "\n      query OverviewData {\n        ...OverviewStatCards_QueryFragment\n        ...OverviewPendingRequests_QueryFragment\n        ...OverviewActiveBookings_QueryFragment\n        ...OverviewTopSpaces_QueryFragment\n      }\n    ": typeof types.OverviewDataDocument;
  "\n        query DashboardUser {\n          me {\n            id\n            ...NavigationSection_UserFragment\n            ...UserSection_UserFragment\n            ...RoleBasedView_UserFragment\n          }\n        }\n      ": typeof types.DashboardUserDocument;
  "\n  mutation SendMessage($input: SendMessageInput!) {\n    sendMessage(input: $input) {\n      message {\n        id\n        content\n        type\n        attachments\n        createdAt\n        senderUser {\n          id\n          name\n          avatar\n        }\n      }\n      errors {\n        ... on ForbiddenError {\n          message\n        }\n      }\n    }\n  }\n": typeof types.SendMessageDocument;
  "\n  mutation MarkConversationRead($input: MarkConversationReadInput!) {\n    markConversationRead(input: $input) {\n      participant {\n        id\n        lastReadAt\n      }\n      errors {\n        ... on ForbiddenError {\n          message\n        }\n      }\n    }\n  }\n": typeof types.MarkConversationReadDocument;
  "\n  query LoadEarlierMessages($conversationId: ID!, $before: String) {\n    messagesByConversation(\n      conversationId: $conversationId\n      last: 50\n      before: $before\n      order: [{ createdAt: ASC }]\n    ) {\n      nodes {\n        id\n        content\n        type\n        attachments\n        createdAt\n        senderUser {\n          id\n          name\n          avatar\n        }\n      }\n      pageInfo {\n        hasPreviousPage\n        startCursor\n      }\n    }\n  }\n": typeof types.LoadEarlierMessagesDocument;
  "\n  mutation NotifyTyping($input: NotifyTypingInput!) {\n    notifyTyping(input: $input) {\n      boolean\n    }\n  }\n": typeof types.NotifyTypingDocument;
  "\n  fragment MessageBubble_MessageFragment on Message {\n    id\n    content\n    type\n    attachments\n    createdAt\n    senderUser {\n      id\n      name\n      avatar\n    }\n  }\n": typeof types.MessageBubble_MessageFragmentFragmentDoc;
  "\n  subscription OnMessage($conversationId: ID!) {\n    onMessage(conversationId: $conversationId) {\n      id\n      content\n      type\n      attachments\n      createdAt\n      senderUser {\n        id\n        name\n        avatar\n      }\n    }\n  }\n": typeof types.OnMessageDocument;
  "\n  subscription OnTyping($conversationId: ID!) {\n    onTyping(conversationId: $conversationId) {\n      conversationId\n      userId\n      userName\n      userAvatar\n      isTyping\n      timestamp\n    }\n  }\n": typeof types.OnTypingDocument;
  "\n  fragment ThreadHeader_ConversationFragment on Conversation {\n    id\n    booking {\n      id\n      status\n      startDate\n      endDate\n      totalAmount\n      pricePerDay\n      totalDays\n      installationFee\n      space {\n        id\n        title\n        images\n        address\n        city\n        state\n      }\n    }\n  }\n": typeof types.ThreadHeader_ConversationFragmentFragmentDoc;
  "\n  query MessagesData {\n    me {\n      id\n    }\n    myConversations(first: 50, order: [{ updatedAt: DESC }]) {\n      nodes {\n        ...ConversationItem_ConversationFragment\n      }\n    }\n    unreadConversationsCount\n  }\n": typeof types.MessagesDataDocument;
  "\n  query ThreadData($conversationId: ID!) {\n    me {\n      id\n    }\n    myConversations(first: 50, order: [{ updatedAt: DESC }]) {\n      nodes {\n        ...ConversationItem_ConversationFragment\n        ...ThreadHeader_ConversationFragment\n      }\n    }\n    unreadConversationsCount\n    messagesByConversation(\n      conversationId: $conversationId\n      first: 50\n      order: [{ createdAt: ASC }]\n    ) {\n      nodes {\n        ...MessageBubble_MessageFragment\n      }\n      pageInfo {\n        hasPreviousPage\n        startCursor\n      }\n    }\n  }\n": typeof types.ThreadDataDocument;
  "\n  fragment ConversationItem_ConversationFragment on Conversation {\n    id\n    updatedAt\n    booking {\n      id\n      status\n      space {\n        id\n        title\n      }\n    }\n    participants {\n      user {\n        id\n        name\n        avatar\n      }\n      lastReadAt\n    }\n    messages(first: 1, order: [{ createdAt: DESC }]) {\n      nodes {\n        id\n        content\n        type\n        createdAt\n        senderUser {\n          id\n        }\n      }\n    }\n  }\n": typeof types.ConversationItem_ConversationFragmentFragmentDoc;
  "\n  fragment NavigationSection_UserFragment on User {\n    role\n    activeProfileType\n  }\n": typeof types.NavigationSection_UserFragmentFragmentDoc;
  "\n  subscription OnNotification($userId: ID!) {\n    onNotification(userId: $userId) {\n      id\n      title\n      body\n      type\n      isRead\n      createdAt\n      entityId\n      entityType\n    }\n  }\n": typeof types.OnNotificationDocument;
  "\n        mutation MarkNotificationRead($input: MarkNotificationReadInput!) {\n          markNotificationRead(input: $input) {\n            notification {\n              id\n              isRead\n              readAt\n            }\n            errors {\n              ... on Error {\n                message\n              }\n            }\n          }\n        }\n      ": typeof types.MarkNotificationReadDocument;
  "\n        mutation MarkAllNotificationsRead {\n          markAllNotificationsRead {\n            count\n          }\n        }\n      ": typeof types.MarkAllNotificationsReadDocument;
  "\n        mutation DeleteNotification($input: DeleteNotificationInput!) {\n          deleteNotification(input: $input) {\n            success\n          }\n        }\n      ": typeof types.DeleteNotificationDocument;
  "\n  query LoadMoreNotifications(\n    $after: String\n    $isRead: Boolean\n    $type: NotificationType\n  ) {\n    myNotifications(\n      first: 20\n      after: $after\n      where: { and: [{ isRead: { eq: $isRead } }, { type: { eq: $type } }] }\n      order: [{ createdAt: DESC }]\n    ) {\n      nodes {\n        id\n        title\n        body\n        type\n        isRead\n        readAt\n        createdAt\n        entityId\n        entityType\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n": typeof types.LoadMoreNotificationsDocument;
  "\n        query NotificationsPage {\n          me {\n            id\n          }\n          myNotifications(first: 20, order: [{ createdAt: DESC }]) {\n            nodes {\n              id\n              title\n              body\n              type\n              isRead\n              createdAt\n              readAt\n              entityId\n              entityType\n            }\n            pageInfo {\n              hasNextPage\n              endCursor\n            }\n          }\n          unreadNotificationsCount\n        }\n      ": typeof types.NotificationsPageDocument;
  "\n  fragment About_UserFragment on User {\n    name\n    activeProfileType\n    spaceOwnerProfile {\n      businessName\n      businessType\n      onboardingComplete\n      responseRate\n      averageResponseTime\n      spaces(first: 10) {\n        nodes {\n          id\n        }\n      }\n    }\n    advertiserProfile {\n      companyName\n      industry\n      website\n      onboardingComplete\n      campaigns(first: 10, order: [{ createdAt: DESC }]) {\n        nodes {\n          status\n        }\n      }\n    }\n  }\n": typeof types.About_UserFragmentFragmentDoc;
  "\n  fragment Activity_UserFragment on User {\n    name\n    activeProfileType\n    spaceOwnerProfile {\n      reviews(first: 10, order: [{ createdAt: DESC }]) {\n        nodes {\n          id\n          rating\n          comment\n          createdAt\n          reviewer {\n            name\n            avatar\n            companyName\n          }\n        }\n      }\n    }\n    advertiserProfile {\n      campaigns(first: 10, order: [{ createdAt: DESC }]) {\n        nodes {\n          id\n          name\n          status\n          startDate\n          endDate\n          totalSpend\n          spacesCount\n        }\n      }\n    }\n  }\n": typeof types.Activity_UserFragmentFragmentDoc;
  "\n  fragment Info_UserFragment on User {\n    name\n    avatar\n    activeProfileType\n    spaceOwnerProfile {\n      createdAt\n      spaces(first: 10) {\n        nodes {\n          averageRating\n        }\n      }\n      reviews(first: 10, order: [{ createdAt: DESC }]) {\n        nodes {\n          id\n        }\n      }\n    }\n    advertiserProfile {\n      createdAt\n      totalSpend\n      campaigns(first: 10, order: [{ createdAt: DESC }]) {\n        nodes {\n          id\n        }\n      }\n    }\n  }\n": typeof types.Info_UserFragmentFragmentDoc;
  "\n        query Profile {\n          me {\n            id\n            name\n            ...ProfileLayout_UserFragment\n            ...Info_UserFragment\n            ...About_UserFragment\n            ...Activity_UserFragment\n          }\n        }\n      ": typeof types.ProfileDocument;
  "\n  fragment ProfileLayout_UserFragment on User {\n    role\n  }\n": typeof types.ProfileLayout_UserFragmentFragmentDoc;
  "\n  fragment RoleBasedView_UserFragment on User {\n    role\n    activeProfileType\n  }\n": typeof types.RoleBasedView_UserFragmentFragmentDoc;
  "\n  fragment AccountSettings_UserFragment on User {\n    createdAt\n    lastLoginAt\n    activeProfileType\n  }\n": typeof types.AccountSettings_UserFragmentFragmentDoc;
  "\n  fragment BusinessSettings_UserFragment on User {\n    activeProfileType\n    spaceOwnerProfile {\n      businessName\n      businessType\n      payoutSchedule\n    }\n    advertiserProfile {\n      companyName\n      industry\n      website\n    }\n  }\n": typeof types.BusinessSettings_UserFragmentFragmentDoc;
  "\n  fragment NotificationSettings_UserFragment on User {\n    activeProfileType\n  }\n": typeof types.NotificationSettings_UserFragmentFragmentDoc;
  "\n  fragment PaymentSettings_UserFragment on User {\n    activeProfileType\n  }\n": typeof types.PaymentSettings_UserFragmentFragmentDoc;
  "\n  fragment PayoutSettings_UserFragment on User {\n    activeProfileType\n    spaceOwnerProfile {\n      stripeAccountId\n      stripeAccountStatus\n    }\n  }\n": typeof types.PayoutSettings_UserFragmentFragmentDoc;
  "\n  fragment ProfileSettings_UserFragment on User {\n    name\n    email\n    phone\n    avatar\n    activeProfileType\n  }\n": typeof types.ProfileSettings_UserFragmentFragmentDoc;
  "\n        query Settings {\n          me {\n            id\n            email\n            name\n            avatar\n            phone\n            createdAt\n            lastLoginAt\n            activeProfileType\n            ...SettingsLayout_UserFragment\n            ...ProfileSettings_UserFragment\n            ...BusinessSettings_UserFragment\n            ...PayoutSettings_UserFragment\n            ...AccountSettings_UserFragment\n          }\n          myNotificationPreferences {\n            id\n            notificationType\n            inAppEnabled\n            emailEnabled\n            pushEnabled\n          }\n        }\n      ": typeof types.SettingsDocument;
  "\n      query GetSavedPaymentMethods {\n        mySavedPaymentMethods {\n          id\n          brand\n          last4\n          expMonth\n          expYear\n          isDefault\n          createdAt\n        }\n      }\n    ": typeof types.GetSavedPaymentMethodsDocument;
  "\n  fragment SettingsLayout_UserFragment on User {\n    role\n  }\n": typeof types.SettingsLayout_UserFragmentFragmentDoc;
  "\n      query GetCurrentUserForSettings {\n        me {\n          id\n          avatar\n          spaceOwnerProfile {\n            id\n          }\n          advertiserProfile {\n            id\n          }\n        }\n      }\n    ": typeof types.GetCurrentUserForSettingsDocument;
  "\n        mutation UpdateUserProfile($input: UpdateCurrentUserInput!) {\n          updateCurrentUser(input: $input) {\n            user {\n              id\n            }\n          }\n        }\n      ": typeof types.UpdateUserProfileDocument;
  "\n        mutation UpdateSpaceOwnerBusinessInfo(\n          $input: UpdateSpaceOwnerProfileInput!\n        ) {\n          updateSpaceOwnerProfile(input: $input) {\n            spaceOwnerProfile {\n              id\n            }\n          }\n        }\n      ": typeof types.UpdateSpaceOwnerBusinessInfoDocument;
  "\n        mutation UpdateAdvertiserBusinessInfo(\n          $input: UpdateAdvertiserProfileInput!\n        ) {\n          updateAdvertiserProfile(input: $input) {\n            advertiserProfile {\n              id\n            }\n          }\n        }\n      ": typeof types.UpdateAdvertiserBusinessInfoDocument;
  "\n        mutation UpdateNotificationPreference(\n          $input: UpdateNotificationPreferenceInput!\n        ) {\n          updateNotificationPreference(input: $input) {\n            preference {\n              id\n              notificationType\n              inAppEnabled\n              emailEnabled\n              pushEnabled\n            }\n          }\n        }\n      ": typeof types.UpdateNotificationPreferenceDocument;
  "\n        mutation ConnectStripeAccount {\n          connectStripeAccount {\n            accountId\n            onboardingUrl\n            errors {\n              ... on Error {\n                message\n              }\n            }\n          }\n        }\n      ": typeof types.ConnectStripeAccountDocument;
  "\n        mutation DisconnectStripeAccount {\n          disconnectStripeAccount {\n            profile {\n              id\n              stripeAccountId\n              stripeAccountStatus\n            }\n            errors {\n              ... on Error {\n                message\n              }\n            }\n          }\n        }\n      ": typeof types.DisconnectStripeAccountDocument;
  "\n        mutation RefreshStripeAccountStatus {\n          refreshStripeAccountStatus {\n            profile {\n              id\n              stripeAccountStatus\n            }\n            errors {\n              ... on Error {\n                message\n              }\n            }\n          }\n        }\n      ": typeof types.RefreshStripeAccountStatusDocument;
  "\n        mutation DeleteMyAccount($input: DeleteMyAccountInput!) {\n          deleteMyAccount(input: $input) {\n            success\n            errors {\n              ... on Error {\n                message\n              }\n            }\n          }\n        }\n      ": typeof types.DeleteMyAccountDocument;
  "\n        mutation UpdateUserAvatar($input: UpdateCurrentUserInput!) {\n          updateCurrentUser(input: $input) {\n            user {\n              id\n              avatar\n            }\n          }\n        }\n      ": typeof types.UpdateUserAvatarDocument;
  "\n        mutation ChangePassword($input: ChangePasswordInput!) {\n          changePassword(input: $input) {\n            success\n            errors {\n              ... on Error {\n                message\n              }\n            }\n          }\n        }\n      ": typeof types.ChangePasswordDocument;
  "\n        mutation CreateSetupIntent {\n          createSetupIntent {\n            clientSecret\n            setupIntentId\n            errors {\n              ... on Error {\n                message\n              }\n            }\n          }\n        }\n      ": typeof types.CreateSetupIntentDocument;
  "\n        mutation ConfirmSetupIntent($input: ConfirmSetupIntentInput!) {\n          confirmSetupIntent(input: $input) {\n            paymentMethod {\n              id\n            }\n            errors {\n              ... on Error {\n                message\n              }\n            }\n          }\n        }\n      ": typeof types.ConfirmSetupIntentDocument;
  "\n        mutation SetDefaultPaymentMethod(\n          $input: SetDefaultPaymentMethodInput!\n        ) {\n          setDefaultPaymentMethod(input: $input) {\n            paymentMethod {\n              id\n              isDefault\n            }\n            errors {\n              ... on Error {\n                message\n              }\n            }\n          }\n        }\n      ": typeof types.SetDefaultPaymentMethodDocument;
  "\n        mutation DeletePaymentMethod($input: DeletePaymentMethodInput!) {\n          deletePaymentMethod(input: $input) {\n            success\n            errors {\n              ... on Error {\n                message\n              }\n            }\n          }\n        }\n      ": typeof types.DeletePaymentMethodDocument;
  "\n  fragment Gallery_SharedSpaceFragment on Space {\n    title\n    images\n  }\n": typeof types.Gallery_SharedSpaceFragmentFragmentDoc;
  "\n  fragment Header_SharedSpaceFragment on Space {\n    title\n    status\n    type\n  }\n": typeof types.Header_SharedSpaceFragmentFragmentDoc;
  "\n  fragment OwnerCard_SpaceFragment on Space {\n    spaceOwnerProfile {\n      businessName\n      user {\n        name\n        avatar\n      }\n    }\n  }\n": typeof types.OwnerCard_SpaceFragmentFragmentDoc;
  "\n        query SharedSpaceDetail($id: ID!) {\n          spaceById(id: $id) {\n            id\n            ...Header_SharedSpaceFragment\n            ...Gallery_SharedSpaceFragment\n            ...SpaceInfo_SpaceFragment\n            ...PricingCard_SpaceFragment\n            ...OwnerCard_SpaceFragment\n          }\n        }\n      ": typeof types.SharedSpaceDetailDocument;
  "\n  fragment PricingCard_SpaceFragment on Space {\n    pricePerDay\n    installationFee\n    minDuration\n    maxDuration\n  }\n": typeof types.PricingCard_SpaceFragmentFragmentDoc;
  "\n  fragment SpaceInfo_SpaceFragment on Space {\n    description\n    address\n    city\n    state\n    zipCode\n    width\n    height\n    dimensionsText\n    traffic\n    availableFrom\n    availableTo\n    averageRating\n    totalBookings\n  }\n": typeof types.SpaceInfo_SpaceFragmentFragmentDoc;
  "\n  fragment UserSection_UserFragment on User {\n    email\n    name\n    avatar\n    activeProfileType\n  }\n": typeof types.UserSection_UserFragmentFragmentDoc;
  "\n      mutation SwitchProfile($input: UpdateCurrentUserInput!) {\n        updateCurrentUser(input: $input) {\n          user {\n            id\n            activeProfileType\n          }\n          errors {\n            ... on Error {\n              message\n            }\n          }\n        }\n      }\n    ": typeof types.SwitchProfileDocument;
};
const documents: Documents = {
  "\n  fragment BookingCard_AdvertiserBookingFragment on Booking {\n    id\n    status\n    startDate\n    endDate\n    totalAmount\n    space {\n      title\n      images\n      city\n      state\n      owner {\n        businessName\n      }\n    }\n    campaign {\n      name\n    }\n  }\n":
    types.BookingCard_AdvertiserBookingFragmentFragmentDoc,
  "\n  fragment BookingsTable_AdvertiserBookingFragment on Booking {\n    id\n    status\n    startDate\n    endDate\n    totalAmount\n    space {\n      title\n      images\n      city\n      state\n      owner {\n        businessName\n      }\n    }\n    campaign {\n      name\n    }\n  }\n":
    types.BookingsTable_AdvertiserBookingFragmentFragmentDoc,
  "\n      query AdvertiserBookings {\n        myBookingsAsAdvertiser {\n          nodes {\n            id\n            ...BookingCard_AdvertiserBookingFragment\n            ...BookingsTable_AdvertiserBookingFragment\n          }\n        }\n      }\n    ":
    types.AdvertiserBookingsDocument,
  "\n  fragment CampaignCard_CampaignFragment on Campaign {\n    id\n    name\n    description\n    status\n    startDate\n    endDate\n    totalBudget\n    imageUrl\n    bookings {\n      nodes {\n        id\n      }\n    }\n  }\n":
    types.CampaignCard_CampaignFragmentFragmentDoc,
  "\n  fragment CampaignsTable_CampaignFragment on Campaign {\n    id\n    name\n    description\n    status\n    startDate\n    endDate\n    totalBudget\n    imageUrl\n    bookings {\n      nodes {\n        id\n      }\n    }\n  }\n":
    types.CampaignsTable_CampaignFragmentFragmentDoc,
  "\n      query AdvertiserCampaigns {\n        myCampaigns {\n          nodes {\n            id\n            ...CampaignCard_CampaignFragment\n            ...CampaignsTable_CampaignFragment\n          }\n        }\n      }\n    ":
    types.AdvertiserCampaignsDocument,
  "\n  fragment DiscoverSpaceCard_SpaceFragment on Space {\n    id\n    title\n    description\n    city\n    state\n    images\n    type\n    pricePerDay\n  }\n":
    types.DiscoverSpaceCard_SpaceFragmentFragmentDoc,
  "\n  fragment DiscoverMap_SpaceFragment on Space {\n    id\n    title\n    address\n    city\n    state\n    zipCode\n    latitude\n    longitude\n    pricePerDay\n    type\n    images\n    width\n    height\n  }\n":
    types.DiscoverMap_SpaceFragmentFragmentDoc,
  "\n  fragment DiscoverTable_SpaceFragment on Space {\n    id\n    title\n    city\n    state\n    images\n    type\n    pricePerDay\n  }\n":
    types.DiscoverTable_SpaceFragmentFragmentDoc,
  "\n          query DiscoverSpaces {\n            spaces(first: 32, where: { status: { eq: ACTIVE } }) {\n              nodes {\n                id\n                ...DiscoverSpaceCard_SpaceFragment\n                ...DiscoverTable_SpaceFragment\n                ...DiscoverMap_SpaceFragment\n              }\n            }\n          }\n        ":
    types.DiscoverSpacesDocument,
  "\n  fragment BookingCard_BookingFragment on Booking {\n    id\n    status\n    startDate\n    endDate\n    ownerPayoutAmount\n    space {\n      title\n      images\n    }\n    campaign {\n      name\n      advertiserProfile {\n        companyName\n      }\n    }\n  }\n":
    types.BookingCard_BookingFragmentFragmentDoc,
  "\n  fragment BookingsTable_BookingFragment on Booking {\n    id\n    status\n    startDate\n    endDate\n    ownerPayoutAmount\n    space {\n      title\n      images\n    }\n    campaign {\n      name\n      advertiserProfile {\n        companyName\n      }\n    }\n  }\n":
    types.BookingsTable_BookingFragmentFragmentDoc,
  "\n          query SpaceOwnerBookings {\n            myBookingsAsOwner {\n              nodes {\n                id\n                ...BookingCard_BookingFragment\n                ...BookingsTable_BookingFragment\n              }\n            }\n          }\n        ":
    types.SpaceOwnerBookingsDocument,
  "\n  fragment BalanceCards_EarningsSummaryFragment on EarningsSummary {\n    availableBalance\n    pendingPayouts\n    thisMonthEarnings\n    lastMonthEarnings\n    totalEarnings\n  }\n":
    types.BalanceCards_EarningsSummaryFragmentFragmentDoc,
  "\n        query SpaceOwnerEarnings {\n          earningsSummary {\n            ...BalanceCards_EarningsSummaryFragment\n          }\n          myPayouts {\n            nodes {\n              id\n              amount\n              processedAt\n              ...PayoutsTable_PayoutFragment\n            }\n          }\n        }\n      ":
    types.SpaceOwnerEarningsDocument,
  "\n  fragment PayoutsTable_PayoutFragment on Payout {\n    id\n    amount\n    stage\n    status\n    processedAt\n    booking {\n      id\n      space {\n        title\n      }\n    }\n  }\n":
    types.PayoutsTable_PayoutFragmentFragmentDoc,
  "\n  fragment SpaceCard_SpaceFragment on Space {\n    id\n    title\n    description\n    city\n    state\n    images\n    type\n    status\n    createdAt\n  }\n":
    types.SpaceCard_SpaceFragmentFragmentDoc,
  "\n  fragment ListingsTable_SpaceFragment on Space {\n    id\n    title\n    city\n    state\n    images\n    type\n    status\n    createdAt\n  }\n":
    types.ListingsTable_SpaceFragmentFragmentDoc,
  "\n  fragment Details_SpaceFragment on Space {\n    id\n    description\n    type\n    address\n    city\n    state\n    zipCode\n    traffic\n    pricePerDay\n    installationFee\n    minDuration\n    maxDuration\n    width\n    height\n    dimensionsText\n    availableFrom\n    availableTo\n  }\n":
    types.Details_SpaceFragmentFragmentDoc,
  "\n  fragment Gallery_SpaceFragment on Space {\n    id\n    title\n    images\n  }\n":
    types.Gallery_SpaceFragmentFragmentDoc,
  "\n  fragment Header_SpaceFragment on Space {\n    title\n    status\n  }\n":
    types.Header_SpaceFragmentFragmentDoc,
  "\n        query SpaceDetail($id: ID!) {\n          spaceById(id: $id) {\n            id\n            ...Header_SpaceFragment\n            ...Gallery_SpaceFragment\n            ...Details_SpaceFragment\n            ...Performance_SpaceFragment\n          }\n        }\n      ":
    types.SpaceDetailDocument,
  "\n  fragment Performance_SpaceFragment on Space {\n    totalBookings\n    totalRevenue\n    averageRating\n  }\n":
    types.Performance_SpaceFragmentFragmentDoc,
  "\n        query SpaceOwnerListings(\n          $first: Int\n          $last: Int\n          $after: String\n          $before: String\n          $order: [SpaceSortInput!]\n          $where: SpaceFilterInput\n          $gridView: Boolean!\n          $tableView: Boolean!\n        ) {\n          mySpaces(\n            first: $first\n            last: $last\n            after: $after\n            before: $before\n            order: $order\n            where: $where\n          ) {\n            nodes {\n              id\n              ...SpaceCard_SpaceFragment @include(if: $gridView)\n              ...ListingsTable_SpaceFragment @include(if: $tableView)\n            }\n            pageInfo {\n              hasNextPage\n              hasPreviousPage\n              startCursor\n              endCursor\n            }\n          }\n        }\n      ":
    types.SpaceOwnerListingsDocument,
  "\n  fragment OverviewActiveBookingsBookingCard_BookingFragment on Booking {\n    id\n    status\n    campaign {\n      advertiser {\n        user {\n          name\n        }\n      }\n    }\n    space {\n      id\n      title\n    }\n    startDate\n    endDate\n  }\n":
    types.OverviewActiveBookingsBookingCard_BookingFragmentFragmentDoc,
  "\n  fragment OverviewActiveBookings_QueryFragment on Query {\n    myBookingsAsOwner(\n      first: 5\n      where: { status: { in: [PAID, FILE_DOWNLOADED, INSTALLED] } }\n    ) {\n      nodes {\n        ...OverviewActiveBookingsBookingCard_BookingFragment\n      }\n    }\n  }\n":
    types.OverviewActiveBookings_QueryFragmentFragmentDoc,
  "\n  fragment OverviewPendingRequests_QueryFragment on Query {\n    incomingBookingRequests(first: 5) {\n      nodes {\n        ...OverviewPendingRequestsRequestCard_BookingFragment\n      }\n    }\n  }\n":
    types.OverviewPendingRequests_QueryFragmentFragmentDoc,
  "\n  fragment OverviewPendingRequestsRequestCard_BookingFragment on Booking {\n    id\n    campaign {\n      advertiser {\n        user {\n          name\n          avatar\n        }\n      }\n    }\n    space {\n      id\n      title\n    }\n    startDate\n    endDate\n    totalAmount\n    createdAt\n  }\n":
    types.OverviewPendingRequestsRequestCard_BookingFragmentFragmentDoc,
  "\n  fragment OverviewStatCards_QueryFragment on Query {\n    earningsSummary {\n      availableBalance\n      pendingPayouts\n      thisMonthEarnings\n      lastMonthEarnings\n    }\n  }\n":
    types.OverviewStatCards_QueryFragmentFragmentDoc,
  "\n  fragment OverviewTopSpaces_QueryFragment on Query {\n    me {\n      spaceOwnerProfile {\n        spaces(first: 5, order: { totalRevenue: DESC }) {\n          nodes {\n            ...OverviewTopSpacesSpaceCard_SpaceFragment\n          }\n        }\n      }\n    }\n  }\n":
    types.OverviewTopSpaces_QueryFragmentFragmentDoc,
  "\n  fragment OverviewTopSpacesSpaceCard_SpaceFragment on Space {\n    id\n    title\n    images\n    totalBookings\n    totalRevenue\n    averageRating\n    status\n  }\n":
    types.OverviewTopSpacesSpaceCard_SpaceFragmentFragmentDoc,
  "\n      query OverviewData {\n        ...OverviewStatCards_QueryFragment\n        ...OverviewPendingRequests_QueryFragment\n        ...OverviewActiveBookings_QueryFragment\n        ...OverviewTopSpaces_QueryFragment\n      }\n    ":
    types.OverviewDataDocument,
  "\n        query DashboardUser {\n          me {\n            id\n            ...NavigationSection_UserFragment\n            ...UserSection_UserFragment\n            ...RoleBasedView_UserFragment\n          }\n        }\n      ":
    types.DashboardUserDocument,
  "\n  mutation SendMessage($input: SendMessageInput!) {\n    sendMessage(input: $input) {\n      message {\n        id\n        content\n        type\n        attachments\n        createdAt\n        senderUser {\n          id\n          name\n          avatar\n        }\n      }\n      errors {\n        ... on ForbiddenError {\n          message\n        }\n      }\n    }\n  }\n":
    types.SendMessageDocument,
  "\n  mutation MarkConversationRead($input: MarkConversationReadInput!) {\n    markConversationRead(input: $input) {\n      participant {\n        id\n        lastReadAt\n      }\n      errors {\n        ... on ForbiddenError {\n          message\n        }\n      }\n    }\n  }\n":
    types.MarkConversationReadDocument,
  "\n  query LoadEarlierMessages($conversationId: ID!, $before: String) {\n    messagesByConversation(\n      conversationId: $conversationId\n      last: 50\n      before: $before\n      order: [{ createdAt: ASC }]\n    ) {\n      nodes {\n        id\n        content\n        type\n        attachments\n        createdAt\n        senderUser {\n          id\n          name\n          avatar\n        }\n      }\n      pageInfo {\n        hasPreviousPage\n        startCursor\n      }\n    }\n  }\n":
    types.LoadEarlierMessagesDocument,
  "\n  mutation NotifyTyping($input: NotifyTypingInput!) {\n    notifyTyping(input: $input) {\n      boolean\n    }\n  }\n":
    types.NotifyTypingDocument,
  "\n  fragment MessageBubble_MessageFragment on Message {\n    id\n    content\n    type\n    attachments\n    createdAt\n    senderUser {\n      id\n      name\n      avatar\n    }\n  }\n":
    types.MessageBubble_MessageFragmentFragmentDoc,
  "\n  subscription OnMessage($conversationId: ID!) {\n    onMessage(conversationId: $conversationId) {\n      id\n      content\n      type\n      attachments\n      createdAt\n      senderUser {\n        id\n        name\n        avatar\n      }\n    }\n  }\n":
    types.OnMessageDocument,
  "\n  subscription OnTyping($conversationId: ID!) {\n    onTyping(conversationId: $conversationId) {\n      conversationId\n      userId\n      userName\n      userAvatar\n      isTyping\n      timestamp\n    }\n  }\n":
    types.OnTypingDocument,
  "\n  fragment ThreadHeader_ConversationFragment on Conversation {\n    id\n    booking {\n      id\n      status\n      startDate\n      endDate\n      totalAmount\n      pricePerDay\n      totalDays\n      installationFee\n      space {\n        id\n        title\n        images\n        address\n        city\n        state\n      }\n    }\n  }\n":
    types.ThreadHeader_ConversationFragmentFragmentDoc,
  "\n  query MessagesData {\n    me {\n      id\n    }\n    myConversations(first: 50, order: [{ updatedAt: DESC }]) {\n      nodes {\n        ...ConversationItem_ConversationFragment\n      }\n    }\n    unreadConversationsCount\n  }\n":
    types.MessagesDataDocument,
  "\n  query ThreadData($conversationId: ID!) {\n    me {\n      id\n    }\n    myConversations(first: 50, order: [{ updatedAt: DESC }]) {\n      nodes {\n        ...ConversationItem_ConversationFragment\n        ...ThreadHeader_ConversationFragment\n      }\n    }\n    unreadConversationsCount\n    messagesByConversation(\n      conversationId: $conversationId\n      first: 50\n      order: [{ createdAt: ASC }]\n    ) {\n      nodes {\n        ...MessageBubble_MessageFragment\n      }\n      pageInfo {\n        hasPreviousPage\n        startCursor\n      }\n    }\n  }\n":
    types.ThreadDataDocument,
  "\n  fragment ConversationItem_ConversationFragment on Conversation {\n    id\n    updatedAt\n    booking {\n      id\n      status\n      space {\n        id\n        title\n      }\n    }\n    participants {\n      user {\n        id\n        name\n        avatar\n      }\n      lastReadAt\n    }\n    messages(first: 1, order: [{ createdAt: DESC }]) {\n      nodes {\n        id\n        content\n        type\n        createdAt\n        senderUser {\n          id\n        }\n      }\n    }\n  }\n":
    types.ConversationItem_ConversationFragmentFragmentDoc,
  "\n  fragment NavigationSection_UserFragment on User {\n    role\n    activeProfileType\n  }\n":
    types.NavigationSection_UserFragmentFragmentDoc,
  "\n  subscription OnNotification($userId: ID!) {\n    onNotification(userId: $userId) {\n      id\n      title\n      body\n      type\n      isRead\n      createdAt\n      entityId\n      entityType\n    }\n  }\n":
    types.OnNotificationDocument,
  "\n        mutation MarkNotificationRead($input: MarkNotificationReadInput!) {\n          markNotificationRead(input: $input) {\n            notification {\n              id\n              isRead\n              readAt\n            }\n            errors {\n              ... on Error {\n                message\n              }\n            }\n          }\n        }\n      ":
    types.MarkNotificationReadDocument,
  "\n        mutation MarkAllNotificationsRead {\n          markAllNotificationsRead {\n            count\n          }\n        }\n      ":
    types.MarkAllNotificationsReadDocument,
  "\n        mutation DeleteNotification($input: DeleteNotificationInput!) {\n          deleteNotification(input: $input) {\n            success\n          }\n        }\n      ":
    types.DeleteNotificationDocument,
  "\n  query LoadMoreNotifications(\n    $after: String\n    $isRead: Boolean\n    $type: NotificationType\n  ) {\n    myNotifications(\n      first: 20\n      after: $after\n      where: { and: [{ isRead: { eq: $isRead } }, { type: { eq: $type } }] }\n      order: [{ createdAt: DESC }]\n    ) {\n      nodes {\n        id\n        title\n        body\n        type\n        isRead\n        readAt\n        createdAt\n        entityId\n        entityType\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n":
    types.LoadMoreNotificationsDocument,
  "\n        query NotificationsPage {\n          me {\n            id\n          }\n          myNotifications(first: 20, order: [{ createdAt: DESC }]) {\n            nodes {\n              id\n              title\n              body\n              type\n              isRead\n              createdAt\n              readAt\n              entityId\n              entityType\n            }\n            pageInfo {\n              hasNextPage\n              endCursor\n            }\n          }\n          unreadNotificationsCount\n        }\n      ":
    types.NotificationsPageDocument,
  "\n  fragment About_UserFragment on User {\n    name\n    activeProfileType\n    spaceOwnerProfile {\n      businessName\n      businessType\n      onboardingComplete\n      responseRate\n      averageResponseTime\n      spaces(first: 10) {\n        nodes {\n          id\n        }\n      }\n    }\n    advertiserProfile {\n      companyName\n      industry\n      website\n      onboardingComplete\n      campaigns(first: 10, order: [{ createdAt: DESC }]) {\n        nodes {\n          status\n        }\n      }\n    }\n  }\n":
    types.About_UserFragmentFragmentDoc,
  "\n  fragment Activity_UserFragment on User {\n    name\n    activeProfileType\n    spaceOwnerProfile {\n      reviews(first: 10, order: [{ createdAt: DESC }]) {\n        nodes {\n          id\n          rating\n          comment\n          createdAt\n          reviewer {\n            name\n            avatar\n            companyName\n          }\n        }\n      }\n    }\n    advertiserProfile {\n      campaigns(first: 10, order: [{ createdAt: DESC }]) {\n        nodes {\n          id\n          name\n          status\n          startDate\n          endDate\n          totalSpend\n          spacesCount\n        }\n      }\n    }\n  }\n":
    types.Activity_UserFragmentFragmentDoc,
  "\n  fragment Info_UserFragment on User {\n    name\n    avatar\n    activeProfileType\n    spaceOwnerProfile {\n      createdAt\n      spaces(first: 10) {\n        nodes {\n          averageRating\n        }\n      }\n      reviews(first: 10, order: [{ createdAt: DESC }]) {\n        nodes {\n          id\n        }\n      }\n    }\n    advertiserProfile {\n      createdAt\n      totalSpend\n      campaigns(first: 10, order: [{ createdAt: DESC }]) {\n        nodes {\n          id\n        }\n      }\n    }\n  }\n":
    types.Info_UserFragmentFragmentDoc,
  "\n        query Profile {\n          me {\n            id\n            name\n            ...ProfileLayout_UserFragment\n            ...Info_UserFragment\n            ...About_UserFragment\n            ...Activity_UserFragment\n          }\n        }\n      ":
    types.ProfileDocument,
  "\n  fragment ProfileLayout_UserFragment on User {\n    role\n  }\n":
    types.ProfileLayout_UserFragmentFragmentDoc,
  "\n  fragment RoleBasedView_UserFragment on User {\n    role\n    activeProfileType\n  }\n":
    types.RoleBasedView_UserFragmentFragmentDoc,
  "\n  fragment AccountSettings_UserFragment on User {\n    createdAt\n    lastLoginAt\n    activeProfileType\n  }\n":
    types.AccountSettings_UserFragmentFragmentDoc,
  "\n  fragment BusinessSettings_UserFragment on User {\n    activeProfileType\n    spaceOwnerProfile {\n      businessName\n      businessType\n      payoutSchedule\n    }\n    advertiserProfile {\n      companyName\n      industry\n      website\n    }\n  }\n":
    types.BusinessSettings_UserFragmentFragmentDoc,
  "\n  fragment NotificationSettings_UserFragment on User {\n    activeProfileType\n  }\n":
    types.NotificationSettings_UserFragmentFragmentDoc,
  "\n  fragment PaymentSettings_UserFragment on User {\n    activeProfileType\n  }\n":
    types.PaymentSettings_UserFragmentFragmentDoc,
  "\n  fragment PayoutSettings_UserFragment on User {\n    activeProfileType\n    spaceOwnerProfile {\n      stripeAccountId\n      stripeAccountStatus\n    }\n  }\n":
    types.PayoutSettings_UserFragmentFragmentDoc,
  "\n  fragment ProfileSettings_UserFragment on User {\n    name\n    email\n    phone\n    avatar\n    activeProfileType\n  }\n":
    types.ProfileSettings_UserFragmentFragmentDoc,
  "\n        query Settings {\n          me {\n            id\n            email\n            name\n            avatar\n            phone\n            createdAt\n            lastLoginAt\n            activeProfileType\n            ...SettingsLayout_UserFragment\n            ...ProfileSettings_UserFragment\n            ...BusinessSettings_UserFragment\n            ...PayoutSettings_UserFragment\n            ...AccountSettings_UserFragment\n          }\n          myNotificationPreferences {\n            id\n            notificationType\n            inAppEnabled\n            emailEnabled\n            pushEnabled\n          }\n        }\n      ":
    types.SettingsDocument,
  "\n      query GetSavedPaymentMethods {\n        mySavedPaymentMethods {\n          id\n          brand\n          last4\n          expMonth\n          expYear\n          isDefault\n          createdAt\n        }\n      }\n    ":
    types.GetSavedPaymentMethodsDocument,
  "\n  fragment SettingsLayout_UserFragment on User {\n    role\n  }\n":
    types.SettingsLayout_UserFragmentFragmentDoc,
  "\n      query GetCurrentUserForSettings {\n        me {\n          id\n          avatar\n          spaceOwnerProfile {\n            id\n          }\n          advertiserProfile {\n            id\n          }\n        }\n      }\n    ":
    types.GetCurrentUserForSettingsDocument,
  "\n        mutation UpdateUserProfile($input: UpdateCurrentUserInput!) {\n          updateCurrentUser(input: $input) {\n            user {\n              id\n            }\n          }\n        }\n      ":
    types.UpdateUserProfileDocument,
  "\n        mutation UpdateSpaceOwnerBusinessInfo(\n          $input: UpdateSpaceOwnerProfileInput!\n        ) {\n          updateSpaceOwnerProfile(input: $input) {\n            spaceOwnerProfile {\n              id\n            }\n          }\n        }\n      ":
    types.UpdateSpaceOwnerBusinessInfoDocument,
  "\n        mutation UpdateAdvertiserBusinessInfo(\n          $input: UpdateAdvertiserProfileInput!\n        ) {\n          updateAdvertiserProfile(input: $input) {\n            advertiserProfile {\n              id\n            }\n          }\n        }\n      ":
    types.UpdateAdvertiserBusinessInfoDocument,
  "\n        mutation UpdateNotificationPreference(\n          $input: UpdateNotificationPreferenceInput!\n        ) {\n          updateNotificationPreference(input: $input) {\n            preference {\n              id\n              notificationType\n              inAppEnabled\n              emailEnabled\n              pushEnabled\n            }\n          }\n        }\n      ":
    types.UpdateNotificationPreferenceDocument,
  "\n        mutation ConnectStripeAccount {\n          connectStripeAccount {\n            accountId\n            onboardingUrl\n            errors {\n              ... on Error {\n                message\n              }\n            }\n          }\n        }\n      ":
    types.ConnectStripeAccountDocument,
  "\n        mutation DisconnectStripeAccount {\n          disconnectStripeAccount {\n            profile {\n              id\n              stripeAccountId\n              stripeAccountStatus\n            }\n            errors {\n              ... on Error {\n                message\n              }\n            }\n          }\n        }\n      ":
    types.DisconnectStripeAccountDocument,
  "\n        mutation RefreshStripeAccountStatus {\n          refreshStripeAccountStatus {\n            profile {\n              id\n              stripeAccountStatus\n            }\n            errors {\n              ... on Error {\n                message\n              }\n            }\n          }\n        }\n      ":
    types.RefreshStripeAccountStatusDocument,
  "\n        mutation DeleteMyAccount($input: DeleteMyAccountInput!) {\n          deleteMyAccount(input: $input) {\n            success\n            errors {\n              ... on Error {\n                message\n              }\n            }\n          }\n        }\n      ":
    types.DeleteMyAccountDocument,
  "\n        mutation UpdateUserAvatar($input: UpdateCurrentUserInput!) {\n          updateCurrentUser(input: $input) {\n            user {\n              id\n              avatar\n            }\n          }\n        }\n      ":
    types.UpdateUserAvatarDocument,
  "\n        mutation ChangePassword($input: ChangePasswordInput!) {\n          changePassword(input: $input) {\n            success\n            errors {\n              ... on Error {\n                message\n              }\n            }\n          }\n        }\n      ":
    types.ChangePasswordDocument,
  "\n        mutation CreateSetupIntent {\n          createSetupIntent {\n            clientSecret\n            setupIntentId\n            errors {\n              ... on Error {\n                message\n              }\n            }\n          }\n        }\n      ":
    types.CreateSetupIntentDocument,
  "\n        mutation ConfirmSetupIntent($input: ConfirmSetupIntentInput!) {\n          confirmSetupIntent(input: $input) {\n            paymentMethod {\n              id\n            }\n            errors {\n              ... on Error {\n                message\n              }\n            }\n          }\n        }\n      ":
    types.ConfirmSetupIntentDocument,
  "\n        mutation SetDefaultPaymentMethod(\n          $input: SetDefaultPaymentMethodInput!\n        ) {\n          setDefaultPaymentMethod(input: $input) {\n            paymentMethod {\n              id\n              isDefault\n            }\n            errors {\n              ... on Error {\n                message\n              }\n            }\n          }\n        }\n      ":
    types.SetDefaultPaymentMethodDocument,
  "\n        mutation DeletePaymentMethod($input: DeletePaymentMethodInput!) {\n          deletePaymentMethod(input: $input) {\n            success\n            errors {\n              ... on Error {\n                message\n              }\n            }\n          }\n        }\n      ":
    types.DeletePaymentMethodDocument,
  "\n  fragment Gallery_SharedSpaceFragment on Space {\n    title\n    images\n  }\n":
    types.Gallery_SharedSpaceFragmentFragmentDoc,
  "\n  fragment Header_SharedSpaceFragment on Space {\n    title\n    status\n    type\n  }\n":
    types.Header_SharedSpaceFragmentFragmentDoc,
  "\n  fragment OwnerCard_SpaceFragment on Space {\n    spaceOwnerProfile {\n      businessName\n      user {\n        name\n        avatar\n      }\n    }\n  }\n":
    types.OwnerCard_SpaceFragmentFragmentDoc,
  "\n        query SharedSpaceDetail($id: ID!) {\n          spaceById(id: $id) {\n            id\n            ...Header_SharedSpaceFragment\n            ...Gallery_SharedSpaceFragment\n            ...SpaceInfo_SpaceFragment\n            ...PricingCard_SpaceFragment\n            ...OwnerCard_SpaceFragment\n          }\n        }\n      ":
    types.SharedSpaceDetailDocument,
  "\n  fragment PricingCard_SpaceFragment on Space {\n    pricePerDay\n    installationFee\n    minDuration\n    maxDuration\n  }\n":
    types.PricingCard_SpaceFragmentFragmentDoc,
  "\n  fragment SpaceInfo_SpaceFragment on Space {\n    description\n    address\n    city\n    state\n    zipCode\n    width\n    height\n    dimensionsText\n    traffic\n    availableFrom\n    availableTo\n    averageRating\n    totalBookings\n  }\n":
    types.SpaceInfo_SpaceFragmentFragmentDoc,
  "\n  fragment UserSection_UserFragment on User {\n    email\n    name\n    avatar\n    activeProfileType\n  }\n":
    types.UserSection_UserFragmentFragmentDoc,
  "\n      mutation SwitchProfile($input: UpdateCurrentUserInput!) {\n        updateCurrentUser(input: $input) {\n          user {\n            id\n            activeProfileType\n          }\n          errors {\n            ... on Error {\n              message\n            }\n          }\n        }\n      }\n    ":
    types.SwitchProfileDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment BookingCard_AdvertiserBookingFragment on Booking {\n    id\n    status\n    startDate\n    endDate\n    totalAmount\n    space {\n      title\n      images\n      city\n      state\n      owner {\n        businessName\n      }\n    }\n    campaign {\n      name\n    }\n  }\n"
): (typeof documents)["\n  fragment BookingCard_AdvertiserBookingFragment on Booking {\n    id\n    status\n    startDate\n    endDate\n    totalAmount\n    space {\n      title\n      images\n      city\n      state\n      owner {\n        businessName\n      }\n    }\n    campaign {\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment BookingsTable_AdvertiserBookingFragment on Booking {\n    id\n    status\n    startDate\n    endDate\n    totalAmount\n    space {\n      title\n      images\n      city\n      state\n      owner {\n        businessName\n      }\n    }\n    campaign {\n      name\n    }\n  }\n"
): (typeof documents)["\n  fragment BookingsTable_AdvertiserBookingFragment on Booking {\n    id\n    status\n    startDate\n    endDate\n    totalAmount\n    space {\n      title\n      images\n      city\n      state\n      owner {\n        businessName\n      }\n    }\n    campaign {\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query AdvertiserBookings {\n        myBookingsAsAdvertiser {\n          nodes {\n            id\n            ...BookingCard_AdvertiserBookingFragment\n            ...BookingsTable_AdvertiserBookingFragment\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query AdvertiserBookings {\n        myBookingsAsAdvertiser {\n          nodes {\n            id\n            ...BookingCard_AdvertiserBookingFragment\n            ...BookingsTable_AdvertiserBookingFragment\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment CampaignCard_CampaignFragment on Campaign {\n    id\n    name\n    description\n    status\n    startDate\n    endDate\n    totalBudget\n    imageUrl\n    bookings {\n      nodes {\n        id\n      }\n    }\n  }\n"
): (typeof documents)["\n  fragment CampaignCard_CampaignFragment on Campaign {\n    id\n    name\n    description\n    status\n    startDate\n    endDate\n    totalBudget\n    imageUrl\n    bookings {\n      nodes {\n        id\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment CampaignsTable_CampaignFragment on Campaign {\n    id\n    name\n    description\n    status\n    startDate\n    endDate\n    totalBudget\n    imageUrl\n    bookings {\n      nodes {\n        id\n      }\n    }\n  }\n"
): (typeof documents)["\n  fragment CampaignsTable_CampaignFragment on Campaign {\n    id\n    name\n    description\n    status\n    startDate\n    endDate\n    totalBudget\n    imageUrl\n    bookings {\n      nodes {\n        id\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query AdvertiserCampaigns {\n        myCampaigns {\n          nodes {\n            id\n            ...CampaignCard_CampaignFragment\n            ...CampaignsTable_CampaignFragment\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query AdvertiserCampaigns {\n        myCampaigns {\n          nodes {\n            id\n            ...CampaignCard_CampaignFragment\n            ...CampaignsTable_CampaignFragment\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment DiscoverSpaceCard_SpaceFragment on Space {\n    id\n    title\n    description\n    city\n    state\n    images\n    type\n    pricePerDay\n  }\n"
): (typeof documents)["\n  fragment DiscoverSpaceCard_SpaceFragment on Space {\n    id\n    title\n    description\n    city\n    state\n    images\n    type\n    pricePerDay\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment DiscoverMap_SpaceFragment on Space {\n    id\n    title\n    address\n    city\n    state\n    zipCode\n    latitude\n    longitude\n    pricePerDay\n    type\n    images\n    width\n    height\n  }\n"
): (typeof documents)["\n  fragment DiscoverMap_SpaceFragment on Space {\n    id\n    title\n    address\n    city\n    state\n    zipCode\n    latitude\n    longitude\n    pricePerDay\n    type\n    images\n    width\n    height\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment DiscoverTable_SpaceFragment on Space {\n    id\n    title\n    city\n    state\n    images\n    type\n    pricePerDay\n  }\n"
): (typeof documents)["\n  fragment DiscoverTable_SpaceFragment on Space {\n    id\n    title\n    city\n    state\n    images\n    type\n    pricePerDay\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n          query DiscoverSpaces {\n            spaces(first: 32, where: { status: { eq: ACTIVE } }) {\n              nodes {\n                id\n                ...DiscoverSpaceCard_SpaceFragment\n                ...DiscoverTable_SpaceFragment\n                ...DiscoverMap_SpaceFragment\n              }\n            }\n          }\n        "
): (typeof documents)["\n          query DiscoverSpaces {\n            spaces(first: 32, where: { status: { eq: ACTIVE } }) {\n              nodes {\n                id\n                ...DiscoverSpaceCard_SpaceFragment\n                ...DiscoverTable_SpaceFragment\n                ...DiscoverMap_SpaceFragment\n              }\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment BookingCard_BookingFragment on Booking {\n    id\n    status\n    startDate\n    endDate\n    ownerPayoutAmount\n    space {\n      title\n      images\n    }\n    campaign {\n      name\n      advertiserProfile {\n        companyName\n      }\n    }\n  }\n"
): (typeof documents)["\n  fragment BookingCard_BookingFragment on Booking {\n    id\n    status\n    startDate\n    endDate\n    ownerPayoutAmount\n    space {\n      title\n      images\n    }\n    campaign {\n      name\n      advertiserProfile {\n        companyName\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment BookingsTable_BookingFragment on Booking {\n    id\n    status\n    startDate\n    endDate\n    ownerPayoutAmount\n    space {\n      title\n      images\n    }\n    campaign {\n      name\n      advertiserProfile {\n        companyName\n      }\n    }\n  }\n"
): (typeof documents)["\n  fragment BookingsTable_BookingFragment on Booking {\n    id\n    status\n    startDate\n    endDate\n    ownerPayoutAmount\n    space {\n      title\n      images\n    }\n    campaign {\n      name\n      advertiserProfile {\n        companyName\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n          query SpaceOwnerBookings {\n            myBookingsAsOwner {\n              nodes {\n                id\n                ...BookingCard_BookingFragment\n                ...BookingsTable_BookingFragment\n              }\n            }\n          }\n        "
): (typeof documents)["\n          query SpaceOwnerBookings {\n            myBookingsAsOwner {\n              nodes {\n                id\n                ...BookingCard_BookingFragment\n                ...BookingsTable_BookingFragment\n              }\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment BalanceCards_EarningsSummaryFragment on EarningsSummary {\n    availableBalance\n    pendingPayouts\n    thisMonthEarnings\n    lastMonthEarnings\n    totalEarnings\n  }\n"
): (typeof documents)["\n  fragment BalanceCards_EarningsSummaryFragment on EarningsSummary {\n    availableBalance\n    pendingPayouts\n    thisMonthEarnings\n    lastMonthEarnings\n    totalEarnings\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        query SpaceOwnerEarnings {\n          earningsSummary {\n            ...BalanceCards_EarningsSummaryFragment\n          }\n          myPayouts {\n            nodes {\n              id\n              amount\n              processedAt\n              ...PayoutsTable_PayoutFragment\n            }\n          }\n        }\n      "
): (typeof documents)["\n        query SpaceOwnerEarnings {\n          earningsSummary {\n            ...BalanceCards_EarningsSummaryFragment\n          }\n          myPayouts {\n            nodes {\n              id\n              amount\n              processedAt\n              ...PayoutsTable_PayoutFragment\n            }\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment PayoutsTable_PayoutFragment on Payout {\n    id\n    amount\n    stage\n    status\n    processedAt\n    booking {\n      id\n      space {\n        title\n      }\n    }\n  }\n"
): (typeof documents)["\n  fragment PayoutsTable_PayoutFragment on Payout {\n    id\n    amount\n    stage\n    status\n    processedAt\n    booking {\n      id\n      space {\n        title\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment SpaceCard_SpaceFragment on Space {\n    id\n    title\n    description\n    city\n    state\n    images\n    type\n    status\n    createdAt\n  }\n"
): (typeof documents)["\n  fragment SpaceCard_SpaceFragment on Space {\n    id\n    title\n    description\n    city\n    state\n    images\n    type\n    status\n    createdAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment ListingsTable_SpaceFragment on Space {\n    id\n    title\n    city\n    state\n    images\n    type\n    status\n    createdAt\n  }\n"
): (typeof documents)["\n  fragment ListingsTable_SpaceFragment on Space {\n    id\n    title\n    city\n    state\n    images\n    type\n    status\n    createdAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment Details_SpaceFragment on Space {\n    id\n    description\n    type\n    address\n    city\n    state\n    zipCode\n    traffic\n    pricePerDay\n    installationFee\n    minDuration\n    maxDuration\n    width\n    height\n    dimensionsText\n    availableFrom\n    availableTo\n  }\n"
): (typeof documents)["\n  fragment Details_SpaceFragment on Space {\n    id\n    description\n    type\n    address\n    city\n    state\n    zipCode\n    traffic\n    pricePerDay\n    installationFee\n    minDuration\n    maxDuration\n    width\n    height\n    dimensionsText\n    availableFrom\n    availableTo\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment Gallery_SpaceFragment on Space {\n    id\n    title\n    images\n  }\n"
): (typeof documents)["\n  fragment Gallery_SpaceFragment on Space {\n    id\n    title\n    images\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment Header_SpaceFragment on Space {\n    title\n    status\n  }\n"
): (typeof documents)["\n  fragment Header_SpaceFragment on Space {\n    title\n    status\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        query SpaceDetail($id: ID!) {\n          spaceById(id: $id) {\n            id\n            ...Header_SpaceFragment\n            ...Gallery_SpaceFragment\n            ...Details_SpaceFragment\n            ...Performance_SpaceFragment\n          }\n        }\n      "
): (typeof documents)["\n        query SpaceDetail($id: ID!) {\n          spaceById(id: $id) {\n            id\n            ...Header_SpaceFragment\n            ...Gallery_SpaceFragment\n            ...Details_SpaceFragment\n            ...Performance_SpaceFragment\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment Performance_SpaceFragment on Space {\n    totalBookings\n    totalRevenue\n    averageRating\n  }\n"
): (typeof documents)["\n  fragment Performance_SpaceFragment on Space {\n    totalBookings\n    totalRevenue\n    averageRating\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        query SpaceOwnerListings(\n          $first: Int\n          $last: Int\n          $after: String\n          $before: String\n          $order: [SpaceSortInput!]\n          $where: SpaceFilterInput\n          $gridView: Boolean!\n          $tableView: Boolean!\n        ) {\n          mySpaces(\n            first: $first\n            last: $last\n            after: $after\n            before: $before\n            order: $order\n            where: $where\n          ) {\n            nodes {\n              id\n              ...SpaceCard_SpaceFragment @include(if: $gridView)\n              ...ListingsTable_SpaceFragment @include(if: $tableView)\n            }\n            pageInfo {\n              hasNextPage\n              hasPreviousPage\n              startCursor\n              endCursor\n            }\n          }\n        }\n      "
): (typeof documents)["\n        query SpaceOwnerListings(\n          $first: Int\n          $last: Int\n          $after: String\n          $before: String\n          $order: [SpaceSortInput!]\n          $where: SpaceFilterInput\n          $gridView: Boolean!\n          $tableView: Boolean!\n        ) {\n          mySpaces(\n            first: $first\n            last: $last\n            after: $after\n            before: $before\n            order: $order\n            where: $where\n          ) {\n            nodes {\n              id\n              ...SpaceCard_SpaceFragment @include(if: $gridView)\n              ...ListingsTable_SpaceFragment @include(if: $tableView)\n            }\n            pageInfo {\n              hasNextPage\n              hasPreviousPage\n              startCursor\n              endCursor\n            }\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment OverviewActiveBookingsBookingCard_BookingFragment on Booking {\n    id\n    status\n    campaign {\n      advertiser {\n        user {\n          name\n        }\n      }\n    }\n    space {\n      id\n      title\n    }\n    startDate\n    endDate\n  }\n"
): (typeof documents)["\n  fragment OverviewActiveBookingsBookingCard_BookingFragment on Booking {\n    id\n    status\n    campaign {\n      advertiser {\n        user {\n          name\n        }\n      }\n    }\n    space {\n      id\n      title\n    }\n    startDate\n    endDate\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment OverviewActiveBookings_QueryFragment on Query {\n    myBookingsAsOwner(\n      first: 5\n      where: { status: { in: [PAID, FILE_DOWNLOADED, INSTALLED] } }\n    ) {\n      nodes {\n        ...OverviewActiveBookingsBookingCard_BookingFragment\n      }\n    }\n  }\n"
): (typeof documents)["\n  fragment OverviewActiveBookings_QueryFragment on Query {\n    myBookingsAsOwner(\n      first: 5\n      where: { status: { in: [PAID, FILE_DOWNLOADED, INSTALLED] } }\n    ) {\n      nodes {\n        ...OverviewActiveBookingsBookingCard_BookingFragment\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment OverviewPendingRequests_QueryFragment on Query {\n    incomingBookingRequests(first: 5) {\n      nodes {\n        ...OverviewPendingRequestsRequestCard_BookingFragment\n      }\n    }\n  }\n"
): (typeof documents)["\n  fragment OverviewPendingRequests_QueryFragment on Query {\n    incomingBookingRequests(first: 5) {\n      nodes {\n        ...OverviewPendingRequestsRequestCard_BookingFragment\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment OverviewPendingRequestsRequestCard_BookingFragment on Booking {\n    id\n    campaign {\n      advertiser {\n        user {\n          name\n          avatar\n        }\n      }\n    }\n    space {\n      id\n      title\n    }\n    startDate\n    endDate\n    totalAmount\n    createdAt\n  }\n"
): (typeof documents)["\n  fragment OverviewPendingRequestsRequestCard_BookingFragment on Booking {\n    id\n    campaign {\n      advertiser {\n        user {\n          name\n          avatar\n        }\n      }\n    }\n    space {\n      id\n      title\n    }\n    startDate\n    endDate\n    totalAmount\n    createdAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment OverviewStatCards_QueryFragment on Query {\n    earningsSummary {\n      availableBalance\n      pendingPayouts\n      thisMonthEarnings\n      lastMonthEarnings\n    }\n  }\n"
): (typeof documents)["\n  fragment OverviewStatCards_QueryFragment on Query {\n    earningsSummary {\n      availableBalance\n      pendingPayouts\n      thisMonthEarnings\n      lastMonthEarnings\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment OverviewTopSpaces_QueryFragment on Query {\n    me {\n      spaceOwnerProfile {\n        spaces(first: 5, order: { totalRevenue: DESC }) {\n          nodes {\n            ...OverviewTopSpacesSpaceCard_SpaceFragment\n          }\n        }\n      }\n    }\n  }\n"
): (typeof documents)["\n  fragment OverviewTopSpaces_QueryFragment on Query {\n    me {\n      spaceOwnerProfile {\n        spaces(first: 5, order: { totalRevenue: DESC }) {\n          nodes {\n            ...OverviewTopSpacesSpaceCard_SpaceFragment\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment OverviewTopSpacesSpaceCard_SpaceFragment on Space {\n    id\n    title\n    images\n    totalBookings\n    totalRevenue\n    averageRating\n    status\n  }\n"
): (typeof documents)["\n  fragment OverviewTopSpacesSpaceCard_SpaceFragment on Space {\n    id\n    title\n    images\n    totalBookings\n    totalRevenue\n    averageRating\n    status\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query OverviewData {\n        ...OverviewStatCards_QueryFragment\n        ...OverviewPendingRequests_QueryFragment\n        ...OverviewActiveBookings_QueryFragment\n        ...OverviewTopSpaces_QueryFragment\n      }\n    "
): (typeof documents)["\n      query OverviewData {\n        ...OverviewStatCards_QueryFragment\n        ...OverviewPendingRequests_QueryFragment\n        ...OverviewActiveBookings_QueryFragment\n        ...OverviewTopSpaces_QueryFragment\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        query DashboardUser {\n          me {\n            id\n            ...NavigationSection_UserFragment\n            ...UserSection_UserFragment\n            ...RoleBasedView_UserFragment\n          }\n        }\n      "
): (typeof documents)["\n        query DashboardUser {\n          me {\n            id\n            ...NavigationSection_UserFragment\n            ...UserSection_UserFragment\n            ...RoleBasedView_UserFragment\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation SendMessage($input: SendMessageInput!) {\n    sendMessage(input: $input) {\n      message {\n        id\n        content\n        type\n        attachments\n        createdAt\n        senderUser {\n          id\n          name\n          avatar\n        }\n      }\n      errors {\n        ... on ForbiddenError {\n          message\n        }\n      }\n    }\n  }\n"
): (typeof documents)["\n  mutation SendMessage($input: SendMessageInput!) {\n    sendMessage(input: $input) {\n      message {\n        id\n        content\n        type\n        attachments\n        createdAt\n        senderUser {\n          id\n          name\n          avatar\n        }\n      }\n      errors {\n        ... on ForbiddenError {\n          message\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation MarkConversationRead($input: MarkConversationReadInput!) {\n    markConversationRead(input: $input) {\n      participant {\n        id\n        lastReadAt\n      }\n      errors {\n        ... on ForbiddenError {\n          message\n        }\n      }\n    }\n  }\n"
): (typeof documents)["\n  mutation MarkConversationRead($input: MarkConversationReadInput!) {\n    markConversationRead(input: $input) {\n      participant {\n        id\n        lastReadAt\n      }\n      errors {\n        ... on ForbiddenError {\n          message\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query LoadEarlierMessages($conversationId: ID!, $before: String) {\n    messagesByConversation(\n      conversationId: $conversationId\n      last: 50\n      before: $before\n      order: [{ createdAt: ASC }]\n    ) {\n      nodes {\n        id\n        content\n        type\n        attachments\n        createdAt\n        senderUser {\n          id\n          name\n          avatar\n        }\n      }\n      pageInfo {\n        hasPreviousPage\n        startCursor\n      }\n    }\n  }\n"
): (typeof documents)["\n  query LoadEarlierMessages($conversationId: ID!, $before: String) {\n    messagesByConversation(\n      conversationId: $conversationId\n      last: 50\n      before: $before\n      order: [{ createdAt: ASC }]\n    ) {\n      nodes {\n        id\n        content\n        type\n        attachments\n        createdAt\n        senderUser {\n          id\n          name\n          avatar\n        }\n      }\n      pageInfo {\n        hasPreviousPage\n        startCursor\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation NotifyTyping($input: NotifyTypingInput!) {\n    notifyTyping(input: $input) {\n      boolean\n    }\n  }\n"
): (typeof documents)["\n  mutation NotifyTyping($input: NotifyTypingInput!) {\n    notifyTyping(input: $input) {\n      boolean\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment MessageBubble_MessageFragment on Message {\n    id\n    content\n    type\n    attachments\n    createdAt\n    senderUser {\n      id\n      name\n      avatar\n    }\n  }\n"
): (typeof documents)["\n  fragment MessageBubble_MessageFragment on Message {\n    id\n    content\n    type\n    attachments\n    createdAt\n    senderUser {\n      id\n      name\n      avatar\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  subscription OnMessage($conversationId: ID!) {\n    onMessage(conversationId: $conversationId) {\n      id\n      content\n      type\n      attachments\n      createdAt\n      senderUser {\n        id\n        name\n        avatar\n      }\n    }\n  }\n"
): (typeof documents)["\n  subscription OnMessage($conversationId: ID!) {\n    onMessage(conversationId: $conversationId) {\n      id\n      content\n      type\n      attachments\n      createdAt\n      senderUser {\n        id\n        name\n        avatar\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  subscription OnTyping($conversationId: ID!) {\n    onTyping(conversationId: $conversationId) {\n      conversationId\n      userId\n      userName\n      userAvatar\n      isTyping\n      timestamp\n    }\n  }\n"
): (typeof documents)["\n  subscription OnTyping($conversationId: ID!) {\n    onTyping(conversationId: $conversationId) {\n      conversationId\n      userId\n      userName\n      userAvatar\n      isTyping\n      timestamp\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment ThreadHeader_ConversationFragment on Conversation {\n    id\n    booking {\n      id\n      status\n      startDate\n      endDate\n      totalAmount\n      pricePerDay\n      totalDays\n      installationFee\n      space {\n        id\n        title\n        images\n        address\n        city\n        state\n      }\n    }\n  }\n"
): (typeof documents)["\n  fragment ThreadHeader_ConversationFragment on Conversation {\n    id\n    booking {\n      id\n      status\n      startDate\n      endDate\n      totalAmount\n      pricePerDay\n      totalDays\n      installationFee\n      space {\n        id\n        title\n        images\n        address\n        city\n        state\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query MessagesData {\n    me {\n      id\n    }\n    myConversations(first: 50, order: [{ updatedAt: DESC }]) {\n      nodes {\n        ...ConversationItem_ConversationFragment\n      }\n    }\n    unreadConversationsCount\n  }\n"
): (typeof documents)["\n  query MessagesData {\n    me {\n      id\n    }\n    myConversations(first: 50, order: [{ updatedAt: DESC }]) {\n      nodes {\n        ...ConversationItem_ConversationFragment\n      }\n    }\n    unreadConversationsCount\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query ThreadData($conversationId: ID!) {\n    me {\n      id\n    }\n    myConversations(first: 50, order: [{ updatedAt: DESC }]) {\n      nodes {\n        ...ConversationItem_ConversationFragment\n        ...ThreadHeader_ConversationFragment\n      }\n    }\n    unreadConversationsCount\n    messagesByConversation(\n      conversationId: $conversationId\n      first: 50\n      order: [{ createdAt: ASC }]\n    ) {\n      nodes {\n        ...MessageBubble_MessageFragment\n      }\n      pageInfo {\n        hasPreviousPage\n        startCursor\n      }\n    }\n  }\n"
): (typeof documents)["\n  query ThreadData($conversationId: ID!) {\n    me {\n      id\n    }\n    myConversations(first: 50, order: [{ updatedAt: DESC }]) {\n      nodes {\n        ...ConversationItem_ConversationFragment\n        ...ThreadHeader_ConversationFragment\n      }\n    }\n    unreadConversationsCount\n    messagesByConversation(\n      conversationId: $conversationId\n      first: 50\n      order: [{ createdAt: ASC }]\n    ) {\n      nodes {\n        ...MessageBubble_MessageFragment\n      }\n      pageInfo {\n        hasPreviousPage\n        startCursor\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment ConversationItem_ConversationFragment on Conversation {\n    id\n    updatedAt\n    booking {\n      id\n      status\n      space {\n        id\n        title\n      }\n    }\n    participants {\n      user {\n        id\n        name\n        avatar\n      }\n      lastReadAt\n    }\n    messages(first: 1, order: [{ createdAt: DESC }]) {\n      nodes {\n        id\n        content\n        type\n        createdAt\n        senderUser {\n          id\n        }\n      }\n    }\n  }\n"
): (typeof documents)["\n  fragment ConversationItem_ConversationFragment on Conversation {\n    id\n    updatedAt\n    booking {\n      id\n      status\n      space {\n        id\n        title\n      }\n    }\n    participants {\n      user {\n        id\n        name\n        avatar\n      }\n      lastReadAt\n    }\n    messages(first: 1, order: [{ createdAt: DESC }]) {\n      nodes {\n        id\n        content\n        type\n        createdAt\n        senderUser {\n          id\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment NavigationSection_UserFragment on User {\n    role\n    activeProfileType\n  }\n"
): (typeof documents)["\n  fragment NavigationSection_UserFragment on User {\n    role\n    activeProfileType\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  subscription OnNotification($userId: ID!) {\n    onNotification(userId: $userId) {\n      id\n      title\n      body\n      type\n      isRead\n      createdAt\n      entityId\n      entityType\n    }\n  }\n"
): (typeof documents)["\n  subscription OnNotification($userId: ID!) {\n    onNotification(userId: $userId) {\n      id\n      title\n      body\n      type\n      isRead\n      createdAt\n      entityId\n      entityType\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        mutation MarkNotificationRead($input: MarkNotificationReadInput!) {\n          markNotificationRead(input: $input) {\n            notification {\n              id\n              isRead\n              readAt\n            }\n            errors {\n              ... on Error {\n                message\n              }\n            }\n          }\n        }\n      "
): (typeof documents)["\n        mutation MarkNotificationRead($input: MarkNotificationReadInput!) {\n          markNotificationRead(input: $input) {\n            notification {\n              id\n              isRead\n              readAt\n            }\n            errors {\n              ... on Error {\n                message\n              }\n            }\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        mutation MarkAllNotificationsRead {\n          markAllNotificationsRead {\n            count\n          }\n        }\n      "
): (typeof documents)["\n        mutation MarkAllNotificationsRead {\n          markAllNotificationsRead {\n            count\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        mutation DeleteNotification($input: DeleteNotificationInput!) {\n          deleteNotification(input: $input) {\n            success\n          }\n        }\n      "
): (typeof documents)["\n        mutation DeleteNotification($input: DeleteNotificationInput!) {\n          deleteNotification(input: $input) {\n            success\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query LoadMoreNotifications(\n    $after: String\n    $isRead: Boolean\n    $type: NotificationType\n  ) {\n    myNotifications(\n      first: 20\n      after: $after\n      where: { and: [{ isRead: { eq: $isRead } }, { type: { eq: $type } }] }\n      order: [{ createdAt: DESC }]\n    ) {\n      nodes {\n        id\n        title\n        body\n        type\n        isRead\n        readAt\n        createdAt\n        entityId\n        entityType\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n"
): (typeof documents)["\n  query LoadMoreNotifications(\n    $after: String\n    $isRead: Boolean\n    $type: NotificationType\n  ) {\n    myNotifications(\n      first: 20\n      after: $after\n      where: { and: [{ isRead: { eq: $isRead } }, { type: { eq: $type } }] }\n      order: [{ createdAt: DESC }]\n    ) {\n      nodes {\n        id\n        title\n        body\n        type\n        isRead\n        readAt\n        createdAt\n        entityId\n        entityType\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        query NotificationsPage {\n          me {\n            id\n          }\n          myNotifications(first: 20, order: [{ createdAt: DESC }]) {\n            nodes {\n              id\n              title\n              body\n              type\n              isRead\n              createdAt\n              readAt\n              entityId\n              entityType\n            }\n            pageInfo {\n              hasNextPage\n              endCursor\n            }\n          }\n          unreadNotificationsCount\n        }\n      "
): (typeof documents)["\n        query NotificationsPage {\n          me {\n            id\n          }\n          myNotifications(first: 20, order: [{ createdAt: DESC }]) {\n            nodes {\n              id\n              title\n              body\n              type\n              isRead\n              createdAt\n              readAt\n              entityId\n              entityType\n            }\n            pageInfo {\n              hasNextPage\n              endCursor\n            }\n          }\n          unreadNotificationsCount\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment About_UserFragment on User {\n    name\n    activeProfileType\n    spaceOwnerProfile {\n      businessName\n      businessType\n      onboardingComplete\n      responseRate\n      averageResponseTime\n      spaces(first: 10) {\n        nodes {\n          id\n        }\n      }\n    }\n    advertiserProfile {\n      companyName\n      industry\n      website\n      onboardingComplete\n      campaigns(first: 10, order: [{ createdAt: DESC }]) {\n        nodes {\n          status\n        }\n      }\n    }\n  }\n"
): (typeof documents)["\n  fragment About_UserFragment on User {\n    name\n    activeProfileType\n    spaceOwnerProfile {\n      businessName\n      businessType\n      onboardingComplete\n      responseRate\n      averageResponseTime\n      spaces(first: 10) {\n        nodes {\n          id\n        }\n      }\n    }\n    advertiserProfile {\n      companyName\n      industry\n      website\n      onboardingComplete\n      campaigns(first: 10, order: [{ createdAt: DESC }]) {\n        nodes {\n          status\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment Activity_UserFragment on User {\n    name\n    activeProfileType\n    spaceOwnerProfile {\n      reviews(first: 10, order: [{ createdAt: DESC }]) {\n        nodes {\n          id\n          rating\n          comment\n          createdAt\n          reviewer {\n            name\n            avatar\n            companyName\n          }\n        }\n      }\n    }\n    advertiserProfile {\n      campaigns(first: 10, order: [{ createdAt: DESC }]) {\n        nodes {\n          id\n          name\n          status\n          startDate\n          endDate\n          totalSpend\n          spacesCount\n        }\n      }\n    }\n  }\n"
): (typeof documents)["\n  fragment Activity_UserFragment on User {\n    name\n    activeProfileType\n    spaceOwnerProfile {\n      reviews(first: 10, order: [{ createdAt: DESC }]) {\n        nodes {\n          id\n          rating\n          comment\n          createdAt\n          reviewer {\n            name\n            avatar\n            companyName\n          }\n        }\n      }\n    }\n    advertiserProfile {\n      campaigns(first: 10, order: [{ createdAt: DESC }]) {\n        nodes {\n          id\n          name\n          status\n          startDate\n          endDate\n          totalSpend\n          spacesCount\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment Info_UserFragment on User {\n    name\n    avatar\n    activeProfileType\n    spaceOwnerProfile {\n      createdAt\n      spaces(first: 10) {\n        nodes {\n          averageRating\n        }\n      }\n      reviews(first: 10, order: [{ createdAt: DESC }]) {\n        nodes {\n          id\n        }\n      }\n    }\n    advertiserProfile {\n      createdAt\n      totalSpend\n      campaigns(first: 10, order: [{ createdAt: DESC }]) {\n        nodes {\n          id\n        }\n      }\n    }\n  }\n"
): (typeof documents)["\n  fragment Info_UserFragment on User {\n    name\n    avatar\n    activeProfileType\n    spaceOwnerProfile {\n      createdAt\n      spaces(first: 10) {\n        nodes {\n          averageRating\n        }\n      }\n      reviews(first: 10, order: [{ createdAt: DESC }]) {\n        nodes {\n          id\n        }\n      }\n    }\n    advertiserProfile {\n      createdAt\n      totalSpend\n      campaigns(first: 10, order: [{ createdAt: DESC }]) {\n        nodes {\n          id\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        query Profile {\n          me {\n            id\n            name\n            ...ProfileLayout_UserFragment\n            ...Info_UserFragment\n            ...About_UserFragment\n            ...Activity_UserFragment\n          }\n        }\n      "
): (typeof documents)["\n        query Profile {\n          me {\n            id\n            name\n            ...ProfileLayout_UserFragment\n            ...Info_UserFragment\n            ...About_UserFragment\n            ...Activity_UserFragment\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment ProfileLayout_UserFragment on User {\n    role\n  }\n"
): (typeof documents)["\n  fragment ProfileLayout_UserFragment on User {\n    role\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment RoleBasedView_UserFragment on User {\n    role\n    activeProfileType\n  }\n"
): (typeof documents)["\n  fragment RoleBasedView_UserFragment on User {\n    role\n    activeProfileType\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment AccountSettings_UserFragment on User {\n    createdAt\n    lastLoginAt\n    activeProfileType\n  }\n"
): (typeof documents)["\n  fragment AccountSettings_UserFragment on User {\n    createdAt\n    lastLoginAt\n    activeProfileType\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment BusinessSettings_UserFragment on User {\n    activeProfileType\n    spaceOwnerProfile {\n      businessName\n      businessType\n      payoutSchedule\n    }\n    advertiserProfile {\n      companyName\n      industry\n      website\n    }\n  }\n"
): (typeof documents)["\n  fragment BusinessSettings_UserFragment on User {\n    activeProfileType\n    spaceOwnerProfile {\n      businessName\n      businessType\n      payoutSchedule\n    }\n    advertiserProfile {\n      companyName\n      industry\n      website\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment NotificationSettings_UserFragment on User {\n    activeProfileType\n  }\n"
): (typeof documents)["\n  fragment NotificationSettings_UserFragment on User {\n    activeProfileType\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment PaymentSettings_UserFragment on User {\n    activeProfileType\n  }\n"
): (typeof documents)["\n  fragment PaymentSettings_UserFragment on User {\n    activeProfileType\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment PayoutSettings_UserFragment on User {\n    activeProfileType\n    spaceOwnerProfile {\n      stripeAccountId\n      stripeAccountStatus\n    }\n  }\n"
): (typeof documents)["\n  fragment PayoutSettings_UserFragment on User {\n    activeProfileType\n    spaceOwnerProfile {\n      stripeAccountId\n      stripeAccountStatus\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment ProfileSettings_UserFragment on User {\n    name\n    email\n    phone\n    avatar\n    activeProfileType\n  }\n"
): (typeof documents)["\n  fragment ProfileSettings_UserFragment on User {\n    name\n    email\n    phone\n    avatar\n    activeProfileType\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        query Settings {\n          me {\n            id\n            email\n            name\n            avatar\n            phone\n            createdAt\n            lastLoginAt\n            activeProfileType\n            ...SettingsLayout_UserFragment\n            ...ProfileSettings_UserFragment\n            ...BusinessSettings_UserFragment\n            ...PayoutSettings_UserFragment\n            ...AccountSettings_UserFragment\n          }\n          myNotificationPreferences {\n            id\n            notificationType\n            inAppEnabled\n            emailEnabled\n            pushEnabled\n          }\n        }\n      "
): (typeof documents)["\n        query Settings {\n          me {\n            id\n            email\n            name\n            avatar\n            phone\n            createdAt\n            lastLoginAt\n            activeProfileType\n            ...SettingsLayout_UserFragment\n            ...ProfileSettings_UserFragment\n            ...BusinessSettings_UserFragment\n            ...PayoutSettings_UserFragment\n            ...AccountSettings_UserFragment\n          }\n          myNotificationPreferences {\n            id\n            notificationType\n            inAppEnabled\n            emailEnabled\n            pushEnabled\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query GetSavedPaymentMethods {\n        mySavedPaymentMethods {\n          id\n          brand\n          last4\n          expMonth\n          expYear\n          isDefault\n          createdAt\n        }\n      }\n    "
): (typeof documents)["\n      query GetSavedPaymentMethods {\n        mySavedPaymentMethods {\n          id\n          brand\n          last4\n          expMonth\n          expYear\n          isDefault\n          createdAt\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment SettingsLayout_UserFragment on User {\n    role\n  }\n"
): (typeof documents)["\n  fragment SettingsLayout_UserFragment on User {\n    role\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query GetCurrentUserForSettings {\n        me {\n          id\n          avatar\n          spaceOwnerProfile {\n            id\n          }\n          advertiserProfile {\n            id\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query GetCurrentUserForSettings {\n        me {\n          id\n          avatar\n          spaceOwnerProfile {\n            id\n          }\n          advertiserProfile {\n            id\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        mutation UpdateUserProfile($input: UpdateCurrentUserInput!) {\n          updateCurrentUser(input: $input) {\n            user {\n              id\n            }\n          }\n        }\n      "
): (typeof documents)["\n        mutation UpdateUserProfile($input: UpdateCurrentUserInput!) {\n          updateCurrentUser(input: $input) {\n            user {\n              id\n            }\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        mutation UpdateSpaceOwnerBusinessInfo(\n          $input: UpdateSpaceOwnerProfileInput!\n        ) {\n          updateSpaceOwnerProfile(input: $input) {\n            spaceOwnerProfile {\n              id\n            }\n          }\n        }\n      "
): (typeof documents)["\n        mutation UpdateSpaceOwnerBusinessInfo(\n          $input: UpdateSpaceOwnerProfileInput!\n        ) {\n          updateSpaceOwnerProfile(input: $input) {\n            spaceOwnerProfile {\n              id\n            }\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        mutation UpdateAdvertiserBusinessInfo(\n          $input: UpdateAdvertiserProfileInput!\n        ) {\n          updateAdvertiserProfile(input: $input) {\n            advertiserProfile {\n              id\n            }\n          }\n        }\n      "
): (typeof documents)["\n        mutation UpdateAdvertiserBusinessInfo(\n          $input: UpdateAdvertiserProfileInput!\n        ) {\n          updateAdvertiserProfile(input: $input) {\n            advertiserProfile {\n              id\n            }\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        mutation UpdateNotificationPreference(\n          $input: UpdateNotificationPreferenceInput!\n        ) {\n          updateNotificationPreference(input: $input) {\n            preference {\n              id\n              notificationType\n              inAppEnabled\n              emailEnabled\n              pushEnabled\n            }\n          }\n        }\n      "
): (typeof documents)["\n        mutation UpdateNotificationPreference(\n          $input: UpdateNotificationPreferenceInput!\n        ) {\n          updateNotificationPreference(input: $input) {\n            preference {\n              id\n              notificationType\n              inAppEnabled\n              emailEnabled\n              pushEnabled\n            }\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        mutation ConnectStripeAccount {\n          connectStripeAccount {\n            accountId\n            onboardingUrl\n            errors {\n              ... on Error {\n                message\n              }\n            }\n          }\n        }\n      "
): (typeof documents)["\n        mutation ConnectStripeAccount {\n          connectStripeAccount {\n            accountId\n            onboardingUrl\n            errors {\n              ... on Error {\n                message\n              }\n            }\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        mutation DisconnectStripeAccount {\n          disconnectStripeAccount {\n            profile {\n              id\n              stripeAccountId\n              stripeAccountStatus\n            }\n            errors {\n              ... on Error {\n                message\n              }\n            }\n          }\n        }\n      "
): (typeof documents)["\n        mutation DisconnectStripeAccount {\n          disconnectStripeAccount {\n            profile {\n              id\n              stripeAccountId\n              stripeAccountStatus\n            }\n            errors {\n              ... on Error {\n                message\n              }\n            }\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        mutation RefreshStripeAccountStatus {\n          refreshStripeAccountStatus {\n            profile {\n              id\n              stripeAccountStatus\n            }\n            errors {\n              ... on Error {\n                message\n              }\n            }\n          }\n        }\n      "
): (typeof documents)["\n        mutation RefreshStripeAccountStatus {\n          refreshStripeAccountStatus {\n            profile {\n              id\n              stripeAccountStatus\n            }\n            errors {\n              ... on Error {\n                message\n              }\n            }\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        mutation DeleteMyAccount($input: DeleteMyAccountInput!) {\n          deleteMyAccount(input: $input) {\n            success\n            errors {\n              ... on Error {\n                message\n              }\n            }\n          }\n        }\n      "
): (typeof documents)["\n        mutation DeleteMyAccount($input: DeleteMyAccountInput!) {\n          deleteMyAccount(input: $input) {\n            success\n            errors {\n              ... on Error {\n                message\n              }\n            }\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        mutation UpdateUserAvatar($input: UpdateCurrentUserInput!) {\n          updateCurrentUser(input: $input) {\n            user {\n              id\n              avatar\n            }\n          }\n        }\n      "
): (typeof documents)["\n        mutation UpdateUserAvatar($input: UpdateCurrentUserInput!) {\n          updateCurrentUser(input: $input) {\n            user {\n              id\n              avatar\n            }\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        mutation ChangePassword($input: ChangePasswordInput!) {\n          changePassword(input: $input) {\n            success\n            errors {\n              ... on Error {\n                message\n              }\n            }\n          }\n        }\n      "
): (typeof documents)["\n        mutation ChangePassword($input: ChangePasswordInput!) {\n          changePassword(input: $input) {\n            success\n            errors {\n              ... on Error {\n                message\n              }\n            }\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        mutation CreateSetupIntent {\n          createSetupIntent {\n            clientSecret\n            setupIntentId\n            errors {\n              ... on Error {\n                message\n              }\n            }\n          }\n        }\n      "
): (typeof documents)["\n        mutation CreateSetupIntent {\n          createSetupIntent {\n            clientSecret\n            setupIntentId\n            errors {\n              ... on Error {\n                message\n              }\n            }\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        mutation ConfirmSetupIntent($input: ConfirmSetupIntentInput!) {\n          confirmSetupIntent(input: $input) {\n            paymentMethod {\n              id\n            }\n            errors {\n              ... on Error {\n                message\n              }\n            }\n          }\n        }\n      "
): (typeof documents)["\n        mutation ConfirmSetupIntent($input: ConfirmSetupIntentInput!) {\n          confirmSetupIntent(input: $input) {\n            paymentMethod {\n              id\n            }\n            errors {\n              ... on Error {\n                message\n              }\n            }\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        mutation SetDefaultPaymentMethod(\n          $input: SetDefaultPaymentMethodInput!\n        ) {\n          setDefaultPaymentMethod(input: $input) {\n            paymentMethod {\n              id\n              isDefault\n            }\n            errors {\n              ... on Error {\n                message\n              }\n            }\n          }\n        }\n      "
): (typeof documents)["\n        mutation SetDefaultPaymentMethod(\n          $input: SetDefaultPaymentMethodInput!\n        ) {\n          setDefaultPaymentMethod(input: $input) {\n            paymentMethod {\n              id\n              isDefault\n            }\n            errors {\n              ... on Error {\n                message\n              }\n            }\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        mutation DeletePaymentMethod($input: DeletePaymentMethodInput!) {\n          deletePaymentMethod(input: $input) {\n            success\n            errors {\n              ... on Error {\n                message\n              }\n            }\n          }\n        }\n      "
): (typeof documents)["\n        mutation DeletePaymentMethod($input: DeletePaymentMethodInput!) {\n          deletePaymentMethod(input: $input) {\n            success\n            errors {\n              ... on Error {\n                message\n              }\n            }\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment Gallery_SharedSpaceFragment on Space {\n    title\n    images\n  }\n"
): (typeof documents)["\n  fragment Gallery_SharedSpaceFragment on Space {\n    title\n    images\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment Header_SharedSpaceFragment on Space {\n    title\n    status\n    type\n  }\n"
): (typeof documents)["\n  fragment Header_SharedSpaceFragment on Space {\n    title\n    status\n    type\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment OwnerCard_SpaceFragment on Space {\n    spaceOwnerProfile {\n      businessName\n      user {\n        name\n        avatar\n      }\n    }\n  }\n"
): (typeof documents)["\n  fragment OwnerCard_SpaceFragment on Space {\n    spaceOwnerProfile {\n      businessName\n      user {\n        name\n        avatar\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        query SharedSpaceDetail($id: ID!) {\n          spaceById(id: $id) {\n            id\n            ...Header_SharedSpaceFragment\n            ...Gallery_SharedSpaceFragment\n            ...SpaceInfo_SpaceFragment\n            ...PricingCard_SpaceFragment\n            ...OwnerCard_SpaceFragment\n          }\n        }\n      "
): (typeof documents)["\n        query SharedSpaceDetail($id: ID!) {\n          spaceById(id: $id) {\n            id\n            ...Header_SharedSpaceFragment\n            ...Gallery_SharedSpaceFragment\n            ...SpaceInfo_SpaceFragment\n            ...PricingCard_SpaceFragment\n            ...OwnerCard_SpaceFragment\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment PricingCard_SpaceFragment on Space {\n    pricePerDay\n    installationFee\n    minDuration\n    maxDuration\n  }\n"
): (typeof documents)["\n  fragment PricingCard_SpaceFragment on Space {\n    pricePerDay\n    installationFee\n    minDuration\n    maxDuration\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment SpaceInfo_SpaceFragment on Space {\n    description\n    address\n    city\n    state\n    zipCode\n    width\n    height\n    dimensionsText\n    traffic\n    availableFrom\n    availableTo\n    averageRating\n    totalBookings\n  }\n"
): (typeof documents)["\n  fragment SpaceInfo_SpaceFragment on Space {\n    description\n    address\n    city\n    state\n    zipCode\n    width\n    height\n    dimensionsText\n    traffic\n    availableFrom\n    availableTo\n    averageRating\n    totalBookings\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment UserSection_UserFragment on User {\n    email\n    name\n    avatar\n    activeProfileType\n  }\n"
): (typeof documents)["\n  fragment UserSection_UserFragment on User {\n    email\n    name\n    avatar\n    activeProfileType\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation SwitchProfile($input: UpdateCurrentUserInput!) {\n        updateCurrentUser(input: $input) {\n          user {\n            id\n            activeProfileType\n          }\n          errors {\n            ... on Error {\n              message\n            }\n          }\n        }\n      }\n    "
): (typeof documents)["\n      mutation SwitchProfile($input: UpdateCurrentUserInput!) {\n        updateCurrentUser(input: $input) {\n          user {\n            id\n            activeProfileType\n          }\n          errors {\n            ... on Error {\n              message\n            }\n          }\n        }\n      }\n    "];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
