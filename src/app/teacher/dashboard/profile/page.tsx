"use client";
import Cookies from "js-cookie";
import BreadCrumb from "@/components/breadcrumb";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
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
  email: z.string().min(2),
  username: z.string().min(2),
  password: z.string().min(4),
});
export default function TeacherLogin() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    const fetchTeacherDetails = async () => {
      try {
        const teacherId = Cookies.get("teacherId");

        const detailsres = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/teacher/${teacherId}`,
          {
            method: "GET",
          }
        );

        if (detailsres.ok) {
          const teacherDetails = await detailsres.json();

          // Update the form with the fetched username
          form.setValue("name", teacherDetails.name);
          form.setValue("username", teacherDetails.username);
          form.setValue("email", teacherDetails.email);
        } else {
          console.error("Failed to fetch teacher details");
        }
      } catch (error) {
        console.error("Error during teacher details fetch", error);
      }
    };

    // Call the fetch function when the component mounts
    fetchTeacherDetails();
  }, [form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const teacherId = Cookies.get("teacherId");
      const updatedTeacherId = teacherId;

      //update teacher request
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/teacher/${updatedTeacherId}`,
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
        <div className="p-4 h-full flex items-start">
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="enter your email id"
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
