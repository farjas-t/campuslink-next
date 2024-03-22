"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mb-16 items-center justify-center text-center">
      <span className="bg-gradient-to-b from-foreground to-transparent bg-clip-text text-[5rem] font-extrabold leading-none text-transparent">
        Coming Soon
      </span>
      <div className="mt-8 flex justify-center gap-2">
        <Button onClick={() => router.back()} variant="default" size="lg">
          Go back
        </Button>
      </div>
    </div>
  );
}
