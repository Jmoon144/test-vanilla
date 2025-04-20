import { TodoFilter } from "../types/todo";
import { TodoStore } from "../store/todoStore";

export class TodoFilterButtons {
  private el: HTMLElement;
  private store: TodoStore;
  private unsubscribe: () => void;

  constructor(store: TodoStore) {
    this.store = store;
    this.el = document.createElement("div");
    this.el.className = "todo-filter";
    this.unsubscribe = this.store.subscribe(this.update);
    this.render();
  }

  private render() {
    const todos = this.store.getTodos();
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    this.el.innerHTML = `
      <div class="filter-buttons">
        <button class="filter-btn" data-filter="all">All (${total})</button>
        <button class="filter-btn" data-filter="active">Active (${total - completed})</button>
        <button class="filter-btn" data-filter="completed">Completed (${completed})</button>
      </div>
      <button class="clear-completed">Clear Completed (${completed})</button>
    `;
    this.updateActive();
    this.bind();
  }

  private bind() {
    this.el.addEventListener("click", (e) => {
      const btn = (e.target as HTMLElement).closest("button");
      if (!btn) return;
      if (btn.classList.contains("filter-btn")) {
        this.store.setFilter(btn.dataset.filter as TodoFilter);
      }
      if (btn.classList.contains("clear-completed")) {
        this.store.clearCompleted();
      }
    });
  }

  private update = () => {
    const todos = this.store.getTodos();
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;

    const allBtn = this.el.querySelector('[data-filter="all"]');
    const activeBtn = this.el.querySelector('[data-filter="active"]');
    const completedBtn = this.el.querySelector('[data-filter="completed"]');
    const clearBtn = this.el.querySelector(".clear-completed");

    if (allBtn) allBtn.textContent = `All (${total})`;
    if (activeBtn) activeBtn.textContent = `Active (${total - completed})`;
    if (completedBtn) completedBtn.textContent = `Completed (${completed})`;
    if (clearBtn) clearBtn.textContent = `Clear Completed (${completed})`;

    this.updateActive();
  };

  private updateActive() {
    const current = this.store.getFilter();
    this.el.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.classList.toggle(
        "active",
        (btn as HTMLElement).dataset.filter === current
      );
    });
  }

  getElement() {
    return this.el;
  }
}
