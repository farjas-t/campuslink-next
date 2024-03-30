"use client";
import {
  JSXElementConstructor,
  Key,
  PromiseLikeOfReactNode,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useState,
} from "react";
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

async function fetchPapers(semId: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/paper/semester/${semId}`
  );
  if (response.ok) {
    return response.json();
  }
  throw new Error("Failed to fetch papers");
}

async function fetchTimetable(semId: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/time_schedule/${semId}`
  );
  if (response.ok) {
    return response.json();
  }
  throw new Error("Failed to fetch timetable");
}

async function saveTimetable(semId: string, timetable: any) {
  const method = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/time_schedule/${semId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        semester: semId,
        schedule: timetable,
      }),
    }
  );

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

  function titleCase(str: string) {
    return str
      .toLowerCase()
      .split(" ")
      .map(function (word: string) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  }

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
                      (
                        period: {
                          paper:
                            | string
                            | number
                            | boolean
                            | ReactElement<
                                any,
                                string | JSXElementConstructor<any>
                              >
                            | Iterable<ReactNode>
                            | ReactPortal
                            | PromiseLikeOfReactNode
                            | null
                            | undefined;
                          teacher: {
                            name:
                              | string
                              | number
                              | boolean
                              | ReactElement<
                                  any,
                                  string | JSXElementConstructor<any>
                                >
                              | Iterable<ReactNode>
                              | ReactPortal
                              | PromiseLikeOfReactNode
                              | null
                              | undefined;
                          };
                        },
                        index: Key | null | undefined
                      ) => (
                        <TableCell key={index}>
                          <span className="text-l font-bold tracking-tight">
                            {period.paper}
                          </span>
                          <br />
                          <span className="text-sm text-muted-foreground">
                            {period.teacher.name}
                          </span>
                        </TableCell>
                      )
                    )}
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
        <br />
      </div>
    </ScrollArea>
  );
}
