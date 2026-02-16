import axios from "axios";
import { showToast } from "../utils/toastHandler";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(token) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

function addSubscriber(cb) {
  refreshSubscribers.push(cb);
}

// Helper to get user-friendly error message
function getErrorMessage(error) {
  // Network error (backend down, no internet)
  if (error.code === "ERR_NETWORK" || !error.response) {
    return "Server unreachable. Please try again.";
  }

  const status = error.response?.status;
  const serverMessage = error.response?.data?.detail || 
                        error.response?.data?.message || 
                        error.response?.data?.error;

  // 5xx server errors
  if (status >= 500) {
    return "Something went wrong on the server.";
  }

  // 403 forbidden
  if (status === 403) {
    return "You don't have permission to perform this action.";
  }

  // Use server message if available, otherwise generic
  if (serverMessage) {
    return serverMessage;
  }

  return "An unexpected error occurred.";
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Skip toast for cancelled requests
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    // Handle 401 with token refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/token/refresh/")
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          addSubscriber((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        const res = await axios.post(
          "http://127.0.0.1:8000/api/token/refresh/",
          { refresh: refreshToken }
        );

        const newAccess = res.data.access;

        localStorage.setItem("accessToken", newAccess);

        onRefreshed(newAccess);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        return api(originalRequest);
      } catch (err) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Show toast for all other errors (not 401 being refreshed)
    // Skip if this is a retry request that already failed
    if (!originalRequest._retry) {
      const message = getErrorMessage(error);
      showToast(message, "error");
    }

    return Promise.reject(error);
  }
);

export default api;
