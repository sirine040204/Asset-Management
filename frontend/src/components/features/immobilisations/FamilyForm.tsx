'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AttributeBuilder } from './AttributeBuilder';
import { AttributeDefinition } from './DynamicFormEngine';

export interface FamilyFormData {
  name: string;
  code: string;
  description: string;
  status: 'ACTIVE' | 'ARCHIVED';
  attributes: AttributeDefinition[];
}

interface FamilyFormProps {
  initialData?: Partial<FamilyFormData>;
  onSubmit: (data: FamilyFormData) => void;
  isLoading?: boolean;
}

export function FamilyForm({ initialData, onSubmit, isLoading = false }: FamilyFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FamilyFormData>({
    defaultValues: {
      name: initialData?.name || '',
      code: initialData?.code || '',
      description: initialData?.description || '',
      status: initialData?.status || 'ACTIVE',
      attributes: initialData?.attributes || [],
    }
  });

  const [attributes, setAttributes] = useState<AttributeDefinition[]>(initialData?.attributes || []);

  const handleFormSubmit = (data: Omit<FamilyFormData, 'attributes'>) => {
    onSubmit({
      ...data,
      attributes,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* Base Information */}
      <div className="bg-white border border-[#e5e5e5] rounded-none p-6">
        <h2 className="text-xl font-serif italic font-bold text-[#1a1a1a] mb-6">Informations Générales</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Nom de la famille <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              {...register('name', { required: 'Le nom est obligatoire' })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-black focus:border-black"
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Code
            </label>
            <input 
              type="text" 
              {...register('code')}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-black focus:border-black"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea 
              {...register('description')}
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-black focus:border-black"
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Statut
            </label>
            <select 
              {...register('status')}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-black focus:border-black"
            >
              <option value="ACTIVE">Actif</option>
              <option value="ARCHIVED">Archivé</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dynamic Attributes Builder */}
      <AttributeBuilder 
        attributes={attributes} 
        onChange={setAttributes} 
      />

      <div className="flex justify-end pt-4 border-t border-[#e5e5e5]">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-[#1a1a1a] text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-black/80 disabled:opacity-50 transition-colors"
        >
          {isLoading ? 'ENREGISTREMENT...' : 'ENREGISTRER LA FAMILLE'}
        </button>
      </div>
    </form>
  );
}
