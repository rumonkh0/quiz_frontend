"use client";

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  GraduationCap,
  Home,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import AuthGuard from "@/components/auth/auth-guard";
import { Loader2 } from "lucide-react";

export function StudentDashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, loading: authLoading } = useAppSelector((state) => state.auth);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // This ensures we only render dynamic content after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await dispatch(logout());
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Initial loading state - consistent between server and client
  if (!isClient) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Client-side only rendering of auth states
  if (isClient && (authLoading || (!user && !authLoading))) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <AuthGuard requiredRoles={["student"]}>
      <div className="flex min-h-screen flex-col bg-slate-50">
        <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-white px-4 md:px-6">
          <Link
            href="/student"
            className="flex items-center gap-2 font-semibold"
            suppressHydrationWarning
          >
            <GraduationCap className="h-6 w-6" />
            <span>QuizMaster</span>
            <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-600">
              Student
            </span>
          </Link>
          <nav className="ml-auto flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/student/profile">
                <User className="h-5 w-5" />
                <span className="sr-only">Profile</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/student/settings">
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
                  pathname === "/student" ? "default" : "ghost"
                }
                suppressHydrationWarning
                className="justify-start"
                asChild
              >
                <Link href="/student">
                  <Home className="mr-2 h-5 w-5" />
                  Dashboard
                </Link>
              </Button>
              <Button
                variant={
                  pathname.includes("/student/classroom") ? "default" : "ghost"
                }
                suppressHydrationWarning
                className="justify-start"
                asChild
              >
                <Link href="/student">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Classes
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
