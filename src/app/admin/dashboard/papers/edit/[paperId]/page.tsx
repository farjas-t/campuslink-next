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
  { title: "Papers", link: "/admin/dashboard/papers/" },
  { title: "Edit", link: "/admin/dashboard/papers/edit" },
];

const formSchema = z.object({
  code: z.string(),
  paper: z.string().min(2),
  teacher: z.string(),
});

export default function EditPaper({ params }: { params: { paperId: string } }) {
  const paperid = params.paperId;
  const timestamp = new Date().getTime();
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      paper: "",
      teacher: "",
    },
  });

  useEffect(() => {
    const fetchPaperDetails = async () => {
      try {
        const detailsres = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/paper/${paperid}?timestamp=${timestamp}`,
          {
            method: "GET",
          }
        );

        if (detailsres.ok) {
          const deptDetails = await detailsres.json();

          // Update the form with the fetched username
          form.setValue("code", deptDetails.code);
          form.setValue("paper", deptDetails.paper);
          form.setValue("teacher", deptDetails.teacher);
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

  const [teachers, setTeachers] = React.useState<any[]>([]);

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/paper/${paperid}`,
        {
          method: "PATCH",
          body: JSON.stringify({ ...values, teacher: values.teacher }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      if (response.ok) {
        toast({
          description: "Paper edited successfully.",
        });
        router.push("/admin/dashboard/papers/");
      } else {
        toast({
          variant: "destructive",
          description: "Failed to edit paper.",
        });
        console.error("Paper edit failed");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Error during paper edit.",
      });
      console.error("Error during paper edit", error);
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
                Edit Paper
              </h1>
              <p className="text-sm text-muted-foreground">
                Edit paper details
              </p>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2 w-full"
              >
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
