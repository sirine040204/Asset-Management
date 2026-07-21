import React from "react";

interface SidebarNavSectionProps {
  title: string;
  children: React.ReactNode;
}

export function SidebarNavSection({
  title,
  children,
}: SidebarNavSectionProps) {
  return (
    <div className="mb-6">
      <h3 className="px-6 text-[10px] font-bold text-[#8a8a8a] tracking-[0.15em] uppercase mb-2">
        {title}
      </h3>
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}
