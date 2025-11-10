import React from 'react';
import { FilterStatus } from '../types';
import { ClipboardIcon } from './Icons';

interface EmptyStateProps {
    hasTasks: boolean;
    currentFilter: FilterStatus;
}

const EmptyState: React.FC<EmptyStateProps> = ({ hasTasks, currentFilter }) => {
    const message = hasTasks
        ? `No ${currentFilter} tasks found.`
        : "Your to-do list is empty!";
    
    const subMessage = hasTasks
        ? "Try selecting a different filter."
        : "Add a new task above to get started.";

    return (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400 animate-fade-in">
            <ClipboardIcon className="mx-auto h-16 w-16 text-slate-300 dark:text-slate-600" />
            <p className="mt-4 text-lg font-semibold">{message}</p>
            <p className="mt-1 text-sm">{subMessage}</p>
        </div>
    );
};

export default EmptyState;
