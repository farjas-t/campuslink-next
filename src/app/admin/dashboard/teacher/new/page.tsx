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
  { title: "Teachers", link: "/admin/dashboard/teacher" },
  { title: "Create", link: "/admin/dashboard/teachers/new" },
];

const formSchema = z.object({
  name: z.string().min(2),
  email: z.string(),
  username: z.string(),
  password: z.string(),
});

export default function CreateDept() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch(`http://localhost:3500/teacher/`, {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      if (response.ok) {
        toast({
          description: "Teacher created successfully.",
        });
        setTimeout(() => {
          router.push("/admin/dashboard/teacher/");
        }, 2000);
      } else {
        toast({
          variant: "destructive",
          description: "Failed to create teacher.",
        });
        console.error("Teacher creation failed");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Error during teacher creation.",
      });
      console.error("Error during teacher creation", error);
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
                Create Teacher
              </h1>
              <p className="text-sm text-muted-foreground">Add new teacher</p>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2 w-full"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teacher Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="enter teacher name"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="enter teacher email"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="enter teacher username"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="enter teacher password"
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
