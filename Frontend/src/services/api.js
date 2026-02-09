import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const api = axios.create({
    baseURL : API_BASE_URL,
});

api.interceptors.request.use((config => {
    const AccessToken = localStorage.getItem("access_token");
    if (AccessToken) {
        config.headers.Authorization = `Bearer ${AccessToken}`;   
    }
    return config;
}))

export default api;