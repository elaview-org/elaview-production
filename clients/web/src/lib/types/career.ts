// Career types for the Careers feature.
// NOTE: These are manually defined — the backend (.NET GraphQL) needs to implement
// the Career entity, queries, and mutations before this feature is fully functional.
// See api/server/careers.ts for the GraphQL stubs.

export type CareerType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
export type CareerDepartment =
  | "ENGINEERING"
  | "DESIGN"
  | "MARKETING"
  | "SALES"
  | "OPERATIONS"
  | "CUSTOMER_SUCCESS";

export interface Career {
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
}

export const CAREER_TYPE_LABELS: Record<CareerType, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};

export const CAREER_DEPARTMENT_LABELS: Record<CareerDepartment, string> = {
  ENGINEERING: "Engineering",
  DESIGN: "Design",
  MARKETING: "Marketing",
  SALES: "Sales",
  OPERATIONS: "Operations",
  CUSTOMER_SUCCESS: "Customer Success",
};
