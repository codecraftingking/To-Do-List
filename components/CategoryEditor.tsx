import React, { useState, useEffect } from 'react';
import { getCategorySuggestions } from '../services/geminiService';

interface CategoryEditorProps {
  taskText: string;
  currentCategory?: string;
  onSave: (category: string) => void;
  onClose: () => void;
}

const CategoryEditor: React.FC<CategoryEditorProps> = ({ taskText, currentCategory, onSave, onClose }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [customCategory, setCustomCategory] = useState(currentCategory || '');

  useEffect(() => {
    const fetchSuggestions = async () => {
      setIsLoading(true);
      const fetchedSuggestions = await getCategorySuggestions(taskText);
      // Ensure current category is an option if not already suggested
      const uniqueSuggestions = new Set([
        ...(currentCategory ? [currentCategory] : []),
        ...fetchedSuggestions
      ]);
      setSuggestions(Array.from(uniqueSuggestions));
      setIsLoading(false);
    };
    fetchSuggestions();
  }, [taskText, currentCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customCategory.trim()) {
      onSave(customCategory.trim());
    }
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20 animate-fade-in p-2">
      <form onSubmit={handleSubmit} className="mb-2">
        <input
          type="text"
          value={customCategory}
          onChange={(e) => setCustomCategory(e.target.value)}
          placeholder="New category..."
          className="w-full px-2 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </form>
      <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1 px-1">Suggestions</div>
      {isLoading ? (
        <div className="flex justify-center items-center p-4">
          <div className="w-5 h-5 border-2 border-slate-300 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="max-h-40 overflow-y-auto">
          {suggestions.length > 0 ? (
            suggestions.map(suggestion => (
              <button
                key={suggestion}
                onClick={() => onSave(suggestion)}
                className="w-full text-left text-sm px-2 py-1.5 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/50 text-slate-700 dark:text-slate-300"
              >
                {suggestion}
              </button>
            ))
          ) : (
            <div className="text-center text-xs text-slate-400 p-2">No suggestions found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryEditor;
