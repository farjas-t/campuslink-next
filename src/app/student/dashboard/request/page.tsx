"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import BreadCrumb from "@/components/breadcrumb";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Check, CircleSlash, Hourglass } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Teacher = {
  _id: string;
  name: string;
};

const breadcrumbItems = [
  { title: "Dashboard", link: "/student/dashboard/" },
  { title: "Requests", link: "/student/dashboard/request" },
];

const formSchema = z.object({
  student: z.string(),
  teacher: z.string(),
  text: z.string().min(2),
});

const studentId = Cookies.get("studentId");

export default function CreateRequest() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      student: studentId,
      teacher: "",
      text: "",
    },
  });

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    const fetchStudentRequests = async () => {
      try {
        const studentId = Cookies.get("studentId");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/request/student/${studentId}/requests`
        );
        if (response.ok) {
          const data = await response.json();
          setRequests(data.requests);
        } else {
          console.error("Failed to fetch student requests");
        }
      } catch (error) {
        console.error("Error during student requests fetch", error);
      }
    };

    fetchStudentRequests();
  }, []);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/teacher/`
        );
        if (response.ok) {
          const data: Teacher[] = await response.json();
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
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/request/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );
      if (response.ok) {
        toast({
          description: "Request sent successfully.",
        });
        const updatedResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/request/student/${studentId}/requests`
        );
        if (updatedResponse.ok) {
          const updatedData = await updatedResponse.json();
          setRequests(updatedData.requests);
        } else {
          console.error("Failed to fetch updated student requests");
        }
      } else {
        toast({
          variant: "destructive",
          description: "Failed to send request.",
        });
        console.error("Request sending failed");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Error during request sending.",
      });
      console.error("Error during request sending", error);
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
                Create Request
              </h1>
              <p className="text-sm text-muted-foreground">
                Send a request to a teacher
              </p>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2 w-full"
              >
                <FormField
                  control={form.control}
                  name="teacher"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teacher</FormLabel>
                      <Select
                        {...field}
                        onValueChange={(value) =>
                          form.setValue("teacher", value)
                        }
                        value={form.getValues("teacher")}
                        defaultValue={form.getValues("teacher")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a teacher" />
                        </SelectTrigger>
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
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <Textarea
                        placeholder="Enter your request message"
                        className="resize-none"
                        {...field}
                      />
                    </FormItem>
                  )}
                />
                <Button type="submit">Send</Button>
              </form>
            </Form>
          </div>
        </div>
        <Card className="col-span-7">
          <CardHeader>
            <CardTitle>My Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              {requests &&
                requests.map((request: any, index: number) => (
                  <div
                    key={index}
                    className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                  >
                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                    <div className="space-y-1">
                      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex flex-col space-y-2">
                          <p className="text-xs text-muted-foreground">
                            {request.datetime}
                          </p>
                          <p className="text-lg font-medium leading-none">
                            {request.text}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            To: {request.teacher.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {request.status === "pending" ? (
                              <span className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-yellow-200 text-black p-2">
                                <Hourglass className="mr-2 h-4 w-4" />
                                Pending
                              </span>
                            ) : request.status === "accepted" ? (
                              <span className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-green-200 text-black p-2">
                                <Check className="mr-2 h-4 w-4" />
                                Accepted
                              </span>
                            ) : (
                              <span className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-red-200 text-black p-2">
                                <CircleSlash className="mr-2 h-4 w-4" />
                                Rejected
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Remarks : {request.remark}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
