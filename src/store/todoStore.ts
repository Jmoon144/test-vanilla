import { Todo, TodoFilter } from "../types/todo";

export class TodoStore {
  private todos: Todo[] = [];
  private listeners: (() => void)[] = [];
  private filter: TodoFilter = "all";

  constructor() {
    this.loadTodos();
  }

  private loadTodos() {
    const saved = localStorage.getItem("todos");
    if (saved) {
      this.todos = JSON.parse(saved).map((t: any) => ({
        ...t,
        createdAt: new Date(t.createdAt),
      }));
    }
  }

  private saveTodos() {
    localStorage.setItem("todos", JSON.stringify(this.todos));
  }

  private notifyListeners() {
    this.listeners.forEach((fn) => fn());
  }

  subscribe(fn: () => void) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  getTodos(): Todo[] {
    return [...this.todos];
  }

  getFilteredTodos(): Todo[] {
    switch (this.filter) {
      case "active":
        return this.todos.filter((t) => !t.completed);
      case "completed":
        return this.todos.filter((t) => t.completed);
      default:
        return [...this.todos];
    }
  }

  getFilter(): TodoFilter {
    return this.filter;
  }

  setFilter(filter: TodoFilter) {
    this.filter = filter;
    this.notifyListeners();
  }

  addTodo(content: string) {
    const newTodo: Todo = {
      id: Date.now().toString(),
      content,
      completed: false,
      order: 0,
      createdAt: new Date(),
    };
    this.todos.unshift(newTodo);
    this.todos.forEach((t, i) => (t.order = i));
    this.saveTodos();
    this.notifyListeners();
  }

  toggleTodo(id: string) {
    this.todos = this.todos.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t,
    );
    this.saveTodos();
    this.notifyListeners();
  }

  deleteTodo(id: string) {
    this.todos = this.todos.filter((t) => t.id !== id);
    this.saveTodos();
    this.notifyListeners();
  }

  clearCompleted() {
    this.todos = this.todos.filter((t) => !t.completed);
    this.saveTodos();
    this.notifyListeners();
  }

  reorderTodos(sourceId: string, targetIndex: number) {
    const sourceIndex = this.todos.findIndex((t) => t.id === sourceId);
    if (sourceIndex === -1 || sourceIndex === targetIndex) return;

    const [moved] = this.todos.splice(sourceIndex, 1);
    const adjustedIndex =
      sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;
    this.todos.splice(adjustedIndex, 0, moved);

    this.todos.forEach((t, i) => (t.order = i));
    this.saveTodos();
    this.notifyListeners();
  }

  getRemainingCount(): number {
    return this.todos.filter((t) => !t.completed).length;
  }
}
