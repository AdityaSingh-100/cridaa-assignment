import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (userData) => api.post("/auth/login", userData),
  getCurrentUser: () => api.get("/auth/me"),
  updateProfile: (userData) => api.put("/auth/update", userData),
};

// Slots API
export const slotsAPI = {
  getSlots: (params) => api.get("/slots", { params }),
  getSlot: (id) => api.get(`/slots/${id}`),
  bookSlot: (id) => api.post(`/slots/book/${id}`),
  cancelBooking: (id) => api.delete(`/slots/cancel/${id}`),
  getMyBookings: () => api.get("/slots/user/my-bookings"),
};

export default api;
