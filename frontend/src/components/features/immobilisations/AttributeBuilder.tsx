'use client';

import React, { useState } from 'react';
import { AttributeDefinition, DataType } from './DynamicFormEngine';
import { Plus, Trash2, GripVertical, Settings } from 'lucide-react';

interface AttributeBuilderProps {
  attributes: AttributeDefinition[];
  onChange: (attributes: AttributeDefinition[]) => void;
}

export function AttributeBuilder({ attributes, onChange }: AttributeBuilderProps) {
  const [editingAttr, setEditingAttr] = useState<number | null>(null);

  const addAttribute = () => {
    const newAttr: AttributeDefinition = {
      internal_code: `attr_${Date.now()}`, // Temporary local ID
      label: 'Nouvel Attribut',
      data_type: 'TEXT',
      is_required: false,
    };
    onChange([...attributes, newAttr]);
    setEditingAttr(attributes.length); // Open settings for new attr
  };

  const removeAttribute = (index: number) => {
    const newAttrs = [...attributes];
    newAttrs.splice(index, 1);
    onChange(newAttrs);
    if (editingAttr === index) setEditingAttr(null);
  };

  const updateAttribute = (index: number, updates: Partial<AttributeDefinition>) => {
    const newAttrs = [...attributes];
    newAttrs[index] = { ...newAttrs[index], ...updates };
    onChange(newAttrs);
  };

  return (
    <div className="bg-white border border-[#e5e5e5] rounded-none p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-serif italic font-bold text-[#1a1a1a]">Attributs de la Famille</h2>
          <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mt-1">Configurez les champs dynamiques</p>
        </div>
        <button
          type="button"
          onClick={addAttribute}
          className="bg-[#1a1a1a] text-white px-4 py-2 text-xs font-bold tracking-wider hover:bg-black/80 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> AJOUTER UN ATTRIBUT
        </button>
      </div>

      <div className="space-y-4">
        {attributes.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            Aucun attribut configuré. Cliquez sur "Ajouter un attribut" pour commencer.
          </div>
        ) : (
          attributes.map((attr, index) => (
            <div key={attr.internal_code || index} className="border border-[#e5e5e5] rounded-md overflow-hidden">
              {/* Header / Summary row */}
              <div className="flex items-center bg-gray-50/50 p-3">
                <div className="cursor-move text-gray-400 p-2"><GripVertical className="h-4 w-4" /></div>
                
                <div className="flex-1 px-4 flex items-center gap-4">
                  <span className="font-bold text-sm text-[#1a1a1a]">{attr.label || 'Sans nom'}</span>
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">{attr.data_type}</span>
                  {attr.is_required && <span className="text-xs text-red-500 font-medium">Requis</span>}
                </div>
                
                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => setEditingAttr(editingAttr === index ? null : index)}
                    className="p-2 text-gray-500 hover:text-[#1a1a1a]"
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => removeAttribute(index)}
                    className="p-2 text-gray-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Editor details panel */}
              {editingAttr === index && (
                <div className="p-4 border-t border-[#e5e5e5] bg-white grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Label</label>
                    <input 
                      type="text" 
                      value={attr.label}
                      onChange={(e) => updateAttribute(index, { label: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-black focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Type de donnée</label>
                    <select
                      value={attr.data_type}
                      onChange={(e) => updateAttribute(index, { data_type: e.target.value as DataType })}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-black focus:border-black"
                    >
                      <option value="TEXT">Texte court</option>
                      <option value="TEXTAREA">Texte long</option>
                      <option value="INTEGER">Nombre entier</option>
                      <option value="DECIMAL">Nombre décimal</option>
                      <option value="DATE">Date</option>
                      <option value="BOOLEAN">Case à cocher (Oui/Non)</option>
                      <option value="SELECT">Sélection unique</option>
                      <option value="MULTI_SELECT">Sélection multiple</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 md:col-span-2">
                    <input 
                      type="checkbox" 
                      id={`req-${index}`}
                      checked={attr.is_required}
                      onChange={(e) => updateAttribute(index, { is_required: e.target.checked })}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor={`req-${index}`} className="text-sm text-gray-700 font-medium">Ce champ est obligatoire</label>
                  </div>

                  {(attr.data_type === 'SELECT' || attr.data_type === 'MULTI_SELECT') && (
                    <div className="md:col-span-2 pt-2 border-t border-gray-100">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Options configurables</label>
                      <p className="text-xs text-gray-500 mb-2">Dans une implémentation complète, vous pourrez ajouter des options ici.</p>
                      {/* For MVP, options configuration goes here */}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
