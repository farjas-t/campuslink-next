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
  const [notifications, setNotifications] = useState([]);
  const [username, setUsername] = useState(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      from: `${username}`,
    },
  });

  useEffect(() => {
    const fetchTeacherDetails = async () => {
      try {
        // Replace this with your logic to fetch the teacherId
        const teacherId = Cookies.get("teacherId");

        const detailsres = await fetch(
          `http://localhost:3500/teacher/${teacherId}`,
          {
            method: "GET",
          }
        );
        if (detailsres.ok) {
          const teacherDetails = await detailsres.json();
          setUsername(teacherDetails.name);
          const formValues = {
            content: "",
            from: `${teacherDetails.name}`,
          };
          form.reset(formValues);
        } else {
          console.error("Failed to fetch teacher details");
        }
      } catch (error) {
        console.error("Error during teacher details fetch", error);
      }
    };
    fetchTeacherDetails();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timestamp = new Date().getTime();

        const announcements = await fetchAnnouncements(timestamp);
        setNotifications(announcements);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const onDelete = async (announceId: string) => {
    try {
      const response = await fetch(
        `http://localhost:3500/announce/${announceId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        toast({
          description: "Announcement deleted successfully.",
        });
        const timestamp = new Date().getTime();
        const updatedAnnouncements = await fetchAnnouncements(timestamp);
        setNotifications(updatedAnnouncements);
      } else {
        toast({
          variant: "destructive",
          description: "Failed to delete announcement.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Error during deletion.",
      });
      console.error("Error during deletion", error);
    }
  };

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
      // Update teacher request
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
        const timestamp = new Date().getTime();
        const updatedAnnouncements = await fetchAnnouncements(timestamp);
        setNotifications(updatedAnnouncements);
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
                            {notification.from === username && (
                              <Button
                                variant="outline"
                                size="icon"
                                className="p-2"
                                onClick={() => onDelete(notification.id)}
                              >
                                <Trash />
                              </Button>
                            )}
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
