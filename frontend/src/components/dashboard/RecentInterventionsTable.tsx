import React from "react";
import { StatusBadge, StatusType } from "../ui/StatusBadge";
import { Maximize2, MoreHorizontal } from "lucide-react";

interface Intervention {
  ref: string;
  description: string;
  subDescription: string;
  status: StatusType;
  technician: string;
}

const interventions: Intervention[] = [
  {
    ref: "#WO-9281",
    description: "Maintenance pompe P-402",
    subDescription: "Sfax — Ligne 3",
    status: "EN RETARD",
    technician: "K. Mansour",
  },
  {
    ref: "#WO-9285",
    description: "Inspection turbine T-12",
    subDescription: "Gabès — Unité D",
    status: "EN COURS",
    technician: "M. Dridi",
  },
  {
    ref: "#WO-9287",
    description: "Calibrage capteurs Zone B",
    subDescription: "Sfax — Zone B",
    status: "PLANIFIÉ",
    technician: "S. Trabelsi",
  },
  {
    ref: "#WO-9276",
    description: "Remplacement filtres HVAC",
    subDescription: "Tunis — Atelier 1",
    status: "TERMINÉ",
    technician: "L. Gharbi",
  },
  {
    ref: "#WO-9291",
    description: "Contrôle réglementaire ISO 9001",
    subDescription: "Bizerte — Doc.",
    status: "PLANIFIÉ",
    technician: "A. Ben Ali",
  },
];

export function RecentInterventionsTable() {
  return (
    <div className="bg-white border border-[#e5e5e5] rounded-none">
      <div className="flex items-center justify-between p-6 pb-4 border-b border-[#e5e5e5]">
        <div>
          <h2 className="text-xl font-serif italic font-bold text-[#1a1a1a]">
            Interventions récentes
          </h2>
          <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold mt-1">
            SEMAINE 20 • 14 ORDRES ACTIFS
          </p>
        </div>
        
        <div className="flex items-center bg-gray-100 p-1 rounded-sm">
          <button className="px-4 py-1.5 text-[10px] font-bold tracking-wider bg-[#1a1a1a] text-white rounded-sm">
            TOUT
          </button>
          <button className="px-4 py-1.5 text-[10px] font-bold tracking-wider text-gray-500 hover:text-[#1a1a1a]">
            EN RETARD
          </button>
          <button className="px-4 py-1.5 text-[10px] font-bold tracking-wider text-gray-500 hover:text-[#1a1a1a]">
            PLANIFIÉ
          </button>
        </div>
      </div>

      <div className="w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#e5e5e5] bg-gray-50/50">
              <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-gray-400">Réf.</th>
              <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-gray-400">Description</th>
              <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-gray-400">Statut</th>
              <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-gray-400">Technicien</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {interventions.map((item, index) => (
              <tr key={index} className="border-b border-[#e5e5e5] hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 text-[11px] font-mono text-gray-400">{item.ref}</td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-[#1a1a1a]">{item.description}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{item.subDescription}</p>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={item.status} />
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.technician}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-gray-400 hover:text-[#1a1a1a]">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 flex items-center justify-center border-t border-[#e5e5e5]">
        <button className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-[#1a1a1a] transition-colors">
          VOIR TOUS LES ORDRES DE TRAVAIL
        </button>
      </div>
    </div>
  );
}
