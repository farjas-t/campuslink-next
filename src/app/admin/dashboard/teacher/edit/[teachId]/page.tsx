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
  { title: "Teachers", link: "/admin/dashboard/teacher" },
  { title: "Edit", link: "/admin/dashboard/teachers/edit/" },
];

const formSchema = z.object({
  name: z.string().min(2),
  email: z.string(),
  department: z.string(),
  username: z.string(),
  password: z.string(),
});

export default function EditTeacher({
  params,
}: {
  params: { teachId: string };
}) {
  const teachid = params.teachId;
  const timestamp = new Date().getTime();
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      department: "",
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    const fetchPaperDetails = async () => {
      try {
        const detailsres = await fetch(
          `http://localhost:3500/teacher/${teachid}?timestamp=${timestamp}`,
          {
            method: "GET",
          }
        );

        if (detailsres.ok) {
          const paperDetails = await detailsres.json();

          // Update the form with the fetched username
          form.setValue("department", paperDetails.department._id);
          form.setValue("name", paperDetails.name);
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

  // Custom function to handle value change
  const handleDepartmentChange = (value: string) => {
    form.setValue("department", value);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch(`http://localhost:3500/teacher/${teachid}`, {
        method: "PATCH",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      if (response.ok) {
        toast({
          description: "Teacher edited successfully.",
        });
        router.push("/admin/dashboard/teacher/");
      } else {
        toast({
          variant: "destructive",
          description: "Failed to edit teacher.",
        });
        console.error("Teacher edit failed");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Error during teacher edit.",
      });
      console.error("Error during teacher edit", error);
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
                Edit Teacher
              </h1>
              <p className="text-sm text-muted-foreground">
                Edit teacher details
              </p>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2 w-full"
              >
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select
                        onValueChange={handleDepartmentChange} // Use setValue to update the form value
                        value={form.getValues("department")} // Get the current value from the form
                        defaultValue={form.getValues("department")}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              defaultValue={form.getValues("department")}
                              placeholder="Select a department"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map((department) => (
                            <SelectItem
                              key={department._id}
                              value={department._id}
                            >
                              {department.deptname}{" "}
                              {/* Use deptname from the API response */}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teacher Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="enter teacher name"
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
                          placeholder="enter teacher email"
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
                          placeholder="enter teacher username"
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
                          placeholder="enter teacher password"
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
