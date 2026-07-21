'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { DynamicFormEngine, AttributeDefinition } from '@/components/features/immobilisations/DynamicFormEngine';

// Mock families data from API
const families = [
  { 
    id: '1', 
    name: 'Matériel Informatique',
    attributes: [
      { internal_code: 'cpu', label: 'Processeur', data_type: 'TEXT', is_required: true },
      { internal_code: 'ram', label: 'RAM (Go)', data_type: 'INTEGER', is_required: true },
      { internal_code: 'os', label: 'Système d\'exploitation', data_type: 'SELECT', is_required: true, options: [{label: 'Windows', value: 'win'}, {label: 'MacOS', value: 'mac'}] },
    ] as AttributeDefinition[]
  },
  { 
    id: '2', 
    name: 'Matériel Roulant',
    attributes: [
      { internal_code: 'registration', label: 'Immatriculation', data_type: 'TEXT', is_required: true },
      { internal_code: 'mileage', label: 'Kilométrage', data_type: 'INTEGER', is_required: false },
    ] as AttributeDefinition[]
  }
];

export default function CreateActifPage() {
  const [selectedFamilyId, setSelectedFamilyId] = useState<string>('');
  
  const selectedFamily = families.find(f => f.id === selectedFamilyId);

  const handleSubmit = (data: Record<string, any>) => {
    console.log("Submitting Immobilisation with Dynamic Attributes:", data);
    alert("Vérifiez la console pour le payload généré !");
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      <div>
        <Link 
          href="/structure/immobilisations/actifs"
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-[#1a1a1a] transition-colors mb-4"
        >
          <ArrowLeft className="h-3 w-3" /> Retour aux actifs
        </Link>
        <h1 className="text-4xl font-serif italic font-bold text-[#1a1a1a] mb-2">
          Nouvel Actif
        </h1>
        <p className="text-sm text-gray-500 max-w-2xl">
          Déclarez un nouvel actif. Sélectionnez d'abord sa famille pour charger les champs spécifiques.
        </p>
      </div>

      <div className="bg-white border border-[#e5e5e5] rounded-none p-6">
        <div className="max-w-md mb-8">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Famille d'immobilisation <span className="text-red-500">*</span>
          </label>
          <select 
            value={selectedFamilyId}
            onChange={(e) => setSelectedFamilyId(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-black focus:border-black"
          >
            <option value="">-- Sélectionnez une famille --</option>
            {families.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>

        {selectedFamily ? (
          <div className="pt-6 border-t border-[#e5e5e5]">
            <h3 className="text-sm font-bold text-[#1a1a1a] uppercase tracking-wider mb-6">
              Caractéristiques Spécifiques : {selectedFamily.name}
            </h3>
            <DynamicFormEngine 
              attributes={selectedFamily.attributes} 
              onSubmit={handleSubmit} 
            />
          </div>
        ) : (
          <div className="py-12 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded">
            Sélectionnez une famille ci-dessus pour afficher le formulaire de création.
          </div>
        )}
      </div>
    </div>
  );
}
