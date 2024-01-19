import AdminBreadCrumb from "@/components/breadcrumb";
import { columns } from "@/components/tables/student-tables/columns";
import { DepartmentTable } from "@/components/tables/student-tables/student-table";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";

import { Student } from "@/components/tables/student-tables/columns";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard/" },
  { title: "Students", link: "/admin/dashboard/student" },
];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function page({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const offset = (page - 1) * pageLimit;
  const timestamp = new Date().getTime();

  const res = await fetch(
    `http://localhost:3500/student?timestamp=${timestamp}`,
    {
      method: "GET",
    }
  );

  const countres = await fetch(
    `http://localhost:3500/student/extra/count?timestamp=${timestamp}`,
    {
      method: "GET",
    }
  );

  const countData = await countres.json();
  const count = countData.count;

  const departmentRes = await res.json();
  const pageCount = Math.ceil(count / pageLimit);
  const student: Student[] = departmentRes;
  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <AdminBreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Students (${count})`}
            description="Manage students"
          />

          <Link
            href={"/dashboard/student/new"}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />

        <DepartmentTable
          pageNo={page}
          columns={columns}
          count={count}
          data={student}
          pageCount={pageCount}
        />
      </div>
    </>
  );
}
