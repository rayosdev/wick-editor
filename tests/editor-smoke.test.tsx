import { test } from "vitest";

test.skip("Editor mounts without throwing (skipped in unit tests)", () => {
  // Intentionally skipped. This mount path pulls large browser-only editor
  // dependencies and is covered by E2E suites.
});
