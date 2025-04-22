"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { getCurrentUser } from "@/store/slices/authSlice";

export default function AuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("eduToken");
      if (token) {
        try {
          await dispatch(getCurrentUser()).unwrap();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          console.log("fk++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
          // localStorage.removeItem("eduToken");
        }
      }
    };

    initializeAuth();
  }, [dispatch]);

  return null;
}
