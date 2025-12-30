// src/components/crm/EditableCell.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { api } from "../../../../elaview-mvp/src/trpc/react";
import { Loader2, Check, X } from "lucide-react";
import { toast } from "sonner";

interface Option {
  value: string;
  label: string;
  className?: string;
}

interface EditableCellProps {
  leadId: string;
  field: string;
  value: string | number;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea';
  placeholder?: string;
  options?: Option[];
  onUpdate: () => void;
  className?: string;
}

export function EditableCell({
  leadId,
  field,
  value,
  type,
  placeholder = '',
  options = [],
  onUpdate,
  className = '',
}: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value?.toString() || '');
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(null);

  // Update mutation
  const updateField = api.crm.updateLeadField.useMutation({
    onSuccess: () => {
      setIsSaving(false);
      setIsEditing(false);
      onUpdate();
      toast.success('Updated');
    },
    onError: (error) => {
      setIsSaving(false);
      toast.error(error.message || 'Failed to update');
      setEditValue(value?.toString() || '');
    },
  });

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current instanceof HTMLInputElement || inputRef.current instanceof HTMLTextAreaElement) {
        inputRef.current.select();
      }
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editValue === value?.toString()) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);

    // Convert value based on type
    let finalValue: any = editValue;

    if (type === 'number') {
      finalValue = editValue ? parseInt(editValue, 10) : null;
    } else if (type === 'date') {
      finalValue = editValue ? new Date(editValue) : null;
    } else if (!editValue || editValue.trim() === '') {
      finalValue = null;
    }

    updateField.mutate({
      id: leadId,
      field,
      value: finalValue,
    });
  };

  const handleCancel = () => {
    setEditValue(value?.toString() || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (type === 'textarea') {
      // For textarea, Ctrl/Cmd+Enter to save, Escape to cancel
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSave();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleCancel();
      }
    } else {
      // For other inputs, Enter to save, Escape to cancel
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSave();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleCancel();
      }
    }
  };

  // Display value formatter
  const getDisplayValue = () => {
    if (!value && value !== 0) return placeholder || '—';

    if (type === 'select' && options.length > 0) {
      const option = options.find(opt => opt.value === value);
      return option ? option.label : value;
    }

    if (type === 'date' && value) {
      try {
        return new Date(value).toLocaleDateString();
      } catch {
        return value;
      }
    }

    return value;
  };

  // Get display class
  const getDisplayClass = () => {
    if (type === 'select' && options.length > 0) {
      const option = options.find(opt => opt.value === value);
      return option?.className || '';
    }
    return '';
  };

  // View Mode
  if (!isEditing) {
    return (
      <div
        onClick={() => setIsEditing(true)}
        className={`cursor-pointer px-2 py-1 rounded hover:bg-slate-900/50 transition-colors min-h-[32px] flex items-center ${className} ${getDisplayClass()}`}
      >
        {isSaving ? (
          <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
        ) : (
          <span className={!value && value !== 0 ? 'text-slate-600 italic' : ''}>
            {getDisplayValue()}
          </span>
        )}
      </div>
    );
  }

  // Edit Mode
  const sharedInputClasses = "w-full px-2 py-1 bg-slate-900 border-2 border-purple-500 rounded text-white text-sm focus:outline-none";

  if (type === 'select') {
    return (
      <div className="relative flex items-center gap-1">
        <select
          ref={inputRef as React.RefObject<HTMLSelectElement>}
          value={editValue}
          onChange={(e) => {
            setEditValue(e.target.value);
            // Auto-save on select change
            setTimeout(() => {
              updateField.mutate({
                id: leadId,
                field,
                value: e.target.value || null,
              });
            }, 100);
          }}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          disabled={isSaving}
          className={sharedInputClasses}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {isSaving && <Loader2 className="h-3 w-3 animate-spin text-purple-500" />}
      </div>
    );
  }

  if (type === 'textarea') {
    return (
      <div className="space-y-1">
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSaving}
          placeholder={placeholder}
          rows={3}
          className={sharedInputClasses}
        />
        <div className="flex items-center gap-1">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50"
            title="Save (Ctrl+Enter)"
          >
            <Check className="h-3 w-3" />
          </button>
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="p-1 bg-slate-700 text-white rounded hover:bg-slate-600 disabled:opacity-50"
            title="Cancel (Esc)"
          >
            <X className="h-3 w-3" />
          </button>
          {isSaving && <Loader2 className="h-3 w-3 animate-spin text-purple-500" />}
        </div>
      </div>
    );
  }

  // text, number, date inputs
  return (
    <div className="relative">
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type={type}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        disabled={isSaving}
        placeholder={placeholder}
        className={sharedInputClasses}
      />
      {isSaving && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <Loader2 className="h-3 w-3 animate-spin text-purple-500" />
        </div>
      )}
    </div>
  );
}
