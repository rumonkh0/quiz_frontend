"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  GraduationCap,
  Home,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import AuthGuard from "@/components/auth/auth-guard";
import { Loader2 } from "lucide-react";

export function TeacherDashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, loading: authLoading } = useAppSelector((state) => state.auth);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await dispatch(logout());
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <AuthGuard requiredRoles={["teacher"]}>
      <div className="flex min-h-screen flex-col bg-slate-50">
        <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-white px-4 md:px-6">
          <Link
            href="/teacher/dashboard"
            className="flex items-center gap-2 font-semibold"
          >
            <GraduationCap className="h-6 w-6" />
            <span>EduPlatform</span>
            <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-600">
              Teacher
            </span>
          </Link>
          <nav className="ml-auto flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/teacher/profile">
                <User className="h-5 w-5" />
                <span className="sr-only">Profile</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/teacher/settings">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <LogOut className="h-5 w-5" />
              )}
              <span className="sr-only">Logout</span>
            </Button>
          </nav>
        </header>
        <div className="flex flex-1">
          <aside className="hidden w-64 border-r bg-white md:block">
            <nav className="flex flex-col gap-2 p-4">
              <Button
                variant={
                  pathname === "/teacher/dashboard" ? "default" : "ghost"
                }
                className="justify-start"
                asChild
              >
                <Link href="/teacher/dashboard">
                  <Home className="mr-2 h-5 w-5" />
                  Dashboard
                </Link>
              </Button>
              <Button
                variant={
                  pathname.includes("/teacher/classes") ? "default" : "ghost"
                }
                className="justify-start"
                asChild
              >
                <Link href="/teacher/classes">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Classes
                </Link>
              </Button>
              <Button
                variant={
                  pathname.includes("/teacher/analytics") ? "default" : "ghost"
                }
                className="justify-start"
                asChild
              >
                <Link href="/teacher/analytics">
                  <LayoutDashboard className="mr-2 h-5 w-5" />
                  Analytics
                </Link>
              </Button>
            </nav>
          </aside>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
