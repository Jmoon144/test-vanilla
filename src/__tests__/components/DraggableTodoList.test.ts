import { DraggableTodoList } from "../../components/DraggableTodoList";
import { TodoStore } from "../../store/todoStore";

describe("DraggableTodoList", () => {
  let store: TodoStore;

  beforeEach(() => {
    localStorage.clear();
    store = new TodoStore();
  });

  it("할 일이 없을 경우 리스트가 비어 있어야 한다", () => {
    const list = new DraggableTodoList(store);
    const el = list.getElement();
    expect(el.children.length).toBe(0);
  });

  it("할 일이 추가되면 리스트에 렌더링되어야 한다", () => {
    store.addTodo("리스트 테스트");

    const list = new DraggableTodoList(store);
    const el = list.getElement();

    expect(el.querySelector(".todo-item")?.textContent).toContain(
      "리스트 테스트",
    );
  });

  it("할 일을 삭제하면 리스트에서도 제거된다", () => {
    store.addTodo("할 일 A");
    const [a] = store.getTodos();
    const list = new DraggableTodoList(store);

    store.deleteTodo(a.id);
    const el = list.getElement();

    expect(el.querySelector(`[data-id="${a.id}"]`)).toBeNull();
  });
});
