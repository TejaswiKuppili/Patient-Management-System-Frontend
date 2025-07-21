import apiClient from "./apiClient";
import { RegisterRequest, LoginRequest, LoginResponse } from "../types";

// API call to register a new user
export const register = async (
  data: RegisterRequest
): Promise<LoginResponse> => {
  const response = await apiClient.post("/api/users/create", data);
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
