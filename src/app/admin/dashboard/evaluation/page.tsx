"use client";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [teachers, setTeachers] = useState<any[]>([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch("http://localhost:3500/teacher/");
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

  const onClick = async (teacherId: string) => {
    router.push(`/admin/dashboard/evaluation/${teacherId}`);
  };

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Teacher Performance Evaluation
          </h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-7">
                <CardHeader>
                  <div>
                    {teachers.map((teacher: any, index: any) => (
                      <div
                        key={index}
                        className="mb-4 grid items-start pb-4 last:mb-0 last:pb-0"
                      >
                        <div className="space-y-1">
                          <div className="flex flex-row items-center justify-between space-y-0">
                            <Button
                              variant="outline"
                              size="icon"
                              className="w-full h-fit p-4 justify-between"
                              onClick={() => onClick(teacher._id)}
                            >
                              <div className="flex flex-col space-y-2 text-left">
                                <CardTitle>{teacher.name}</CardTitle>
                                <p className="text-xs text-muted-foreground">
                                  Department : {teacher.department.deptname}
                                </p>
                              </div>
                              <ChevronRight />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}
