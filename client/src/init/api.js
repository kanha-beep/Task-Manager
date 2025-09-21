import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "http://localhost:3000/api", // replace with your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add token automatically if you store it in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
