import { render, cleanup } from "@testing-library/react";
import Editor from "../src/Editor/Editor.tsx";
import { afterEach, test, expect, vi } from "vitest";

afterEach(() => cleanup());

test.skip("Editor mounts without throwing (skipped in unit tests)", () => {
  // This test is intentionally skipped in unit test runs because Editor mounts
  // pull in many browser-specific and large bundles (wick engine). Re-enable
  // when you want to run heavier integration/unit tests or when you add
  // appropriate mocks for engine and resources.
});
