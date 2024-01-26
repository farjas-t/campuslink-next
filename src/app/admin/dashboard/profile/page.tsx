"use client";
import Cookies from "js-cookie";
import BreadCrumb from "@/components/breadcrumb";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  name: z.string().min(2),
  username: z.string().min(2),
  password: z.string().min(4),
});
const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard/" },
  { title: "Edit Profile", link: "/admin/dashboard/profile" },
];
export default function AdminLogin() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const adminId = Cookies.get("adminId");

        const detailsres = await fetch(
          `http://localhost:3500/admin/${adminId}`,
          {
            method: "GET",
          }
        );

        if (detailsres.ok) {
          const adminDetails = await detailsres.json();

          // Update the form with the fetched username
          form.setValue("name", adminDetails.name);
          form.setValue("username", adminDetails.username);
        } else {
          console.error("Failed to fetch admin details");
        }
      } catch (error) {
        console.error("Error during admin details fetch", error);
      }
    };

    // Call the fetch function when the component mounts
    fetchAdminDetails();
  }, [form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const adminId = Cookies.get("adminId");
      const updatedAdminId = adminId;

      //update admin request
      const response = await fetch(
        `http://localhost:3500/admin/${updatedAdminId}`,
        {
          method: "PATCH",
          body: JSON.stringify(values),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      if (response.ok) {
        toast({
          description: "Profile updated successfully.",
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast({
          variant: "destructive",
          description: "Failed to update profile.",
        });
        console.error("Profile update failed");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Error during profile update.",
      });
      console.error("Error during profile update", error);
    }
  }

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <div className="p-4 lg:p-8 h-full flex items-start">
          <div className="mx-left flex w-full flex-col justify-start space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-left">
              <h1 className="text-2xl font-semibold tracking-tight">
                Edit Profile
              </h1>
              <p className="text-sm text-muted-foreground">
                Edit your name, username and password below
              </p>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2 w-full"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="enter your name"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
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
                      <FormLabel>New Password</FormLabel>
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
                  Update
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
