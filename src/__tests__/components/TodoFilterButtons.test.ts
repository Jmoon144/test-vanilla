import { TodoFilterButtons } from "../../components/TodoFilterButtons";
import { TodoStore } from "../../store/todoStore";

describe("TodoFilterButtons", () => {
  let store: TodoStore;

  beforeEach(() => {
    localStorage.clear();
    store = new TodoStore();
  });

  it("필터 버튼과 완료 제거 버튼이 렌더링되어야 한다", () => {
    store.addTodo("할 일 1");
    store.addTodo("할 일 2");

    const comp = new TodoFilterButtons(store);
    const el = comp.getElement();

    expect(el.querySelector('[data-filter="all"]')?.textContent).toContain(
      "All (2)",
    );
    expect(el.querySelector(".clear-completed")?.textContent).toContain(
      "Clear Completed (0)",
    );
  });

  it("필터 버튼을 누르면 필터가 변경된다", () => {
    const spy = jest.spyOn(store, "setFilter");
    const comp = new TodoFilterButtons(store);
    const el = comp.getElement();

    const activeBtn = el.querySelector(
      '[data-filter="active"]',
    ) as HTMLButtonElement;
    activeBtn.click();

    expect(spy).toHaveBeenCalledWith("active");
  });

  it("Clear Completed 버튼을 누르면 완료된 항목이 삭제된다", () => {
    store.addTodo("할 일 1");
    store.addTodo("할 일 2");

    const [_, b] = store.getTodos();
    store.toggleTodo(b.id);

    const spy = jest.spyOn(store, "clearCompleted");
    const comp = new TodoFilterButtons(store);
    const el = comp.getElement();

    const clearBtn = el.querySelector(".clear-completed") as HTMLButtonElement;
    clearBtn.click();

    expect(spy).toHaveBeenCalled();
  });
});
