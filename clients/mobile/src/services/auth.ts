/**
 * Authentication Service
 *
 * Handles authentication operations with the backend REST API.
 * Uses cookie-based authentication.
 */

import { endpoints, defaultFetchOptions } from '@/config/api';
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  User,
  AuthError,
} from '@/types/auth';

/**
 * Login user with email and password
 * @param email User email
 * @param password User password
 * @returns LoginResponse with user data
 * @throws Error if login fails
 */
export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  try {
    console.log('Endpoint:', endpoints.auth.login);
    const response = await fetch(endpoints.auth.login, {
      ...defaultFetchOptions,
      method: 'POST',
      body: JSON.stringify({ email, password } as LoginRequest),
    });

    if (!response.ok) {
      const error: AuthError = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data: LoginResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred during login');
  }
}

/**
 * Sign up a new user
 * @param data Signup request data
 * @returns SignupResponse with user data
 * @throws Error if signup fails
 */
export async function signup(data: SignupRequest): Promise<SignupResponse> {
  try {
    const response = await fetch(endpoints.auth.signup, {
      ...defaultFetchOptions,
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error: AuthError = await response.json();
      throw new Error(error.message || 'Signup failed');
    }

    const responseData: SignupResponse = await response.json();
    return responseData;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred during signup');
  }
}

/**
 * Logout the current user
 * @throws Error if logout fails
 */
export async function logout(): Promise<void> {
  try {
    const response = await fetch(endpoints.auth.logout, {
      ...defaultFetchOptions,
      method: 'POST',
    });

    if (!response.ok) {
      const error: AuthError = await response.json();
      throw new Error(error.message || 'Logout failed');
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred during logout');
  }
}

/**
 * Get current user from the backend
 * This should use GraphQL in practice, but for now we'll return null
 * and implement it when we set up Apollo Client
 * @returns User or null if not authenticated
 */
export async function getCurrentUser(): Promise<User | null> {
  // TODO: Implement with GraphQL currentUser query
  // For now, return null - we'll implement this when setting up Apollo
  return null;
}
