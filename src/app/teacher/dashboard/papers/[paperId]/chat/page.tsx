"use client";
import Cookies from "js-cookie";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, SendHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";

interface Paper {
  _id: string;
  code: string;
  paper: string;
  semester: {
    _id: string;
    semnum: number;
  };
  department: {
    _id: string;
    deptname: string;
  };
}

const formSchema = z.object({
  content: z.string().min(1),
  from: z.string(),
});

export default function ViewPaper({ params }: { params: { paperId: string } }) {
  const { toast } = useToast();
  const paperid = params.paperId;
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [username, setUsername] = useState(null);
  const timestamp = new Date().getTime();
  const teacherId = Cookies.get("teacherId");
  const [paper, setPaper] = useState<Paper | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      from: `${username}`,
    },
  });

  useEffect(() => {
    const fetchPaperDetails = async () => {
      try {
        const detailsres = await fetch(
          `http://localhost:3500/paper/${paperid}?timestamp=${timestamp}`,
          {
            method: "GET",
          }
        );

        if (detailsres.ok) {
          const paperDetails = await detailsres.json();
          setPaper(paperDetails);
        } else {
          console.error("Failed to fetch department details");
        }
      } catch (error) {
        console.error("Error during department details fetch", error);
      }
    };
    fetchPaperDetails();
  }, []);

  useEffect(() => {
    const fetchTeacherDetails = async () => {
      try {
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
  }, [teacherId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timestamp = new Date().getTime();

        const chat = await fetchChat(timestamp);
        setNotifications(chat);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, []);

  async function fetchChat(timestamp: any) {
    try {
      const chatRes = await fetch(
        `http://localhost:3500/chat/${paperid}?timestamp=${timestamp}`
      );
      const data = await chatRes.json();
      return data.map((chat: any) => ({
        id: chat._id,
        content: chat.content,
        from: chat.from,
        datetime: chat.datetime,
      }));
    } catch (error) {
      console.error("Error fetching chat:", error);
      return [];
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Update teacher request
      const response = await fetch(`http://localhost:3500/chat/${paperid}`, {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast({
          description: "Chat Sent Successfully.",
        });
        const timestamp = new Date().getTime();
        const updatedChat = await fetchChat(timestamp);
        setNotifications(updatedChat);
      } else {
        toast({
          variant: "destructive",
          description: "Failed to send chat.",
        });
        console.error("Chat failed");
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
    <>
      {paper && (
        <div className="w-full h-20 flex p-4 justify-start items-center border-b">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mr-5 p-0"
          >
            <ChevronLeft />
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <span className="font-bold font-xl">{paper.paper}</span>
            </div>
          </div>
        </div>
      )}
      <ScrollArea className="h-full p-5">
        <div className="mb-4 grid items-start pb-4">
          <div className="">
            {" "}
            <div>
              {notifications.map((notification: any, index: any) => (
                <div key={index} className="mb-4 items-start pb-4">
                  <div className="flex items-start gap-2.5">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback>
                        {" "}
                        {notification.from?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1 w-full max-w-[320px]">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {notification.from}
                        </span>
                        <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                          {notification.datetime}
                        </span>
                      </div>
                      <div className="flex flex-col leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                        <p className="text-sm font-normal text-gray-900 dark:text-white">
                          {" "}
                          {notification.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-row items-center justify-between space-x-4 pb-2 mb-10">
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
                              placeholder="Type your message here."
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button variant="default" className="bg-sky-500 flex-2 ">
                    <SendHorizontal />
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </ScrollArea>
    </>
  );
}
