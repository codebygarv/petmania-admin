import axios from "axios";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5050").replace(/\/$/, "");

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes("/login");
    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const adminApi = {
  get: (url, params) => api.get(url, { params }).then((res) => res.data),
  post: (url, data) => api.post(url, data).then((res) => res.data),
  put: (url, data) => api.put(url, data).then((res) => res.data),
  delete: (url) => api.delete(url).then((res) => res.data),
};

export default api;