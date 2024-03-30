"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  LibraryBig,
  MessagesSquare,
  NotebookPen,
  Presentation,
} from "lucide-react";
import { useRouter } from "next/navigation";

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

export default function ViewPaper({ params }: { params: { paperId: string } }) {
  const paperid = params.paperId;
  const router = useRouter();
  const timestamp = new Date().getTime();
  const [paper, setPaper] = useState<Paper | null>(null);
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
  const onClick = async (routeName: string) => {
    router.push(`./${paperid}/${routeName}`);
  };
  return (
    <>
      {paper && (
        <div className="w-full h-20 flex p-4 justify-start items-center border-b">
          <Button
            variant="ghost"
            className="mr-5 p-0"
            onClick={() => router.back()}
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
        <div className="mb-4 grid items-start pb-4 last:mb-0 last:pb-0">
          <div className="space-y-5">
            <div className="flex flex-row items-center justify-between space-y-0">
              <Button
                variant="outline"
                size="icon"
                className="w-full h-fit p-4 justify-between"
                onClick={() => onClick("chat")}
              >
                <div className="flex flex-row items-center space-y-0 justify-start">
                  <MessagesSquare />
                  <div className="flex flex-col space-y-2 text-left">
                    <h1 className="font-bold text-xl ml-5">Chat</h1>
                  </div>
                </div>
                <ChevronRight />
              </Button>
            </div>
            <div className="flex flex-row items-center justify-between space-y-0">
              <Button
                variant="outline"
                size="icon"
                className="w-full h-fit p-4 justify-between"
                onClick={() => onClick("notebook")}
              >
                <div className="flex flex-row items-center space-y-0 justify-start">
                  <NotebookPen />
                  <div className="flex flex-col space-y-2 text-left">
                    <h1 className="font-bold text-xl ml-5">Notebook</h1>
                  </div>
                </div>
                <ChevronRight />
              </Button>
            </div>
            <div className="flex flex-row items-center justify-between space-y-0">
              <Button
                variant="outline"
                size="icon"
                className="w-full h-fit p-4 justify-between"
                onClick={() =>
                  router.push(
                    "https://www.mamoclibrary.in/virtual-class-room-libraries"
                  )
                }
              >
                <div className="flex flex-row items-center space-y-0 justify-start">
                  <LibraryBig />
                  <div className="flex flex-col space-y-2 text-left">
                    <h1 className="font-bold text-xl ml-5">Study Materials</h1>
                  </div>
                </div>
                <ChevronRight />
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </>
  );
}
