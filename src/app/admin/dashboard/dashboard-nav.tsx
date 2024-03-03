"use client";
import Cookies from "js-cookie";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";

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
    title: "Time Table",
    href: "/admin/dashboard/timetable",
    icon: "timetable",
    label: "timetable",
  },
  {
    title: "To Do",
    href: "/admin/dashboard/todo",
    icon: "kanban",
    label: "todo",
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

interface DashboardNavProps {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

export function DashboardNav({ items, setOpen }: DashboardNavProps) {
  const path = usePathname();

  if (!items?.length) {
    return null;
  }

  return (
    <nav className="grid items-start gap-2">
      {items.map((item, index) => {
        const Icon = Icons[item.icon || "arrowRight"];
        return (
          item.href && (
            <Link
              key={index}
              href={item.disabled ? "/" : item.href}
              onClick={() => {
                if (setOpen) setOpen(false);
                console.log("Clicked item:", item);
                if (item.label === "login") {
                  console.log("Removing 'adminId' cookie");
                  Cookies.remove("adminId");
                }
              }}
            >
              <span
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  path === item.href ? "bg-accent" : "transparent",
                  item.disabled && "cursor-not-allowed opacity-80"
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </span>
            </Link>
          )
        );
      })}
    </nav>
  );
}
