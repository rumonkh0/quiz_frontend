import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ReduxProvider } from "@/lib/providers/redux-provider";
import { Toaster } from "sonner";
import "./globals.css";
import AuthInitializer from "@/components/auth/auth-initializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduPlatform - Learning Management System",
  description: "Interactive learning platform for students, teachers, and administrators",
  // themeColor: "#ffffff",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ReduxProvider>
          <AuthInitializer />
          {children}
          <Toaster position="top-center" richColors />
        </ReduxProvider>
      </body>
    </html>
  );
}