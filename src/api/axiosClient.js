// src/api/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api/v1', // Sửa lại theo port Backend của bạn
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để nhét Token vào (nếu Admin đã đăng nhập)
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token'); // Hoặc lấy từ Zustand
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;