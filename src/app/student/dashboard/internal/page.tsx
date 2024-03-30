"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import BreadCrumb from "@/components/breadcrumb";
import { Heading } from "@/components/ui/heading";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

type Internal = {
  paper: string;
  internals: {
    _id: string;
    test: number;
    seminar: number;
    assignment: number;
    attendance: number;
    total: number;
  };
};

const breadcrumbItems = [
  { title: "Dashboard", link: "/student/dashboard/" },
  { title: "Internal", link: "/student/dashboard/internal" },
];

export default function DashboardLayout() {
  const [internals, setInternals] = useState<Internal[] | null>(null);

  useEffect(() => {
    const studentId = Cookies.get("studentId");
    const fetchInternal = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/internal/student/${studentId}`
        );

        if (response.ok) {
          const data: Internal[] = await response.json();
          setInternals(data);
        } else {
          console.error("Failed to fetch internals");
        }
      } catch (error) {
        console.error("Error during internals fetch", error);
      }
    };

    fetchInternal();
  }, []);

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading title={`Internal Marks`} description="" />
        </div>
        <div className="flex h-screen overflow-hidden p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paper</TableHead>
                <TableHead className="text-center">Test</TableHead>
                <TableHead className="text-center">Seminar</TableHead>
                <TableHead className="text-center">Assignment</TableHead>
                <TableHead className="text-center">Attendance</TableHead>
                <TableHead className="text-center">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {internals &&
                internals.map((internal, index) => (
                  <TableRow key={index}>
                    <TableCell>{internal.paper}</TableCell>
                    <TableCell className="text-center">
                      {internal.internals.test}
                    </TableCell>
                    <TableCell className="text-center">
                      {internal.internals.seminar}
                    </TableCell>
                    <TableCell className="text-center">
                      {internal.internals.assignment}
                    </TableCell>
                    <TableCell className="text-center">
                      {internal.internals.attendance}
                    </TableCell>
                    <TableCell className="text-center">
                      {internal.internals.total}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
