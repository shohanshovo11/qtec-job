"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "./_components/AdminSidebar";
import { useAuthStore } from "@/store/authStore";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, user, _hasHydrated } = useAuthStore();

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!isAuthenticated || user?.role !== "admin") {
      router.replace("/");
    }
  }, [_hasHydrated, isAuthenticated, user, router]);

  // Show nothing while hydrating or if not admin
  if (!_hasHydrated || !isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-muted/30">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top padding on mobile for fixed header */}
        <div className="lg:hidden h-14 shrink-0" />
        <main className="flex-1 p-5 lg:p-8 max-w-350 w-full">{children}</main>
      </div>
    </div>
  );
}
