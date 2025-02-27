import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { TooltipProvider } from "@/components/ui/tooltip";
export function Layout() {
  return <TooltipProvider>
      <div className="flex w-full">
        <Sidebar />
        <div className="flex-1 flex flex-col h-[100%]">
          <TopBar />
          <main className="flex-1 overflow-auto p-6 ">
            <Outlet />
          </main>
        </div>
      </div>
    </TooltipProvider>;
}