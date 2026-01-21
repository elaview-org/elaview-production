import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import * as SecureStore from "expo-secure-store";

export type UserRole = "advertiser" | "owner" | null;

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => Promise<void>;
  isLoading: boolean;
  clearRole: () => Promise<void>;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const ROLE_STORAGE_KEY = "user_role";

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved role on mount
  useEffect(() => {
    const loadRole = async () => {
      try {
        const savedRole = await SecureStore.getItemAsync(ROLE_STORAGE_KEY);
        if (savedRole === "advertiser" || savedRole === "owner") {
          setRoleState(savedRole);
        }
      } catch (error) {
        console.error("Failed to load role:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadRole();
  }, []);

  const setRole = async (newRole: UserRole) => {
    try {
      if (newRole) {
        await SecureStore.setItemAsync(ROLE_STORAGE_KEY, newRole);
      } else {
        await SecureStore.deleteItemAsync(ROLE_STORAGE_KEY);
      }
      setRoleState(newRole);
    } catch (error) {
      console.error("Failed to save role:", error);
      throw error;
    }
  };

  const clearRole = async () => {
    await setRole(null);
  };

  return (
    <RoleContext.Provider value={{ role, setRole, isLoading, clearRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
