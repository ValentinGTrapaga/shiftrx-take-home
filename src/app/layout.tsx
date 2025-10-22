import { TRPCProvider } from "@/server/trpc/react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/providers/auth/provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShiftRX",
  description: "ShiftRx Take Home",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <TRPCProvider>
          <AuthProvider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarTrigger className="fixed bottom-4 left-4 z-10 border border-gray-200 rounded-full p-4 bg-white" />
              {children}
              <Toaster />
            </SidebarProvider>
          </AuthProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}
