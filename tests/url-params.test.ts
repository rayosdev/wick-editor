import { describe, expect, it } from "vitest";
import { getFirstSearchParam } from "Editor/Util/urlParams";

describe("getFirstSearchParam", () => {
  it("returns first match when duplicate keys exist", () => {
    const search = "?project=one.wick&project=two.wick&example=demo.wick";
    expect(getFirstSearchParam(search, "project")).toBe("one.wick");
    expect(getFirstSearchParam(search, "example")).toBe("demo.wick");
  });

  it("returns empty string when key is missing", () => {
    expect(getFirstSearchParam("?a=1", "missing")).toBe("");
  });
});
