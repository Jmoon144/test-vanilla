import { TodoStoreMock } from "../__mock__/MockTodoStore";

describe("TodoStore", () => {
  let store: TodoStoreMock;

  beforeEach(() => {
    localStorage.clear();
    store = new TodoStoreMock();
  });

  it("완료된 할 일을 모두 제거할 수 있다", () => {
    store.addTodo("삭제될 할 일");
    store.addTodo("남을 할 일");

    const afterAdd = store.getTodos();

    const deleteTarget = afterAdd.find((t) => t.content === "삭제될 할 일")!.id;
    store.toggleTodo(deleteTarget);

    store.clearCompleted();

    const remaining = store.getTodos();

    expect(remaining).toHaveLength(1);
    expect(remaining[0].content).toBe("남을 할 일");
  });

  it("필터링 기능이 정상 동작한다", () => {
    store.addTodo("Task A");
    store.addTodo("Task B");

    const afterAdd = store.getTodos();
    const taskAId = afterAdd.find((t) => t.content === "Task A")!.id;
    const taskBId = afterAdd.find((t) => t.content === "Task B")!.id;

    store.toggleTodo(taskAId);

    store.setFilter("active");
    const active = store.getFilteredTodos();
    expect(active.map((t) => t.id)).toEqual([taskBId]);

    store.setFilter("completed");
    const completed = store.getFilteredTodos();
    expect(completed.map((t) => t.id)).toEqual([taskAId]);

    store.setFilter("all");
    expect(store.getFilteredTodos()).toHaveLength(2);
  });
});
