import { db } from './database';

/**
 * Project Cache Storage
 * Handles caching of Wick project files
 */
export class ProjectCache {
  private static readonly CACHE_KEY = 'wick_cached_project';

  /**
   * Save a project to cache
   */
  static async save(projectData: string): Promise<void> {
    try {
      await db.projectCache.put({
        key: this.CACHE_KEY,
        data: projectData,
        timestamp: Date.now(),
      });
      console.debug('[ProjectCache] Saved project to cache', {
        size: projectData.length,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('[ProjectCache] Save error:', error);
      throw error;
    }
  }

  /**
   * Load a project from cache
   */
  static async load(): Promise<string | null> {
    try {
      const cached = await db.projectCache.get(this.CACHE_KEY);
      if (cached) {
        console.debug('[ProjectCache] Loaded project from cache', {
          size: cached.data.length,
          timestamp: cached.timestamp,
        });
        return cached.data;
      }
      return null;
    } catch (error) {
      console.error('[ProjectCache] Load error:', error);
      return null;
    }
  }

  /**
   * Check if cache exists
   */
  static async exists(): Promise<boolean> {
    try {
      const cached = await db.projectCache.get(this.CACHE_KEY);
      return !!cached;
    } catch (error) {
      return false;
    }
  }

  /**
   * Clear the project cache
   */
  static async clear(): Promise<void> {
    try {
      await db.projectCache.delete(this.CACHE_KEY);
      console.debug('[ProjectCache] Cleared project cache');
    } catch (error) {
      console.error('[ProjectCache] Clear error:', error);
    }
  }

  /**
   * Get cache timestamp
   */
  static async getTimestamp(): Promise<number | null> {
    try {
      const cached = await db.projectCache.get(this.CACHE_KEY);
      return cached?.timestamp || null;
    } catch (error) {
      return null;
    }
  }
}


