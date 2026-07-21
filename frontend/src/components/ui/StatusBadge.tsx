import React from "react";

export type StatusType = "EN RETARD" | "EN COURS" | "PLANIFIÉ" | "TERMINÉ";

interface StatusBadgeProps {
  status: StatusType;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  let bgColor = "bg-gray-100";
  let textColor = "text-gray-600";

  switch (status) {
    case "EN RETARD":
      bgColor = "bg-red-100";
      textColor = "text-red-700";
      break;
    case "EN COURS":
      bgColor = "bg-blue-100";
      textColor = "text-blue-700";
      break;
    case "PLANIFIÉ":
      bgColor = "bg-gray-200";
      textColor = "text-gray-700";
      break;
    case "TERMINÉ":
      bgColor = "bg-emerald-100";
      textColor = "text-emerald-700";
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${bgColor} ${textColor}`}
    >
      {status}
    </span>
  );
}
