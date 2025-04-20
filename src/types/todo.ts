export type TodoFilter = "all" | "active" | "completed";

export interface Todo {
  id: string;
  content: string;
  completed: boolean;
  createdAt: Date;
  order: number;
}

export interface TodoStore {
  getTodos(): Todo[];
  getFilteredTodos(): Todo[];
  addTodo(content: string): void;
  toggleTodo(id: string): void;
  deleteTodo(id: string): void;
  setFilter(filter: TodoFilter): void;
  reorderTodos(sourceId: string, targetId: string): void;
  subscribe(listener: () => void): () => void;
}
