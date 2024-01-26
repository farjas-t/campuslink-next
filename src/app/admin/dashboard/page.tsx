"use client";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BookCopy,
  BookOpen,
  SendHorizontal,
  Trash,
  Users,
  UsersRound,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  content: z.string().min(1),
  from: z.string(),
});

export default function Page() {
  const { toast } = useToast();
  const [deptcount, setDeptCount] = useState(0);
  const [teachcount, setTeachCount] = useState(0);
  const [studcount, setStudCount] = useState(0);
  const [papercount, setPaperCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [username, setUsername] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      from: `${username}`,
    },
  });

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        // Replace this with your logic to fetch the adminId
        const adminId = Cookies.get("adminId");

        const detailsres = await fetch(
          `http://localhost:3500/admin/${adminId}`,
          {
            method: "GET",
          }
        );
        if (detailsres.ok) {
          const adminDetails = await detailsres.json();
          setUsername(adminDetails.name);
          const formValues = {
            content: "",
            from: `${adminDetails.name}`,
          };
          form.reset(formValues);
        } else {
          console.error("Failed to fetch admin details");
        }
      } catch (error) {
        console.error("Error during admin details fetch", error);
      }
    };
    fetchAdminDetails();
  }, [form]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timestamp = new Date().getTime();

        // Fetch counts
        setDeptCount(
          await fetchCount(
            `http://localhost:3500/department/extra/count?timestamp=${timestamp}`
          )
        );
        setTeachCount(
          await fetchCount(
            `http://localhost:3500/teacher/extra/count?timestamp=${timestamp}`
          )
        );
        setStudCount(
          await fetchCount(
            `http://localhost:3500/student/extra/count?timestamp=${timestamp}`
          )
        );
        setPaperCount(
          await fetchCount(
            `http://localhost:3500/paper/extra/count?timestamp=${timestamp}`
          )
        );

        // Fetch announcements
        const announcements = await fetchAnnouncements(timestamp);
        setNotifications(announcements);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  async function fetchCount(endpoint: any) {
    try {
      const response = await fetch(endpoint, { method: "GET" });
      const data = await response.json();
      return data.count;
    } catch (error) {
      console.error(`Error fetching count from ${endpoint}:`, error);
      return 0;
    }
  }

  async function fetchAnnouncements(timestamp: any) {
    try {
      const announcementsRes = await fetch(
        `http://localhost:3500/announce?timestamp=${timestamp}`
      );
      const data = await announcementsRes.json();
      return data.map((announcement: any) => ({
        id: announcement._id,
        content: announcement.content,
        from: announcement.from,
        datetime: announcement.datetime,
      }));
    } catch (error) {
      console.error("Error fetching announcements:", error);
      return [];
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Update admin request
      const response = await fetch(`http://localhost:3500/announce/`, {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast({
          description: "Announcement Sent Successfully.",
        });

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast({
          variant: "destructive",
          description: "Failed to send announcement.",
        });
        console.error("Announcement failed");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Error during sending announcement.",
      });
      console.error("Error during sending announcement", error);
    }
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Hi {username}, Welcome back 👋
          </h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Students
                  </CardTitle>
                  <UsersRound />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{studcount}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Teachers
                  </CardTitle>
                  <Users />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{teachcount}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Departments
                  </CardTitle>
                  <BookCopy />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{deptcount}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Papers</CardTitle>
                  <BookOpen />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{papercount}</div>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-7">
                <CardHeader>
                  <CardTitle>Announcements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-row items-center justify-between space-y-0 space-x-4 pb-2 mb-5">
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-2 space-x-4 w-full contents"
                      >
                        <div className="flex-1">
                          <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Textarea
                                    placeholder="Type your announcement here."
                                    {...field}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>

                        <Button variant="default" className="bg-sky-500 flex-2">
                          <SendHorizontal />
                        </Button>
                      </form>
                    </Form>
                  </div>
                  <div>
                    {notifications.map((notification: any, index: any) => (
                      <div
                        key={index}
                        className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                      >
                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                        <div className="space-y-1">
                          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="flex flex-col space-y-2">
                              <p className="text-xs text-muted-foreground">
                                {notification.datetime}
                              </p>
                              <p className="text-sm font-medium leading-none">
                                {notification.content}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                &#8208;&nbsp;{notification.from}
                              </p>
                            </div>
                            <Button variant="outline" size="icon">
                              <Trash />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}
