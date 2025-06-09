import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "@/types/mission";
import { storeUser, getUser } from "@/lib/storage";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for agency demo
const mockUsers: Record<string, { password: string; user: User }> = {
  admin: {
    password: "admin123",
    user: {
      id: "1",
      username: "admin",
      role: "admin",
      lastLogin: new Date().toISOString(),
      department: "Command",
      fullName: "Amaan Husain",
    },
  },
  operator: {
    password: "operator123",
    user: {
      id: "2",
      username: "operator",
      role: "operator",
      lastLogin: new Date().toISOString(),
      department: "Operations",
      fullName: "Agent john wick",
    },
  },
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    const storedUser = getUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    console.log("AuthContext login called with:", { username, password });
    setLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockUser = mockUsers[username];
    console.log("Found mock user:", mockUser);

    if (mockUser && mockUser.password === password) {
      const userWithUpdatedLogin = {
        ...mockUser.user,
        lastLogin: new Date().toISOString(),
      };
      console.log("Login successful, setting user:", userWithUpdatedLogin);
      setUser(userWithUpdatedLogin);
      storeUser(userWithUpdatedLogin);
      setLoading(false);
      return true;
    }

    console.log("Login failed - invalid credentials");
    setLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    storeUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
