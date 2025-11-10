import React from 'react';
import { FilterStatus } from '../types';

interface FilterControlsProps {
  currentFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
}

const FILTERS: { label: string; value: FilterStatus }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
];

const FilterControls: React.FC<FilterControlsProps> = ({ currentFilter, onFilterChange }) => {
  return (
    <div className="flex-shrink-0 flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
      {FILTERS.map(({ label, value }) => {
        const isActive = currentFilter === value;
        return (
          <button
            key={value}
            onClick={() => onFilterChange(value)}
            className={`w-full px-3 py-1.5 text-sm font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-700 focus:ring-indigo-500 ${
              isActive
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-900/40'
            }`}
            aria-pressed={isActive}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default FilterControls;
