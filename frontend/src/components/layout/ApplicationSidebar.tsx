import React from "react";
import { SidebarNavItem } from "./SidebarNavItem";
import { SidebarNavSection } from "./SidebarNavSection";
import {
  LayoutDashboard,
  Box,
  Users,
  Settings,
  Wrench,
  FileText,
  DollarSign,
  AlertTriangle,
  CheckSquare,
  Bell,
  BarChart2,
  Building,
} from "lucide-react";

export function ApplicationSidebar() {
  return (
    <aside className="w-64 bg-[#f4f3ed] h-screen border-r border-[#e5e5e5] flex flex-col fixed left-0 top-0 overflow-y-auto">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#1a1a1a] rounded text-white flex items-center justify-center font-serif text-xl italic font-bold">
            A
          </div>
          <div>
            <h1 className="font-serif italic font-bold text-lg leading-tight">
              Al-Mawarid
            </h1>
            <p className="text-[9px] uppercase tracking-widest text-gray-500 font-sans">
              EAM • TUNISIE
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 pb-8">
        <SidebarNavSection title="Tableau de bord">
          <SidebarNavItem icon={LayoutDashboard} label="Vue d'ensemble" href="/" isActive />
        </SidebarNavSection>

        <SidebarNavSection title="Structure">
          <SidebarNavItem icon={Building} label="Immobilisations" href="/immobilisations" />
          <SidebarNavItem icon={Users} label="Organisation" href="/organisation" />
          <SidebarNavItem icon={Users} label="Utilisateurs" href="/utilisateurs" />
          <SidebarNavItem icon={Settings} label="Paramètres" href="/parametres" />
        </SidebarNavSection>

        <SidebarNavSection title="Traitement">
          <SidebarNavItem icon={Wrench} label="Entretiens" href="/traitement/entretiens" />
          <SidebarNavItem icon={FileText} label="Documents" href="/traitement/documents" />
          <SidebarNavItem icon={DollarSign} label="Coûts" href="/traitement/couts" />
          <SidebarNavItem icon={AlertTriangle} label="Signalements" href="/traitement/signalements" />
        </SidebarNavSection>

        <SidebarNavSection title="Suivi">
          <SidebarNavItem icon={CheckSquare} label="Validations" href="/suivi/validations" />
          <SidebarNavItem icon={Wrench} label="Entretiens" href="/suivi/entretiens" />
          <SidebarNavItem icon={FileText} label="Documents" href="/suivi/documents" />
          <SidebarNavItem icon={Bell} label="Alertes & Échéances" href="/suivi/alertes" />
        </SidebarNavSection>

        <SidebarNavSection title="État">
          <SidebarNavItem icon={Box} label="Immobilisations" href="/etat/immobilisations" />
          <SidebarNavItem icon={Wrench} label="Entretiens" href="/etat/entretiens" />
          <SidebarNavItem icon={FileText} label="Documents" href="/etat/documents" />
          <SidebarNavItem icon={DollarSign} label="Coûts" href="/etat/couts" />
          <SidebarNavItem icon={BarChart2} label="Statistiques" href="/etat/statistiques" />
        </SidebarNavSection>
      </nav>
    </aside>
  );
}
