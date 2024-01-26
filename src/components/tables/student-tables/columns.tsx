"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Button } from "@/components/ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";

export type Student = {
  _id: string;
  name: string;
  admno: number;
  rollno: number;
  semester: {
    _id: string;
    semnum: number;
  };
  department: {
    _id: string;
    deptname: string;
  };
  email: string;
  username: string;
};

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "admno",
    header: ({ column }) => {
      return (
        <Button
          variant="link"
          className="p-0 text-muted-foreground"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Adm.No.
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="link"
          className="p-0 text-muted-foreground"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: "E-mail",
  },
  {
    accessorKey: "department.deptname",
    header: ({ column }) => {
      return (
        <Button
          variant="link"
          className="p-0 text-muted-foreground"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Department
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "semester.semnum",
    header: ({ column }) => {
      return (
        <Button
          variant="link"
          className="p-0 text-muted-foreground"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Semester
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
