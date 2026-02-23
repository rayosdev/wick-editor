/**
 * Project Storage using Dexie.js for autosaves and cached projects.
 * Mirrors the legacy localforage behaviour while providing richer metadata.
 */

import type { AutosavePayload, AutosaveRecord, CurrentProjectRecord, SettingsRecord } from './database';
import { db } from './database';
import {
  getLatestAutosaveIndexEntry,
  removeAutosaveIndexEntry,
  replaceAutosaveIndexSource,
  upsertAutosaveIndexEntry,
  type AutosaveSource,
} from "./autosaveIndex";
import {
  parseAutosavePayload,
  parseSettingsRecord,
  AutosaveRecordSchema,
  CurrentProjectRecordSchema,
  SettingsRecordSchema,
} from './schemas';

const CURRENT_PROJECT_KEY = 'current';
type LegacyAutosaveEntry = { uuid: string; lastModified?: number };

export class ProjectStorage {
  static async saveAutosave(autosaveData: AutosavePayload): Promise<void> {
    const parsedPayload = parseAutosavePayload(autosaveData);
    const uuid = parsedPayload.projectData.uuid;

    const record: AutosaveRecord = {
      uuid,
      lastModified: parsedPayload.lastModified,
      projectData: parsedPayload.projectData,
      objectsData: parsedPayload.objectsData,
    };

    await db.autosaves.put(record);
    upsertAutosaveIndexEntry("dexie", uuid, parsedPayload.lastModified);
  }

  static async getLatestAutosave(): Promise<AutosaveRecord | null> {
    const indexedLatest = getLatestAutosaveIndexEntry("dexie");
    if (indexedLatest) {
      const indexedEntry = await db.autosaves.get(indexedLatest.uuid);
      if (indexedEntry) {
        const indexedParsed = AutosaveRecordSchema.safeParse(indexedEntry);
        if (indexedParsed.success) {
          return indexedParsed.data;
        }
      }

      removeAutosaveIndexEntry("dexie", indexedLatest.uuid);
    }

    const latest = await db.autosaves.orderBy("lastModified").reverse().first();
    if (!latest) {
      return null;
    }

    const parsed = AutosaveRecordSchema.safeParse(latest);
    if (!parsed.success) {
      console.warn(
        "[ProjectStorage] Invalid autosave record in storage, ignoring latest entry",
        parsed.error,
      );
      if (typeof latest.uuid === "string") {
        removeAutosaveIndexEntry("dexie", latest.uuid);
      }
      return null;
    }

    upsertAutosaveIndexEntry("dexie", parsed.data.uuid, parsed.data.lastModified);
    return parsed.data;
  }

  static async getAllAutosaves(): Promise<AutosaveRecord[]> {
    const autosaves = await db.autosaves.orderBy("lastModified").reverse().toArray();
    return autosaves.flatMap((autosave) => {
      const parsed = AutosaveRecordSchema.safeParse(autosave);
      if (!parsed.success) {
        console.warn(
          "[ProjectStorage] Invalid autosave record in storage, skipping",
          parsed.error,
        );
        if (typeof autosave.uuid === "string") {
          removeAutosaveIndexEntry("dexie", autosave.uuid);
        }
        return [];
      }
      upsertAutosaveIndexEntry("dexie", parsed.data.uuid, parsed.data.lastModified);
      return [parsed.data];
    });
  }

  static async getAutosaveByUUID(uuid: string): Promise<AutosaveRecord | null> {
    const entry = await db.autosaves.get(uuid);
    if (!entry) {
      removeAutosaveIndexEntry("dexie", uuid);
      return null;
    }

    const parsed = AutosaveRecordSchema.safeParse(entry);
    if (!parsed.success) {
      console.warn('[ProjectStorage] Invalid autosave record for UUID, skipping', { uuid, error: parsed.error });
      removeAutosaveIndexEntry("dexie", uuid);
      return null;
    }

    upsertAutosaveIndexEntry("dexie", parsed.data.uuid, parsed.data.lastModified);
    return parsed.data;
  }

  static async deleteAutosave(uuid: string): Promise<void> {
    await db.autosaves.delete(uuid);
    removeAutosaveIndexEntry("dexie", uuid);
  }

  static async cleanupOldAutosaves(keepCount = 10): Promise<void> {
    const autosaves = await this.getAllAutosaves();
    if (autosaves.length <= keepCount) {
      return;
    }

    const toDelete = autosaves.slice(keepCount);
    if (toDelete.length) {
      await db.autosaves.bulkDelete(toDelete.map(({ uuid }) => uuid));
      toDelete.forEach(({ uuid }) => {
        removeAutosaveIndexEntry("dexie", uuid);
      });
    }
  }

  static async saveCurrentProject(autosaveData: AutosavePayload): Promise<void> {
    const parsedPayload = parseAutosavePayload(autosaveData);
    const uuid = parsedPayload.projectData.uuid;

    const record: CurrentProjectRecord = {
      key: CURRENT_PROJECT_KEY,
      uuid,
      lastModified: Date.now(),
      autosaveData: parsedPayload,
    };

    await db.currentProject.put(record, CURRENT_PROJECT_KEY);
  }

  static async getCurrentProject(): Promise<CurrentProjectRecord | null> {
    const entry = await db.currentProject.get(CURRENT_PROJECT_KEY);
    if (!entry) {
      return null;
    }

    const parsed = CurrentProjectRecordSchema.safeParse(entry);
    if (!parsed.success) {
      console.warn('[ProjectStorage] Invalid current project record in storage, ignoring', parsed.error);
      return null;
    }

    return parsed.data;
  }

  static async clearCurrentProject(): Promise<void> {
    await db.currentProject.delete(CURRENT_PROJECT_KEY);
  }

  static async saveSetting(key: string, value: unknown): Promise<void> {
    const record: SettingsRecord = parseSettingsRecord({ key, value });
    await db.settings.put(record, key);
  }

  static async getSetting<T = unknown>(key: string): Promise<T | null> {
    const entry = await db.settings.get(key);
    if (!entry) {
      return null;
    }

    const parsed = SettingsRecordSchema.safeParse(entry);
    if (!parsed.success) {
      console.warn('[ProjectStorage] Invalid setting record in storage, ignoring', { key, error: parsed.error });
      return null;
    }

    return parsed.data.value as T;
  }

  static async deleteSetting(key: string): Promise<void> {
    await db.settings.delete(key);
  }

  static async getAllSettings(): Promise<Record<string, unknown>> {
    const entries = await db.settings.toArray();
    return entries.reduce<Record<string, unknown>>((acc, entry) => {
      const parsed = SettingsRecordSchema.safeParse(entry);
      if (!parsed.success) {
        console.warn('[ProjectStorage] Invalid setting record in storage, skipping', parsed.error);
        return acc;
      }

      acc[parsed.data.key] = parsed.data.value;
      return acc;
    }, {});
  }

  static async hasRecentCurrentProject(): Promise<boolean> {
    const entry = await this.getCurrentProject();
    if (!entry) {
      return false;
    }

    const hoursSinceLastSave = (Date.now() - entry.lastModified) / (1000 * 60 * 60);
    return hoursSinceLastSave <= 24;
  }

  static recordLegacyAutosave(entry: LegacyAutosaveEntry): void {
    if (!entry?.uuid) {
      return;
    }

    upsertAutosaveIndexEntry("legacy", entry.uuid, entry.lastModified ?? Date.now());
  }

  static reconcileLegacyAutosaves(entries: LegacyAutosaveEntry[]): void {
    replaceAutosaveIndexSource("legacy", entries);
  }

  static removeLegacyAutosave(uuid: string): void {
    removeAutosaveIndexEntry("legacy", uuid);
  }

  static getLatestIndexedAutosave(): {
    source: AutosaveSource;
    uuid: string;
    lastModified: number;
  } | null {
    const latest = getLatestAutosaveIndexEntry();
    if (!latest) {
      return null;
    }

    return {
      source: latest.source,
      uuid: latest.uuid,
      lastModified: latest.lastModified,
    };
  }

  static getLatestIndexedAutosaveForSource(
    source: AutosaveSource,
  ): {
    source: AutosaveSource;
    uuid: string;
    lastModified: number;
  } | null {
    const latest = getLatestAutosaveIndexEntry(source);
    if (!latest) {
      return null;
    }

    return {
      source: latest.source,
      uuid: latest.uuid,
      lastModified: latest.lastModified,
    };
  }

}

export default ProjectStorage;
