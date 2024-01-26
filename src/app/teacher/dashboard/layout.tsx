"use client";
import { useEffect, useState } from "react";
import Header from "@/app/teacher/dashboard/header";
import Sidebar from "@/app/teacher/dashboard/sidebar";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isTeacher, setIsTeacher] = useState(false);

  useEffect(() => {
    const teacherId = Cookies.get("teacherId");
    setIsTeacher(teacherId !== undefined && teacherId !== null);
  }, []);

  useEffect(() => {
    const teacherId = Cookies.get("teacherId");

    if (!teacherId) {
      router.push("/");
    }
  }, []);

  return isTeacher ? (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="w-full pt-16">{children}</main>
      </div>
    </>
  ) : null;
}
