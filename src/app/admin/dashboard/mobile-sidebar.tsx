"use client";
import { DashboardNav } from "@/app/admin/dashboard/dashboard-nav";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { useState } from "react";

import { Icons } from "@/components/icons";

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
}

// import { Playlist } from "../data/playlists";

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: "dashboard",
    label: "Dashboard",
  },
  {
    title: "Departments",
    href: "/admin/dashboard/department",
    icon: "departments",
    label: "department",
  },
  {
    title: "Teachers",
    href: "/admin/dashboard/teacher",
    icon: "teachers",
    label: "teachers",
  },
  {
    title: "Students",
    href: "/admin/dashboard/student",
    icon: "students",
    label: "students",
  },
  {
    title: "Papers",
    href: "/admin/dashboard/papers",
    icon: "papers",
    label: "papers",
  },
  {
    title: "Kanban",
    href: "/admin/dashboard/kanban",
    icon: "kanban",
    label: "kanban",
  },
  {
    title: "Profile",
    href: "/admin/dashboard/profile",
    icon: "profile",
    label: "profile",
  },
  {
    title: "Logout",
    href: "/",
    icon: "logout",
    label: "login",
  },
];

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  // playlists: Playlist[];
}

export function MobileSidebar({ className }: SidebarProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <MenuIcon />
        </SheetTrigger>
        <SheetContent side="left" className="!px-0">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                Menu
              </h2>
              <div className="space-y-1">
                <DashboardNav items={navItems} setOpen={setOpen} />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
