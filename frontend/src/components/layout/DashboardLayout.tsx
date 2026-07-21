import React from "react";
import { ApplicationSidebar } from "./ApplicationSidebar";
import { ApplicationTopbar } from "./ApplicationTopbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#f9f8f4] text-[#1a1a1a] font-sans">
      <ApplicationSidebar />
      
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <ApplicationTopbar />
        
        <main className="flex-1 p-8 pb-20">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
