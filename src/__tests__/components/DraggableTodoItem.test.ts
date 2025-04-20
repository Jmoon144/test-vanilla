import DraggableTodoItem from "../../components/DraggableTodoItem";
import { TodoStore } from "../../store/todoStore";
import { Todo } from "../../types/todo";

const createTodo = (content: string): Todo => ({
  id: "test-id",
  content,
  completed: false,
  order: 0,
  createdAt: new Date(),
});

describe("DraggableTodoItem", () => {
  let store: TodoStore;
  let todo: Todo;

  beforeEach(() => {
    store = new TodoStore();
    todo = createTodo("드래그 테스트");
  });

  it("드래그 핸들과 × 버튼, 내용을 렌더링해야 한다", () => {
    const item = new DraggableTodoItem(todo, store);
    const el = item.getElement();

    expect(el.classList.contains("todo-item")).toBe(true);
    expect(el.querySelector(".todo-content")?.textContent).toBe(
      "드래그 테스트"
    );
    expect(el.querySelector(".drag-handle")?.innerHTML).toBe("☰");
    expect(el.querySelector(".delete-btn")?.textContent).toBe("×");
  });

  it("체크박스를 클릭하면 완료 상태로 체크된다", () => {
    const spy = jest.spyOn(store, "toggleTodo");
    const item = new DraggableTodoItem(todo, store);
    const checkbox = item
      .getElement()
      .querySelector(".todo-checkbox") as HTMLInputElement;

    checkbox.checked = true;
    checkbox.dispatchEvent(new Event("change", { bubbles: true }));

    expect(spy).toHaveBeenCalledWith("test-id");
  });

  it("× 버튼을 클릭하면 삭제된다", () => {
    const spy = jest.spyOn(store, "deleteTodo");
    const item = new DraggableTodoItem(todo, store);
    const btn = item
      .getElement()
      .querySelector(".delete-btn") as HTMLButtonElement;

    btn.click();
    expect(spy).toHaveBeenCalledWith("test-id");
  });
});
