import React from "react";

interface CostCategory {
  label: string;
  percentage: number;
}

const categories: CostCategory[] = [
  { label: "Main d'œuvre", percentage: 42 },
  { label: "Pièces de rechange", percentage: 35 },
  { label: "Consommables", percentage: 15 },
  { label: "Sous-traitance", percentage: 8 },
];

export function CostBreakdownChart() {
  return (
    <div className="bg-white p-6 border border-[#e5e5e5] rounded-none mb-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-serif italic font-bold text-[#1a1a1a]">
            Répartition des coûts
          </h2>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-1">
            TOTAL ENGAGÉ - 84.2K TND
          </p>
        </div>
        <div className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">
          MAI 2026
        </div>
      </div>

      <div className="flex flex-col gap-6 mt-8">
        {categories.map((category, index) => (
          <div key={index} className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider text-[#1a1a1a]">
              <span>{category.label}</span>
              <span className="text-gray-400">{category.percentage}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1a1a1a] rounded-full"
                style={{ width: `${category.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
