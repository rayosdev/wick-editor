import { vi } from 'vitest';

// Mock canvas for Node.js environment
global.HTMLCanvasElement = class HTMLCanvasElement {
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
};

// Mock Paper.js - Define classes first to avoid circular references
class MockPoint {
  constructor(x, y) {
    if (typeof x === 'object') {
      this.x = x.x;
      this.y = x.y;
    } else {
      this.x = x || 0;
      this.y = y || 0;
    }
  }
  
  add(point) {
    return new MockPoint(this.x + point.x, this.y + point.y);
  }
  
  subtract(point) {
    return new MockPoint(this.x - point.x, this.y - point.y);
  }
  
  multiply(value) {
    return new MockPoint(this.x * value, this.y * value);
  }
  
  clone() {
    return new MockPoint(this.x, this.y);
  }
}

class MockView {
  constructor() {
    this.zoom = 1;
    this.center = new MockPoint(0, 0);
  }
  
  viewToProject(point) {
    return point.clone();
  }
}

class MockPaperScope {
  constructor() {
    this.view = new MockView();
    this.Point = MockPoint;
  }
}

// Now assign to global.paper
global.paper = {
  Point: MockPoint,
  View: MockView,
  PaperScope: MockPaperScope,
  setup(canvas) {
    return new MockPaperScope();
  },
};

// Mock window.requestAnimationFrame
global.requestAnimationFrame = vi.fn((callback) => {
  return setTimeout(callback, 16);
});

global.cancelAnimationFrame = vi.fn((id) => {
  clearTimeout(id);
});
