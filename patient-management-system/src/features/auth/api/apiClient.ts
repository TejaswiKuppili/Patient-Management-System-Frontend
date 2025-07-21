import axios from "axios";
import { refreshToken } from "./authApi";

/*
  This file sets up an Axios client with interceptors for handling authentication tokens
  and refreshing tokens when they expire. It also processes a queue of failed requests
  that need to be retried after a token refresh.
*/

const apiClient = axios.create({
  baseURL: "https://localhost:7104",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: any[] = [];

// Interceptor to add the access token to the request headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("Access Token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Function to process the queue of failed requests and prevent duplicate refresh calls
// const processQueue = (error: any, token: string | null = null) => {
//   failedQueue.forEach((prom) => {
//     if (token) {
//       prom.resolve(token);
//     } else {
//       prom.reject(error);
//     }
//   });
//   failedQueue = [];
// };

// Interceptor to handle 401 errors and refresh tokens

// apiClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // Pass through errors for login or refresh endpoints (don't retry)
//     const isAuthEndpoint =
//       originalRequest.url.includes("/auth/login") ||
//       originalRequest.url.includes("/auth/refresh");

//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry &&
//       !isAuthEndpoint
//     ) {
//       originalRequest._retry = true;
//       console.log("Token expired, attempting to refresh...");

//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         }).then((token) => {
//           originalRequest.headers.Authorization = `Bearer ${token}`;
//           return apiClient(originalRequest);
//         });
//       }

// isRefreshing = true;

// try {
//   const { accessToken: newAccessToken } = await refreshToken();
//   localStorage.setItem("New Access Token", newAccessToken);
//   processQueue(null, newAccessToken);
//   originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//   return apiClient(originalRequest);
// } catch (err) {
//   processQueue(err, null);
//   localStorage.removeItem("accessToken");
//   window.location.href = "/login";
//   return Promise.reject(err);
// } finally {
//   isRefreshing = false;
// }
// }

// The caller handles the error. Displays the error message from backend)
// return Promise.reject(error);
// }
// );

export default apiClient;
