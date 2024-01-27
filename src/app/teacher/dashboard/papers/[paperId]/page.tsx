"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";

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
  const timestamp = new Date().getTime();
  const [paper, setPaper] = useState<Paper | null>(null);
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
  return (
    <ScrollArea className="h-full">
      {paper && (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div>
            <p className="text-sm text-muted-foreground">{paper.code}</p>
            <h1 className="text-2xl font-bold tracking-tight">{paper.paper}</h1>
            <p className="text-sm text-muted-foreground">
              Semester {paper.semester.semnum}, {paper.department.deptname}
            </p>
          </div>
        </div>
      )}
    </ScrollArea>
  );
}
