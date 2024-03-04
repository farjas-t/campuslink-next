"use client";
import Cookies from "js-cookie";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export function UserNav() {
  const router = useRouter();
  const [studentName, setstudentName] = useState<string | null>(null);
  const [studentUname, setstudentUname] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        // Replace this with your logic to fetch the studentId
        const studentId = Cookies.get("studentId");

        const detailsres = await fetch(
          `http://localhost:3500/student/${studentId}`,
          {
            method: "GET",
          }
        );
        if (detailsres.ok) {
          const studentDetails = await detailsres.json();
          setstudentUname(studentDetails.username);
          setstudentName(studentDetails.name);
        } else {
          console.error("Failed to fetch student details");
        }
      } catch (error) {
        console.error("Error during student details fetch", error);
      }
    };
    fetchStudentDetails();
  }, []);

  const handleLogout = () => {
    Cookies.remove("studentId");
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" />
            <AvatarFallback> {studentName?.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{studentName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              username : {studentUname}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push("/student/dashboard/profile")}
        >
          Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
