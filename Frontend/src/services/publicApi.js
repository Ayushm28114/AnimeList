import axios from "axios";
import { showToast } from "../utils/toastHandler";
import { startLoader, stopLoader } from "../utils/topLoader";

const publicApi = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

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

publicApi.interceptors.request.use((config) => {
  startLoader();
  return config;
});

publicApi.interceptors.response.use(
  (res) => {
    stopLoader();
    return res;
  },
  (error) => {
    stopLoader();

    // Skip toast for cancelled requests
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    // Skip toast for 404 errors (handled by UI as "Not Found")
    if (error.response?.status === 404) {
      return Promise.reject(error);
    }

    // Skip toast for 429 rate limit errors (handled by retry logic)
    if (error.response?.status === 429) {
      return Promise.reject(error);
    }

    const message = getErrorMessage(error);
    showToast(message, "error");

    return Promise.reject(error);
  }
);

export default publicApi;
