import React from "react";
import { Search, Bell, ChevronDown } from "lucide-react";

export function ApplicationTopbar() {
  return (
    <header className="h-16 border-b border-[#e5e5e5] bg-[#f4f3ed] flex items-center justify-between px-8 sticky top-0 z-10 w-full">
      <div className="flex items-center gap-4">
        {/* Company Selector */}
        <div className="flex items-center gap-2 border border-[#e5e5e5] rounded-md px-3 py-1.5 bg-white cursor-pointer hover:bg-gray-50">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold">
              Société Active
            </span>
            <span className="text-sm font-medium">Soc. Chimique Tunisienne</span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-500 ml-2" />
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un actif, OT, document..."
            className="w-80 h-9 bg-white border border-[#e5e5e5] rounded-full pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#1a1a1a]"
          />
        </div>

        {/* Notifications */}
        <button className="relative text-gray-500 hover:text-[#1a1a1a] transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-[#f4f3ed]"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 border-l border-[#e5e5e5] pl-6">
          <div className="flex flex-col items-end text-right">
            <span className="text-sm font-bold text-[#1a1a1a]">Anis Ben Salah</span>
            <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold">
              Administrateur
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center text-sm font-serif italic font-bold">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
