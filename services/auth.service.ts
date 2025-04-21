import api from "@/lib/api/axios";

// services/auth.service.ts
export const registerUser = async (userData: RegisterPayload) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  };