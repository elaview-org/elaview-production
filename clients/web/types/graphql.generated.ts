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

export type BooleanOperationFilterInput = {
  eq?: InputMaybe<Scalars['Boolean']['input']>;
  neq?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Campaign = {
  __typename: 'Campaign';
  advertiserProfile: AdvertiserProfile;
  advertiserProfileId: Scalars['UUID']['output'];
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

export type ListFilterInputTypeOfCampaignFilterInput = {
  all?: InputMaybe<CampaignFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<CampaignFilterInput>;
  some?: InputMaybe<CampaignFilterInput>;
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
