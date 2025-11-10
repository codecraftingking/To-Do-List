
import React from 'react';
import { PlusCircleIcon } from './Icons';

interface SuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  suggestions: string[];
  onAddSuggestion: (suggestion: string) => void;
}

const SuggestionsModal: React.FC<SuggestionsModalProps> = ({ isOpen, onClose, suggestions, onAddSuggestion }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-md animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Task Suggestions</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Here are a few ideas from Gemini to get you going.</p>
        </div>
        
        <ul className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-md group">
              <span className="text-slate-700 dark:text-slate-300">{suggestion}</span>
              <button
                onClick={() => onAddSuggestion(suggestion)}
                className="p-2 text-indigo-500 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:text-indigo-600 transition-colors"
                title="Add to my list"
              >
                <PlusCircleIcon className="h-6 w-6" />
              </button>
            </li>
          ))}
        </ul>
        
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-b-lg text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuggestionsModal;
