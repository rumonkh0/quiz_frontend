import axios from "axios";
import type { AppStore } from "@/store/store";

let store: AppStore;

export const injectStore = (_store: AppStore) => {
  store = _store;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token; // <-- always fresh
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
