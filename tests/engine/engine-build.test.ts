import { beforeAll, describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

describe("Engine Build Output", () => {
  const distPath = path.resolve(process.cwd(), "engine/dist");

  beforeAll(() => {
    if (!fs.existsSync(distPath)) {
      throw new Error("Engine dist/ not found. Run: cd engine && npm run build");
    }
  });

  it("creates wickengine.js", () => {
    const file = path.join(distPath, "wickengine.js");
    expect(fs.existsSync(file), "wickengine.js should exist").toBe(true);
  });

  it("wickengine.js is not empty", () => {
    const file = path.join(distPath, "wickengine.js");
    const stats = fs.statSync(file);
    expect(stats.size).toBeGreaterThan(100_000);
  });

  it("wickengine.js contains IIFE wrapper", () => {
    const file = path.join(distPath, "wickengine.js");
    const content = fs.readFileSync(file, "utf8");
    expect(content).toContain("(function()");
  });

  it("wickengine.js contains build version", () => {
    const file = path.join(distPath, "wickengine.js");
    const content = fs.readFileSync(file, "utf8");
    expect(content).toMatch(/WICK_ENGINE_BUILD_VERSION/);
  });

  it("creates emptyproject.html", () => {
    const file = path.join(distPath, "emptyproject.html");
    expect(fs.existsSync(file), "emptyproject.html should exist").toBe(true);
  });

  it("emptyproject.html contains wickengine", () => {
    const file = path.join(distPath, "emptyproject.html");
    const content = fs.readFileSync(file, "utf8");
    expect(content).toContain("WICK_ENGINE_BUILD_VERSION");
  });

  it("creates ZIP export resources", () => {
    const files = ["index.html", "preloadjs.min.js", "project.html"];

    files.forEach((filename) => {
      const file = path.join(distPath, filename);
      expect(fs.existsSync(file), `${filename} should exist`).toBe(true);
    });
  });

  it("bundle size is reasonable", () => {
    const file = path.join(distPath, "wickengine.js");
    const stats = fs.statSync(file);
    const sizeMB = stats.size / 1024 / 1024;
    expect(sizeMB).toBeLessThan(10);
    expect(sizeMB).toBeGreaterThan(0.5);
  });
});
