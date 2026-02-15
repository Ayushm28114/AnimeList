import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api";

export async function refreshAccessToken() {
  const refresh = localStorage.getItem("refreshToken");
  if (!refresh) throw new Error("No refresh token");

  const res = await axios.post(`${BASE_URL}/token/refresh/`, {
    refresh: refresh,
  });

  const newAccess = res.data.access;
  localStorage.setItem("accessToken", newAccess);
  return newAccess;
}
