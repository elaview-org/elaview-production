/**
 * Authentication Types
 *
 * Types for authentication flow, matching the backend .NET API
 */

/**
 * User roles in the system
 * Note: These are permission levels, separate from profile types
 */
export type UserRole = "Admin" | "Advertiser" | "User";

/**
 * User account status
 */
export type UserStatus = "Active" | "Inactive" | "Suspended";

/**
 * User entity from the backend
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  // Optional profile information
  advertiserProfile?: {
    id: string;
    companyName: string;
  };
  spaceOwnerProfile?: {
    id: string;
    businessName: string;
  };
}

/**
 * Login request payload
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Login response from backend
 */
export interface LoginResponse {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  message: string;
}

/**
 * Signup request payload
 */
export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

/**
 * Signup response from backend
 */
export interface SignupResponse {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  message: string;
}

/**
 * Auth error response
 */
export interface AuthError {
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Auth state for context
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
