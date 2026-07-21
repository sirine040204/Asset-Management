import React from 'react';
import Link from 'next/link';
import { Search, Filter, ShieldCheck, Wrench, AlertCircle, Archive } from 'lucide-react';

// Mock data reflecting the new EnterpriseBaseModel structure
const actifs = [
  { id: '1', code: 'IT-001', name: 'MacBook Pro M2 - Dev Team', family: 'Matériel Informatique', status: 'ACTIVE', purchase_date: '2026-05-10', responsible: 'Alice Martin' },
  { id: '2', code: 'IT-002', name: 'Serveur Dell PowerEdge', family: 'Matériel Informatique', status: 'EN_MAINTENANCE', purchase_date: '2025-11-20', responsible: 'IT Dept' },
  { id: '3', code: 'VH-014', name: 'Peugeot 208 Commerciale', family: 'Matériel Roulant', status: 'ACTIVE', purchase_date: '2026-01-15', responsible: 'Marc Dubois' },
  { id: '4', code: 'MOB-102', name: 'Bureau Assis-Debout', family: 'Mobilier de Bureau', status: 'ARCHIVED', purchase_date: '2024-03-01', responsible: '-' },
];

export default function ActifsPage() {
  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'ACTIVE': return { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Disponible', icon: ShieldCheck };
      case 'EN_MAINTENANCE': return { bg: 'bg-amber-100', text: 'text-amber-700', label: 'En Maintenance', icon: Wrench };
      case 'HORS_SERVICE': return { bg: 'bg-red-100', text: 'text-red-700', label: 'Hors Service', icon: AlertCircle };
      case 'ARCHIVED': return { bg: 'bg-gray-200', text: 'text-gray-700', label: 'Réformée', icon: Archive };
      default: return { bg: 'bg-gray-100', text: 'text-gray-600', label: status, icon: ShieldCheck };
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div>
        <h2 className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">
          Gestion Opérationnelle
        </h2>
        <h1 className="text-4xl font-serif italic font-bold text-[#1a1a1a] mb-2">
          Registre des Immobilisations
        </h1>
        <div className="flex justify-between items-start">
          <p className="text-sm text-gray-500 max-w-2xl">
            Gérez votre parc physique. Suivez le statut, l'affectation et les caractéristiques techniques de tous vos actifs.
          </p>
          <div className="flex gap-4">
            <Link 
              href="/structure/immobilisations/actifs/create"
              className="bg-[#1a1a1a] text-white px-6 py-2.5 text-sm font-bold hover:bg-black/80 transition-colors flex items-center gap-2"
            >
              <span className="text-lg leading-none">+</span> Nouvel Actif
            </Link>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-[#e5e5e5] rounded-none">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-[#e5e5e5]">
          <div className="relative w-80">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par code ou nom..."
              className="w-full h-9 bg-gray-50 border border-[#e5e5e5] rounded-sm pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#1a1a1a]"
            />
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 border border-[#e5e5e5] rounded-sm text-sm font-medium hover:bg-gray-50">
            <Filter className="h-4 w-4 text-gray-500" />
            Filtrer par Famille
          </button>
        </div>

        {/* Data Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-[#e5e5e5] bg-gray-50/50">
                <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-gray-400">Code Actif</th>
                <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-gray-400">Désignation</th>
                <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-gray-400">Famille</th>
                <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-gray-400">Responsable</th>
                <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-gray-400">Date Achat</th>
                <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-gray-400">Statut</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {actifs.map((actif) => {
                const status = getStatusConfig(actif.status);
                const StatusIcon = status.icon;
                return (
                  <tr key={actif.id} className="border-b border-[#e5e5e5] hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-[11px] font-mono text-gray-500 font-bold">{actif.code}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-[#1a1a1a]">{actif.name}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{actif.family}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{actif.responsible}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{actif.purchase_date}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider ${status.bg} ${status.text}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/structure/immobilisations/actifs/${actif.id}`}
                        className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a] hover:underline"
                      >
                        Consulter
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
