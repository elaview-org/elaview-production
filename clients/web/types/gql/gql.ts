/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

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
    "\n        query GetMyBookingsAsAdvertiser($first: Int!) {\n          myBookingsAsAdvertiser(first: $first) {\n            nodes {\n              id\n              status\n              startDate\n              endDate\n              createdAt\n              space {\n                title\n                city\n                state\n              }\n              campaign {\n                name\n              }\n            }\n          }\n        }\n      ": typeof types.GetMyBookingsAsAdvertiserDocument,
    "\n      query DiscoverSpaces {\n        spaces(first: 32, where: { status: { eq: ACTIVE } }) {\n          nodes {\n            id\n            title\n            address\n            city\n            state\n            zipCode\n            latitude\n            longitude\n            pricePerDay\n            type\n            images\n            width\n            height\n            status\n          }\n        }\n      }\n    ": typeof types.DiscoverSpacesDocument,
    "\n      query DiscoverSpacesMap {\n        spaces(first: 32, where: { status: { eq: ACTIVE } }) {\n          nodes {\n            id\n            title\n            address\n            city\n            state\n            zipCode\n            latitude\n            longitude\n            pricePerDay\n            type\n            images\n            width\n            height\n            status\n          }\n        }\n      }\n    ": typeof types.DiscoverSpacesMapDocument,
    "\n      query AdvertiserSettings {\n        me {\n          id\n          email\n          name\n          avatar\n          phone\n          createdAt\n          lastLoginAt\n          activeProfileType\n          advertiserProfile {\n            id\n            companyName\n            industry\n            website\n            onboardingComplete\n          }\n        }\n      }\n    ": typeof types.AdvertiserSettingsDocument,
    "\n      query GetCurrentUserForSettings {\n        me {\n          id\n          avatar\n          advertiserProfile {\n            id\n          }\n        }\n      }\n    ": typeof types.GetCurrentUserForSettingsDocument,
    "\n        mutation UpdateCurrentUserProfile($input: UpdateCurrentUserInput!) {\n          updateCurrentUser(input: $input) {\n            user {\n              id\n            }\n          }\n        }\n      ": typeof types.UpdateCurrentUserProfileDocument,
    "\n        mutation UpdateAdvertiserProfileInfo($input: UpdateAdvertiserProfileInput!) {\n          updateAdvertiserProfile(input: $input) {\n            advertiserProfile {\n              id\n            }\n          }\n        }\n      ": typeof types.UpdateAdvertiserProfileInfoDocument,
    "\n  fragment BookingCard_BookingFragment on Booking {\n    id\n    status\n    startDate\n    endDate\n    ownerPayoutAmount\n    space {\n      title\n      images\n    }\n    campaign {\n      name\n      advertiserProfile {\n        companyName\n      }\n    }\n  }\n": typeof types.BookingCard_BookingFragmentFragmentDoc,
    "\n  fragment BookingsTable_BookingFragment on Booking {\n    id\n    status\n    startDate\n    endDate\n    ownerPayoutAmount\n    space {\n      title\n      images\n    }\n    campaign {\n      name\n      advertiserProfile {\n        companyName\n      }\n    }\n  }\n": typeof types.BookingsTable_BookingFragmentFragmentDoc,
    "\n      query SpaceOwnerBookings {\n        myBookingsAsOwner {\n          nodes {\n            id\n            ...BookingCard_BookingFragment\n            ...BookingsTable_BookingFragment\n          }\n        }\n      }\n    ": typeof types.SpaceOwnerBookingsDocument,
    "\n  fragment BalanceCards_EarningsSummaryFragment on EarningsSummary {\n    availableBalance\n    pendingPayouts\n    thisMonthEarnings\n    lastMonthEarnings\n    totalEarnings\n  }\n": typeof types.BalanceCards_EarningsSummaryFragmentFragmentDoc,
    "\n      query SpaceOwnerEarnings {\n        earningsSummary {\n          ...BalanceCards_EarningsSummaryFragment\n        }\n        myPayouts {\n          nodes {\n            id\n            amount\n            processedAt\n            ...PayoutsTable_PayoutFragment\n          }\n        }\n      }\n    ": typeof types.SpaceOwnerEarningsDocument,
    "\n  fragment PayoutsTable_PayoutFragment on Payout {\n    id\n    amount\n    stage\n    status\n    processedAt\n    booking {\n      id\n      space {\n        title\n      }\n    }\n  }\n": typeof types.PayoutsTable_PayoutFragmentFragmentDoc,
    "\n  fragment SpaceCard_SpaceFragment on Space {\n    id\n    title\n    description\n    city\n    state\n    images\n    type\n    status\n    createdAt\n  }\n": typeof types.SpaceCard_SpaceFragmentFragmentDoc,
    "\n  fragment ListingsTable_SpaceFragment on Space {\n    id\n    title\n    city\n    state\n    images\n    type\n    status\n    createdAt\n  }\n": typeof types.ListingsTable_SpaceFragmentFragmentDoc,
    "\n  fragment Details_SpaceFragment on Space {\n    id\n    description\n    type\n    address\n    city\n    state\n    zipCode\n    traffic\n    pricePerDay\n    installationFee\n    minDuration\n    maxDuration\n    width\n    height\n    dimensionsText\n    availableFrom\n    availableTo\n  }\n": typeof types.Details_SpaceFragmentFragmentDoc,
    "\n  fragment Gallery_SpaceFragment on Space {\n    id\n    title\n    images\n  }\n": typeof types.Gallery_SpaceFragmentFragmentDoc,
    "\n  fragment Header_SpaceFragment on Space {\n    title\n    status\n  }\n": typeof types.Header_SpaceFragmentFragmentDoc,
    "\n      query SpaceDetail($id: ID!) {\n        spaceById(id: $id) {\n          id\n          ...Header_SpaceFragment\n          ...Gallery_SpaceFragment\n          ...Details_SpaceFragment\n          ...Performance_SpaceFragment\n        }\n      }\n    ": typeof types.SpaceDetailDocument,
    "\n  fragment Performance_SpaceFragment on Space {\n    totalBookings\n    totalRevenue\n    averageRating\n  }\n": typeof types.Performance_SpaceFragmentFragmentDoc,
    "\n        query SpaceOwnerListings {\n          mySpaces {\n            nodes {\n              id\n              ...SpaceCard_SpaceFragment\n              ...ListingsTable_SpaceFragment\n            }\n          }\n        }\n      ": typeof types.SpaceOwnerListingsDocument,
    "\n  fragment AboutSection_UserFragment on User {\n    name\n    spaceOwnerProfile {\n      businessName\n      businessType\n      onboardingComplete\n      spaces(first: 10) {\n        nodes {\n          id\n        }\n      }\n    }\n  }\n": typeof types.AboutSection_UserFragmentFragmentDoc,
    "\n      query SpaceOwnerProfile {\n        me {\n          name\n          ...ProfileCard_UserFragment\n          ...AboutSection_UserFragment\n        }\n      }\n    ": typeof types.SpaceOwnerProfileDocument,
    "\n  fragment ProfileCard_UserFragment on User {\n    name\n    avatar\n    spaceOwnerProfile {\n      createdAt\n      spaces(first: 10) {\n        nodes {\n          averageRating\n          reviews(first: 10) {\n            nodes {\n              id\n            }\n          }\n        }\n      }\n    }\n  }\n": typeof types.ProfileCard_UserFragmentFragmentDoc,
    "\n      query SpaceOwnerSettings {\n        me {\n          id\n          email\n          name\n          avatar\n          phone\n          createdAt\n          lastLoginAt\n          activeProfileType\n          spaceOwnerProfile {\n            id\n            businessName\n            businessType\n            payoutSchedule\n            onboardingComplete\n            stripeAccountId\n            stripeAccountStatus\n          }\n        }\n        myNotificationPreferences {\n          id\n          notificationType\n          inAppEnabled\n          emailEnabled\n          pushEnabled\n        }\n      }\n    ": typeof types.SpaceOwnerSettingsDocument,
    "\n      query GetSpaceOwnerForSettings {\n        me {\n          id\n          avatar\n          spaceOwnerProfile {\n            id\n          }\n        }\n      }\n    ": typeof types.GetSpaceOwnerForSettingsDocument,
    "\n        mutation UpdateSpaceOwnerProfile($input: UpdateCurrentUserInput!) {\n          updateCurrentUser(input: $input) {\n            user {\n              id\n            }\n          }\n        }\n      ": typeof types.UpdateSpaceOwnerProfileDocument,
    "\n        mutation UpdateSpaceOwnerBusinessInfo(\n          $input: UpdateSpaceOwnerProfileInput!\n        ) {\n          updateSpaceOwnerProfile(input: $input) {\n            spaceOwnerProfile {\n              id\n            }\n          }\n        }\n      ": typeof types.UpdateSpaceOwnerBusinessInfoDocument,
    "\n      query DashboardUser {\n        me {\n          ...NavigationSection_UserFragment\n          ...UserSection_UserFragment\n          ...RoleBasedView_UserFragment\n        }\n      }\n    ": typeof types.DashboardUserDocument,
    "\n  fragment NavigationSection_UserFragment on User {\n    role\n    activeProfileType\n  }\n": typeof types.NavigationSection_UserFragmentFragmentDoc,
    "\n  fragment RoleBasedView_UserFragment on User {\n    role\n    activeProfileType\n  }\n": typeof types.RoleBasedView_UserFragmentFragmentDoc,
    "\n      mutation SwitchProfile($input: UpdateCurrentUserInput!) {\n        updateCurrentUser(input: $input) {\n          user {\n            id\n            activeProfileType\n          }\n          errors {\n            ... on Error {\n              message\n            }\n          }\n        }\n      }\n    ": typeof types.SwitchProfileDocument,
    "\n  fragment UserSection_UserFragment on User {\n    email\n    name\n    avatar\n    activeProfileType\n  }\n": typeof types.UserSection_UserFragmentFragmentDoc,
};
const documents: Documents = {
    "\n        query GetMyBookingsAsAdvertiser($first: Int!) {\n          myBookingsAsAdvertiser(first: $first) {\n            nodes {\n              id\n              status\n              startDate\n              endDate\n              createdAt\n              space {\n                title\n                city\n                state\n              }\n              campaign {\n                name\n              }\n            }\n          }\n        }\n      ": types.GetMyBookingsAsAdvertiserDocument,
    "\n      query DiscoverSpaces {\n        spaces(first: 32, where: { status: { eq: ACTIVE } }) {\n          nodes {\n            id\n            title\n            address\n            city\n            state\n            zipCode\n            latitude\n            longitude\n            pricePerDay\n            type\n            images\n            width\n            height\n            status\n          }\n        }\n      }\n    ": types.DiscoverSpacesDocument,
    "\n      query DiscoverSpacesMap {\n        spaces(first: 32, where: { status: { eq: ACTIVE } }) {\n          nodes {\n            id\n            title\n            address\n            city\n            state\n            zipCode\n            latitude\n            longitude\n            pricePerDay\n            type\n            images\n            width\n            height\n            status\n          }\n        }\n      }\n    ": types.DiscoverSpacesMapDocument,
    "\n      query AdvertiserSettings {\n        me {\n          id\n          email\n          name\n          avatar\n          phone\n          createdAt\n          lastLoginAt\n          activeProfileType\n          advertiserProfile {\n            id\n            companyName\n            industry\n            website\n            onboardingComplete\n          }\n        }\n      }\n    ": types.AdvertiserSettingsDocument,
    "\n      query GetCurrentUserForSettings {\n        me {\n          id\n          avatar\n          advertiserProfile {\n            id\n          }\n        }\n      }\n    ": types.GetCurrentUserForSettingsDocument,
    "\n        mutation UpdateCurrentUserProfile($input: UpdateCurrentUserInput!) {\n          updateCurrentUser(input: $input) {\n            user {\n              id\n            }\n          }\n        }\n      ": types.UpdateCurrentUserProfileDocument,
    "\n        mutation UpdateAdvertiserProfileInfo($input: UpdateAdvertiserProfileInput!) {\n          updateAdvertiserProfile(input: $input) {\n            advertiserProfile {\n              id\n            }\n          }\n        }\n      ": types.UpdateAdvertiserProfileInfoDocument,
    "\n  fragment BookingCard_BookingFragment on Booking {\n    id\n    status\n    startDate\n    endDate\n    ownerPayoutAmount\n    space {\n      title\n      images\n    }\n    campaign {\n      name\n      advertiserProfile {\n        companyName\n      }\n    }\n  }\n": types.BookingCard_BookingFragmentFragmentDoc,
    "\n  fragment BookingsTable_BookingFragment on Booking {\n    id\n    status\n    startDate\n    endDate\n    ownerPayoutAmount\n    space {\n      title\n      images\n    }\n    campaign {\n      name\n      advertiserProfile {\n        companyName\n      }\n    }\n  }\n": types.BookingsTable_BookingFragmentFragmentDoc,
    "\n      query SpaceOwnerBookings {\n        myBookingsAsOwner {\n          nodes {\n            id\n            ...BookingCard_BookingFragment\n            ...BookingsTable_BookingFragment\n          }\n        }\n      }\n    ": types.SpaceOwnerBookingsDocument,
    "\n  fragment BalanceCards_EarningsSummaryFragment on EarningsSummary {\n    availableBalance\n    pendingPayouts\n    thisMonthEarnings\n    lastMonthEarnings\n    totalEarnings\n  }\n": types.BalanceCards_EarningsSummaryFragmentFragmentDoc,
    "\n      query SpaceOwnerEarnings {\n        earningsSummary {\n          ...BalanceCards_EarningsSummaryFragment\n        }\n        myPayouts {\n          nodes {\n            id\n            amount\n            processedAt\n            ...PayoutsTable_PayoutFragment\n          }\n        }\n      }\n    ": types.SpaceOwnerEarningsDocument,
    "\n  fragment PayoutsTable_PayoutFragment on Payout {\n    id\n    amount\n    stage\n    status\n    processedAt\n    booking {\n      id\n      space {\n        title\n      }\n    }\n  }\n": types.PayoutsTable_PayoutFragmentFragmentDoc,
    "\n  fragment SpaceCard_SpaceFragment on Space {\n    id\n    title\n    description\n    city\n    state\n    images\n    type\n    status\n    createdAt\n  }\n": types.SpaceCard_SpaceFragmentFragmentDoc,
    "\n  fragment ListingsTable_SpaceFragment on Space {\n    id\n    title\n    city\n    state\n    images\n    type\n    status\n    createdAt\n  }\n": types.ListingsTable_SpaceFragmentFragmentDoc,
    "\n  fragment Details_SpaceFragment on Space {\n    id\n    description\n    type\n    address\n    city\n    state\n    zipCode\n    traffic\n    pricePerDay\n    installationFee\n    minDuration\n    maxDuration\n    width\n    height\n    dimensionsText\n    availableFrom\n    availableTo\n  }\n": types.Details_SpaceFragmentFragmentDoc,
    "\n  fragment Gallery_SpaceFragment on Space {\n    id\n    title\n    images\n  }\n": types.Gallery_SpaceFragmentFragmentDoc,
    "\n  fragment Header_SpaceFragment on Space {\n    title\n    status\n  }\n": types.Header_SpaceFragmentFragmentDoc,
    "\n      query SpaceDetail($id: ID!) {\n        spaceById(id: $id) {\n          id\n          ...Header_SpaceFragment\n          ...Gallery_SpaceFragment\n          ...Details_SpaceFragment\n          ...Performance_SpaceFragment\n        }\n      }\n    ": types.SpaceDetailDocument,
    "\n  fragment Performance_SpaceFragment on Space {\n    totalBookings\n    totalRevenue\n    averageRating\n  }\n": types.Performance_SpaceFragmentFragmentDoc,
    "\n        query SpaceOwnerListings {\n          mySpaces {\n            nodes {\n              id\n              ...SpaceCard_SpaceFragment\n              ...ListingsTable_SpaceFragment\n            }\n          }\n        }\n      ": types.SpaceOwnerListingsDocument,
    "\n  fragment AboutSection_UserFragment on User {\n    name\n    spaceOwnerProfile {\n      businessName\n      businessType\n      onboardingComplete\n      spaces(first: 10) {\n        nodes {\n          id\n        }\n      }\n    }\n  }\n": types.AboutSection_UserFragmentFragmentDoc,
    "\n      query SpaceOwnerProfile {\n        me {\n          name\n          ...ProfileCard_UserFragment\n          ...AboutSection_UserFragment\n        }\n      }\n    ": types.SpaceOwnerProfileDocument,
    "\n  fragment ProfileCard_UserFragment on User {\n    name\n    avatar\n    spaceOwnerProfile {\n      createdAt\n      spaces(first: 10) {\n        nodes {\n          averageRating\n          reviews(first: 10) {\n            nodes {\n              id\n            }\n          }\n        }\n      }\n    }\n  }\n": types.ProfileCard_UserFragmentFragmentDoc,
    "\n      query SpaceOwnerSettings {\n        me {\n          id\n          email\n          name\n          avatar\n          phone\n          createdAt\n          lastLoginAt\n          activeProfileType\n          spaceOwnerProfile {\n            id\n            businessName\n            businessType\n            payoutSchedule\n            onboardingComplete\n            stripeAccountId\n            stripeAccountStatus\n          }\n        }\n        myNotificationPreferences {\n          id\n          notificationType\n          inAppEnabled\n          emailEnabled\n          pushEnabled\n        }\n      }\n    ": types.SpaceOwnerSettingsDocument,
    "\n      query GetSpaceOwnerForSettings {\n        me {\n          id\n          avatar\n          spaceOwnerProfile {\n            id\n          }\n        }\n      }\n    ": types.GetSpaceOwnerForSettingsDocument,
    "\n        mutation UpdateSpaceOwnerProfile($input: UpdateCurrentUserInput!) {\n          updateCurrentUser(input: $input) {\n            user {\n              id\n            }\n          }\n        }\n      ": types.UpdateSpaceOwnerProfileDocument,
    "\n        mutation UpdateSpaceOwnerBusinessInfo(\n          $input: UpdateSpaceOwnerProfileInput!\n        ) {\n          updateSpaceOwnerProfile(input: $input) {\n            spaceOwnerProfile {\n              id\n            }\n          }\n        }\n      ": types.UpdateSpaceOwnerBusinessInfoDocument,
    "\n      query DashboardUser {\n        me {\n          ...NavigationSection_UserFragment\n          ...UserSection_UserFragment\n          ...RoleBasedView_UserFragment\n        }\n      }\n    ": types.DashboardUserDocument,
    "\n  fragment NavigationSection_UserFragment on User {\n    role\n    activeProfileType\n  }\n": types.NavigationSection_UserFragmentFragmentDoc,
    "\n  fragment RoleBasedView_UserFragment on User {\n    role\n    activeProfileType\n  }\n": types.RoleBasedView_UserFragmentFragmentDoc,
    "\n      mutation SwitchProfile($input: UpdateCurrentUserInput!) {\n        updateCurrentUser(input: $input) {\n          user {\n            id\n            activeProfileType\n          }\n          errors {\n            ... on Error {\n              message\n            }\n          }\n        }\n      }\n    ": types.SwitchProfileDocument,
    "\n  fragment UserSection_UserFragment on User {\n    email\n    name\n    avatar\n    activeProfileType\n  }\n": types.UserSection_UserFragmentFragmentDoc,
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
export function graphql(source: "\n        query GetMyBookingsAsAdvertiser($first: Int!) {\n          myBookingsAsAdvertiser(first: $first) {\n            nodes {\n              id\n              status\n              startDate\n              endDate\n              createdAt\n              space {\n                title\n                city\n                state\n              }\n              campaign {\n                name\n              }\n            }\n          }\n        }\n      "): (typeof documents)["\n        query GetMyBookingsAsAdvertiser($first: Int!) {\n          myBookingsAsAdvertiser(first: $first) {\n            nodes {\n              id\n              status\n              startDate\n              endDate\n              createdAt\n              space {\n                title\n                city\n                state\n              }\n              campaign {\n                name\n              }\n            }\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query DiscoverSpaces {\n        spaces(first: 32, where: { status: { eq: ACTIVE } }) {\n          nodes {\n            id\n            title\n            address\n            city\n            state\n            zipCode\n            latitude\n            longitude\n            pricePerDay\n            type\n            images\n            width\n            height\n            status\n          }\n        }\n      }\n    "): (typeof documents)["\n      query DiscoverSpaces {\n        spaces(first: 32, where: { status: { eq: ACTIVE } }) {\n          nodes {\n            id\n            title\n            address\n            city\n            state\n            zipCode\n            latitude\n            longitude\n            pricePerDay\n            type\n            images\n            width\n            height\n            status\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query DiscoverSpacesMap {\n        spaces(first: 32, where: { status: { eq: ACTIVE } }) {\n          nodes {\n            id\n            title\n            address\n            city\n            state\n            zipCode\n            latitude\n            longitude\n            pricePerDay\n            type\n            images\n            width\n            height\n            status\n          }\n        }\n      }\n    "): (typeof documents)["\n      query DiscoverSpacesMap {\n        spaces(first: 32, where: { status: { eq: ACTIVE } }) {\n          nodes {\n            id\n            title\n            address\n            city\n            state\n            zipCode\n            latitude\n            longitude\n            pricePerDay\n            type\n            images\n            width\n            height\n            status\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query AdvertiserSettings {\n        me {\n          id\n          email\n          name\n          avatar\n          phone\n          createdAt\n          lastLoginAt\n          activeProfileType\n          advertiserProfile {\n            id\n            companyName\n            industry\n            website\n            onboardingComplete\n          }\n        }\n      }\n    "): (typeof documents)["\n      query AdvertiserSettings {\n        me {\n          id\n          email\n          name\n          avatar\n          phone\n          createdAt\n          lastLoginAt\n          activeProfileType\n          advertiserProfile {\n            id\n            companyName\n            industry\n            website\n            onboardingComplete\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query GetCurrentUserForSettings {\n        me {\n          id\n          avatar\n          advertiserProfile {\n            id\n          }\n        }\n      }\n    "): (typeof documents)["\n      query GetCurrentUserForSettings {\n        me {\n          id\n          avatar\n          advertiserProfile {\n            id\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n        mutation UpdateCurrentUserProfile($input: UpdateCurrentUserInput!) {\n          updateCurrentUser(input: $input) {\n            user {\n              id\n            }\n          }\n        }\n      "): (typeof documents)["\n        mutation UpdateCurrentUserProfile($input: UpdateCurrentUserInput!) {\n          updateCurrentUser(input: $input) {\n            user {\n              id\n            }\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n        mutation UpdateAdvertiserProfileInfo($input: UpdateAdvertiserProfileInput!) {\n          updateAdvertiserProfile(input: $input) {\n            advertiserProfile {\n              id\n            }\n          }\n        }\n      "): (typeof documents)["\n        mutation UpdateAdvertiserProfileInfo($input: UpdateAdvertiserProfileInput!) {\n          updateAdvertiserProfile(input: $input) {\n            advertiserProfile {\n              id\n            }\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment BookingCard_BookingFragment on Booking {\n    id\n    status\n    startDate\n    endDate\n    ownerPayoutAmount\n    space {\n      title\n      images\n    }\n    campaign {\n      name\n      advertiserProfile {\n        companyName\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment BookingCard_BookingFragment on Booking {\n    id\n    status\n    startDate\n    endDate\n    ownerPayoutAmount\n    space {\n      title\n      images\n    }\n    campaign {\n      name\n      advertiserProfile {\n        companyName\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment BookingsTable_BookingFragment on Booking {\n    id\n    status\n    startDate\n    endDate\n    ownerPayoutAmount\n    space {\n      title\n      images\n    }\n    campaign {\n      name\n      advertiserProfile {\n        companyName\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment BookingsTable_BookingFragment on Booking {\n    id\n    status\n    startDate\n    endDate\n    ownerPayoutAmount\n    space {\n      title\n      images\n    }\n    campaign {\n      name\n      advertiserProfile {\n        companyName\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query SpaceOwnerBookings {\n        myBookingsAsOwner {\n          nodes {\n            id\n            ...BookingCard_BookingFragment\n            ...BookingsTable_BookingFragment\n          }\n        }\n      }\n    "): (typeof documents)["\n      query SpaceOwnerBookings {\n        myBookingsAsOwner {\n          nodes {\n            id\n            ...BookingCard_BookingFragment\n            ...BookingsTable_BookingFragment\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment BalanceCards_EarningsSummaryFragment on EarningsSummary {\n    availableBalance\n    pendingPayouts\n    thisMonthEarnings\n    lastMonthEarnings\n    totalEarnings\n  }\n"): (typeof documents)["\n  fragment BalanceCards_EarningsSummaryFragment on EarningsSummary {\n    availableBalance\n    pendingPayouts\n    thisMonthEarnings\n    lastMonthEarnings\n    totalEarnings\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query SpaceOwnerEarnings {\n        earningsSummary {\n          ...BalanceCards_EarningsSummaryFragment\n        }\n        myPayouts {\n          nodes {\n            id\n            amount\n            processedAt\n            ...PayoutsTable_PayoutFragment\n          }\n        }\n      }\n    "): (typeof documents)["\n      query SpaceOwnerEarnings {\n        earningsSummary {\n          ...BalanceCards_EarningsSummaryFragment\n        }\n        myPayouts {\n          nodes {\n            id\n            amount\n            processedAt\n            ...PayoutsTable_PayoutFragment\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment PayoutsTable_PayoutFragment on Payout {\n    id\n    amount\n    stage\n    status\n    processedAt\n    booking {\n      id\n      space {\n        title\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment PayoutsTable_PayoutFragment on Payout {\n    id\n    amount\n    stage\n    status\n    processedAt\n    booking {\n      id\n      space {\n        title\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment SpaceCard_SpaceFragment on Space {\n    id\n    title\n    description\n    city\n    state\n    images\n    type\n    status\n    createdAt\n  }\n"): (typeof documents)["\n  fragment SpaceCard_SpaceFragment on Space {\n    id\n    title\n    description\n    city\n    state\n    images\n    type\n    status\n    createdAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ListingsTable_SpaceFragment on Space {\n    id\n    title\n    city\n    state\n    images\n    type\n    status\n    createdAt\n  }\n"): (typeof documents)["\n  fragment ListingsTable_SpaceFragment on Space {\n    id\n    title\n    city\n    state\n    images\n    type\n    status\n    createdAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment Details_SpaceFragment on Space {\n    id\n    description\n    type\n    address\n    city\n    state\n    zipCode\n    traffic\n    pricePerDay\n    installationFee\n    minDuration\n    maxDuration\n    width\n    height\n    dimensionsText\n    availableFrom\n    availableTo\n  }\n"): (typeof documents)["\n  fragment Details_SpaceFragment on Space {\n    id\n    description\n    type\n    address\n    city\n    state\n    zipCode\n    traffic\n    pricePerDay\n    installationFee\n    minDuration\n    maxDuration\n    width\n    height\n    dimensionsText\n    availableFrom\n    availableTo\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment Gallery_SpaceFragment on Space {\n    id\n    title\n    images\n  }\n"): (typeof documents)["\n  fragment Gallery_SpaceFragment on Space {\n    id\n    title\n    images\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment Header_SpaceFragment on Space {\n    title\n    status\n  }\n"): (typeof documents)["\n  fragment Header_SpaceFragment on Space {\n    title\n    status\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query SpaceDetail($id: ID!) {\n        spaceById(id: $id) {\n          id\n          ...Header_SpaceFragment\n          ...Gallery_SpaceFragment\n          ...Details_SpaceFragment\n          ...Performance_SpaceFragment\n        }\n      }\n    "): (typeof documents)["\n      query SpaceDetail($id: ID!) {\n        spaceById(id: $id) {\n          id\n          ...Header_SpaceFragment\n          ...Gallery_SpaceFragment\n          ...Details_SpaceFragment\n          ...Performance_SpaceFragment\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment Performance_SpaceFragment on Space {\n    totalBookings\n    totalRevenue\n    averageRating\n  }\n"): (typeof documents)["\n  fragment Performance_SpaceFragment on Space {\n    totalBookings\n    totalRevenue\n    averageRating\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n        query SpaceOwnerListings {\n          mySpaces {\n            nodes {\n              id\n              ...SpaceCard_SpaceFragment\n              ...ListingsTable_SpaceFragment\n            }\n          }\n        }\n      "): (typeof documents)["\n        query SpaceOwnerListings {\n          mySpaces {\n            nodes {\n              id\n              ...SpaceCard_SpaceFragment\n              ...ListingsTable_SpaceFragment\n            }\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment AboutSection_UserFragment on User {\n    name\n    spaceOwnerProfile {\n      businessName\n      businessType\n      onboardingComplete\n      spaces(first: 10) {\n        nodes {\n          id\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment AboutSection_UserFragment on User {\n    name\n    spaceOwnerProfile {\n      businessName\n      businessType\n      onboardingComplete\n      spaces(first: 10) {\n        nodes {\n          id\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query SpaceOwnerProfile {\n        me {\n          name\n          ...ProfileCard_UserFragment\n          ...AboutSection_UserFragment\n        }\n      }\n    "): (typeof documents)["\n      query SpaceOwnerProfile {\n        me {\n          name\n          ...ProfileCard_UserFragment\n          ...AboutSection_UserFragment\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ProfileCard_UserFragment on User {\n    name\n    avatar\n    spaceOwnerProfile {\n      createdAt\n      spaces(first: 10) {\n        nodes {\n          averageRating\n          reviews(first: 10) {\n            nodes {\n              id\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment ProfileCard_UserFragment on User {\n    name\n    avatar\n    spaceOwnerProfile {\n      createdAt\n      spaces(first: 10) {\n        nodes {\n          averageRating\n          reviews(first: 10) {\n            nodes {\n              id\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query SpaceOwnerSettings {\n        me {\n          id\n          email\n          name\n          avatar\n          phone\n          createdAt\n          lastLoginAt\n          activeProfileType\n          spaceOwnerProfile {\n            id\n            businessName\n            businessType\n            payoutSchedule\n            onboardingComplete\n            stripeAccountId\n            stripeAccountStatus\n          }\n        }\n        myNotificationPreferences {\n          id\n          notificationType\n          inAppEnabled\n          emailEnabled\n          pushEnabled\n        }\n      }\n    "): (typeof documents)["\n      query SpaceOwnerSettings {\n        me {\n          id\n          email\n          name\n          avatar\n          phone\n          createdAt\n          lastLoginAt\n          activeProfileType\n          spaceOwnerProfile {\n            id\n            businessName\n            businessType\n            payoutSchedule\n            onboardingComplete\n            stripeAccountId\n            stripeAccountStatus\n          }\n        }\n        myNotificationPreferences {\n          id\n          notificationType\n          inAppEnabled\n          emailEnabled\n          pushEnabled\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query GetSpaceOwnerForSettings {\n        me {\n          id\n          avatar\n          spaceOwnerProfile {\n            id\n          }\n        }\n      }\n    "): (typeof documents)["\n      query GetSpaceOwnerForSettings {\n        me {\n          id\n          avatar\n          spaceOwnerProfile {\n            id\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n        mutation UpdateSpaceOwnerProfile($input: UpdateCurrentUserInput!) {\n          updateCurrentUser(input: $input) {\n            user {\n              id\n            }\n          }\n        }\n      "): (typeof documents)["\n        mutation UpdateSpaceOwnerProfile($input: UpdateCurrentUserInput!) {\n          updateCurrentUser(input: $input) {\n            user {\n              id\n            }\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n        mutation UpdateSpaceOwnerBusinessInfo(\n          $input: UpdateSpaceOwnerProfileInput!\n        ) {\n          updateSpaceOwnerProfile(input: $input) {\n            spaceOwnerProfile {\n              id\n            }\n          }\n        }\n      "): (typeof documents)["\n        mutation UpdateSpaceOwnerBusinessInfo(\n          $input: UpdateSpaceOwnerProfileInput!\n        ) {\n          updateSpaceOwnerProfile(input: $input) {\n            spaceOwnerProfile {\n              id\n            }\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query DashboardUser {\n        me {\n          ...NavigationSection_UserFragment\n          ...UserSection_UserFragment\n          ...RoleBasedView_UserFragment\n        }\n      }\n    "): (typeof documents)["\n      query DashboardUser {\n        me {\n          ...NavigationSection_UserFragment\n          ...UserSection_UserFragment\n          ...RoleBasedView_UserFragment\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment NavigationSection_UserFragment on User {\n    role\n    activeProfileType\n  }\n"): (typeof documents)["\n  fragment NavigationSection_UserFragment on User {\n    role\n    activeProfileType\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment RoleBasedView_UserFragment on User {\n    role\n    activeProfileType\n  }\n"): (typeof documents)["\n  fragment RoleBasedView_UserFragment on User {\n    role\n    activeProfileType\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation SwitchProfile($input: UpdateCurrentUserInput!) {\n        updateCurrentUser(input: $input) {\n          user {\n            id\n            activeProfileType\n          }\n          errors {\n            ... on Error {\n              message\n            }\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation SwitchProfile($input: UpdateCurrentUserInput!) {\n        updateCurrentUser(input: $input) {\n          user {\n            id\n            activeProfileType\n          }\n          errors {\n            ... on Error {\n              message\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment UserSection_UserFragment on User {\n    email\n    name\n    avatar\n    activeProfileType\n  }\n"): (typeof documents)["\n  fragment UserSection_UserFragment on User {\n    email\n    name\n    avatar\n    activeProfileType\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;