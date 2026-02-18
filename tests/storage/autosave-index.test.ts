import { beforeEach, describe, expect, it } from "vitest";

import {
  clearAutosaveIndexForTests,
  getLatestAutosaveIndexEntry,
  hasAutosaveIndexSource,
  removeAutosaveIndexEntriesByUUID,
  replaceAutosaveIndexSource,
  upsertAutosaveIndexEntry,
} from "../../src/storage/autosaveIndex";

describe("Autosave index", () => {
  beforeEach(() => {
    clearAutosaveIndexForTests();
  });

  it("returns latest entries per source and across sources", () => {
    upsertAutosaveIndexEntry("dexie", "dexie-old", 1_000);
    upsertAutosaveIndexEntry("dexie", "dexie-new", 3_000);
    upsertAutosaveIndexEntry("legacy", "legacy-newest", 5_000);

    const latestDexie = getLatestAutosaveIndexEntry("dexie");
    const latestLegacy = getLatestAutosaveIndexEntry("legacy");
    const latestOverall = getLatestAutosaveIndexEntry();

    expect(latestDexie?.uuid).toBe("dexie-new");
    expect(latestLegacy?.uuid).toBe("legacy-newest");
    expect(latestOverall?.source).toBe("legacy");
    expect(latestOverall?.uuid).toBe("legacy-newest");
  });

  it("replaces one source without touching the other source", () => {
    upsertAutosaveIndexEntry("legacy", "legacy-old", 1_000);
    upsertAutosaveIndexEntry("legacy", "legacy-remove", 2_000);
    upsertAutosaveIndexEntry("dexie", "dexie-keep", 4_000);

    replaceAutosaveIndexSource("legacy", [{ uuid: "legacy-new", lastModified: 6_000 }]);

    expect(hasAutosaveIndexSource("legacy")).toBe(true);
    expect(getLatestAutosaveIndexEntry("legacy")?.uuid).toBe("legacy-new");
    expect(getLatestAutosaveIndexEntry("dexie")?.uuid).toBe("dexie-keep");
    expect(getLatestAutosaveIndexEntry()?.uuid).toBe("legacy-new");
  });

  it("removes matching UUID from every source", () => {
    upsertAutosaveIndexEntry("legacy", "shared-uuid", 1_000);
    upsertAutosaveIndexEntry("dexie", "shared-uuid", 2_000);

    removeAutosaveIndexEntriesByUUID("shared-uuid");

    expect(getLatestAutosaveIndexEntry("legacy")).toBeNull();
    expect(getLatestAutosaveIndexEntry("dexie")).toBeNull();
  });
});
