import React, { createContext, useContext, useEffect, useState } from "react";
import { getUserById, login as loginApi, logout as logoutApi } from "../auth/api/authApi" // Adjust path
import { useNavigate } from "react-router-dom";
import { AuthContextType, LoginResponse, User } from "./types";

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response: LoginResponse = await loginApi({ email, password });

      const user: User = {
        id: response.userDetails.id,
        email: response.userDetails.email,
        name: response.userDetails.name,
        roleName: response.userDetails.roleName,
      };

      if (user) {
        localStorage.setItem("User ID", user.id.toString());
        localStorage.setItem("Access Token", response.accessToken);
        localStorage.setItem("Refresh Token", response.refreshToken);

        setUser(user);

        // Role-based redirection
        if (!user.roleName) {
          navigate("/access-pending");
        } else if (user.roleName === "Admin") {
          navigate("/dashboard/assign-roles");
        } else if (user.roleName === "Doctor") {
          navigate("/dashboard/patients");
        } else {
          navigate("/access-pending");
        }
      } else {
        throw new Error("No user info in response.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setUser(null);
      throw error; // rethrow to handle in component
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const storedUserId = localStorage.getItem("User ID");

      if (!storedUserId) {
        setLoading(false);
        return;
      }

      try {
        const userDetails = await getUserById(storedUserId);

        if (userDetails) {
          setUser(userDetails);
        } else {
          throw new Error("User data not found");
        }
      } catch (error) {
        console.error("Error fetching user details", error);
        localStorage.removeItem("User ID");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = () => {
    logoutApi();
    localStorage.clear();
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
