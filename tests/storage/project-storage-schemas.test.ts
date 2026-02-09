import { describe, expect, it } from "vitest";

import {
  parseAutosavePayload,
  parseAutosaveRecord,
  parseCurrentProjectRecord,
  parseSettingsRecord,
} from "../../src/storage/schemas";

describe("ProjectStorage schemas", () => {
  it("accepts valid autosave payloads", () => {
    const payload = parseAutosavePayload({
      projectData: {
        uuid: "project-123",
        name: "My Project",
      },
      objectsData: [
        { uuid: "obj-1", classname: "Frame" },
        { uuid: "obj-2", classname: "Layer" },
      ],
      lastModified: Date.now(),
    });

    expect(payload.projectData.uuid).toBe("project-123");
    expect(payload.objectsData.length).toBe(2);
  });

  it("rejects autosave payloads missing a project uuid", () => {
    expect(() =>
      parseAutosavePayload({
        projectData: { name: "Invalid Project" },
        objectsData: [],
        lastModified: Date.now(),
      })
    ).toThrow();
  });

  it("accepts valid persisted autosave/current-project/settings records", () => {
    const autosaveRecord = parseAutosaveRecord({
      uuid: "project-123",
      projectData: { uuid: "project-123", name: "My Project" },
      objectsData: [],
      lastModified: 1735689600000,
    });

    const currentProject = parseCurrentProjectRecord({
      key: "current",
      uuid: "project-123",
      lastModified: 1735689600001,
      autosaveData: autosaveRecord,
    });

    const setting = parseSettingsRecord({
      key: "editorTheme",
      value: "dark",
    });

    expect(currentProject.autosaveData.projectData.uuid).toBe("project-123");
    expect(setting.value).toBe("dark");
  });
});
