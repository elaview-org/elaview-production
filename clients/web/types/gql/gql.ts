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
    "\n  fragment AboutSection_UserFragment on User {\n    name\n    spaceOwnerProfile {\n      businessName\n      businessType\n      onboardingComplete\n      spaces(first: 10) {\n        nodes {\n          id\n        }\n      }\n    }\n  }\n": typeof types.AboutSection_UserFragmentFragmentDoc,
    "\n      query SpaceOwnerProfile {\n        me {\n          ...ProfileCard_UserFragment\n          ...AboutSection_UserFragment\n          ...ReviewsSection_UserFragment\n        }\n      }\n    ": typeof types.SpaceOwnerProfileDocument,
    "\n  fragment ProfileCard_UserFragment on User {\n    name\n    avatar\n    spaceOwnerProfile {\n      createdAt\n      spaces(first: 10) {\n        nodes {\n          averageRating\n          reviews(first: 10) {\n            nodes {\n              id\n            }\n          }\n        }\n      }\n    }\n  }\n": typeof types.ProfileCard_UserFragmentFragmentDoc,
    "\n  fragment ReviewCard_ReviewFragment on Review {\n    id\n    rating\n    comment\n    createdAt\n    booking {\n      campaign {\n        advertiserProfile {\n          companyName\n          user {\n            name\n            avatar\n          }\n        }\n      }\n    }\n  }\n": typeof types.ReviewCard_ReviewFragmentFragmentDoc,
    "\n  fragment ReviewsSection_UserFragment on User {\n    name\n    spaceOwnerProfile {\n      spaces(first: 10) {\n        nodes {\n          reviews(first: 10) {\n            nodes {\n              ...ReviewCard_ReviewFragment\n            }\n          }\n        }\n      }\n    }\n  }\n": typeof types.ReviewsSection_UserFragmentFragmentDoc,
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
    "\n  fragment AboutSection_UserFragment on User {\n    name\n    spaceOwnerProfile {\n      businessName\n      businessType\n      onboardingComplete\n      spaces(first: 10) {\n        nodes {\n          id\n        }\n      }\n    }\n  }\n": types.AboutSection_UserFragmentFragmentDoc,
    "\n      query SpaceOwnerProfile {\n        me {\n          ...ProfileCard_UserFragment\n          ...AboutSection_UserFragment\n          ...ReviewsSection_UserFragment\n        }\n      }\n    ": types.SpaceOwnerProfileDocument,
    "\n  fragment ProfileCard_UserFragment on User {\n    name\n    avatar\n    spaceOwnerProfile {\n      createdAt\n      spaces(first: 10) {\n        nodes {\n          averageRating\n          reviews(first: 10) {\n            nodes {\n              id\n            }\n          }\n        }\n      }\n    }\n  }\n": types.ProfileCard_UserFragmentFragmentDoc,
    "\n  fragment ReviewCard_ReviewFragment on Review {\n    id\n    rating\n    comment\n    createdAt\n    booking {\n      campaign {\n        advertiserProfile {\n          companyName\n          user {\n            name\n            avatar\n          }\n        }\n      }\n    }\n  }\n": types.ReviewCard_ReviewFragmentFragmentDoc,
    "\n  fragment ReviewsSection_UserFragment on User {\n    name\n    spaceOwnerProfile {\n      spaces(first: 10) {\n        nodes {\n          reviews(first: 10) {\n            nodes {\n              ...ReviewCard_ReviewFragment\n            }\n          }\n        }\n      }\n    }\n  }\n": types.ReviewsSection_UserFragmentFragmentDoc,
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
export function graphql(source: "\n  fragment AboutSection_UserFragment on User {\n    name\n    spaceOwnerProfile {\n      businessName\n      businessType\n      onboardingComplete\n      spaces(first: 10) {\n        nodes {\n          id\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment AboutSection_UserFragment on User {\n    name\n    spaceOwnerProfile {\n      businessName\n      businessType\n      onboardingComplete\n      spaces(first: 10) {\n        nodes {\n          id\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query SpaceOwnerProfile {\n        me {\n          ...ProfileCard_UserFragment\n          ...AboutSection_UserFragment\n          ...ReviewsSection_UserFragment\n        }\n      }\n    "): (typeof documents)["\n      query SpaceOwnerProfile {\n        me {\n          ...ProfileCard_UserFragment\n          ...AboutSection_UserFragment\n          ...ReviewsSection_UserFragment\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ProfileCard_UserFragment on User {\n    name\n    avatar\n    spaceOwnerProfile {\n      createdAt\n      spaces(first: 10) {\n        nodes {\n          averageRating\n          reviews(first: 10) {\n            nodes {\n              id\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment ProfileCard_UserFragment on User {\n    name\n    avatar\n    spaceOwnerProfile {\n      createdAt\n      spaces(first: 10) {\n        nodes {\n          averageRating\n          reviews(first: 10) {\n            nodes {\n              id\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ReviewCard_ReviewFragment on Review {\n    id\n    rating\n    comment\n    createdAt\n    booking {\n      campaign {\n        advertiserProfile {\n          companyName\n          user {\n            name\n            avatar\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment ReviewCard_ReviewFragment on Review {\n    id\n    rating\n    comment\n    createdAt\n    booking {\n      campaign {\n        advertiserProfile {\n          companyName\n          user {\n            name\n            avatar\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ReviewsSection_UserFragment on User {\n    name\n    spaceOwnerProfile {\n      spaces(first: 10) {\n        nodes {\n          reviews(first: 10) {\n            nodes {\n              ...ReviewCard_ReviewFragment\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment ReviewsSection_UserFragment on User {\n    name\n    spaceOwnerProfile {\n      spaces(first: 10) {\n        nodes {\n          reviews(first: 10) {\n            nodes {\n              ...ReviewCard_ReviewFragment\n            }\n          }\n        }\n      }\n    }\n  }\n"];
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