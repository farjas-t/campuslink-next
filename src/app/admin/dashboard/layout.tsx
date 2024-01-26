"use client";
import { useEffect, useState } from "react";
import Header from "@/app/admin/dashboard/header";
import Sidebar from "@/app/admin/dashboard/sidebar";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const adminId = Cookies.get("adminId");
    setIsAdmin(adminId !== undefined && adminId !== null);
  }, []);

  useEffect(() => {
    const adminId = Cookies.get("adminId");

    if (!adminId) {
      router.push("/");
    }
  }, []);

  return isAdmin ? (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="w-full pt-16">{children}</main>
      </div>
    </>
  ) : null;
}
