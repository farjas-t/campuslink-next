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
  const [teacherName, setteacherName] = useState<string | null>(null);
  const [teacherUname, setteacherUname] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeacherDetails = async () => {
      try {
        // Replace this with your logic to fetch the teacherId
        const teacherId = Cookies.get("teacherId");

        const detailsres = await fetch(
          `http://localhost:3500/teacher/${teacherId}`,
          {
            method: "GET",
          }
        );
        if (detailsres.ok) {
          const teacherDetails = await detailsres.json();
          setteacherUname(teacherDetails.username);
          setteacherName(teacherDetails.name);
        } else {
          console.error("Failed to fetch teacher details");
        }
      } catch (error) {
        console.error("Error during teacher details fetch", error);
      }
    };
    fetchTeacherDetails();
  }, []);

  const handleLogout = () => {
    Cookies.remove("teacherId");
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" />
            <AvatarFallback> {teacherName?.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{teacherName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              username : {teacherUname}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push("/teacher/dashboard/profile")}
        >
          Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
