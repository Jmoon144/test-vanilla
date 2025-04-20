export type TodoFilter = "all" | "active" | "completed";

export interface Todo {
  id: string;
  content: string;
  completed: boolean;
  createdAt: Date;
  order: number;
}
