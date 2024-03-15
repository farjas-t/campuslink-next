import ThemeToggle from "@/components/layout/ThemeToggle/theme-toggle";
import { cn } from "@/lib/utils";
import { MobileSidebar } from "./mobile-sidebar";
import { UserNav } from "./user-nav";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <div className="fixed top-0 left-0 right-0 supports-backdrop-blur:bg-background/60 border-b bg-background/95 backdrop-blur z-20">
      <nav className="h-14 flex items-center justify-between px-4">
        <div className="hidden md:flex items-center">
          <Link
            href={"/admin/dashboard/"}
            className="text-xl ml-5 flex items-center font-bold"
          >
            <Image
              src="/Icon_Light.svg"
              alt="Light Icon"
              width={24}
              height={24}
            />
            &nbsp; Campuslink
          </Link>
        </div>

        <div className={cn("block sm:!hidden")}>
          <MobileSidebar />
        </div>

        <div className="flex items-center gap-5 mr-5">
          <ThemeToggle />
          <UserNav />
        </div>
      </nav>
    </div>
  );
}
