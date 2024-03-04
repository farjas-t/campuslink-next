import React from "react";
import { Room } from "./Room";

export default function RootLayout({
  params,
  children,
}: {
  params: { paperId: string };
  children: React.ReactNode;
}) {
  return (
    <Room
      params={{
        paperId: `${params.paperId}`,
      }}
    >
      {children}
    </Room>
  );
}
