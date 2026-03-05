// TODO: This file contains GraphQL stubs for the Careers feature.
// The backend (.NET GraphQL API) needs to implement the following:
//
//   type Career {
//     id: ID!
//     title: String!
//     department: CareerDepartment!
//     location: String!
//     type: CareerType!
//     description: String!
//     requirements: String!
//     isActive: Boolean!
//     createdAt: DateTime!
//     expiresAt: DateTime
//   }
//
//   enum CareerDepartment { ENGINEERING DESIGN MARKETING SALES OPERATIONS CUSTOMER_SUCCESS }
//   enum CareerType { FULL_TIME PART_TIME CONTRACT INTERNSHIP }
//
//   type Query {
//     careers(where: CareerFilterInput, order: [CareerSortInput!], first: Int, after: String): CareersConnection
//     careerById(id: ID!): Career
//   }
//
//   type Mutation {
//     createCareer(input: CreateCareerInput!): CreateCareerPayload
//     updateCareer(id: ID!, input: UpdateCareerInput!): UpdateCareerPayload
//     deleteCareer(input: DeleteCareerInput!): DeleteCareerPayload
//   }
//
// Once the backend is implemented, remove the fallback empty arrays below and
// uncomment the actual gql.query() calls.

import type { Career } from "@/lib/types/career";

const careers = {
  list: async (variables?: {
    isActive?: boolean;
    department?: string;
    first?: number;
    after?: string;
  }): Promise<Career[]> => {
    void variables; // TODO: Pass to GraphQL query once backend implements Career entity
    // TODO: Replace with real GraphQL query once backend implements Career entity.
    // Example:
    // return gql.query({
    //   query: graphql(`
    //     query GetCareers($where: CareerFilterInput, $first: Int, $after: String) {
    //       careers(where: $where, first: $first, after: $after, order: [{ createdAt: DESC }]) {
    //         nodes {
    //           id title department location type description requirements isActive createdAt expiresAt
    //         }
    //       }
    //     }
    //   `),
    //   variables: { where: variables?.isActive !== undefined ? { isActive: { eq: variables.isActive } } : undefined },
    // }).then(res => res.data?.careers?.nodes ?? []);
    return [];
  },

  detail: async (id: string): Promise<Career | null> => {
    void id; // TODO: Pass to GraphQL query once backend implements Career entity
    // TODO: Replace with real GraphQL query once backend implements Career entity.
    // Example:
    // return gql.query({
    //   query: graphql(`
    //     query GetCareerById($id: ID!) {
    //       careerById(id: $id) {
    //         id title department location type description requirements isActive createdAt expiresAt
    //       }
    //     }
    //   `),
    //   variables: { id },
    // }).then(res => res.data?.careerById ?? null);
    return null;
  },
};

export default careers;
