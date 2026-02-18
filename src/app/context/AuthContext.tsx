"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import axios from "../../utils/api";
import type { User } from "../../types/user";
import { useAppDispatch } from "../../hooks/useAdminRedux";
import { setAdminUser, logout as adminLogout } from "../../redux/slices/adminSlice";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  register: (data: any) => Promise<void>;
  login: (email: string, password: string) => Promise<User>;
  adminLogin: (email: string, password: string) => Promise<User>;
  logout: () => void;
  isProfileComplete: boolean;
  isActive: boolean;
  isBlocked: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadUser = () => {
      try {
        const storedToken = localStorage.getItem("token") || localStorage.getItem("adminToken");
        const storedUser = localStorage.getItem("user");
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          if (localStorage.getItem("adminToken")) {
            dispatch(setAdminUser(JSON.parse(storedUser)));
          }
        }
      } catch (error) {
        console.error("Error loading user from storage:", error);
        localStorage.clear(); // Clear corrupted data
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, [dispatch]);

  const register = async (data: any) => {
    try {
      const res = await axios.post("/auth/register", data);
      if (!res.data.user || !res.data.token) {
        throw new Error("Invalid response from server");
      }
      
      const userData: User = {
        _id: res.data.user._id,
        firstName: res.data.user.firstName,
        lastName: res.data.user.lastName,
        email: res.data.user.email,
        role: res.data.user.role || "user",
          token: res.data.token, 

      };
      
      setUser(userData);
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error: any) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const res = await axios.post("/auth/login", { email, password });
      if (!res.data.user || !res.data.token) {
        throw new Error("Invalid response from server");
      }
      
      const loggedInUser: User = {
  _id: res.data.user._id,
  firstName: res.data.user.firstName,
  lastName: res.data.user.lastName,
  email: res.data.user.email,
  role: res.data.user.role || "user",
  token: res.data.token, // <-- Add this
};

      
      setUser(loggedInUser);
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      return loggedInUser;
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const adminLogin = async (email: string, password: string): Promise<User> => {
    try {
      const res = await axios.post("/admin/login", { email, password });
      if (!res.data.token) {
        throw new Error("No token received from admin login");
      }
      
      // Backend returns: { success: true, token } NOT { user, token }
      const adminUser: User = {
        _id: "admin-id",
        firstName: "Admin",
        lastName: "User",
        email: email, // Use email from request since backend doesn't return user object
        role: "admin",
          token: res.data.token, 

      };
      
      setUser(adminUser);
      setToken(res.data.token);
      dispatch(setAdminUser(adminUser));
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("user", JSON.stringify(adminUser));
      return adminUser;
    } catch (error: any) {
      console.error("Admin login error:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("user");
    dispatch(adminLogout());
    
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token,
      loading,
      register, 
      login, 
      adminLogin, 
      logout,
       isProfileComplete: !!user?.firstName && !!user?.lastName && !!user?.email,
    isActive: user?.role !== "user",
    isBlocked: false,
    }}>
      {children}
    </AuthContext.Provider>
  );
};