import { test, expect, type Page } from "@playwright/test";

type AutosavePayload = {
  projectData: {
    uuid: string;
    name?: string;
    [key: string]: unknown;
  };
  objectsData: unknown[];
  lastModified: number;
};

type AutosaveListEntry = {
  uuid: string;
  lastModified?: number;
};

async function initializeEditor(page: Page): Promise<void> {
  await page.addInitScript(() => {
    try {
      window.localStorage.setItem("skipWelcomeMessage", "true");
    } catch {
      // Ignore localStorage access issues in constrained environments.
    }
  });

  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.waitForFunction(() => {
    const globalWindow = window as Window & {
      editor?: unknown;
      Wick?: unknown;
      __wickStorage?: {
        ProjectStorage?: unknown;
      };
    };

    return Boolean(
      globalWindow.editor &&
        globalWindow.Wick &&
        globalWindow.__wickStorage?.ProjectStorage,
    );
  });
}

async function clearAllRecoveryStorage(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const globalWindow = window as Window & {
      localforage?: {
        getItem?: (key: string) => Promise<unknown>;
        removeItem?: (key: string) => Promise<void>;
      };
      __wickStorage?: {
        db?: {
          autosaves?: { clear: () => Promise<void> };
          currentProject?: { clear: () => Promise<void> };
        };
      };
    };

    const localforageList = (await globalWindow.localforage
      ?.getItem?.("autosaveList")
      .catch(() => [])) as AutosaveListEntry[] | null;

    const list = Array.isArray(localforageList) ? localforageList : [];
    for (const autosave of list) {
      if (!autosave?.uuid) continue;
      await globalWindow.localforage
        ?.removeItem?.(`autosave_${autosave.uuid}`)
        .catch(() => {});
    }

    await globalWindow.localforage?.removeItem?.("autosaveList").catch(() => {});
    await globalWindow.localforage
      ?.removeItem?.("wickEditor_currentProject")
      .catch(() => {});

    try {
      window.localStorage.removeItem("wickEditor_currentProject_backup");
      window.localStorage.removeItem("wick_cached_project");
      window.localStorage.removeItem("wick_cached_project_timestamp");
    } catch {
      // Ignore localStorage access issues.
    }

    await globalWindow.__wickStorage?.db?.autosaves?.clear?.().catch(() => {});
    await globalWindow.__wickStorage?.db?.currentProject?.clear?.().catch(() => {});
  });
}

test.describe.serial("Autosave source selection", () => {
  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "This regression suite targets chromium-based runtime storage behavior.",
  );

  test("loads the newest autosave across Dexie and legacy stores", async ({ page }) => {
    await initializeEditor(page);
    await clearAllRecoveryStorage(page);

    const dexiePreferred = await page.evaluate(async () => {
      const globalWindow = window as Window & {
        editor: {
          project: unknown;
          setupNewProject: (project?: unknown) => void;
          loadAutosavedProject: (callback: () => void) => void;
        };
        Wick: {
          Project: new () => unknown;
          AutoSave: {
            generateAutosaveData: (project: unknown) => AutosavePayload;
            saveAutosaveData: (
              autosaveData: AutosavePayload,
              callback: () => void,
            ) => void;
          };
        };
        __wickStorage?: {
          ProjectStorage: {
            saveAutosave: (autosaveData: AutosavePayload) => Promise<void>;
          };
        };
      };

      const now = Date.now();
      const basePayload = globalWindow.Wick.AutoSave.generateAutosaveData(
        globalWindow.editor.project,
      );

      const dexiePayload = JSON.parse(
        JSON.stringify(basePayload),
      ) as AutosavePayload;
      dexiePayload.projectData.uuid = `dexie-${now}`;
      dexiePayload.projectData.name = "Dexie Latest";
      dexiePayload.lastModified = now + 10_000;

      const legacyPayload = JSON.parse(
        JSON.stringify(basePayload),
      ) as AutosavePayload;
      legacyPayload.projectData.uuid = `legacy-${now}`;
      legacyPayload.projectData.name = "Legacy Older";
      legacyPayload.lastModified = now + 2_000;

      await globalWindow.__wickStorage?.ProjectStorage.saveAutosave(dexiePayload);
      await new Promise<void>((resolve) => {
        globalWindow.Wick.AutoSave.saveAutosaveData(legacyPayload, () => {
          resolve();
        });
      });

      globalWindow.editor.setupNewProject(new globalWindow.Wick.Project());
      await new Promise<void>((resolve) => {
        globalWindow.editor.loadAutosavedProject(() => {
          resolve();
        });
      });

      return {
        loadedUUID: (globalWindow.editor.project as { uuid?: string }).uuid,
        expectedUUID: dexiePayload.projectData.uuid,
      };
    });

    expect(dexiePreferred.loadedUUID).toBe(dexiePreferred.expectedUUID);

    await clearAllRecoveryStorage(page);

    const legacyPreferred = await page.evaluate(async () => {
      const globalWindow = window as Window & {
        editor: {
          project: unknown;
          setupNewProject: (project?: unknown) => void;
          loadAutosavedProject: (callback: () => void) => void;
        };
        Wick: {
          Project: new () => unknown;
          AutoSave: {
            generateAutosaveData: (project: unknown) => AutosavePayload;
            saveAutosaveData: (
              autosaveData: AutosavePayload,
              callback: () => void,
            ) => void;
          };
        };
        __wickStorage?: {
          ProjectStorage: {
            saveAutosave: (autosaveData: AutosavePayload) => Promise<void>;
          };
        };
      };

      const now = Date.now();
      const basePayload = globalWindow.Wick.AutoSave.generateAutosaveData(
        globalWindow.editor.project,
      );

      const dexiePayload = JSON.parse(
        JSON.stringify(basePayload),
      ) as AutosavePayload;
      dexiePayload.projectData.uuid = `dexie-${now}`;
      dexiePayload.projectData.name = "Dexie Older";
      dexiePayload.lastModified = now + 1_000;

      const legacyPayload = JSON.parse(
        JSON.stringify(basePayload),
      ) as AutosavePayload;
      legacyPayload.projectData.uuid = `legacy-${now}`;
      legacyPayload.projectData.name = "Legacy Latest";
      legacyPayload.lastModified = now + 12_000;

      await globalWindow.__wickStorage?.ProjectStorage.saveAutosave(dexiePayload);
      await new Promise<void>((resolve) => {
        globalWindow.Wick.AutoSave.saveAutosaveData(legacyPayload, () => {
          resolve();
        });
      });

      globalWindow.editor.setupNewProject(new globalWindow.Wick.Project());
      await new Promise<void>((resolve) => {
        globalWindow.editor.loadAutosavedProject(() => {
          resolve();
        });
      });

      return {
        loadedUUID: (globalWindow.editor.project as { uuid?: string }).uuid,
        expectedUUID: legacyPayload.projectData.uuid,
      };
    });

    expect(legacyPreferred.loadedUUID).toBe(legacyPreferred.expectedUUID);
  });

  test("clears only the latest autosave while preserving older autosaves", async ({ page }) => {
    await initializeEditor(page);
    await clearAllRecoveryStorage(page);

    const result = await page.evaluate(async () => {
      const globalWindow = window as Window & {
        editor: {
          project: unknown;
          clearAutoSavedProject: (callback: () => void) => void;
        };
        Wick: {
          AutoSave: {
            generateAutosaveData: (project: unknown) => AutosavePayload;
            saveAutosaveData: (
              autosaveData: AutosavePayload,
              callback: () => void,
            ) => void;
            getAutosavesList: (
              callback: (autosaves: AutosaveListEntry[]) => void,
            ) => void;
          };
        };
        localforage: {
          getItem: (key: string) => Promise<unknown>;
        };
        __wickStorage?: {
          ProjectStorage: {
            saveCurrentProject: (autosaveData: AutosavePayload) => Promise<void>;
            getCurrentProject: () => Promise<unknown>;
          };
          localforage: {
            setItem: (key: string, value: unknown) => Promise<void>;
            getItem: (key: string) => Promise<unknown>;
          };
        };
      };

      const now = Date.now();
      const basePayload = globalWindow.Wick.AutoSave.generateAutosaveData(
        globalWindow.editor.project,
      );

      const olderLegacyPayload = JSON.parse(
        JSON.stringify(basePayload),
      ) as AutosavePayload;
      olderLegacyPayload.projectData.uuid = `legacy-old-${now}`;
      olderLegacyPayload.lastModified = now + 1_000;

      const newestLegacyPayload = JSON.parse(
        JSON.stringify(basePayload),
      ) as AutosavePayload;
      newestLegacyPayload.projectData.uuid = `legacy-new-${now}`;
      newestLegacyPayload.lastModified = now + 6_000;

      await new Promise<void>((resolve) => {
        globalWindow.Wick.AutoSave.saveAutosaveData(olderLegacyPayload, () => {
          resolve();
        });
      });
      await new Promise<void>((resolve) => {
        globalWindow.Wick.AutoSave.saveAutosaveData(newestLegacyPayload, () => {
          resolve();
        });
      });

      await globalWindow.__wickStorage?.ProjectStorage.saveCurrentProject(
        newestLegacyPayload,
      );
      await globalWindow.__wickStorage?.localforage.setItem(
        "wickEditor_currentProject",
        {
          key: "current",
          uuid: newestLegacyPayload.projectData.uuid,
          autosaveData: newestLegacyPayload,
          lastModified: newestLegacyPayload.lastModified,
        },
      );
      window.localStorage.setItem(
        "wickEditor_currentProject_backup",
        JSON.stringify({
          key: "current",
          uuid: newestLegacyPayload.projectData.uuid,
          autosaveData: newestLegacyPayload,
          lastModified: newestLegacyPayload.lastModified,
        }),
      );

      await new Promise<void>((resolve) => {
        globalWindow.editor.clearAutoSavedProject(() => {
          resolve();
        });
      });

      const remainingAutosaves = await new Promise<AutosaveListEntry[]>(
        (resolve) => {
          globalWindow.Wick.AutoSave.getAutosavesList((autosaves: AutosaveListEntry[]) => {
            resolve(autosaves);
          });
        },
      );

      const fallbackCurrent = await globalWindow.__wickStorage?.localforage.getItem(
        "wickEditor_currentProject",
      );
      const dexieCurrent =
        await globalWindow.__wickStorage?.ProjectStorage.getCurrentProject();
      const localBackup = window.localStorage.getItem(
        "wickEditor_currentProject_backup",
      );

      return {
        remainingUUIDs: remainingAutosaves.map((autosave) => autosave.uuid),
        olderUUID: olderLegacyPayload.projectData.uuid,
        newestUUID: newestLegacyPayload.projectData.uuid,
        fallbackCurrentExists: Boolean(fallbackCurrent),
        dexieCurrentExists: Boolean(dexieCurrent),
        localBackupExists: Boolean(localBackup),
      };
    });

    expect(result.remainingUUIDs).toContain(result.olderUUID);
    expect(result.remainingUUIDs).not.toContain(result.newestUUID);
    expect(result.fallbackCurrentExists).toBe(false);
    expect(result.dexieCurrentExists).toBe(false);
    expect(result.localBackupExists).toBe(false);
  });
});
