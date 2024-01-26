"use client";
import BreadCrumb from "@/components/breadcrumb";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard/" },
  { title: "Departments", link: "/admin/dashboard/department" },
  { title: "Edit", link: "/admin/dashboard/department/edit/" },
];

export default function CreateDept({ params }: { params: { deptId: string } }) {
  const deptid = params.deptId;
  const router = useRouter();
  const { toast } = useToast();
  const formSchema = z.object({
    deptname: z.string(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deptname: "",
    },
  });

  useEffect(() => {
    const fetchDeptDetails = async () => {
      try {
        const detailsres = await fetch(
          `http://localhost:3500/department/${deptid}`,
          {
            method: "GET",
          }
        );

        if (detailsres.ok) {
          const deptDetails = await detailsres.json();

          // Update the form with the fetched username
          form.setValue("deptname", deptDetails.deptname);
        } else {
          console.error("Failed to fetch department details");
        }
      } catch (error) {
        console.error("Error during department details fetch", error);
      }
    };

    // Call the fetch function when the component mounts
    fetchDeptDetails();
  }, [form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch(
        `http://localhost:3500/department/${deptid}`,
        {
          method: "PATCH",
          body: JSON.stringify(values),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      if (response.ok) {
        toast({
          description: "Department edited successfully.",
        });
        setTimeout(() => {
          router.push("/admin/dashboard/department/");
        }, 2000);
      } else {
        toast({
          variant: "destructive",
          description: "Failed to edit department.",
        });
        console.error("Department editing failed");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Error during department edit.",
      });
      console.error("Error during department edit", error);
    }
  }

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <div className="p-4 lg:p-8 h-full flex items-start">
          <div className="mx-left flex w-full flex-col justify-start space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-left">
              <h1 className="text-2xl font-semibold tracking-tight">
                Edit Department
              </h1>
              <p className="text-sm text-muted-foreground">
                Edit department details
              </p>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2 w-full"
              >
                <FormField
                  control={form.control}
                  name="deptname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="enter department name"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <br />
                <Button type="submit" className="ml-auto w-full">
                  Save
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
