import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import * as SecureStore from "expo-secure-store";
import api from "@/api";
import { Mutation, ProfileType, Query } from "@/types/graphql";
import * as authService from "@/services/auth";

interface SessionUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  activeProfileType: ProfileType | null;
}

interface SessionContextType {
  user: SessionUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  profileType: ProfileType | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: {
    email: string;
    password: string;
    name: string;
  }) => Promise<void>;
  switchProfile: (targetType: ProfileType) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

const AUTH_FLAG_KEY = "is_authenticated";

export function SessionProvider({ children }: { children: ReactNode }) {
  const client = api.client();
  const [authFlag, setAuthFlag] = useState<boolean | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync(AUTH_FLAG_KEY).then((flag) => {
      setAuthFlag(flag === "true");
    });
  }, []);

  const { data, loading, refetch } = api.query<Pick<Query, "me">>(
    api.gql`
      query {
        me {
          id
          email
          name
          avatar
          activeProfileType
        }
      }
    `,
    {
      skip: authFlag === null || !authFlag,
      fetchPolicy: "network-only",
      errorPolicy: "all",
    }
  );

  const [switchProfileMutation] = api.mutation<
    Pick<Mutation, "updateCurrentUser">
  >(
    api.gql`
      mutation SwitchProfile($input: UpdateCurrentUserInput!) {
        updateCurrentUser(input: $input) {
          user {
            id
            activeProfileType
          }
          errors {
            ... on NotFoundError {
              message
            }
          }
        }
      }
    `
  );

  const user: SessionUser | null = data?.me
    ? {
        id: String(data.me.id),
        email: data.me.email,
        name: data.me.name,
        avatar: data.me.avatar ?? undefined,
        activeProfileType: data.me.activeProfileType ?? null,
      }
    : null;

  const isLoading = authFlag === null || (authFlag && loading) || isLoggingIn;
  const isAuthenticated = !!user;
  const profileType = user?.activeProfileType ?? null;

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoggingIn(true);
      try {
        await authService.login(email, password);
        await SecureStore.setItemAsync(AUTH_FLAG_KEY, "true");
        setAuthFlag(true);
        await refetch();
      } finally {
        setIsLoggingIn(false);
      }
    },
    [refetch]
  );

  const signup = useCallback(
    async (signupData: { email: string; password: string; name: string }) => {
      setIsLoggingIn(true);
      try {
        await authService.signup(signupData);
        await SecureStore.setItemAsync(AUTH_FLAG_KEY, "true");
        setAuthFlag(true);
        await refetch();
      } finally {
        setIsLoggingIn(false);
      }
    },
    [refetch]
  );

  const switchProfile = useCallback(
    async (targetType: ProfileType) => {
      const { data: result } = await switchProfileMutation({
        variables: { input: { input: { activeProfileType: targetType } } },
      });

      if (result?.updateCurrentUser?.errors?.length) {
        throw new Error(result.updateCurrentUser.errors[0].message);
      }

      await refetch();
    },
    [switchProfileMutation, refetch]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Continue with local cleanup even if backend call fails
    }
    await SecureStore.deleteItemAsync(AUTH_FLAG_KEY);
    await client.clearStore();
    setAuthFlag(false);
  }, [client]);

  const refetchUser = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <SessionContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        profileType,
        login,
        signup,
        switchProfile,
        logout,
        refetchUser,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}