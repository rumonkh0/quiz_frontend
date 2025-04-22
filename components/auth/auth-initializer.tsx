"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { getCurrentUser, setToken } from "@/store/slices/authSlice";

export default function AuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("eduToken");
      if (token) {
        dispatch(setToken(token));
        try {
          await dispatch(getCurrentUser()).unwrap();
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          localStorage.removeItem("eduToken");
        }
      }
    };

    initializeAuth();
  }, [dispatch]);

  return null;
}
