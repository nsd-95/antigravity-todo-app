export type TodoColor = 'default' | 'red' | 'blue' | 'green' | 'yellow' | 'purple';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  color: TodoColor;
  createdAt: number;
}

export interface Group {
  id: string;
  title: string;
  todos: Todo[];
  createdAt: number;
}
