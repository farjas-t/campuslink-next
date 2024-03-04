"use client";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  content: z.string().min(1),
  from: z.string(),
});

export default function Page() {
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
    const fetchStudentDetails = async () => {
      try {
        // Replace this with your logic to fetch the studentId
        const studentId = Cookies.get("studentId");

        const detailsres = await fetch(
          `http://localhost:3500/student/${studentId}`,
          {
            method: "GET",
          }
        );
        if (detailsres.ok) {
          const studentDetails = await detailsres.json();
          setUsername(studentDetails.name);
          const formValues = {
            content: "",
            from: `${studentDetails.name}`,
          };
          form.reset(formValues);
        } else {
          console.error("Failed to fetch student details");
        }
      } catch (error) {
        console.error("Error during student details fetch", error);
      }
    };
    fetchStudentDetails();
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
