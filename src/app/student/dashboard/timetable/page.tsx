"use client";
import Cookies from "js-cookie";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Page() {
  const studentId = Cookies.get("studentId");
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Time Table</h2>
        </div>
      </div>
    </ScrollArea>
  );
}
