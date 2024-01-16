"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type Papers = {
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
  teacher: {
    _id: string;
    name: string;
  };
};

export const columns: ColumnDef<Papers>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value: any) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "paper",
    header: "Name",
  },
  {
    accessorKey: "teacher.name",
    header: "Teacher",
  },
  {
    accessorKey: "department.deptname",
    header: "Department",
  },
  {
    accessorKey: "semester.semnum",
    header: "Semester",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
