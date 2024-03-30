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

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard/" },
  { title: "Departments", link: "/admin/dashboard/department" },
  { title: "Create", link: "/admin/dashboard/departments/new" },
];

const formSchema = z.object({
  deptname: z.string().min(2),
  semcount: z.number(),
});

export default function CreateDept() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deptname: "",
      semcount: 6,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/department/`,
        {
          method: "POST",
          body: JSON.stringify(values),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      if (response.ok) {
        toast({
          description: "Department created successfully.",
        });
        setTimeout(() => {
          router.push("/admin/dashboard/department/");
        }, 2000);
      } else {
        toast({
          variant: "destructive",
          description: "Failed to create department.",
        });
        console.error("Department creation failed");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Error during department creation.",
      });
      console.error("Error during department creation", error);
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
                Create Department
              </h1>
              <p className="text-sm text-muted-foreground">
                Add new department
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
                <FormField
                  control={form.control}
                  name="semcount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>No of Semesters</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="enter the semester count"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <br />
                <Button type="submit" className="ml-auto w-full">
                  Create
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
