"use client";
import BreadCrumb from "@/components/breadcrumb";
import { Button, buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Pencil, Plus } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import React, { useEffect, useState } from "react";

type Mark = {
  _id: {
    _id: string;
    name: string;
    rollno: number;
  };
  test: number;
  seminar: number;
  assignment: number;
  attendance: number;
  total: number;
};

type Internal = {
  _id: string;
  paper: string | null;
  marks: Mark[];
  __v: number;
};

const breadcrumbItems = [
  { title: "Dashboard", link: "/teacher/dashboard/" },
  { title: "Internal", link: "/teacher/dashboard/internal" },
];

export default function Page({ params }: { params: { paperId: string } }) {
  const paperId = params.paperId;

  const [internal, setInternal] = useState<Internal>();

  useEffect(() => {
    async function fetchInternalMarks(paperId: string) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/internal/${paperId}`
      );
      const internalRes = await res.json();
      console.log(internalRes);
      setInternal(internalRes);
    }
    fetchInternalMarks(paperId);
  }, [paperId]);

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading title={`Internal Marks`} description="Manage internal" />

          <Link
            href={`/teacher/dashboard/internal/${paperId}/edit`}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </Link>
        </div>
        <Separator />
        {internal && internal.marks && internal.marks.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] text-center">
                  Roll.No.
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-center">Test</TableHead>
                <TableHead className="text-center">Seminar</TableHead>
                <TableHead className="text-center">Assignment</TableHead>
                <TableHead className="text-center">Attendance</TableHead>
                <TableHead className="text-center">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {internal.marks.map((mark, index) => (
                <TableRow key={index}>
                  <TableCell className="text-center">
                    {mark._id.rollno}
                  </TableCell>
                  <TableCell>{mark._id.name}</TableCell>
                  <TableCell className="text-center">{mark.test}</TableCell>
                  <TableCell className="text-center">{mark.seminar}</TableCell>
                  <TableCell className="text-center">
                    {mark.assignment}
                  </TableCell>
                  <TableCell className="text-center">
                    {mark.attendance}
                  </TableCell>
                  <TableCell className="text-center">{mark.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-primary">
            No records found <br />
            <br />
            <Link href={`${paperId}/edit`}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Internal
              </Button>
            </Link>
          </p>
        )}
      </div>
    </>
  );
}
