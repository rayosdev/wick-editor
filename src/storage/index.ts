/**
 * Storage Module
 * Centralized storage using Dexie.js (IndexedDB)
 * 
 * This module provides:
 * - Database setup and configuration
 * - Localforage-compatible adapter for gradual migration
 * - Specialized storage classes for different use cases
 */

export { db, WickDatabase, localforageAdapter } from './database';
export { ProjectCache } from './projectCache';
export { FileCache } from './fileCache';
export { ProjectStorage } from './projectStorage';

// Re-export for convenience
export { db as default } from './database';


