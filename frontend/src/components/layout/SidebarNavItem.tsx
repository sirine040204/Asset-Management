"use client";

import React from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";

interface SidebarNavItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  isActive?: boolean;
}

export function SidebarNavItem({
  icon: Icon,
  label,
  href,
  isActive,
}: SidebarNavItemProps) {
  const pathname = usePathname();
  const active = isActive !== undefined 
    ? isActive 
    : (pathname === href || (href !== '/' && pathname?.startsWith(href)));

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-md transition-colors ${
        active
          ? "bg-[#1a1a1a] text-white font-medium"
          : "text-[#4a4a4a] hover:bg-black/5 hover:text-[#1a1a1a]"
      }`}
    >
      <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 1.5} />
      <span className="text-sm">{label}</span>
    </Link>
  );
}
