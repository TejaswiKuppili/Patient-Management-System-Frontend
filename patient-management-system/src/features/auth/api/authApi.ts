import apiClient from "./apiClient";
import { RegisterRequest, LoginRequest, LoginResponse, User } from "../types";

// API call to register a new user
export const register = async (
  data: RegisterRequest
): Promise<LoginResponse> => {
  const payload = {
    Name: data.name,
    Email: data.email,
    Password: data.password,
    RoleName: data.roleName,
  };

  console.log("payload", payload);
  const response = await apiClient.post("/api/users/create", payload);
  console.log("register", response);
  return response.data;
};

// API call to log in a user
export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const response = await apiClient.post("/api/auth/login", credentials);
  const { accessToken, refreshToken, userDetails } = response.data.data;
  // Store access token and refresh token
  localStorage.setItem("Access Token", accessToken);
  localStorage.setItem("Refresh Token", refreshToken);
  localStorage.setItem("User ID", userDetails.id);
  localStorage.setItem("Role", userDetails.roleName);

  return { accessToken, refreshToken, userDetails };
};

// API call to get user details by ID
export const getUserById = async (userId: string): Promise<User> => {
  const response = await apiClient.get(`/api/users/${userId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!response) throw new Error("Failed to fetch user");
  return await response.data.data;
};

// API call to refresh the access token using the refresh token
export const refreshToken = async (): Promise<{ accessToken: string }> => {
  const storedRefreshToken = localStorage.getItem("refreshToken");
  if (!storedRefreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await apiClient.post("/api/auth/refresh", {
    refreshToken: storedRefreshToken,
  });

  const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
    response.data.data;

  localStorage.setItem("New AccessToken", newAccessToken);
  localStorage.setItem("New RefreshToken", newRefreshToken);

  return { accessToken: newAccessToken };
};

// Function to log out the user by removing tokens from local storage
export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};
