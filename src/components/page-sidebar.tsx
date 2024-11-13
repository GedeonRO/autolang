import React from "react";
import Sidebar from "./app-sidebar";
export default function PageSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="bg-white w-full flex">{children}</main>
    </div>
  );
}
