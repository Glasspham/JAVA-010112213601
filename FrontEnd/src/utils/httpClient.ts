import axios from "axios";

// Base URL với debug info
const BASE_URL = process.env.REACT_APP_API_URL;

// Tạo axios instance
const httpClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Tự động thêm token vào header
httpClient.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage
    const token = localStorage.getItem("TOKEN");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Xử lý lỗi 401 (Unauthorized)
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem("TOKEN");
      localStorage.removeItem("USERNAME");
      localStorage.removeItem("USER_ROLE");

      // Redirect về login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default httpClient;
