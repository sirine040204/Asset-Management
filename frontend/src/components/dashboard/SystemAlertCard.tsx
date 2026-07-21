import React from "react";

export function SystemAlertCard() {
  return (
    <div className="bg-[#1a1a1a] text-white p-6 border border-[#1a1a1a] rounded-none">
      <h3 className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-4">
        Alerte Systémique
      </h3>
      
      <p className="text-sm font-bold leading-relaxed mb-6 pr-4">
        Stock de lubrifiant haute-viscosité sous le seuil critique (12 L).
      </p>
      
      <button className="w-full bg-white text-[#1a1a1a] text-[10px] font-bold uppercase tracking-widest py-3 hover:bg-gray-100 transition-colors">
        Commander Maintenant
      </button>
    </div>
  );
}
