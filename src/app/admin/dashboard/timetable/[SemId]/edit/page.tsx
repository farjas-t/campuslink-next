"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

async function fetchPapers(semId: string) {
  const response = await fetch(`http://localhost:3500/paper/semester/${semId}`);
  if (response.ok) {
    return response.json();
  }
  throw new Error("Failed to fetch papers");
}

async function fetchTimetable(semId: string) {
  const response = await fetch(`http://localhost:3500/time_schedule/${semId}`);
  if (response.ok) {
    return response.json();
  }
  throw new Error("Failed to fetch timetable");
}

async function saveTimetable(semId: string, timetable: any) {
  const method = await fetch(`http://localhost:3500/time_schedule/${semId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      semester: semId,
      schedule: timetable,
    }),
  });

  if (!method.ok) {
    throw new Error("Failed to save timetable");
  }
}

export default function useTimetable({
  params,
}: {
  params: { SemId: string };
}) {
  const [semid, setSemid] = useState<string>(params.SemId);
  const [papers, setPapers] = useState([]);
  const [timetable, setTimetable] = useState<any>({});

  const router = useRouter();

  useEffect(() => {
    if (semid) {
      fetchPapers(semid)
        .then((data) => setPapers(data))
        .catch((error) => console.error(error));

      fetchTimetable(semid)
        .then((data) => setTimetable(data))
        .catch((error) => console.error(error));
    }
  }, [semid]);

  const handleSave = async () => {
    try {
      await saveTimetable(semid, timetable.schedule);
      console.log("Timetable saved successfully!");
      router.push(`/admin/dashboard/timetable/${semid}`);
    } catch (error) {
      console.error(error);
    }
  };

  function titleCase(str: string) {
    return str
      .toLowerCase()
      .split(" ")
      .map(function (word: string) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  }

  const handlePaperChange = (day: string, index: number, paperId: string) => {
    const updatedTimetable = { ...timetable };
    updatedTimetable.schedule[day][index] = paperId;
    setTimetable(updatedTimetable);
  };

  return (
    <ScrollArea className="h-full">
      <div className="container mx-auto py-10">
        <Heading title={`Time Table`} description={``} />
        <br />
        <Separator />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Day</TableHead>
              <TableHead>1</TableHead>
              <TableHead>2</TableHead>
              <TableHead>3</TableHead>
              <TableHead>4</TableHead>
              <TableHead>5</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {["monday", "tuesday", "wednesday", "thursday", "friday"].map(
              (day) => (
                <TableRow key={day}>
                  <TableHead>{titleCase(day)}</TableHead>
                  {timetable.schedule &&
                    timetable.schedule[day] &&
                    timetable.schedule[day].map(
                      (period: any, index: number) => (
                        <TableCell key={index}>
                          <select
                            value={period && period._id}
                            onChange={(e) =>
                              handlePaperChange(
                                day,
                                index,
                                e.target.value as string
                              )
                            }
                          >
                            <option value="">Select Paper</option>
                            {papers.map((paper: any) => (
                              <option key={paper._id} value={paper._id}>
                                {paper.paper}
                              </option>
                            ))}
                          </select>
                          <br />
                        </TableCell>
                      )
                    )}
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
        <br />
        <Button onClick={handleSave}>Save</Button>
      </div>
    </ScrollArea>
  );
}
