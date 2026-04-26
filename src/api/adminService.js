import { adminApi } from "./axios";

export const adminAuthApi = {
  login: (credentials) => adminApi.post("/api/admin/login", credentials),
  register: (data) => adminApi.post("/api/admin/register", data),
};

export const adminDashboardApi = {
  getStats: () => adminApi.get("/api/admin/dashboard"),
};

export const adminUsersApi = {
  getAll: (params) => adminApi.get("/api/admin/users", params),
  getUserDetails: (id) => adminApi.get(`/api/admin/users/${id}`),
  getUserPets: (id) => adminApi.get(`/api/admin/users/${id}/pets`),
  verifyUser: (id, data) => adminApi.put(`/api/admin/users/${id}/verify`, data),
  deleteUser: (id) => adminApi.delete(`/api/admin/users/${id}`),
};

export const adminPetsApi = {
  getAll: (params) => adminApi.get("/api/admin/pets", params),
  getPetDetails: (id) => adminApi.get(`/api/admin/pets/${id}`),
  approvePet: (id) => adminApi.put(`/api/admin/pets/${id}/approve`),
  rejectPet: (id, reason) => adminApi.put(`/api/admin/pets/${id}/reject`, { reason }),
  deletePet: (id) => adminApi.delete(`/api/admin/pets/${id}`),
};