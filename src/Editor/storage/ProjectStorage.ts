/**
 * Project Storage using Dexie.js for better IndexedDB management
 * 
 * This provides:
 * - Type-safe storage operations
 * - Indexed queries (by UUID, lastModified)
 * - Better transaction handling
 * - Bulk operations for autosaves
 */

import Dexie, { Table } from 'dexie';

// Types for storage
export interface AutosaveEntry {
  uuid: string;
  lastModified: number;
  projectData: any;
  objectsData: any[];
}

export interface CurrentProjectEntry {
  uuid: string;
  lastModified: number;
  autosaveData: {
    projectData: any;
    objectsData: any[];
    lastModified: number;
  };
}

export interface SettingsEntry {
  key: string;
  value: any;
}

// Define the database schema
class WickEditorDatabase extends Dexie {
  autosaves!: Table<AutosaveEntry, string>; // uuid as primary key
  currentProject!: Table<CurrentProjectEntry, number>; // id as primary key (auto-increment)
  settings!: Table<SettingsEntry, string>; // key as primary key

  constructor() {
    super('WickEditor');
    
    // Define schema
    this.version(1).stores({
      autosaves: 'uuid, lastModified', // Index by uuid and lastModified
      currentProject: '++id, uuid, lastModified', // Auto-increment id, index by uuid and lastModified
      settings: 'key'
    });
  }
}

// Create database instance
const db = new WickEditorDatabase();

/**
 * Project Storage Service
 * Handles all project persistence operations
 */
export class ProjectStorage {
  /**
   * Save an autosave entry
   */
  static async saveAutosave(autosaveData: {
    projectData: any;
    objectsData: any[];
    lastModified: number;
  }): Promise<void> {
    const uuid = autosaveData.projectData.uuid;
    
    await db.autosaves.put({
      uuid,
      lastModified: autosaveData.lastModified,
      projectData: autosaveData.projectData,
      objectsData: autosaveData.objectsData,
    });
  }

  /**
   * Get the latest autosave entry
   */
  static async getLatestAutosave(): Promise<AutosaveEntry | null> {
    const latest = await db.autosaves
      .orderBy('lastModified')
      .reverse()
      .first();
    
    return latest || null;
  }

  /**
   * Get all autosaves sorted by lastModified (newest first)
   */
  static async getAllAutosaves(): Promise<AutosaveEntry[]> {
    return await db.autosaves
      .orderBy('lastModified')
      .reverse()
      .toArray();
  }

  /**
   * Get autosave by UUID
   */
  static async getAutosaveByUUID(uuid: string): Promise<AutosaveEntry | null> {
    return (await db.autosaves.get(uuid)) || null;
  }

  /**
   * Delete autosave by UUID
   */
  static async deleteAutosave(uuid: string): Promise<void> {
    await db.autosaves.delete(uuid);
  }

  /**
   * Delete old autosaves (keep only the N most recent)
   */
  static async cleanupOldAutosaves(keepCount: number = 10): Promise<void> {
    const all = await this.getAllAutosaves();
    if (all.length > keepCount) {
      const toDelete = all.slice(keepCount);
      await db.autosaves.bulkDelete(toDelete.map(a => a.uuid));
    }
  }

  /**
   * Save current project (single entry, always overwrites)
   */
  static async saveCurrentProject(autosaveData: {
    projectData: any;
    objectsData: any[];
    lastModified: number;
  }): Promise<void> {
    const uuid = autosaveData.projectData.uuid;
    const entry: CurrentProjectEntry = {
      uuid,
      lastModified: Date.now(),
      autosaveData,
    };

    // Delete old entries and add new one
    await db.currentProject.clear();
    await db.currentProject.add(entry);
  }

  /**
   * Get current project
   */
  static async getCurrentProject(): Promise<CurrentProjectEntry | null> {
    const entry = await db.currentProject.toCollection().first();
    return entry || null;
  }

  /**
   * Clear current project
   */
  static async clearCurrentProject(): Promise<void> {
    await db.currentProject.clear();
  }

  /**
   * Save a setting
   */
  static async saveSetting(key: string, value: any): Promise<void> {
    await db.settings.put({ key, value });
  }

  /**
   * Get a setting
   */
  static async getSetting(key: string): Promise<any> {
    const entry = await db.settings.get(key);
    return entry?.value ?? null;
  }

  /**
   * Delete a setting
   */
  static async deleteSetting(key: string): Promise<void> {
    await db.settings.delete(key);
  }

  /**
   * Get all settings
   */
  static async getAllSettings(): Promise<Record<string, any>> {
    const entries = await db.settings.toArray();
    const result: Record<string, any> = {};
    entries.forEach(entry => {
      result[entry.key] = entry.value;
    });
    return result;
  }

  /**
   * Check if current project exists and is recent (within 24 hours)
   */
  static async hasRecentCurrentProject(): Promise<boolean> {
    const entry = await this.getCurrentProject();
    if (!entry) return false;
    
    const hoursSinceLastSave = (Date.now() - entry.lastModified) / (1000 * 60 * 60);
    return hoursSinceLastSave <= 24;
  }
}

export default ProjectStorage;

