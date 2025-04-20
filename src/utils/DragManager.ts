export interface DragOptions {
  element: HTMLElement;
  onDragStart?: () => void;
  onDragEnd?: (_index: number | null) => void;
  scrollThreshold?: number;
  scrollSpeed?: number;
}

export class DragManager {
  private element: HTMLElement;
  private isDragging = false;
  private startX = 0;
  private startY = 0;
  private initialX = 0;
  private initialY = 0;
  private currentX = 0;
  private currentY = 0;
  private placeholder: HTMLElement | null = null;
  private previewElement: HTMLElement | null = null;
  private previewTimer: number | null = null;
  private readonly previewDelay = 2000;
  private onDragStart: () => void;
  private onDragEnd: (_index: number | null) => void;
  private options: { scrollThreshold: number; scrollSpeed: number };
  private scrollInterval: number | null = null;
  private originalParent: HTMLElement | null = null;

  constructor(options: DragOptions) {
    this.element = options.element;
    this.onDragStart = options.onDragStart || (() => {});
    this.onDragEnd = (_index) => {
      if (options.onDragEnd) options.onDragEnd(_index);
    };
    this.options = {
      scrollThreshold: options.scrollThreshold ?? 80,
      scrollSpeed: options.scrollSpeed ?? 15,
    };
  }

  startDrag(e: MouseEvent) {
    if (this.isDragging) return;
    this.originalParent = this.element.parentElement;
    this.clearPlaceholders();
    this.isDragging = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
    const rect = this.element.getBoundingClientRect();
    this.initialX = rect.left;
    this.initialY = rect.top;
    this.element.classList.add("dragging");
    Object.assign(this.element.style, {
      position: "fixed",
      left: `${this.initialX}px`,
      top: `${this.initialY}px`,
      width: `${rect.width}px`,
      margin: "0",
      zIndex: "1000",
    });
    document.addEventListener("mousemove", this.handleMouseMove);
    document.addEventListener("mouseup", this.handleMouseUp);
    document.addEventListener("keydown", this.handleKeyDown);
    this.onDragStart();
  }

  private handleMouseMove = (e: MouseEvent) => {
    if (!this.isDragging) return;
    e.preventDefault();
    this.currentX = e.clientX - this.startX + this.initialX;
    this.currentY = e.clientY - this.startY + this.initialY;
    Object.assign(this.element.style, {
      left: `${this.currentX}px`,
      top: `${this.currentY}px`,
    });
    this.handleScroll(e);
    this.updatePlaceholderPosition();
  };

  private handleMouseUp = (e: MouseEvent) => {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.stopScroll();
    const container = this.originalParent!;
    const { left, right, top, bottom } = container.getBoundingClientRect();
    const outside =
      e.clientX < left ||
      e.clientX > right ||
      e.clientY < top ||
      e.clientY > bottom;
    if (outside) {
      this.cleanup();
      this.onDragEnd(null);
      return;
    }
    const index = this.getPlaceholderIndex();
    this.cleanup();
    this.onDragEnd(index);
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && this.isDragging) {
      this.isDragging = false;
      this.stopScroll();
      this.cleanup();
      this.onDragEnd(null);
    }
  };

  private handleScroll(e: MouseEvent) {
    const container = this.element.parentElement;
    if (!container) return;
    const { top, bottom } = container.getBoundingClientRect();
    const { scrollThreshold, scrollSpeed } = this.options;
    if (e.clientY < top + scrollThreshold) this.startScroll(-scrollSpeed);
    else if (e.clientY > bottom - scrollThreshold)
      this.startScroll(scrollSpeed);
    else this.stopScroll();
  }

  private startScroll(step: number) {
    this.stopScroll();
    const container = this.element.parentElement;
    if (!container) return;
    this.scrollInterval = window.setInterval(() => {
      container.scrollTop += step;
      this.updatePlaceholderPosition();
    }, 16);
  }

  private stopScroll() {
    if (this.scrollInterval != null) {
      clearInterval(this.scrollInterval);
      this.scrollInterval = null;
    }
  }

  private updatePlaceholderPosition() {
    const container = this.element.parentElement;
    if (!container) return;
    const items = Array.from(container.children).filter(
      (el) =>
        el instanceof HTMLElement &&
        el.classList.contains("todo-item") &&
        el !== this.element,
    ) as HTMLElement[];

    const dragMiddleY = this.currentY + this.element.offsetHeight / 2;
    let inserted = false;

    for (const item of items) {
      const rect = item.getBoundingClientRect();
      const itemMiddleY = rect.top + rect.height / 2;
      if (dragMiddleY < itemMiddleY) {
        this.insertPlaceholder(container, item);
        inserted = true;
        break;
      }
    }

    if (!inserted) {
      const last = items[items.length - 1];
      if (last) {
        this.insertPlaceholder(
          container,
          last.nextSibling as HTMLElement | null,
        );
      }
    }
  }

  private insertPlaceholder(container: HTMLElement, ref: HTMLElement | null) {
    if (!this.placeholder) {
      this.placeholder = document.createElement("div");
      this.placeholder.className = "todo-item-placeholder";
      this.placeholder.style.height = `${this.element.offsetHeight}px`;
    }
    container.insertBefore(this.placeholder, ref);
    this.resetPreviewTimer();
  }

  private resetPreviewTimer() {
    if (this.previewTimer) clearTimeout(this.previewTimer);
    if (this.previewElement) this.previewElement.remove();
    this.previewTimer = window.setTimeout(() => {
      if (!this.placeholder) return;
      this.previewElement = this.element.cloneNode(true) as HTMLElement;
      Object.assign(this.previewElement.style, {
        filter: "blur(2px)",
        opacity: "0.5",
        pointerEvents: "none",
      });
      this.placeholder.parentElement?.insertBefore(
        this.previewElement,
        this.placeholder,
      );
    }, this.previewDelay);
  }

  private getPlaceholderIndex(): number | null {
    if (!this.placeholder || !this.placeholder.parentElement) return null;
    const siblings = Array.from(this.placeholder.parentElement.children).filter(
      (el) => el.classList.contains("todo-item"),
    );
    const index = siblings.indexOf(this.placeholder);
    return index === -1 ? siblings.length : index;
  }

  private clearPlaceholders() {
    if (!this.originalParent) return;
    this.originalParent
      .querySelectorAll<HTMLElement>(".todo-item-placeholder")
      .forEach((p) => p.remove());
    if (this.previewElement) this.previewElement.remove();
    if (this.previewTimer) clearTimeout(this.previewTimer);
    this.placeholder = null;
    this.previewElement = null;
    this.previewTimer = null;
  }

  private cleanup() {
    document.removeEventListener("mousemove", this.handleMouseMove);
    document.removeEventListener("mouseup", this.handleMouseUp);
    document.removeEventListener("keydown", this.handleKeyDown);
    this.element.classList.remove("dragging");
    Object.assign(this.element.style, {
      position: "",
      left: "",
      top: "",
      width: "",
      margin: "",
      zIndex: "",
    });
    this.clearPlaceholders();
    this.stopScroll();
  }
}
