"use client";
import BreadCrumb from "@/components/breadcrumb";
import Cookies from "js-cookie";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect, useState } from "react";

const breadcrumbItems = [
  { title: "Dashboard", link: "/teacher/dashboard/" },
  { title: "Internal", link: "/teacher/dashboard/internal" },
];

const formSchema = z.object({
  paper: z.string(),
});

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default function Page({ searchParams }: paramsProps) {
  const teacherId = Cookies.get("teacherId");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paper: "",
    },
  });

  const [papers, setPapers] = useState<any[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPapers() {
      const res = await fetch(
        `http://localhost:3500/paper/teacher/${teacherId}`
      );
      const papersData = await res.json();
      setPapers(papersData);
    }

    fetchPapers();
  }, []);

  const handlePaperChange = (value: string) => {
    form.setValue("paper", value);
    setSelectedPaper(value);
  };

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading title={`Internal Marks`} description="Manage internal" />
        </div>
        <Separator />
        <div className="pl-7 pr-7">
          <Form {...form}>
            <form className="mt-9 w-full">
              <div>
                <FormField
                  control={form.control}
                  name="paper"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select the paper</FormLabel>
                      <Select
                        onValueChange={handlePaperChange}
                        value={form.getValues("paper")}
                        defaultValue={form.getValues("paper")}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              defaultValue={form.getValues("paper")}
                              placeholder="Select a paper"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {papers.map((paper) => (
                            <SelectItem key={paper._id} value={paper._id}>
                              {paper.paper}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              <Link
                href={`/teacher/dashboard/internal/${selectedPaper}`}
                className="mt-5"
              >
                <Button variant="secondary" className="mt-6 w-full">
                  Fetch
                </Button>
              </Link>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
