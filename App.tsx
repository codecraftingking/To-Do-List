import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Todo, FilterStatus } from './types';
import { getSuggestions, getCategoryForTask } from './services/geminiService';
import Header from './components/Header';
import AddTodoForm from './components/AddTodoForm';
import TodoList from './components/TodoList';
import SuggestionsModal from './components/SuggestionsModal';
import { SparklesIcon, XCircleIcon, TrashIcon } from './components/Icons';
import FilterControls from './components/FilterControls';

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme');
      return (storedTheme === 'dark' || storedTheme === 'light') ? storedTheme : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    try {
      const storedTodos = localStorage.getItem('todos');
      if (storedTodos) {
        setTodos(JSON.parse(storedTodos));
      }
    } catch (e) {
      console.error("Failed to load todos from localStorage", e);
      setError("Could not load your saved tasks.");
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('todos', JSON.stringify(todos));
    } catch (e) {
      console.error("Failed to save todos to localStorage", e);
      setError("Could not save your tasks.");
    }
  }, [todos]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleAddTodo = async (text: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      isCategorizing: true,
    };
    setTodos(prevTodos => [newTodo, ...prevTodos]);

    try {
      const category = await getCategoryForTask(text);
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === newTodo.id ? { ...todo, category, isCategorizing: false } : todo
        )
      );
    } catch (err) {
      console.error("Failed to get category", err);
      // Still update the categorizing flag to false on error
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === newTodo.id ? { ...todo, isCategorizing: false } : todo
        )
      );
    }
  };

  const handleToggleTodo = (id: string) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };
  
  const handleEditTodo = (id: string, text: string) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, text } : todo
      )
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };
  
  const handleClearCompleted = () => {
    setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
  }

  const handleUpdateCategory = (id: string, category: string) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, category: category.trim() || 'General' } : todo
      )
    );
  };

  const handleGetSuggestions = useCallback(async () => {
    setIsLoadingSuggestions(true);
    setError(null);
    try {
      const suggestedTasks = await getSuggestions(todos);
      setSuggestions(suggestedTasks);
    } catch (err) {
      setError('Failed to get suggestions. Please check your API key and try again.');
      console.error(err);
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, [todos]);

  const addSuggestionToTodos = (suggestion: string) => {
    if (!todos.some(todo => todo.text.toLowerCase() === suggestion.toLowerCase())) {
        handleAddTodo(suggestion);
    }
    setSuggestions(prev => prev.filter(s => s !== suggestion));
  };

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    });
  }, [todos, filter]);

  const completedCount = useMemo(() => todos.filter(t => t.completed).length, [todos]);

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        <Header theme={theme} onThemeToggle={() => setTheme(theme === 'light' ? 'dark' : 'light')} />

        <main className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl shadow-2xl rounded-lg mt-8 animate-fade-in ring-1 ring-slate-200 dark:ring-slate-700">
          <div className="p-6">
            <AddTodoForm onAddTodo={handleAddTodo} />
            <div className="mt-6 flex justify-between items-center gap-4">
              <FilterControls currentFilter={filter} onFilterChange={setFilter} />
              {completedCount > 0 && (
                <button 
                  onClick={handleClearCompleted}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md transition-all duration-200"
                  title="Clear all completed tasks"
                >
                  <TrashIcon className="h-4 w-4" />
                  <span>Clear Completed</span>
                </button>
              )}
            </div>
            {error && (
                <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/50 border border-red-400 text-red-700 dark:text-red-300 rounded-md flex items-center gap-3 animate-fade-in">
                    <XCircleIcon className="h-5 w-5 text-red-500"/>
                    <span>{error}</span>
                </div>
            )}
            <TodoList
              todos={filteredTodos}
              totalTodos={todos.length}
              filter={filter}
              onToggleTodo={handleToggleTodo}
              onDeleteTodo={handleDeleteTodo}
              onEditTodo={handleEditTodo}
              onUpdateCategory={handleUpdateCategory}
            />
          </div>
          <div className="border-t border-slate-200 dark:border-slate-700 p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-b-lg">
             <button
                onClick={handleGetSuggestions}
                disabled={isLoadingSuggestions}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoadingSuggestions ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Thinking...</span>
                  </>
                ) : (
                  <>
                    <SparklesIcon className="h-5 w-5" />
                    <span>Suggest Tasks with Gemini</span>
                  </>
                )}
              </button>
          </div>
        </main>
      </div>
      
      <SuggestionsModal 
        isOpen={suggestions.length > 0}
        onClose={() => setSuggestions([])}
        suggestions={suggestions}
        onAddSuggestion={addSuggestionToTodos}
      />
    </div>
  );
};

export default App;