import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookCopy, BookOpen, Users, UsersRound } from "lucide-react";

export default async function page() {
  const deptcountres = await fetch(
    `http://localhost:3500/department/extra/count`
  );
  const deptcountData = await deptcountres.json();
  const deptcount = deptcountData.count;

  const teachcountres = await fetch(
    `http://localhost:3500/department/extra/count`
  );
  const teachcountData = await teachcountres.json();
  const teachcount = teachcountData.count;

  const studcountres = await fetch(`http://localhost:3500/student/extra/count`);
  const studcountData = await studcountres.json();
  const studcount = studcountData.count;

  const papercountres = await fetch(`http://localhost:3500/paper/extra/count`);
  const papercountData = await papercountres.json();
  const papercount = papercountData.count;

  const username = "Admin";

  const notifications = [
    {
      content: "Your call has been confirmed.",
      time: "1 hour ago",
    },
    {
      content: "You have a new message!",
      time: "1 hour ago",
    },
  ];

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
                    {notifications.map((notification, index) => (
                      <div
                        key={index}
                        className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                      >
                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {notification.content}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {notification.time}
                          </p>
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
