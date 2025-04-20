import { DragManager } from "../../utils/DragManager";

describe("DragManager", () => {
  let element: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = "";
    element = document.createElement("div");
    element.textContent = "드래그 테스트";
    element.className = "todo-item";
    document.body.appendChild(element);
  });

  it("드래그 시작 시 dragging 클래스가 추가된다", () => {
    const onStart = jest.fn();
    const manager = new DragManager({
      element,
      onDragStart: onStart,
    });

    const event = new MouseEvent("mousedown", {
      bubbles: true,
      clientX: 50,
      clientY: 50,
    });

    manager.startDrag(event);

    expect(element.classList.contains("dragging")).toBe(true);
    expect(onStart).toHaveBeenCalled();
  });

  it("ESC 키를 누르면 드래그가 취소된다", () => {
    const onEnd = jest.fn();
    const manager = new DragManager({
      element,
      onDragEnd: onEnd,
    });

    const down = new MouseEvent("mousedown", { clientX: 0, clientY: 0 });
    manager.startDrag(down);

    const esc = new KeyboardEvent("keydown", { key: "Escape" });
    document.dispatchEvent(esc);

    expect(element.classList.contains("dragging")).toBe(false);
    expect(onEnd).toHaveBeenCalledWith(null);
  });
});
