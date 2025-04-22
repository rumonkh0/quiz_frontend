"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: ("student" | "teacher" | "admin")[];
}

const AuthGuard = ({ children, requiredRoles }: AuthGuardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Check authentication status
    if (loading) return;
    if (!token) {
      // router.push(`/login`);
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // Check authorization roles
    if (requiredRoles && user?.role && !requiredRoles.includes(user.role)) {
      router.push("/unauthorized");
    }
  }, [token, user, router, pathname, requiredRoles, loading]);

  // Optional: Show loading state
  if (!user || (requiredRoles && !requiredRoles.includes(user.role))) {
    return <div>Loading authentication status...</div>;
  }

  return <>{children}</>;
};

export default AuthGuard;
