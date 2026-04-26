import { adminApi } from "./axios";

export const adminAuthApi = {
  login: (credentials) => adminApi.post("/admin/login", credentials),
  register: (data) => adminApi.post("/admin/register", data),
  logout: () => adminApi.post("/admin/logout"),
  getProfile: () => adminApi.get("/admin/profile"),
};