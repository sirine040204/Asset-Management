import React from "react";
import { KpiSummaryCard } from "@/components/dashboard/KpiSummaryCard";
import { RecentInterventionsTable } from "@/components/dashboard/RecentInterventionsTable";
import { CostBreakdownChart } from "@/components/dashboard/CostBreakdownChart";
import { SystemAlertCard } from "@/components/dashboard/SystemAlertCard";

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div>
        <h2 className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">
          Tableau de bord - 12 Mai 2026
        </h2>
        <h1 className="text-4xl font-serif italic font-bold text-[#1a1a1a] mb-2">
          Aperçu opérationnel
        </h1>
        <div className="flex justify-between items-start">
          <p className="text-sm text-gray-500 max-w-2xl">
            Rapport de maintenance consolidé pour le complexe industriel de Sfax. Dernière mise à jour : aujourd'hui, 08:42.
          </p>
          <div className="flex gap-4">
            <button className="bg-white border border-[#e5e5e5] px-6 py-2.5 text-sm font-bold text-[#1a1a1a] hover:bg-gray-50 transition-colors">
              Exporter
            </button>
            <button className="bg-[#1a1a1a] text-white px-6 py-2.5 text-sm font-bold hover:bg-black/80 transition-colors flex items-center gap-2">
              <span className="text-lg leading-none">+</span> Nouvel ordre de travail
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiSummaryCard
          title="Actifs Totaux"
          value="1 248"
          trend="+5 Ce mois"
          trendColor="green"
        />
        <KpiSummaryCard
          title="Ordres Ouverts"
          value="42"
          trend="12 En retard"
          trendColor="red"
        />
        <KpiSummaryCard
          title="Coût Mensuel"
          value="84.2k"
          subtitle="TND"
          trend="8% De budget"
          trendColor="gray"
        />
        <KpiSummaryCard
          title="Disponibilité"
          value="94.2 %"
          trend="Optimal"
          trendColor="gray"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RecentInterventionsTable />
        </div>
        <div>
          <CostBreakdownChart />
          <SystemAlertCard />
        </div>
      </div>
    </div>
  );
}
