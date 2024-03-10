"use client";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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
import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

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

export default function showTimetable({
  params,
}: {
  params: { SemId: string };
}) {
  const { toast } = useToast();
  const [semid, setSemid] = useState<string>(params.SemId);
  const [papers, setPapers] = useState([]);
  const [timetable, setTimetable] = useState<any>({});

  const handlePaperChange = (
    day: string,
    periodIndex: number,
    paperId: string
  ) => {
    console.log("handlePaperChange function");
    setTimetable((prevTimetable: any) => {
      const newTimetable = { ...prevTimetable };
      newTimetable.schedule[day][periodIndex] = paperId;
      return newTimetable;
    });
  };

  const handleSave = async () => {
    try {
      await saveTimetable(semid, timetable);
      console.log("Timetable saved successfully!");
      toast({
        title: "Time Table Edited Succesfuly!",
      });
      console.log(
        JSON.stringify({
          semester: semid,
          schedule: timetable,
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

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
        <Heading title={`Edit Time Table`} description={``} />
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
                          <Select
                            key={period.paper}
                            onValueChange={(value) =>
                              handlePaperChange(day, index, value)
                            }
                            value={period.paper}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a paper" />
                            </SelectTrigger>
                            <SelectContent>
                              {papers.map((paper) => (
                                <SelectItem key={paper._id} value={paper._id}>
                                  {paper.paper}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      )
                    )}
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
        <br />
        <Button
          onClick={handleSave}
          className={cn(buttonVariants({ variant: "default" }))}
        >
          Save
        </Button>
      </div>
    </ScrollArea>
  );
}
