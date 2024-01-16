import { DashboardNav } from "@/app/admin/dashboard/dashboard-nav";
import { cn } from "@/lib/utils";

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

export default function Sidebar() {
  return (
    <nav
      className={cn(`relative hidden h-screen border-r pt-16 md:block w-72`)}
    >
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight">
              Menu
            </h2>
            <DashboardNav items={navItems} />
          </div>
        </div>
      </div>
    </nav>
  );
}
