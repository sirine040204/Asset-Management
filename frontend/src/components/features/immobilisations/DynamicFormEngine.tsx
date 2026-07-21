import React from 'react';
import { useForm, Controller } from 'react-hook-form';

export type DataType = 'TEXT' | 'TEXTAREA' | 'INTEGER' | 'DECIMAL' | 'DATE' | 'BOOLEAN' | 'EMAIL' | 'PHONE' | 'URL' | 'SELECT' | 'MULTI_SELECT';

export interface AttributeDefinition {
  internal_code: string;
  label: string;
  data_type: DataType;
  is_required: boolean;
  placeholder?: string;
  help_text?: string;
  options?: Array<{ label: string; value: string }>;
}

interface DynamicFormEngineProps {
  attributes: AttributeDefinition[];
  defaultValues?: Record<string, any>;
  serverErrors?: Record<string, string[]>;
  onSubmit: (data: Record<string, any>) => void;
  isLoading?: boolean;
}

export function DynamicFormEngine({ attributes, defaultValues = {}, serverErrors = {}, onSubmit, isLoading = false }: DynamicFormEngineProps) {
  const { control, handleSubmit, formState: { errors }, setError } = useForm({
    values: defaultValues
  });

  React.useEffect(() => {
    if (serverErrors) {
      Object.entries(serverErrors).forEach(([key, messages]) => {
        // Map attribute_values.internal_code errors from the backend to the frontend fields
        const fieldName = key.replace('attribute_values.', '');
        setError(fieldName, { type: 'server', message: messages[0] });
      });
    }
  }, [serverErrors, setError]);

  const renderField = (attr: AttributeDefinition, field: any) => {
    const baseClass = "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black";
    
    switch (attr.data_type) {
      case 'TEXTAREA':
        return <textarea {...field} placeholder={attr.placeholder} className={baseClass} rows={3} />;
      case 'BOOLEAN':
        return <input type="checkbox" {...field} checked={field.value} className="h-4 w-4 rounded border-gray-300" />;
      case 'SELECT':
        return (
          <select {...field} className={baseClass}>
            <option value="">Sélectionner une option</option>
            {attr.options?.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        );
      case 'DATE':
        return <input type="date" {...field} className={baseClass} />;
      case 'INTEGER':
      case 'DECIMAL':
        return <input type="number" step={attr.data_type === 'DECIMAL' ? "0.01" : "1"} {...field} placeholder={attr.placeholder} className={baseClass} />;
      default:
        return <input type={attr.data_type.toLowerCase()} {...field} placeholder={attr.placeholder} className={baseClass} />;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {attributes.map(attr => (
          <div key={attr.internal_code} className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              {attr.label}
              {attr.is_required && <span className="text-red-500">*</span>}
            </label>
            
            <Controller
              name={attr.internal_code}
              control={control}
              rules={{ required: attr.is_required ? "Ce champ est obligatoire" : false }}
              render={({ field }) => (
                <div>
                  {renderField(attr, field)}
                  {attr.help_text && <p className="text-xs text-gray-500 mt-1">{attr.help_text}</p>}
                </div>
              )}
            />
            {errors[attr.internal_code] && (
              <p className="text-xs text-red-500">{(errors[attr.internal_code] as any).message}</p>
            )}
          </div>
        ))}
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 disabled:opacity-50"
        >
          {isLoading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
}
