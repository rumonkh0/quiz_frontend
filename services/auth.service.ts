import api from "@/lib/api/axios";
import { RegisterPayload } from "@/types/auth.type";

// services/auth.service.ts
export const registerUser = async (userData: RegisterPayload) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  };