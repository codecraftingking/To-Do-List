export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  category?: string;
  isCategorizing?: boolean;
}

export type FilterStatus = 'all' | 'active' | 'completed';
