import React from 'react';
import { Todo, FilterStatus } from '../types';
import TodoItem from './TodoItem';
import EmptyState from './EmptyState';

interface TodoListProps {
  todos: Todo[];
  totalTodos: number;
  filter: FilterStatus;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onEditTodo: (id: string, text: string) => void;
  onUpdateCategory: (id: string, category: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, totalTodos, filter, onToggleTodo, onDeleteTodo, onEditTodo, onUpdateCategory }) => {
  if (todos.length === 0) {
    return (
      <div className="py-8">
        <EmptyState hasTasks={totalTodos > 0} currentFilter={filter}/>
      </div>
    );
  }

  return (
    <ul className="mt-6 space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleTodo={onToggleTodo}
          onDeleteTodo={onDeleteTodo}
          onEditTodo={onEditTodo}
          onUpdateCategory={onUpdateCategory}
        />
      ))}
    </ul>
  );
};

export default TodoList;
