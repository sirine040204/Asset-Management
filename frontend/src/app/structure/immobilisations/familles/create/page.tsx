'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FamilyForm, FamilyFormData } from '@/components/features/immobilisations/FamilyForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateFamilyPage() {
  const router = useRouter();

  const handleSubmit = async (data: FamilyFormData) => {
    // In a real implementation, this would be an API call
    console.log('Submitting family data to API:', data);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Redirect back to list
    router.push('/structure/immobilisations/familles');
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      <div>
        <Link 
          href="/structure/immobilisations/familles"
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-[#1a1a1a] transition-colors mb-4"
        >
          <ArrowLeft className="h-3 w-3" /> Retour à la liste
        </Link>
        <h1 className="text-4xl font-serif italic font-bold text-[#1a1a1a] mb-2">
          Nouvelle Famille d'Immobilisation
        </h1>
        <p className="text-sm text-gray-500 max-w-2xl">
          Créez un nouveau modèle d'actif en configurant ses informations générales et ses attributs dynamiques.
        </p>
      </div>

      <FamilyForm onSubmit={handleSubmit} />
    </div>
  );
}
