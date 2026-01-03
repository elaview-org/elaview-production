// PriorityAlert.tsx
import React from 'react';

interface PriorityAlertProps {
  priority: {
    level: 'urgent' | 'warning' | 'action';
    title: string;
    message: string;
    action: string;
    sectionId: string;
  } | null;
}

export function PriorityAlert({ priority }: PriorityAlertProps) {
  if (!priority) return null;

  const handleScrollToSection = () => {
    const element = document.getElementById(priority.sectionId);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className={`rounded-lg border-2 p-5 shadow-lg ${
      priority.level === 'urgent'
        ? 'bg-red-500/10 border-red-500/50'
        : priority.level === 'warning'
        ? 'bg-amber-500/10 border-amber-500/50'
        : 'bg-blue-500/10 border-blue-500/50'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className={`text-xl font-bold ${
            priority.level === 'urgent' ? 'text-red-400' :
            priority.level === 'warning' ? 'text-amber-400' : 'text-blue-400'
          }`}>
            {priority.title}
          </h3>
          <p className={`text-sm mt-1.5 ${
            priority.level === 'urgent' ? 'text-red-300' :
            priority.level === 'warning' ? 'text-amber-300' : 'text-blue-300'
          }`}>
            {priority.message}
          </p>
        </div>
        <button
          onClick={handleScrollToSection}
          className={`ml-4 px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 whitespace-nowrap ${
            priority.level === 'urgent'
              ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20'
              : priority.level === 'warning'
              ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-500/20'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20'
          }`}
        >
          {priority.action}
        </button>
      </div>
    </div>
  );
}
