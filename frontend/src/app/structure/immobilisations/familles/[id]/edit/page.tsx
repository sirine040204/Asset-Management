'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiClient } from '@/lib/api';
import { AttributeBuilder } from '@/components/features/immobilisations/AttributeBuilder';

export default function EditFamilyPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [family, setFamily] = useState<any>(null);
  const [attributes, setAttributes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await ApiClient.getFamily(params.id);
        setFamily(data);
        setAttributes(data.attributes.filter((a: any) => a.status === 'ACTIVE'));
      } catch (error) {
        console.error("Failed to load family", error);
      }
    }
    fetchData();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await ApiClient.updateFamily(params.id, {
        ...family,
        attributes
      });
      router.push('/structure/immobilisations/familles');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!family) return <div className="p-8">Chargement...</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-serif font-bold mb-8">Modifier Famille: {family.name}</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-6 border border-gray-200 space-y-4">
          <h2 className="text-lg font-bold">Informations de base</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Nom de la famille</label>
            <input 
              type="text" 
              value={family.name}
              onChange={e => setFamily({...family, name: e.target.value})}
              className="w-full border p-2 rounded-sm"
            />
          </div>
        </div>

        <div className="bg-white p-6 border border-gray-200">
          <h2 className="text-lg font-bold mb-4">Attributs de la famille</h2>
          <AttributeBuilder attributes={attributes} onChange={setAttributes} />
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={isLoading} className="bg-black text-white px-6 py-2 rounded-sm">
            Enregistrer les modifications
          </button>
        </div>
      </form>
    </div>
  );
}
