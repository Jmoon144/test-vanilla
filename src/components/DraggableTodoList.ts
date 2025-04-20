import DraggableTodoItem from "./DraggableTodoItem";
import { TodoStore } from "../store/todoStore";

export class DraggableTodoList {
  private el: HTMLElement;
  private store: TodoStore;
  private items = new Map<string, DraggableTodoItem>();
  private unsubscribe: () => void;

  constructor(store: TodoStore) {
    this.store = store;
    this.el = document.createElement("div");
    this.el.className = "todo-list";
    this.unsubscribe = this.store.subscribe(this.renderList);
    this.renderList();
  }

  private renderList = () => {
    const todos = this.store.getFilteredTodos();
    const ids = new Set(todos.map((t) => t.id));

    for (const id of this.items.keys()) {
      if (!ids.has(id)) {
        const item = this.items.get(id)!;
        item.getElement().remove();
        this.items.delete(id);
      }
    }

    todos.forEach((todo) => {
      if (!this.items.has(todo.id)) {
        const item = new DraggableTodoItem(todo, this.store);
        this.items.set(todo.id, item);
        this.el.appendChild(item.getElement());
      } else {
        const item = this.items.get(todo.id)!;
        item.update(todo);
      }
    });

    const currentOrder = Array.from(this.el.children)
      .filter((el) => el.classList.contains("todo-item"))
      .map((el) => (el as HTMLElement).dataset.id);
    const desiredOrder = todos.map((t) => t.id);

    if (JSON.stringify(currentOrder) !== JSON.stringify(desiredOrder)) {
      desiredOrder.forEach((id) => {
        const item = this.items.get(id)!;
        this.el.appendChild(item.getElement());
      });
    }
  };

  getElement() {
    return this.el;
  }
}
