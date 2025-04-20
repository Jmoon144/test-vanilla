import { TodoStore } from "../store/todoStore";

export class TodoInput {
  private el: HTMLInputElement;
  private store: TodoStore;

  constructor(store: TodoStore) {
    this.store = store;
    this.el = document.createElement("input");
    this.el.type = "text";
    this.el.placeholder = "What needs to be done?";
    this.el.className = "todo-input";
    this.el.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && this.el.value.trim()) {
        this.store.addTodo(this.el.value.trim());
        this.el.value = "";
      }
    });
  }

  render() {
    return this.el;
  }
}
