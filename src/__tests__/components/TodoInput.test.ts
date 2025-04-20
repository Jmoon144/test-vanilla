import { TodoInput } from "../../components/TodoInput";
import { TodoStore } from "../../store/todoStore";

describe("TodoInput", () => {
  let store: TodoStore;

  beforeEach(() => {
    localStorage.clear();
    store = new TodoStore();
  });

  it('placeholder가 "What needs to be done?"으로 설정되어 있어야 한다', () => {
    const input = new TodoInput(store).render();
    expect(input.placeholder).toBe("What needs to be done?");
  });

  it("Enter 키를 누르면 할 일이 추가된다", () => {
    const spy = jest.spyOn(store, "addTodo");
    const input = new TodoInput(store).render();

    input.value = "새로운 할 일";
    input.dispatchEvent(new KeyboardEvent("keypress", { key: "Enter" }));

    expect(spy).toHaveBeenCalledWith("새로운 할 일");
    expect(input.value).toBe("");
  });

  it("빈 문자열은 추가되지 않는다", () => {
    const spy = jest.spyOn(store, "addTodo");
    const input = new TodoInput(store).render();

    input.value = "   ";
    input.dispatchEvent(new KeyboardEvent("keypress", { key: "Enter" }));

    expect(spy).not.toHaveBeenCalled();
  });
});
