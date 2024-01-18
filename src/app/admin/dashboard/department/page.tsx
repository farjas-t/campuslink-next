import BreadCrumb from "@/components/breadcrumb";
import { columns } from "@/components/tables/department-tables/columns";
import { DepartmentTable } from "@/components/tables/department-tables/department-table";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";

import { Department } from "@/components/tables/department-tables/columns";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard/" },
  { title: "Departments", link: "/admin/dashboard/department" },
];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function page({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;

  const res = await fetch(`http://localhost:3500/department/`, {
    method: "GET",
  });

  const countres = await fetch(`http://localhost:3500/department/extra/count`, {
    method: "GET",
  });

  const countData = await countres.json();
  const count = countData.count;

  const departmentRes = await res.json();
  const pageCount = Math.ceil(count / pageLimit);
  const department: Department[] = departmentRes;
  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Departments (${count})`}
            description="Manage departments"
          />

          <Link
            href={"/admin/dashboard/department/new"}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Create
          </Link>
        </div>
        <Separator />

        <DepartmentTable
          pageNo={page}
          columns={columns}
          count={count}
          data={department}
          pageCount={pageCount}
        />
      </div>
    </>
  );
}
