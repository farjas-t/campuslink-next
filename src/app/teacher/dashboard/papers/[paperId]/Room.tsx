"use client";

import { ReactNode } from "react";
import { RoomProvider } from "../../../../../../liveblocks.config";
import { ClientSideSuspense } from "@liveblocks/react";

export function Room({
  params,
  children,
}: {
  params: { paperId: string };
  children: ReactNode;
}) {
  const paperid = params.paperId;
  return (
    <RoomProvider id={paperid} initialPresence={{}}>
      <ClientSideSuspense fallback={<div>Loading…</div>}>
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
}
