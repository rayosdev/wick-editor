/**
 * Project Storage using Dexie.js for autosaves and cached projects.
 * Mirrors the legacy localforage behaviour while providing richer metadata.
 */

import type { AutosavePayload, AutosaveRecord, CurrentProjectRecord, SettingsRecord } from './database';
import { db } from './database';
import {
  parseAutosavePayload,
  parseSettingsRecord,
  AutosaveRecordSchema,
  CurrentProjectRecordSchema,
  SettingsRecordSchema,
} from './schemas';

const CURRENT_PROJECT_KEY = 'current';

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
  }

  static async getLatestAutosave(): Promise<AutosaveRecord | null> {
    const latest = await db.autosaves.orderBy('lastModified').reverse().first();
    if (!latest) {
      return null;
    }

    const parsed = AutosaveRecordSchema.safeParse(latest);
    if (!parsed.success) {
      console.warn('[ProjectStorage] Invalid autosave record in storage, ignoring latest entry', parsed.error);
      return null;
    }

    return parsed.data;
  }

  static async getAllAutosaves(): Promise<AutosaveRecord[]> {
    const autosaves = await db.autosaves.orderBy('lastModified').reverse().toArray();
    return autosaves.flatMap((autosave) => {
      const parsed = AutosaveRecordSchema.safeParse(autosave);
      if (!parsed.success) {
        console.warn('[ProjectStorage] Invalid autosave record in storage, skipping', parsed.error);
        return [];
      }
      return [parsed.data];
    });
  }

  static async getAutosaveByUUID(uuid: string): Promise<AutosaveRecord | null> {
    const entry = await db.autosaves.get(uuid);
    if (!entry) {
      return null;
    }

    const parsed = AutosaveRecordSchema.safeParse(entry);
    if (!parsed.success) {
      console.warn('[ProjectStorage] Invalid autosave record for UUID, skipping', { uuid, error: parsed.error });
      return null;
    }

    return parsed.data;
  }

  static async deleteAutosave(uuid: string): Promise<void> {
    await db.autosaves.delete(uuid);
  }

  static async cleanupOldAutosaves(keepCount = 10): Promise<void> {
    const autosaves = await this.getAllAutosaves();
    if (autosaves.length <= keepCount) {
      return;
    }

    const toDelete = autosaves.slice(keepCount);
    if (toDelete.length) {
      await db.autosaves.bulkDelete(toDelete.map(({ uuid }) => uuid));
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
}

export default ProjectStorage;
