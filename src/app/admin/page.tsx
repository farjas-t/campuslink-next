"use client";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import Image from "next/image";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(4, {
    message: "Password must be at least 4 characters.",
  }),
});

export default function AdminLogin() {
  const { toast } = useToast();
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login/admin`,
        {
          method: "POST",
          body: JSON.stringify(values),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        toast({
          description: "Login Successful.",
        });
        const data = await response.json();

        const userId = data._id;

        Cookies.set("adminId", userId);

        router.push("/admin/dashboard");
      } else {
        // Handle login failure (e.g., show an error message)
        toast({
          variant: "destructive",
          description: "Incorrect Username/Password.",
        });
        console.error("Login failed");
      }
    } catch (error) {
      // Handle network or other errors
      toast({
        variant: "destructive",
        description: "Error during login.",
      });
      console.error("Error during login", error);
    }
  }

  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/authentication"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 hidden top-4 md:right-8 md:top-8"
        )}
      >
        Login
      </Link>
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0">
          <div
            className="absolute z-10 inset-0 opacity-80"
            style={{ backgroundColor: "#1e293b" }}
          />
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
              Login as Admin
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your username and password below login
            </p>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-2 w-full"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="enter your username"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="enter your password"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <br />
              <Button type="submit" className="ml-auto w-full">
                Login
              </Button>
            </form>
          </Form>
          <p className="px-8 text-center text-sm text-muted-foreground">
            <Link
              href="/"
              className="underline underline-offset-4 hover:text-primary"
            >
              Go back
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
