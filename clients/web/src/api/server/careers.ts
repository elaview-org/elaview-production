import { gql as apolloGql } from "@apollo/client";
import gql from "./gql";
import type { Career, CareerDepartment, CareerType } from "@/lib/types/career";

const GET_CAREERS_QUERY = apolloGql`
  query GetCareers($where: CareerFilterInput, $first: Int, $after: String) {
    careers(
      where: $where
      first: $first
      after: $after
      order: [{ createdAt: DESC }]
    ) {
      nodes {
        id
        title
        department
        location
        type
        description
        requirements
        isActive
        createdAt
        expiresAt
      }
    }
  }
`;

const GET_CAREER_BY_ID_QUERY = apolloGql`
  query GetCareerById($id: ID!) {
    careerById(id: $id) {
      id
      title
      department
      location
      type
      description
      requirements
      isActive
      createdAt
      expiresAt
    }
  }
`;

const CREATE_CAREER_MUTATION = apolloGql`
  mutation CreateCareer($input: CreateCareerInput!) {
    createCareer(input: $input) {
      career {
        id
      }
      errors {
        ... on Error {
          message
        }
      }
    }
  }
`;

const UPDATE_CAREER_MUTATION = apolloGql`
  mutation UpdateCareer($id: ID!, $input: UpdateCareerInput!) {
    updateCareer(id: $id, input: $input) {
      career {
        id
      }
      errors {
        ... on Error {
          message
        }
      }
    }
  }
`;

const DELETE_CAREER_MUTATION = apolloGql`
  mutation DeleteCareer($input: DeleteCareerInput!) {
    deleteCareer(input: $input) {
      errors {
        ... on Error {
          message
        }
      }
    }
  }
`;

type CareerRecord = {
  id: string;
  title: string;
  department: CareerDepartment;
  location: string;
  type: CareerType;
  description: string;
  requirements: string;
  isActive: boolean;
  createdAt: string;
  expiresAt?: string | null;
};

function mapCareer(record: CareerRecord): Career {
  return {
    id: record.id,
    title: record.title,
    department: record.department,
    location: record.location,
    type: record.type,
    description: record.description,
    requirements: record.requirements,
    isActive: record.isActive,
    createdAt: record.createdAt,
    expiresAt: record.expiresAt ?? null,
  };
}

const careers = {
  list: async (variables?: {
    isActive?: boolean;
    department?: string;
    first?: number;
    after?: string;
  }): Promise<Career[]> => {
    const where: Record<string, unknown> = {};
    if (variables?.isActive !== undefined) {
      where.isActive = { eq: variables.isActive };
    }
    if (variables?.department) {
      where.department = { eq: variables.department };
    }

    const client = await gql.getClient();
    const res = await client.query<{
      careers?: { nodes?: CareerRecord[] | null } | null;
    }>({
      query: GET_CAREERS_QUERY,
      variables: {
        where: Object.keys(where).length ? where : undefined,
        first: variables?.first,
        after: variables?.after,
      },
      fetchPolicy: "no-cache",
    });

    return (res.data?.careers?.nodes ?? []).map(mapCareer);
  },

  detail: async (id: string): Promise<Career | null> => {
    const client = await gql.getClient();
    const res = await client.query<{
      careerById?: CareerRecord | null;
    }>({
      query: GET_CAREER_BY_ID_QUERY,
      variables: { id },
      fetchPolicy: "no-cache",
    });

    if (!res.data?.careerById) {
      return null;
    }

    return mapCareer(res.data.careerById);
  },

  create: async (input: {
    title: string;
    department: CareerDepartment;
    type: CareerType;
    location: string;
    description: string;
    requirements: string;
    isActive: boolean;
    expiresAt?: string;
  }): Promise<{ id: string }> => {
    const client = await gql.getClient();
    const res = await client.mutate<{
      createCareer?: {
        career?: { id?: string | null } | null;
        errors?: Array<{ message: string } | null> | null;
      } | null;
    }>({
      mutation: CREATE_CAREER_MUTATION,
      variables: { input },
    });

    const payload = res.data?.createCareer;
    const error = payload?.errors?.find(Boolean)?.message;
    if (error) {
      throw new Error(error);
    }

    const id = payload?.career?.id;
    if (!id) {
      throw new Error("Failed to create career");
    }

    return { id };
  },

  update: async (
    id: string,
    input: {
      title?: string;
      department?: CareerDepartment;
      type?: CareerType;
      location?: string;
      description?: string;
      requirements?: string;
      isActive?: boolean;
      expiresAt?: string;
    }
  ): Promise<{ id: string }> => {
    const client = await gql.getClient();
    const res = await client.mutate<{
      updateCareer?: {
        career?: { id?: string | null } | null;
        errors?: Array<{ message: string } | null> | null;
      } | null;
    }>({
      mutation: UPDATE_CAREER_MUTATION,
      variables: { id, input },
    });

    const payload = res.data?.updateCareer;
    const error = payload?.errors?.find(Boolean)?.message;
    if (error) {
      throw new Error(error);
    }

    const updatedId = payload?.career?.id;
    if (!updatedId) {
      throw new Error("Failed to update career");
    }

    return { id: updatedId };
  },

  delete: async (id: string): Promise<void> => {
    const client = await gql.getClient();
    const res = await client.mutate<{
      deleteCareer?: {
        errors?: Array<{ message: string } | null> | null;
      } | null;
    }>({
      mutation: DELETE_CAREER_MUTATION,
      variables: { input: { id } },
    });

    const payload = res.data?.deleteCareer;
    const error = payload?.errors?.find(Boolean)?.message;
    if (error) {
      throw new Error(error);
    }
  },
};

export default careers;
