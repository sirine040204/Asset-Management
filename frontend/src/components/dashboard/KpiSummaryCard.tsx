import React from "react";

interface KpiSummaryCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: string;
  trendColor?: "green" | "red" | "gray";
}

export function KpiSummaryCard({
  title,
  value,
  subtitle,
  trend,
  trendColor = "gray",
}: KpiSummaryCardProps) {
  return (
    <div className="bg-white p-6 border border-[#e5e5e5] rounded-none flex flex-col justify-between">
      <h3 className="text-[10px] font-bold text-[#8a8a8a] tracking-widest uppercase mb-4">
        {title}
      </h3>
      
      <div>
        <div className="text-4xl font-serif italic font-bold text-[#1a1a1a] mb-2">
          {value}
        </div>
        
        {subtitle && (
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            {subtitle}
          </div>
        )}
        
        {trend && (
          <div
            className={`text-[10px] font-bold uppercase tracking-wider ${
              trendColor === "green"
                ? "text-emerald-500"
                : trendColor === "red"
                ? "text-red-500"
                : "text-gray-500"
            }`}
          >
            {trend}
          </div>
        )}
      </div>
    </div>
  );
}
