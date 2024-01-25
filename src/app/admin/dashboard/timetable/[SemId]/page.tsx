"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

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

export default function editTimetable({
  params,
}: {
  params: { SemId: string };
}) {
  const [semid, setSemid] = useState<string>(params.SemId);
  const [papers, setPapers] = useState<{ _id: string; paper: string }[]>([]);
  const [timetable, setTimetable] = useState<any>({});

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
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="container mx-auto py-10">
        <pre>{JSON.stringify(papers, null, 2)}</pre>
        <pre>{JSON.stringify(timetable, null, 2)}</pre>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </ScrollArea>
  );
}
