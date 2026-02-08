import Dexie, { Table } from 'dexie';

export interface KeyValueRecord {
  key: string;
  value: any;
  updatedAt: number;
}

export interface ProjectCacheRecord {
  key: string;
  data: string;
  timestamp: number;
}

export interface FileCacheRecord {
  uuid: string;
  data: Blob | ArrayBuffer;
  updatedAt: number;
}

export interface AutosavePayload {
  projectData: any;
  objectsData: any[];
  lastModified: number;
}

export interface AutosaveRecord extends AutosavePayload {
  uuid: string;
}

export interface CurrentProjectRecord {
  key: string;
  uuid: string;
  lastModified: number;
  autosaveData: AutosavePayload;
}

export interface AutosaveListRecord {
  key: string;
  list: string[];
}

export interface SettingsRecord {
  key: string;
  value: any;
}

/**
 * Wick Editor Database
 * Uses Dexie.js (IndexedDB wrapper) for storage
 */
export class WickDatabase extends Dexie {
  // Key-value storage (replaces localforage)
  keyValue!: Table<KeyValueRecord>;

  // Project cache storage
  projectCache!: Table<ProjectCacheRecord>;

  // File cache storage (for asset files)
  fileCache!: Table<FileCacheRecord>;

  // Autosave storage
  autosaves!: Table<AutosaveRecord>;
  autosaveList!: Table<AutosaveListRecord>;

  // Current project snapshot
  currentProject!: Table<CurrentProjectRecord>;

  // Tool/settings storage
  toolSettings!: Table<SettingsRecord>;
  settings!: Table<SettingsRecord>;

  constructor() {
    super('WickEditorDB');

    this.version(1).stores({
      // Key-value store (general purpose, replaces localforage)
      keyValue: 'key, updatedAt',
      // Project cache (cached projects)
      projectCache: 'key, timestamp',
      // File cache (asset files)
      fileCache: 'uuid, updatedAt',
      // Autosaves and related helpers
      autosaves: 'uuid, lastModified',
      autosaveList: 'key',
      currentProject: 'key, lastModified, uuid',
      // Tool/settings
      toolSettings: 'key',
      settings: 'key',
    });
  }
}

// Create singleton instance
export const db = new WickDatabase();

/**
 * Localforage-compatible API wrapper
 * This allows gradual migration from localforage to Dexie
 */
export const localforageAdapter = {
  config: (options: { name?: string; description?: string }) => {
    // Dexie doesn't need config like localforage, but we'll accept it for compatibility
    console.debug('[Storage] Config called:', options);
  },

  getItem: async <T = any>(key: string): Promise<T | null> => {
    try {
      const item = await db.keyValue.get(key);
      return item ? item.value : null;
    } catch (error) {
      console.error('[Storage] getItem error:', error);
      return null;
    }
  },

  setItem: async <T = any>(key: string, value: T): Promise<T> => {
    try {
      await db.keyValue.put({
        key,
        value,
        updatedAt: Date.now(),
      });
      return value;
    } catch (error) {
      console.error('[Storage] setItem error:', error);
      throw error;
    }
  },

  removeItem: async (key: string): Promise<void> => {
    try {
      await db.keyValue.delete(key);
    } catch (error) {
      console.error('[Storage] removeItem error:', error);
      throw error;
    }
  },

  clear: async (): Promise<void> => {
    try {
      await db.keyValue.clear();
    } catch (error) {
      console.error('[Storage] clear error:', error);
      throw error;
    }
  },

  keys: async (): Promise<string[]> => {
    try {
      const items = await db.keyValue.toArray();
      return items.map(item => item.key);
    } catch (error) {
      console.error('[Storage] keys error:', error);
      return [];
    }
  },

  length: async (): Promise<number> => {
    try {
      return await db.keyValue.count();
    } catch (error) {
      console.error('[Storage] length error:', error);
      return 0;
    }
  },

  iterate: async <T = any>(
    iteratorCallback: (value: T, key: string, iterationNumber: number) => void
  ): Promise<void> => {
    try {
      const items = await db.keyValue.toArray();
      items.forEach((item, index) => {
        iteratorCallback(item.value, item.key, index);
      });
    } catch (error) {
      console.error('[Storage] iterate error:', error);
    }
  },
};


