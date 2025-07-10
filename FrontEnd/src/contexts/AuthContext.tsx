import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole } from "../types/user";
import { mockUsers } from "../utils/mockData";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Sử dụng tài khoản admin mặc định để xem tất cả giao diện
  const adminUser = mockUsers.find((u) => u.role === "admin");
  const [user, setUser] = useState<User | null>(adminUser || null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Không cần kiểm tra localStorage vì đã đặt mặc định là admin
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Find user in mock data
      const foundUser = mockUsers.find((u) => u.email === email);
      if (foundUser && password === "password") {
        // Simple password check for mock data
        setUser(foundUser);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(foundUser));
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Check if user already exists
      const existingUser = mockUsers.find((u) => u.email === email);
      if (existingUser) {
        throw new Error("User with this email already exists");
      }
      // Create new user (in a real app, this would be done on the server)
      const newUser: User = {
        id: String(mockUsers.length + 1),
        email,
        firstName,
        lastName,
        role: "member" as UserRole,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      // In a real app, we would save the user to the database here
      // For now, we'll just set the user as logged in
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(newUser));
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
