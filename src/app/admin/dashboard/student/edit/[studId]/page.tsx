"use client";
import BreadCrumb from "@/components/breadcrumb";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard/" },
  { title: "Students", link: "/admin/dashboard/student" },
  { title: "Edit", link: "/admin/dashboard/students/edit" },
];

const formSchema = z.object({
  admno: z.string(),
  rollno: z.string(),
  name: z.string().min(2),
  email: z.string(),
  username: z.string(),
  password: z.string(),
});

export default function CreateStudent({
  params,
}: {
  params: { studId: string };
}) {
  const studid = params.studId;
  const timestamp = new Date().getTime();
  const router = useRouter();
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
    const fetchPaperDetails = async () => {
      try {
        const detailsres = await fetch(
          `http://localhost:3500/student/${studid}?timestamp=${timestamp}`,
          {
            method: "GET",
          }
        );

        if (detailsres.ok) {
          const paperDetails = await detailsres.json();

          // Update the form with the fetched username
          form.setValue("name", paperDetails.name);
          form.setValue("admno", paperDetails.admno);
          form.setValue("rollno", paperDetails.rollno);
          form.setValue("email", paperDetails.email);
          form.setValue("username", paperDetails.username);
          form.setValue("password", paperDetails.password);
        } else {
          console.error("Failed to fetch department details");
        }
      } catch (error) {
        console.error("Error during department details fetch", error);
      }
    };
    // Call the fetch function when the component mounts
    fetchPaperDetails();
  }, [form]);

  const [departments, setDepartments] = React.useState<any[]>([]);
  const [selectedDepartment, setSelectedDepartment] = React.useState<
    string | null
  >(null);

  React.useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("http://localhost:3500/department");
        if (response.ok) {
          const data = await response.json();
          setDepartments(data);
        } else {
          console.error("Failed to fetch departments");
        }
      } catch (error) {
        console.error("Error during department fetch", error);
      }
    };

    fetchDepartments();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch(`http://localhost:3500/student/${studid}`, {
        method: "PATCH",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      if (response.ok) {
        toast({
          description: "Student created successfully.",
        });
        router.push("/admin/dashboard/student/");
      } else {
        toast({
          variant: "destructive",
          description: "Failed to create student.",
        });
        console.error("Student creation failed");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Error during student creation.",
      });
      console.error("Error during student creation", error);
    }
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <div className="p-4 lg:p-8 h-full flex items-start">
          <div className="mx-left flex w-full flex-col justify-start space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-left">
              <h1 className="text-2xl font-semibold tracking-tight">
                Edit Student
              </h1>
              <p className="text-sm text-muted-foreground">
                Edit student details
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
                      <FormLabel>Student Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="enter student name"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="admno"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admission No.</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="enter admission no"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rollno"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Roll No.</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="enter roll no"
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
                          placeholder="enter student email"
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
                          placeholder="enter student username"
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
                          type="text"
                          placeholder="enter student password"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <br />
                <Button type="submit" className="ml-auto">
                  Save
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}