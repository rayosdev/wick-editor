import { test, expect } from '@playwright/test';

test.describe('Dexie Storage Test', () => {
  test('verify Dexie storage is working for cache save/load', async ({ page }) => {
    // Navigate to editor
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => window.Wick && window.Wick.Project && window.editor);
    
    console.log('✅ Page loaded');

    // Step 1: Check if Dexie is available
    console.log('\n=== STEP 1: CHECKING DEXIE AVAILABILITY ===');
    const dexieCheck = await page.evaluate(() => {
      return {
        hasDexie: !!(window as any).__wickStorage && !!(window as any).__wickStorage.db,
        hasProjectCache: !!(window as any).__wickStorage?.ProjectCache,
        dbName: (window as any).__wickStorage?.db?.name,
        dbVersion: (window as any).__wickStorage?.db?.verno,
        dbIsOpen: (window as any).__wickStorage?.db?.isOpen(),
      };
    });
    
    console.log('Dexie check:', dexieCheck);
    expect(dexieCheck.hasDexie).toBe(true);
    expect(dexieCheck.hasProjectCache).toBe(true);
    expect(dexieCheck.dbName).toBe('WickEditorDB');

    // Step 2: Test saving to cache using Dexie
    console.log('\n=== STEP 2: TESTING DEXIE SAVE ===');
    const testProjectData = JSON.stringify({
      test: 'data',
      timestamp: Date.now(),
      project: { name: 'Test Project' }
    });
    
    const saveResult = await page.evaluate(async (data) => {
      try {
        if ((window as any).__wickStorage && (window as any).__wickStorage.ProjectCache) {
          await (window as any).__wickStorage.ProjectCache.save(data);
          return { success: true, method: 'dexie' };
        } else if ((window as any).__wickDebug && (window as any).__wickDebug.saveToIndexedDB) {
          await (window as any).__wickDebug.saveToIndexedDB(data);
          return { success: true, method: 'indexeddb' };
        } else {
          localStorage.setItem('wick_cached_project', data);
          return { success: true, method: 'localStorage' };
        }
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        return { success: false, error: errorMessage, method: 'unknown' };
      }
    }, testProjectData);
    
    console.log('Save result:', saveResult);
    expect(saveResult.success).toBe(true);

    // Step 3: Verify data was saved to Dexie
    console.log('\n=== STEP 3: VERIFYING DEXIE DATA ===');
    const dexieDataCheck = await page.evaluate(async () => {
      try {
        if ((window as any).__wickStorage && (window as any).__wickStorage.db) {
          const db = (window as any).__wickStorage.db;
          const cached = await db.projectCache.get('wick_cached_project');
          return {
            found: !!cached,
            hasData: !!cached?.data,
            dataSize: cached?.data?.length || 0,
            timestamp: cached?.timestamp || null,
          };
        }
        return { found: false, reason: 'Dexie not available' };
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        return { found: false, error: errorMessage };
      }
    });
    
    console.log('Dexie data check:', dexieDataCheck);
    expect(dexieDataCheck.found).toBe(true);
    expect(dexieDataCheck.hasData).toBe(true);
    expect(dexieDataCheck.dataSize).toBeGreaterThan(0);

    // Step 4: Refresh page
    console.log('\n=== STEP 4: REFRESHING PAGE ===');
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.Wick && window.Wick.Project && window.editor);
    await page.waitForTimeout(2000); // Wait for Dexie to initialize

    // Step 5: Test loading from Dexie
    console.log('\n=== STEP 5: TESTING DEXIE LOAD ===');
    const loadResult = await page.evaluate(async () => {
      try {
        // Check if Dexie is available after reload
        const hasDexie = !!(window as any).__wickStorage && !!(window as any).__wickStorage.ProjectCache;
        
        if (hasDexie) {
          const data = await (window as any).__wickStorage.ProjectCache.load();
          return {
            success: true,
            method: 'dexie',
            hasData: !!data,
            dataSize: data?.length || 0,
          };
        } else if ((window as any).__wickDebug && (window as any).__wickDebug.loadFromIndexedDB) {
          const data = await new Promise<string | null>((resolve) => {
            (window as any).__wickDebug.loadFromIndexedDB('wick_cached_project', (_success: boolean) => {
              const cached = localStorage.getItem('wick_cached_project');
              resolve(cached);
            });
          });
          return {
            success: true,
            method: 'indexeddb',
            hasData: !!data,
            dataSize: typeof data === 'string' ? data.length : 0,
          };
        } else {
          const data = localStorage.getItem('wick_cached_project');
          return {
            success: true,
            method: 'localStorage',
            hasData: !!data,
            dataSize: data?.length || 0,
          };
        }
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        return { success: false, error: errorMessage };
      }
    });
    
    console.log('Load result:', loadResult);
    expect(loadResult.success).toBe(true);
    expect(loadResult.hasData).toBe(true);
    expect(loadResult.dataSize).toBeGreaterThan(0);
    
    // Verify the data matches - check Dexie directly
    const dataVerification = await page.evaluate(async () => {
      try {
        if ((window as any).__wickStorage && (window as any).__wickStorage.db) {
          const db = (window as any).__wickStorage.db;
          const cached = await db.projectCache.get('wick_cached_project');
          if (cached && cached.data) {
            const parsed = JSON.parse(cached.data);
            return {
              success: true,
              test: parsed.test,
              projectName: parsed.project?.name,
              hasTimestamp: !!parsed.timestamp,
            };
          }
        }
        // Fallback to localStorage
        const localStorageData = localStorage.getItem('wick_cached_project');
        if (localStorageData) {
          const parsed = JSON.parse(localStorageData);
          return {
            success: true,
            test: parsed.test,
            projectName: parsed.project?.name,
            hasTimestamp: !!parsed.timestamp,
            source: 'localStorage',
          };
        }
        return { success: false, reason: 'No data found' };
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        return { success: false, error: errorMessage };
      }
    });
    
    console.log('Data verification:', dataVerification);
    expect(dataVerification.success).toBe(true);
    expect(dataVerification.test).toBe('data');
    expect(dataVerification.projectName).toBe('Test Project');

    console.log('\n✅ Dexie storage test complete!');
  });
});
