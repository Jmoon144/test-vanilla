import { Todo } from "../types/todo";
import { TodoStore } from "../store/todoStore";
import { DragManager } from "../utils/DragManager";

export default class DraggableTodoItem {
  private element: HTMLElement;
  private todo: Todo;
  private store: TodoStore;
  private dragManager: DragManager | null = null;
  private dragHandle: HTMLElement;
  private checkbox: HTMLInputElement;
  private content: HTMLElement;
  private deleteBtn: HTMLButtonElement;

  constructor(todo: Todo, store: TodoStore) {
    this.todo = todo;
    this.store = store;
    this.element = document.createElement("div");
    this.element.className = `todo-item ${todo.completed ? "completed" : ""}`;
    this.element.dataset.id = todo.id;

    this.dragHandle = document.createElement("div");
    this.dragHandle.className = "drag-handle";
    this.dragHandle.innerHTML = "☰";

    this.checkbox = document.createElement("input");
    this.checkbox.type = "checkbox";
    this.checkbox.className = "todo-checkbox";
    this.checkbox.checked = this.todo.completed;

    this.content = document.createElement("span");
    this.content.className = "todo-content";
    this.content.textContent = this.todo.content;

    this.deleteBtn = document.createElement("button");
    this.deleteBtn.className = "delete-btn";
    this.deleteBtn.textContent = "×";

    this.render();
    this.setupEventListeners();
  }

  private render() {
    const contentWrapper = document.createElement("div");
    contentWrapper.className = "todo-content-wrapper";

    contentWrapper.appendChild(this.checkbox);
    contentWrapper.appendChild(this.content);
    contentWrapper.appendChild(this.deleteBtn);

    this.element.innerHTML = "";
    this.element.appendChild(this.dragHandle);
    this.element.appendChild(contentWrapper);
  }

  private setupEventListeners() {
    this.checkbox.addEventListener("change", () =>
      this.store.toggleTodo(this.todo.id)
    );
    this.content.addEventListener("click", () =>
      this.store.toggleTodo(this.todo.id)
    );
    this.deleteBtn.addEventListener("click", () =>
      this.store.deleteTodo(this.todo.id)
    );

    if (!this.todo.completed) {
      this.dragHandle.addEventListener(
        "mousedown",
        this.handleMouseDown.bind(this)
      );
    }
  }

  private handleMouseDown(e: MouseEvent) {
    if (this.todo.completed) return;

    const existingPlaceholders = document.querySelectorAll(
      ".todo-item-placeholder"
    );
    existingPlaceholders.forEach((placeholder) => placeholder.remove());

    if (!this.dragManager) {
      this.dragManager = new DragManager({
        element: this.element,
        onDragStart: () => this.element.classList.add("dragging"),
        onDragEnd: (targetIndex) => {
          if (typeof targetIndex === "number") {
            this.store.reorderTodos(this.todo.id, targetIndex);
          }
          this.element.classList.remove("dragging");
        },
      });
    }

    this.dragManager.startDrag(e);
  }

  update(todo: Todo) {
    const wasCompleted = this.todo.completed;
    this.todo = todo;

    if (wasCompleted !== todo.completed) {
      this.element.className = `todo-item ${todo.completed ? "completed" : ""}`;

      if (wasCompleted && !todo.completed) {
        this.dragHandle.addEventListener(
          "mousedown",
          this.handleMouseDown.bind(this)
        );
      } else if (!wasCompleted && todo.completed) {
        this.dragHandle.removeEventListener(
          "mousedown",
          this.handleMouseDown.bind(this)
        );
      }
    }

    this.element.dataset.id = todo.id;
    this.checkbox.checked = todo.completed;
    this.content.textContent = todo.content;
  }

  getElement(): HTMLElement {
    return this.element;
  }
}
