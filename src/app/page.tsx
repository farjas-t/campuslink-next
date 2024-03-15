"use client";
import Cookies from "js-cookie";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check for cookies
    const adminId = Cookies.get("adminId");
    const teacherId = Cookies.get("teacherId");
    const studentId = Cookies.get("studentId");

    // Redirect based on cookie presence
    if (adminId) {
      router.push("/admin/dashboard/");
    } else if (teacherId) {
      router.push("/teacher/dashboard/");
    } else if (studentId) {
      router.push("/student/dashboard/");
    }
  }, []);

  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 hidden top-4 md:right-8 md:top-8"
        )}
      >
        Login
      </Link>
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0">
          <div className="absolute z-10 inset-0 bg-primary opacity-80" />
          <div
            className="absolute z-0 inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url(/bg.jpg)" }}
          />
        </div>
        <div className="relative z-20 flex items-center text-3xl font-medium">
          <Image src="/logo.png" alt="Light Icon" width={48} height={48} />
          &nbsp; Campuslink
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Empowering Educators, Engaging Students&rdquo;
            </p>
            <footer className="text-sm">
              Muhammed Abdurahiman Memorial Orphanege College, Mukkam
            </footer>
          </blockquote>
        </div>
      </div>
      <div className="p-4 lg:p-8 h-full flex items-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Choose Your Role
            </h1>
            <p className="text-sm text-muted-foreground">
              Choose the below options to navigate to respective login pages
            </p>
          </div>
          <Link href="/student">
            <Button className="ml-auto w-full">Login as Student</Button>
          </Link>
          <Link href="/teacher">
            <Button variant="outline" className="ml-auto w-full">
              Login as Teacher
            </Button>
          </Link>
          <p className="px-8 text-center text-sm text-muted-foreground">
            <Link
              href="/admin"
              className="underline underline-offset-4 hover:text-primary"
            >
              Login as Admin
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
