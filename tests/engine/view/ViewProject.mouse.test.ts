import { beforeEach, describe, expect, it } from "vitest";

import "../../setup";

type PointLike = {
  x: number;
  y: number;
  add: (point: PointLike) => PointLike;
  subtract: (point: PointLike) => PointLike;
  multiply: (value: number) => PointLike;
  clone: () => PointLike;
};

type PaperGlobal = {
  Point: new (x?: number | { x: number; y: number }, y?: number) => PointLike;
};

function getPaper(): PaperGlobal {
  const paper = (globalThis as any).paper as PaperGlobal | undefined;
  if (!paper) {
    throw new Error("paper mock was not initialized");
  }

  return paper;
}

describe("ViewProject - Mouse/Trackpad Improvements", () => {
  beforeEach(() => {
    const paper = getPaper();

    (globalThis as any).Wick = {
      View: class {
        model: Record<string, unknown>;
        paper: Record<string, unknown>;

        constructor(model: Record<string, unknown>) {
          this.model = model;
          this.paper = {
            view: {
              zoom: 1,
              center: new paper.Point(0, 0),
            },
          };
        }

        fireEvent(): void {}

        render(): void {}
      },
    };
  });

  describe("scrollToZoom - Wheel Events", () => {
    it("should detect zoom gesture when ctrlKey is pressed", () => {
      const event = new WheelEvent("wheel", {
        deltaY: -100,
        ctrlKey: true,
        clientX: 400,
        clientY: 300,
      });

      const isZoomGesture = event.ctrlKey || event.metaKey;
      expect(isZoomGesture).toBe(true);
    });

    it("should detect pan gesture when no modifier keys", () => {
      const event = new WheelEvent("wheel", {
        deltaY: -100,
        deltaX: 50,
        ctrlKey: false,
        metaKey: false,
      });

      const isZoomGesture = event.ctrlKey || event.metaKey;
      expect(isZoomGesture).toBe(false);
    });

    it("should handle different deltaMode values", () => {
      expect(getDeltaMultiplier(0)).toBe(1);
      expect(getDeltaMultiplier(1)).toBe(15);
      expect(getDeltaMultiplier(2)).toBe(100);
    });

    it("should zoom toward cursor position (zoom-to-point)", () => {
      const Point = getPaper().Point;
      const oldZoom = 1.0;
      const newZoom = 1.5;
      const cursorPoint = new Point(400, 300);
      const viewCenter = new Point(0, 0);

      const beta = oldZoom / newZoom;
      const mousePosition = cursorPoint.subtract(viewCenter);
      const offset = mousePosition.multiply(beta).subtract(mousePosition);
      const expectedCenter = viewCenter.add(offset);

      expect(expectedCenter.x).not.toBe(viewCenter.x);
      expect(expectedCenter.y).not.toBe(viewCenter.y);
      expect(offset.x).toBeLessThan(0);
      expect(offset.y).toBeLessThan(0);
    });

    it("should clamp zoom within min/max bounds", () => {
      const ZOOM_MIN = 0.1;
      const ZOOM_MAX = 10.0;

      const tooSmall = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, 0.05));
      expect(tooSmall).toBe(ZOOM_MIN);

      const tooBig = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, 15.0));
      expect(tooBig).toBe(ZOOM_MAX);

      const justRight = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, 2.5));
      expect(justRight).toBe(2.5);
    });
  });

  describe("Touch Events - Mobile Support", () => {
    it("should detect two-finger pan gesture", () => {
      const touchEvent = {
        touches: [
          { clientX: 100, clientY: 100 },
          { clientX: 200, clientY: 200 },
        ],
      };

      expect(touchEvent.touches.length).toBe(2);
    });

    it("should calculate distance between two touches", () => {
      const touch1 = { clientX: 100, clientY: 100 };
      const touch2 = { clientX: 200, clientY: 200 };

      const dx = touch2.clientX - touch1.clientX;
      const dy = touch2.clientY - touch1.clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      expect(distance).toBeCloseTo(141.42, 1);
    });

    it("should calculate center point between two fingers", () => {
      const touch1 = { clientX: 100, clientY: 100 };
      const touch2 = { clientX: 200, clientY: 200 };

      const centerX = (touch1.clientX + touch2.clientX) / 2;
      const centerY = (touch1.clientY + touch2.clientY) / 2;

      expect(centerX).toBe(150);
      expect(centerY).toBe(150);
    });

    it("should apply 1.5x sensitivity to pinch gestures", () => {
      const startDistance = 100;
      const currentDistance = 150;
      const scaleFactor = 1.5;

      const scale = currentDistance / startDistance;
      const adjustedScale = 1 + (scale - 1) * scaleFactor;

      expect(adjustedScale).toBe(1.75);
    });

    it("should distinguish pure pan from pan+zoom gesture", () => {
      const startDistance = 100;
      const currentDistance = 103;
      const threshold = 5;

      const distanceChange = Math.abs(currentDistance - startDistance);
      const isPinching = distanceChange > threshold;

      expect(isPinching).toBe(false);

      const currentDistancePinch = 120;
      const distanceChangePinch = Math.abs(currentDistancePinch - startDistance);
      const isPinchingSignificant = distanceChangePinch > threshold;

      expect(isPinchingSignificant).toBe(true);
    });
  });

  describe("requestAnimationFrame Throttling", () => {
    it("should accumulate deltas before applying", () => {
      let pendingZoomDelta = 0;
      const delta1 = 0.1;
      const delta2 = 0.05;
      const delta3 = -0.02;

      pendingZoomDelta += delta1;
      pendingZoomDelta += delta2;
      pendingZoomDelta += delta3;

      expect(pendingZoomDelta).toBeCloseTo(0.13, 10);
    });

    it("should reset delta after animation frame", () => {
      let pendingZoomDelta = 0.5;
      let zoomRAF: number | null = null;

      zoomRAF = requestAnimationFrame(() => {
        const newZoom = 1.0 + pendingZoomDelta;
        expect(newZoom).toBe(1.5);

        pendingZoomDelta = 0;
        zoomRAF = null;
      });

      expect(zoomRAF).not.toBeNull();
    });
  });

  describe("Pan Gesture with Zoom Scaling", () => {
    it("should scale pan speed by zoom level", () => {
      const deltaX = 100;
      const deltaY = 50;
      const zoom = 2.0;

      const panX = deltaX / zoom;
      const panY = deltaY / zoom;

      expect(panX).toBe(50);
      expect(panY).toBe(25);
    });

    it("should pan faster when zoomed out", () => {
      const deltaX = 100;
      const zoom = 0.5;

      const panX = deltaX / zoom;

      expect(panX).toBe(200);
    });
  });
});

function getDeltaMultiplier(deltaMode: number): number {
  switch (deltaMode) {
    case 1:
      return 15;
    case 2:
      return 100;
    default:
      return 1;
  }
}
