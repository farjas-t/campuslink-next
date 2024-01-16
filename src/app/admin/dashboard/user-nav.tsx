"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
export function UserNav() {
  const [adminId, setAdminId] = useState<string | null>(null);
  const [adminName, setadminName] = useState<string | null>(null);
  const [adminUname, setadminUname] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        // Replace this with your logic to fetch the adminId
        const fetchedAdminId = "659441246b3303bd58840d3f";
        setAdminId(fetchedAdminId); // Set the adminId in the state

        const detailsres = await fetch(
          `http://localhost:3500/admin/${fetchedAdminId}`,
          {
            method: "GET",
          },
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
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>New Team</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => console.log("signout")}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
