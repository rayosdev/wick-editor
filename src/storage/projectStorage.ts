/**
 * Project Storage using Dexie.js for autosaves and cached projects.
 * Mirrors the legacy localforage behaviour while providing richer metadata.
 */

import type { AutosavePayload, AutosaveRecord, CurrentProjectRecord, SettingsRecord } from './database';
import { db } from './database';

const CURRENT_PROJECT_KEY = 'current';

export class ProjectStorage {
  static async saveAutosave(autosaveData: AutosavePayload): Promise<void> {
    const uuid = autosaveData.projectData?.uuid as string | undefined;
    if (!uuid) {
      throw new Error('Autosave payload missing project UUID');
    }

    const record: AutosaveRecord = {
      uuid,
      lastModified: autosaveData.lastModified,
      projectData: autosaveData.projectData,
      objectsData: autosaveData.objectsData,
    };

    await db.autosaves.put(record);
  }

  static async getLatestAutosave(): Promise<AutosaveRecord | null> {
    const latest = await db.autosaves.orderBy('lastModified').reverse().first();
    return latest ?? null;
  }

  static async getAllAutosaves(): Promise<AutosaveRecord[]> {
    return db.autosaves.orderBy('lastModified').reverse().toArray();
  }

  static async getAutosaveByUUID(uuid: string): Promise<AutosaveRecord | null> {
    const entry = await db.autosaves.get(uuid);
    return entry ?? null;
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
    const uuid = autosaveData.projectData?.uuid as string | undefined;
    if (!uuid) {
      throw new Error('Current project payload missing project UUID');
    }

    const record: CurrentProjectRecord = {
      key: CURRENT_PROJECT_KEY,
      uuid,
      lastModified: Date.now(),
      autosaveData,
    };

    await db.currentProject.put(record, CURRENT_PROJECT_KEY);
  }

  static async getCurrentProject(): Promise<CurrentProjectRecord | null> {
    const entry = await db.currentProject.get(CURRENT_PROJECT_KEY);
    return entry ?? null;
  }

  static async clearCurrentProject(): Promise<void> {
    await db.currentProject.delete(CURRENT_PROJECT_KEY);
  }

  static async saveSetting(key: string, value: any): Promise<void> {
    const record: SettingsRecord = { key, value };
    await db.settings.put(record, key);
  }

  static async getSetting<T = any>(key: string): Promise<T | null> {
    const entry = await db.settings.get(key);
    return (entry?.value as T) ?? null;
  }

  static async deleteSetting(key: string): Promise<void> {
    await db.settings.delete(key);
  }

  static async getAllSettings(): Promise<Record<string, any>> {
    const entries = await db.settings.toArray();
    return entries.reduce<Record<string, any>>((acc, { key, value }) => {
      acc[key] = value;
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
