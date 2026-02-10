import { describe, expect, it } from "vitest";

import {
  parseCachedProjectData,
  parseCachedProjectString,
} from "../../src/storage/schemas";

describe("cached project schema", () => {
  it("accepts modern cache payload with export", () => {
    const parsed = parseCachedProjectData({
      export: {
        object: { uuid: "project-1", classname: "Project" },
        children: [],
      },
      metadata: {
        wickVersion: "1.19.3",
      },
    });

    expect(parsed.export).toBeDefined();
  });

  it("accepts legacy payload with project key", () => {
    const parsed = parseCachedProjectString(
      JSON.stringify({
        project: {
          uuid: "project-2",
          name: "Legacy Project",
        },
      })
    );

    expect(parsed.project).toBeDefined();
  });

  it("rejects cache payloads without export/project", () => {
    expect(() =>
      parseCachedProjectString(
        JSON.stringify({
          metadata: { only: "metadata" },
        })
      )
    ).toThrow();
  });
});

