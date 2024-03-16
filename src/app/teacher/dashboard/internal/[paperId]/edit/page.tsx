"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

type Student = {
  _id: string;
  name: string;
  rollno: number;
};

type Mark = {
  _id: string;
  test: number;
  seminar: number;
  assignment: number;
  attendance: number;
  total: number;
};

export default function EditInternalPage({
  params,
}: {
  params: { paperId: string };
}) {
  const router = useRouter();
  const paperId = params.paperId;

  const [students, setStudents] = useState<Student[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await fetch(
          `http://localhost:3500/paper/${paperId}/students`
        );
        const studentsData: Student[] = await res.json();
        setStudents(studentsData);

        // Fetch internal marks
        const internalRes = await fetch(
          `http://localhost:3500/internal/${paperId}`
        );
        const internalData = await internalRes.json();

        if (
          internalData &&
          internalData.marks &&
          internalData.marks.length > 0
        ) {
          // If internal marks data is available, map it to the marks array
          const updatedMarks = internalData.marks.map((mark: any) => ({
            _id: mark._id._id, // Assuming _id is unique identifier
            test: mark.test,
            seminar: mark.seminar,
            assignment: mark.assignment,
            attendance: mark.attendance,
            total: mark.total,
          }));
          setMarks(updatedMarks);
        } else {
          // If no internal marks data is available, initialize marks array with default values
          const initialMarks = studentsData.map((student) => ({
            _id: student._id,
            test: 0,
            seminar: 0,
            assignment: 0,
            attendance: 0,
            total: 0,
          }));
          setMarks(initialMarks);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    if (paperId) {
      fetchStudents();
    }
  }, [paperId]);

  // Update marks and calculate total
  const handleMarkChange = (
    index: number,
    key: keyof Mark,
    value: string
  ): void => {
    const updatedMarks = [...marks] as any;
    // If marks[index] is undefined, initialize it with default values
    if (!updatedMarks[index]) {
      updatedMarks[index] = {
        _id: students[index]._id,
        test: 0,
        seminar: 0,
        assignment: 0,
        attendance: 0,
        total: 0,
      };
    }
    // Update the mark value
    updatedMarks[index][key] = parseInt(value) || 0;
    // Calculate total based on test, seminar, assignment, and attendance
    updatedMarks[index].total =
      updatedMarks[index].test +
      updatedMarks[index].seminar +
      updatedMarks[index].assignment +
      updatedMarks[index].attendance;
    setMarks(updatedMarks);
  };

  // Update internal marks
  const updateInternalMarks = async (): Promise<void> => {
    const res = await fetch(`http://localhost:3500/internal/${paperId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ marks }),
    });
    if (res.ok) {
      alert("Internal marks updated successfully!");
      router.push(`/teacher/dashboard/internal/${paperId}`);
    } else {
      alert("Failed to update internal marks.");
    }
  };

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-start justify-between">
          <Heading
            title={`Edit Internal Marks`}
            description="Manage internal"
          />

          <Link
            href={`/teacher/dashboard/internal/${paperId}`}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            Back
          </Link>
        </div>
        <Separator />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] text-center">Roll.No.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-center">Test</TableHead>
              <TableHead className="text-center">Seminar</TableHead>
              <TableHead className="text-center">Assignment</TableHead>
              <TableHead className="text-center">Attendance</TableHead>
              <TableHead className="text-center">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student, index) => (
              <TableRow key={student._id}>
                <TableCell className="text-center">{student.rollno}</TableCell>
                <TableCell className="w-[200px]">{student.name}</TableCell>
                <TableCell className="text-center">
                  <Input
                    type="number"
                    value={marks[index]?.test || ""}
                    onChange={(e) =>
                      handleMarkChange(index, "test", e.target.value)
                    }
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Input
                    type="number"
                    value={marks[index]?.seminar || ""}
                    onChange={(e) =>
                      handleMarkChange(index, "seminar", e.target.value)
                    }
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Input
                    type="number"
                    value={marks[index]?.assignment || ""}
                    onChange={(e) =>
                      handleMarkChange(index, "assignment", e.target.value)
                    }
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Input
                    type="number"
                    value={marks[index]?.attendance || ""}
                    onChange={(e) =>
                      handleMarkChange(index, "attendance", e.target.value)
                    }
                  />
                </TableCell>
                <TableCell className="text-center">
                  {marks[index]?.total}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-end">
          <Button onClick={updateInternalMarks}>Save</Button>
        </div>
      </div>
    </>
  );
}
