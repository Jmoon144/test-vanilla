import { TodoStore } from "../../store/todoStore";

export class TodoStoreMock extends TodoStore {
  constructor() {
    super(true);
  }

  protected override saveTodos() {}

  protected override loadTodos() {}
}
