import axios from "axios";
import { showToast } from "../utils/toastHandler";
import { startLoader, stopLoader } from "../utils/topLoader";
import {
  getRequestKey,
  addPendingRequest,
  getPendingRequest,
  removePendingRequest,
} from "../utils/requestCache";

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
  
  const key = getRequestKey(config);
  const existingRequest = getPendingRequest(key);
  
  if (existingRequest) {
    return existingRequest;
  }
  
  const request = Promise.resolve(config);
  addPendingRequest(key, request);
  
  return config;
});

publicApi.interceptors.response.use(
  (res) => {
    stopLoader();
    const key = getRequestKey(res.config);
    removePendingRequest(key);
    return res;
  },
  (error) => {
    stopLoader();
    const key = getRequestKey(error.config || {});
    removePendingRequest(key);

    // Skip toast for cancelled requests
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    const message = getErrorMessage(error);
    showToast(message, "error");

    return Promise.reject(error);
  }
);

export default publicApi;
