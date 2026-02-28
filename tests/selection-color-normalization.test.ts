import { describe, expect, it } from "vitest";
import { selectionColorToCss } from "Editor/Util/ColorPicker/selectionColor";

describe("selectionColorToCss", () => {
  it("returns raw string unchanged", () => {
    expect(selectionColorToCss("rgba(16, 32, 48, 0.5)")).toBe(
      "rgba(16, 32, 48, 0.5)"
    );
  });

  it("resolves from toCSS()", () => {
    expect(
      selectionColorToCss({
        toCSS: () => "#123456",
      })
    ).toBe("#123456");
  });

  it("resolves from rgba", () => {
    expect(selectionColorToCss({ rgba: "rgba(1, 2, 3, 1)" })).toBe(
      "rgba(1, 2, 3, 1)"
    );
  });

  it("resolves from hex", () => {
    expect(selectionColorToCss({ hex: "#abcdef" })).toBe("#abcdef");
  });

  it("uses fallback for invalid and empty values", () => {
    expect(selectionColorToCss(undefined)).toBe("#000000");
    expect(selectionColorToCss(null)).toBe("#000000");
    expect(selectionColorToCss("   ")).toBe("#000000");
    expect(selectionColorToCss({ toCSS: () => "" })).toBe("#000000");
    expect(selectionColorToCss({ toCSS: () => "", rgba: "", hex: "" }, "#112233")).toBe(
      "#112233"
    );
  });
});
