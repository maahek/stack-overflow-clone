import axios from "axios";
import { toast } from "react-toastify";


const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// prevents multiple redirects
let isRedirecting = false;

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && !isRedirecting) {
      isRedirecting = true;

      localStorage.removeItem("token");
      toast.error("Session expired. Please login again.");

      // small delay so toast shows before redirect
      setTimeout(() => {
        window.location.href = "/auth";
      }, 1500);
    }

    return Promise.reject(err);
  }
);

export default axiosInstance;