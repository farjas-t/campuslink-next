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
  const [adminName, setadminName] = useState<string | null>(null);
  const [adminUname, setadminUname] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        // Replace this with your logic to fetch the adminId
        const adminId = Cookies.get("adminId");

        const detailsres = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/${adminId}`,
          {
            method: "GET",
          }
        );
        if (detailsres.ok) {
          const adminDetails = await detailsres.json();
          setadminUname(adminDetails.username);
          setadminName(adminDetails.name);
        } else {
          console.error("Failed to fetch admin details");
        }
      } catch (error) {
        console.error("Error during admin details fetch", error);
      }
    };
    fetchAdminDetails();
  }, []);

  const handleLogout = () => {
    Cookies.remove("adminId");
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" />
            <AvatarFallback> {adminName?.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{adminName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              username : {adminUname}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push("/admin/dashboard/profile")}
        >
          Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
