import { db } from './database';

/**
 * File Cache Storage
 * Handles caching of asset files (images, sounds, etc.)
 */
export class FileCache {
  private static readonly FILE_PREFIX = 'filesrc_';

  /**
   * Get the storage key for a file UUID
   */
  static getKeyForUUID(uuid: string): string {
    return this.FILE_PREFIX + uuid;
  }

  /**
   * Save a file to cache
   */
  static async save(uuid: string, data: Blob | ArrayBuffer): Promise<void> {
    try {
      await db.fileCache.put({
        uuid,
        data,
        updatedAt: Date.now(),
      });
      console.debug('[FileCache] Saved file to cache', { uuid });
    } catch (error) {
      console.error('[FileCache] Save error:', error);
      throw error;
    }
  }

  /**
   * Load a file from cache
   */
  static async load(uuid: string): Promise<Blob | ArrayBuffer | null> {
    try {
      const cached = await db.fileCache.get(uuid);
      return cached?.data || null;
    } catch (error) {
      console.error('[FileCache] Load error:', error);
      return null;
    }
  }

  /**
   * Remove a file from cache
   */
  static async remove(uuid: string): Promise<void> {
    try {
      await db.fileCache.delete(uuid);
      console.debug('[FileCache] Removed file from cache', { uuid });
    } catch (error) {
      console.error('[FileCache] Remove error:', error);
    }
  }

  /**
   * Clear all files from cache
   */
  static async clear(): Promise<void> {
    try {
      await db.fileCache.clear();
      console.debug('[FileCache] Cleared all files from cache');
    } catch (error) {
      console.error('[FileCache] Clear error:', error);
    }
  }

  /**
   * Load files for a project (batch operation)
   */
  static async loadFilesForProject(
    assetUuids: string[]
  ): Promise<Map<string, Blob | ArrayBuffer>> {
    const files = new Map<string, Blob | ArrayBuffer>();
    
    try {
      const cachedFiles = await db.fileCache.bulkGet(assetUuids);
      cachedFiles.forEach((cached, index) => {
        if (cached) {
          files.set(assetUuids[index], cached.data);
        }
      });
    } catch (error) {
      console.error('[FileCache] Load files for project error:', error);
    }
    
    return files;
  }
}


