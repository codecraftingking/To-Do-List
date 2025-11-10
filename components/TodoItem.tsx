import React, { useState, useEffect, useRef } from 'react';
import { Todo } from '../types';
import { TrashIcon, ChevronDownIcon } from './Icons';
import CategoryEditor from './CategoryEditor';

interface TodoItemProps {
  todo: Todo;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onEditTodo: (id: string, text: string) => void;
  onUpdateCategory: (id: string, category: string) => void;
}

const categoryColors: { [key: string]: string } = {
  work: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  personal: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  shopping: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  health: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  finance: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
  home: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
  social: 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300',
  default: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300',
};

const getCategoryColor = (category: string) => {
    const lowerCategory = category.toLowerCase();
    return categoryColors[lowerCategory] || categoryColors.default;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggleTodo, onDeleteTodo, onEditTodo, onUpdateCategory }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [isAnimatingCompletion, setIsAnimatingCompletion] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const prevCompletedRef = useRef(todo.completed);


  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsEditingCategory(false);
      }
    };
    if (isEditingCategory) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditingCategory]);

  useEffect(() => {
    if (todo.completed && !prevCompletedRef.current) {
      setIsAnimatingCompletion(true);
      const timer = setTimeout(() => setIsAnimatingCompletion(false), 500); // Animation duration
      return () => clearTimeout(timer);
    }
    prevCompletedRef.current = todo.completed;
  }, [todo.completed]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editText.trim()) {
      onEditTodo(todo.id, editText.trim());
    } else {
      setEditText(todo.text); // revert if empty
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  const handleUpdateCategory = (newCategory: string) => {
    onUpdateCategory(todo.id, newCategory);
    setIsEditingCategory(false);
  };

  return (
    <li className="flex items-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg animate-fade-in group transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-700/50 ring-1 ring-slate-200 dark:ring-slate-700/50">
      <input
        type="checkbox"
        id={`todo-${todo.id}`}
        checked={todo.completed}
        onChange={() => onToggleTodo(todo.id)}
        className={`h-5 w-5 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 cursor-pointer bg-white dark:bg-slate-800 checked:bg-indigo-600 ${isAnimatingCompletion ? 'animate-checkmark-pop' : ''}`}
      />
      <div className="ml-4 flex-grow" onDoubleClick={handleDoubleClick}>
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent p-0 border-0 focus:ring-0 text-slate-700 dark:text-slate-300"
          />
        ) : (
          <label htmlFor={`todo-${todo.id}`} className={`cursor-pointer transition-colors duration-300 ${todo.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-300'}`}>
            {todo.text}
          </label>
        )}
      </div>
      <div className="flex items-center gap-2 ml-4">
        {todo.isCategorizing ? (
          <div className="w-4 h-4 border-2 border-slate-300 border-t-transparent rounded-full animate-spin"></div>
        ) : todo.category && (
          <div className="relative" ref={categoryRef}>
            <button
              onClick={() => setIsEditingCategory(!isEditingCategory)}
              className={`flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${getCategoryColor(todo.category)} transition-transform hover:scale-105`}
            >
              <span>{todo.category}</span>
              <ChevronDownIcon className="h-3 w-3" />
            </button>
            {isEditingCategory && (
              <CategoryEditor
                taskText={todo.text}
                currentCategory={todo.category}
                onSave={handleUpdateCategory}
                onClose={() => setIsEditingCategory(false)}
              />
            )}
          </div>
        )}
        <button
          onClick={() => onDeleteTodo(todo.id)}
          className="p-2 text-slate-400 dark:text-slate-500 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-500 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
          aria-label={`Delete task: ${todo.text}`}
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </li>
  );
};

export default TodoItem;