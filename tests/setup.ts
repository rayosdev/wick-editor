import { vi } from "vitest";

const globalAny = globalThis as any;

class MockCanvasElement {
  width: number;
  height: number;

  constructor() {
    this.width = 800;
    this.height = 600;
  }

  getContext() {
    return {
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      getImageData: vi.fn(),
      putImageData: vi.fn(),
      createImageData: vi.fn(),
      setTransform: vi.fn(),
      drawImage: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
      stroke: vi.fn(),
      translate: vi.fn(),
      scale: vi.fn(),
      rotate: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
    };
  }

  getBoundingClientRect() {
    return {
      left: 0,
      top: 0,
      right: this.width,
      bottom: this.height,
      width: this.width,
      height: this.height,
    };
  }

  addEventListener() {}

  removeEventListener() {}
}

globalAny.HTMLCanvasElement = MockCanvasElement;

class MockPoint {
  x: number;
  y: number;

  constructor(x?: number | { x: number; y: number }, y?: number) {
    if (typeof x === "object" && x !== null) {
      this.x = x.x;
      this.y = x.y;
      return;
    }
    this.x = x ?? 0;
    this.y = y ?? 0;
  }

  add(point: MockPoint): MockPoint {
    return new MockPoint(this.x + point.x, this.y + point.y);
  }

  subtract(point: MockPoint): MockPoint {
    return new MockPoint(this.x - point.x, this.y - point.y);
  }

  multiply(value: number): MockPoint {
    return new MockPoint(this.x * value, this.y * value);
  }

  clone(): MockPoint {
    return new MockPoint(this.x, this.y);
  }
}

class MockView {
  zoom: number;
  center: MockPoint;

  constructor() {
    this.zoom = 1;
    this.center = new MockPoint(0, 0);
  }

  viewToProject(point: MockPoint): MockPoint {
    return point.clone();
  }
}

class MockPaperScope {
  view: MockView;
  Point: typeof MockPoint;

  constructor() {
    this.view = new MockView();
    this.Point = MockPoint;
  }
}

globalAny.paper = {
  Point: MockPoint,
  View: MockView,
  PaperScope: MockPaperScope,
  setup() {
    return new MockPaperScope();
  },
};

globalAny.requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
  return setTimeout(() => callback(performance.now()), 16);
});

globalAny.cancelAnimationFrame = vi.fn((id: number) => {
  clearTimeout(id as unknown as NodeJS.Timeout);
});
