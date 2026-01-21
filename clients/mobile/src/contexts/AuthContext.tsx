/**
 * Authentication Context
 *
 * Manages authentication state and provides auth functions throughout the app.
 * Integrates with the backend REST API for login/signup/logout.
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import * as SecureStore from "expo-secure-store";
import * as authService from "@/services/auth";
import type { User, LoginRequest, SignupRequest } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = "user_data";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved user data on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = await SecureStore.getItemAsync(USER_STORAGE_KEY);
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Failed to load user:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  /**
   * Login with email and password
   */
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authService.login(email, password);

      // Create user object from login response
      const userData: User = {
        id: response.id,
        email: response.email,
        name: response.name,
        role: response.role,
        status: "Active", // Default status
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save user data to secure storage
      await SecureStore.setItemAsync(
        USER_STORAGE_KEY,
        JSON.stringify(userData)
      );
      setUser(userData);

      // After successful login, we could fetch the full user profile
      // using GraphQL currentUser query, but for now we'll use the login response
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sign up a new user
   */
  const signup = async (data: SignupRequest) => {
    try {
      setIsLoading(true);
      const response = await authService.signup(data);

      // Create user object from signup response
      const userData: User = {
        id: response.id,
        email: response.email,
        name: response.name,
        role: response.role,
        status: "Active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save user data to secure storage
      await SecureStore.setItemAsync(
        USER_STORAGE_KEY,
        JSON.stringify(userData)
      );
      setUser(userData);
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout the current user
   */
  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      await SecureStore.deleteItemAsync(USER_STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, clear local state
      await SecureStore.deleteItemAsync(USER_STORAGE_KEY);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Refresh user data from the backend
   * This will be implemented when we set up GraphQL
   */
  const refreshUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        await SecureStore.setItemAsync(
          USER_STORAGE_KEY,
          JSON.stringify(currentUser)
        );
        setUser(currentUser);
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
