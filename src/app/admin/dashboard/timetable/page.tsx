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
import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard/" },
  { title: "Time Table", link: "/admin/dashboard/timetable" },
];

const formSchema = z.object({
  department: z.string(),
  semnum: z.string(),
});

export default function CreateStudent() {
  const [departments, setDepartments] = React.useState<any[]>([]);
  const [selectedDepartment, setSelectedDepartment] = React.useState<
    string | null
  >(null);
  const [SemId, setSemId] = useState<string | null>(null);
  const [timeSchedules, setTimeSchedules] = useState<any[]>([]);
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      department: "",
      semnum: "",
    },
  });

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

  // Custom function to handle value change
  const handleDepartmentChange = (value: string) => {
    form.setValue("department", value);
    setSelectedDepartment(value);
    form.setValue("semnum", ""); // Reset semester field when department changes
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { department, semnum } = values;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/semester/dept/${department}/${semnum}`,
        {
          method: "GET",
        }
      );
      console.log(response);

      if (response.ok) {
        const responseData = await response.json();

        // Assuming the response data has an "_id" property
        const semIdFromResponse = responseData?._id;

        if (semIdFromResponse) {
          setSemId(semIdFromResponse);
          +console.log("fetched semid : " + semIdFromResponse);
          router.push(`/admin/dashboard/timetable/${semIdFromResponse}`);
        } else {
          console.error("Response data does not contain _id");
        }
      } else {
        toast({
          variant: "destructive",
          description: "Failed to fetch sem id.",
        });
        console.error("Fetching failed");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Error during fetch.",
      });
      console.error("Error during fetch", error);
    }
  }

  //   const timeSchedulesResponse = await fetch(
  //     `${process.env.NEXT_PUBLIC_API_BASE_URL}/time_schedule/${SemId}`,
  //     {
  //       method: "GET",
  //     }
  //   );
  //   if (timeSchedulesResponse.ok) {
  //     const timeSchedulesData = await timeSchedulesResponse.json();
  //     setTimeSchedules(timeSchedulesData);
  //     console.log("Fetched time schedules:", timeSchedulesData);
  //   } else {
  //     toast({
  //       variant: "destructive",
  //       description: "Failed to fetch time schedules.",
  //     });
  //     console.error("Fetching time schedules failed");
  //   }

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <div className="p-4 lg:p-8 h-full flex items-start">
          <div className="mx-left flex w-full flex-col justify-start space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-left">
              <h1 className="text-2xl font-semibold tracking-tight">
                Manage Time Table
              </h1>
              <p className="text-sm text-muted-foreground">
                Select the department and semester
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
                <br />
                <Button type="submit" className="ml-auto">
                  Fetch
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
