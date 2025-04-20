import { TodoStore } from "./store/todoStore";
import { TodoInput } from "./components/TodoInput";
import { DraggableTodoList } from "./components/DraggableTodoList";
import { TodoFilterButtons } from "./components/TodoFilterButtons";

export class App {
  private store = new TodoStore();
  private el = document.createElement("div");

  constructor() {
    this.el.className = "todo-app";
    this.render();
  }

  private render() {
    this.el.innerHTML = "";
    const container = document.createElement("div");
    container.className = "todo-container";

    container.appendChild(new TodoInput(this.store).render());
    container.appendChild(new DraggableTodoList(this.store).getElement());
    container.appendChild(new TodoFilterButtons(this.store).getElement());

    this.el.appendChild(container);
  }

  mount(target: HTMLElement) {
    target.appendChild(this.el);
  }
}
