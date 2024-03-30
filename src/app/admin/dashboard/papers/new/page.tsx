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
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard/" },
  { title: "Papers", link: "/admin/dashboard/paper" },
  { title: "Create", link: "/admin/dashboard/papers/new" },
];

const formSchema = z.object({
  code: z.string(),
  paper: z.string().min(2),
  teacher: z.string(),
  department: z.string(),
  semnum: z.string(),
});

export default function CreatePaper() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      paper: "",
      teacher: "",
      department: "",
      semnum: "",
    },
  });

  const [departments, setDepartments] = React.useState<any[]>([]);
  const [selectedDepartment, setSelectedDepartment] = React.useState<
    string | null
  >(null);
  const [teachers, setTeachers] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/department`
        );
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

  React.useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/teacher/`
        );
        if (response.ok) {
          const data = await response.json();
          setTeachers(data);
        } else {
          console.error("Failed to fetch teachers");
        }
      } catch (error) {
        console.error("Error during teacher fetch", error);
      }
    };

    fetchTeachers();
  }, []);

  // Custom function to handle value change
  const handleDepartmentChange = (value: string) => {
    form.setValue("department", value);
    setSelectedDepartment(value);
    form.setValue("semnum", ""); // Reset semester field when department changes
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/paper/`,
        {
          method: "POST",
          body: JSON.stringify({ ...values, teacher: values.teacher }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      if (response.ok) {
        toast({
          description: "Paper created successfully.",
        });
        router.push("/admin/dashboard/papers/");
      } else {
        toast({
          variant: "destructive",
          description: "Failed to create paper.",
        });
        console.error("Paper creation failed");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Error during paper creation.",
      });
      console.error("Error during paper creation", error);
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
                Create Paper
              </h1>
              <p className="text-sm text-muted-foreground">Add new paper</p>
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
                  name="semnum"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Semester</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          form.setValue("semnum", value)
                        }
                        value={form.getValues("semnum")}
                        defaultValue={form.getValues("semnum")}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              defaultValue={form.getValues("semnum")}
                              placeholder="Select a semester"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {selectedDepartment &&
                            Array.from(
                              {
                                length:
                                  departments.find(
                                    (dep) => dep._id === selectedDepartment
                                  )?.semcount || 0,
                              },
                              (_, index) => (
                                <SelectItem
                                  key={index + 1}
                                  value={(index + 1).toString()}
                                >
                                  Semester {index + 1}
                                </SelectItem>
                              )
                            )}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Paper Code</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="enter paper code"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paper"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Paper Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="enter paper name"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="teacher"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teacher</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          form.setValue("teacher", value)
                        }
                        value={form.getValues("teacher")}
                        defaultValue={form.getValues("teacher")}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              defaultValue={form.getValues("teacher")}
                              placeholder="Select a teacher"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {teachers.map((teacher) => (
                            <SelectItem key={teacher._id} value={teacher._id}>
                              {teacher.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <br />
                <Button type="submit" className="ml-auto">
                  Create
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
