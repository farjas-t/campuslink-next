"use client";
import { useEffect, useState } from "react";
import Header from "@/app/student/dashboard/header";
import Sidebar from "@/app/student/dashboard/sidebar";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isStudent, setIsStudent] = useState(false);

  useEffect(() => {
    const studentId = Cookies.get("studentId");
    setIsStudent(studentId !== undefined && studentId !== null);
  }, []);

  useEffect(() => {
    const studentId = Cookies.get("studentId");

    if (!studentId) {
      router.push("/");
    }
  }, []);

  return isStudent ? (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="w-full pt-16">{children}</main>
      </div>
    </>
  ) : null;
}
