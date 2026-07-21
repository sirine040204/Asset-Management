import React from 'react';
import Link from 'next/link';
import { Plus, Search, Filter } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';

// Mock data for the MVP
const families = [
  { id: '1', code: 'INF-01', name: 'Matériel Informatique', attrCount: 5, status: 'ACTIVE', created: '12 Mai 2026' },
  { id: '2', code: 'TRP-01', name: 'Matériel Roulant', attrCount: 8, status: 'ACTIVE', created: '10 Mai 2026' },
  { id: '3', code: 'MBL-01', name: 'Mobilier de Bureau', attrCount: 3, status: 'ARCHIVED', created: '05 Mai 2026' },
];

export default function FamillesPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div>
        <h2 className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">
          Structure
        </h2>
        <h1 className="text-4xl font-serif italic font-bold text-[#1a1a1a] mb-2">
          Familles d'Immobilisations
        </h1>
        <div className="flex justify-between items-start">
          <p className="text-sm text-gray-500 max-w-2xl">
            Gérez les modèles de données de vos actifs. Définissez les attributs spécifiques requis pour chaque type d'immobilisation.
          </p>
          <div className="flex gap-4">
            <Link 
              href="/structure/immobilisations/familles/create"
              className="bg-[#1a1a1a] text-white px-6 py-2.5 text-sm font-bold hover:bg-black/80 transition-colors flex items-center gap-2"
            >
              <span className="text-lg leading-none">+</span> Nouvelle Famille
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
              placeholder="Rechercher une famille..."
              className="w-full h-9 bg-gray-50 border border-[#e5e5e5] rounded-sm pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#1a1a1a]"
            />
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 border border-[#e5e5e5] rounded-sm text-sm font-medium hover:bg-gray-50">
            <Filter className="h-4 w-4 text-gray-500" />
            Filtrer
          </button>
        </div>

        {/* Data Table */}
        <div className="w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e5e5e5] bg-gray-50/50">
                <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-gray-400">Code</th>
                <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-gray-400">Nom de la famille</th>
                <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-gray-400">Attributs DYN.</th>
                <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-gray-400">Date de création</th>
                <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-gray-400">Statut</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {families.map((family) => (
                <tr key={family.id} className="border-b border-[#e5e5e5] hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-[11px] font-mono text-gray-500">{family.code}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-[#1a1a1a]">{family.name}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{family.attrCount} champs</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{family.created}</td>
                  <td className="px-6 py-4">
                    {/* Reusing StatusBadge but with mapped statuses for MVP */}
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        family.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {family.status === 'ACTIVE' ? 'ACTIF' : 'ARCHIVÉ'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`/structure/immobilisations/familles/${family.id}/edit`}
                      className="text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-[#1a1a1a]"
                    >
                      Modifier
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
