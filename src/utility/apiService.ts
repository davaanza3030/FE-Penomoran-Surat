import axios from "axios";
import handleError from "./errorHandler"; // Import error handler
import router from "@/router";
import { useAuthStore } from "@/stores/auth";
import Cookies from "js-cookie";

const getToken = () => {
  return Cookies.get("token");
};

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const authStore = useAuthStore();
    if (error.response && error.response.status === 401) {
      authStore.clearToken();
      router.push({ name: "Login" });
    }
    handleError(error);
    return Promise.reject(error);
  }
);

const apiService = {
  apiGet: async (uri: string, params: any = {}): Promise<any> => {
    try {
      const res = await API.get(uri, { params });
      return res;
    } catch (error) {
      handleError(error); // Menggunakan errorHandler untuk menangani error
      throw error; // Tetap throw error agar dapat di-handle di tempat lain jika perlu
    }
  },

  apiPost: async (uri: string, body: any, options: any = {}): Promise<any> => {
    try {
      const res = await API.post(uri, body, options);
      return res;
    } catch (error) {
      handleError(error); // Menggunakan errorHandler untuk menangani error
      throw error;
    }
  },

  apiPut: async (uri: string, body: any): Promise<any> => {
    try {
      const res = await API.put(uri, body);
      return res;
    } catch (error) {
      handleError(error); // Menggunakan errorHandler untuk menangani error
      throw error;
    }
  },

  apiDelete: async (uri: string, data: any): Promise<any> => {
    try {
      const res = await API.delete(uri, { data });
      return res;
    } catch (error) {
      handleError(error); // Menggunakan errorHandler untuk menangani error
      throw error;
    }
  },
};

export { apiService };
