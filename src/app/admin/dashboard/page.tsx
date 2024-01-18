import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookCopy, BookOpen, Trash, Users, UsersRound } from "lucide-react";

const fetchCount = async (endpoint: any) => {
  try {
    const response = await fetch(endpoint, { method: "GET" });
    const data = await response.json();
    return data.count;
  } catch (error) {
    console.error(`Error fetching count from ${endpoint}:`);
    return 0;
  }
};

const fetchAnnouncements = async () => {
  try {
    const announcementsRes = await fetch(`http://localhost:3500/announce/`);
    const data = await announcementsRes.json();
    return data.map((announcement: any) => ({
      id: announcement._id,
      content: announcement.content,
      from: announcement.from,
      datetime: announcement.datetime,
    }));
  } catch (error) {
    console.error("Error fetching announcements:");
    return [];
  }
};

export default async function page() {
  const timestamp = new Date().getTime();

  const deptcount = await fetchCount(
    `http://localhost:3500/department/extra/count?timestamp=${timestamp}`
  );
  const teachcount = await fetchCount(
    `http://localhost:3500/teacher/extra/count?timestamp=${timestamp}`
  );
  const studcount = await fetchCount(
    `http://localhost:3500/student/extra/count?timestamp=${timestamp}`
  );
  const papercount = await fetchCount(
    `http://localhost:3500/paper/extra/count?timestamp=${timestamp}`
  );

  const notifications = await fetchAnnouncements();

  const username = "Admin";

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
                            <Button variant="destructive" size="icon">
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
