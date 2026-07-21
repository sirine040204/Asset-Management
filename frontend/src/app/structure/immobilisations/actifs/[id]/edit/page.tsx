'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiClient } from '@/lib/api';
import { DynamicFormEngine } from '@/components/features/immobilisations/DynamicFormEngine';

export default function EditActifPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [actif, setActif] = useState<any>(null);
  const [family, setFamily] = useState<any>(null);
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await ApiClient.getImmobilisation(params.id);
        setActif(data);
        if (data.family) {
          const famData = await ApiClient.getFamily(data.family);
          setFamily(famData);
        }
      } catch (error) {
        console.error("Failed to load actif", error);
      }
    }
    fetchData();
  }, [params.id]);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    setServerErrors({});
    
    // Merge base fields and dynamic attributes
    const payload = {
      ...actif,
      attribute_values: data
    };

    try {
      await ApiClient.updateImmobilisation(params.id, payload);
      router.push('/structure/immobilisations/actifs');
    } catch (error: any) {
      if (error.errors) {
        setServerErrors(error.errors);
      } else {
        alert(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!actif || !family) return <div className="p-8">Chargement...</div>;

  // Filter out archived attributes to not render them as inputs, 
  // but if they exist in defaultValues they might just not be shown.
  const activeAttributes = family.attributes.filter((a: any) => a.status === 'ACTIVE');

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-serif font-bold mb-8">Modifier Actif: {actif.code}</h1>
      
      <div className="bg-white p-8 border border-gray-200">
        <DynamicFormEngine 
          attributes={activeAttributes}
          defaultValues={actif.attribute_values}
          serverErrors={serverErrors}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
