import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Load Project From Cache Debug', () => {
  test('save project to localStorage and load from cache @headed', async ({ page }) => {
    // Capture all console messages, especially [ProjectLoad] prefixed ones
    const consoleMessages: string[] = [];
    const consoleErrors: string[] = [];
    const projectLoadLogs: string[] = [];

    page.on('console', msg => {
      const text = msg.text();
      const message = `${msg.type().toUpperCase()}: ${text}`;
      consoleMessages.push(message);
      
      // Capture [ProjectLoad] logs separately
      if (text.includes('[ProjectLoad]')) {
        projectLoadLogs.push(text);
      }
      
      if (msg.type() === 'error') {
        consoleErrors.push(message);
      }
    });

    page.on('pageerror', error => {
      const errorMessage = `PAGE ERROR: ${error.message}`;
      consoleErrors.push(errorMessage);
      consoleMessages.push(errorMessage);
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => window.Wick && window.Wick.WickFile);
    console.log('✅ Page loaded and Wick engine available');

    // Step 1: Read the project file from filesystem
    console.log('\nStep 1: Reading project file from filesystem...');
    const projectPath = path.join(__dirname, 'test-projects', 'timeline-script.wick');
    const projectData = fs.readFileSync(projectPath, 'utf8');
    const projectJson = JSON.parse(projectData);
    
    console.log('Project file structure:', {
      hasProject: !!projectJson.project,
      hasMetadata: !!projectJson.metadata,
      hasExport: !!projectJson.export,
      projectKeys: projectJson.project ? Object.keys(projectJson.project) : [],
    });

    // Step 2: Save project to localStorage (simulating cache)
    console.log('\nStep 2: Saving project to localStorage cache...');
    await page.evaluate((projectDataString) => {
      // Save as JSON string to localStorage with a key that simulates a cached file
      localStorage.setItem('wick_cached_project', projectDataString);
      localStorage.setItem('wick_cached_project_timestamp', Date.now().toString());
      console.log('[ProjectLoad] cache:save', { 
        key: 'wick_cached_project', 
        size: projectDataString.length,
        timestamp: Date.now()
      });
    }, projectData);

    // Step 3: Load from cache using __wickDebug helper (or simulate file open)
    console.log('\nStep 3: Loading project from localStorage cache...');
    try {
      await page.evaluate(() => {
        return new Promise<void>((resolve, reject) => {
          // Get cached project from localStorage
          const cachedData = localStorage.getItem('wick_cached_project');
          if (!cachedData) {
            reject(new Error('No cached project found in localStorage'));
            return;
          }

          console.log('[ProjectLoad] cache:load:start', { 
            key: 'wick_cached_project',
            size: cachedData.length 
          });

          if (window.Wick && window.Wick.WickFile) {
            const blob = new Blob([cachedData], { type: 'application/json' });
            
            window.Wick.WickFile.fromWickFile(blob, (result: unknown) => {
              const loaded = result as { name?: string; uuid?: string } | null;
              console.log('[ProjectLoad] cache:load:fromWickFile:done', { 
                success: !!loaded,
                projectName: loaded?.name,
                projectUuid: loaded?.uuid 
              });
              
              if (loaded && window.editor) {
                try {
                  console.log('[ProjectLoad] cache:load:setupProject:start');
                  window.editor.setupNewProject(loaded);
                  console.log('[ProjectLoad] cache:load:setupProject:done');
                  resolve();
                } catch (setupError: unknown) {
                  const setupErrorObj = setupError as {
                    message?: string;
                    stack?: string;
                  };
                  console.error('[ProjectLoad] cache:load:setupProject:error', { 
                    message: setupErrorObj.message,
                    stack: setupErrorObj.stack 
                  });
                  reject(setupError);
                }
              } else {
                console.error('[ProjectLoad] cache:load:error', { 
                  hasResult: !!result,
                  hasEditor: !!window.editor 
                });
                reject(new Error('Failed to load project from cache'));
              }
            });
          } else {
            reject(new Error('Wick.WickFile not available'));
          }
        });
      });

      console.log('✅ Project loaded from cache successfully');
    } catch (error) {
      console.error('❌ Failed to load project from cache:', error);
      throw error;
    }

    // Step 4: Also test loading via __wickDebug if available
    console.log('\nStep 4: Testing load via __wickDebug.loadFromCache...');
    if (await page.evaluate(() => !!window.__wickDebug?.loadFromCache)) {
      await page.evaluate(() => {
        return new Promise<void>((resolve, reject) => {
            if (window.__wickDebug?.loadFromCache) {
            window.__wickDebug.loadFromCache('wick_cached_project', (success: boolean) => {
              if (success) {
                console.log('[ProjectLoad] cache:__wickDebug:load:success');
                resolve();
              } else {
                reject(new Error('__wickDebug.loadFromCache returned false'));
              }
            });
          } else {
            reject(new Error('__wickDebug.loadFromCache not available'));
          }
        });
      });
      console.log('✅ Loaded via __wickDebug.loadFromCache');
    } else {
      console.log('⚠️  __wickDebug.loadFromCache not available (will be added)');
    }

    // Wait for any async operations
    await page.waitForTimeout(2000);

    // Check project state
    const projectState = await page.evaluate(() => {
      return {
        wickExists: !!window.Wick,
        projectExists: !!window.project,
        projectName: window.project?.name,
        projectChildren: window.project?.children?.length || 0,
        editorProject: !!window.editor?.project,
        editorProjectName: window.editor?.project?.name,
        cacheExists: !!localStorage.getItem('wick_cached_project')
      };
    });

    console.log('Final project state:', projectState);

    // Report [ProjectLoad] logs specifically
    console.log('\n=== [ProjectLoad] LOGS ===');
    projectLoadLogs.forEach((log, index) => {
      console.log(`${index + 1}. ${log}`);
    });

    // Report errors
    if (consoleErrors.length > 0) {
      console.log('\n=== ERRORS FOUND ===');
      consoleErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }

    // Verify project loaded successfully
    expect(projectState.projectExists || projectState.editorProject).toBe(true);
    console.log('🎉 Cache load debug test completed!');
    
    // Keep browser open for a few seconds so you can see the result
    console.log('Keeping browser open for 5 seconds...');
    await page.waitForTimeout(5000);
  });

  test('save project to IndexedDB (localforage) and load from cache @headed', async ({ page }) => {
    // This test uses IndexedDB via localforage (matching the app's autosave system)
    const consoleMessages: string[] = [];
    const projectLoadLogs: string[] = [];

    page.on('console', msg => {
      const text = msg.text();
      consoleMessages.push(`${msg.type().toUpperCase()}: ${text}`);
      if (text.includes('[ProjectLoad]')) {
        projectLoadLogs.push(text);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => window.Wick && window.Wick.WickFile);

    // Read project file
    const projectPath = path.join(__dirname, 'test-projects', 'timeline-script.wick');
    const projectData = fs.readFileSync(projectPath, 'utf8');

    // Save to IndexedDB using localforage (if available) or localStorage fallback
    console.log('\nSaving project to IndexedDB/localforage...');
    const saveResult = await page.evaluate(async (projectDataString: string) => {
      try {
        // Try to use localforage (IndexedDB) if available
        if (window.localforage) {
          await window.localforage.setItem('wick_test_cached_project', projectDataString);
          // Verify it was saved
          const saved = await window.localforage.getItem('wick_test_cached_project');
          const driver = window.localforage.driver ? await window.localforage.driver() : 'localforage';
          console.log('[ProjectLoad] cache:indexeddb:save:success', { 
            key: 'wick_test_cached_project',
            driver: driver,
            verified: !!saved,
            size: saved?.length
          });
          return { method: 'indexeddb', success: !!saved };
        } else {
          // Fallback to localStorage
          localStorage.setItem('wick_test_cached_project', projectDataString);
          const saved = localStorage.getItem('wick_test_cached_project');
          console.log('[ProjectLoad] cache:localStorage:save:success', { 
            key: 'wick_test_cached_project',
            verified: !!saved,
            size: saved?.length
          });
          return { method: 'localStorage', success: !!saved };
        }
      } catch (e: unknown) {
        const err = e as { message?: string; stack?: string };
        console.error('[ProjectLoad] cache:save:error', { message: err.message, stack: err.stack });
        return { method: 'error', success: false, error: err.message };
      }
    }, projectData);
    
    console.log('Save result:', saveResult);
    if (!saveResult.success) {
      console.warn('⚠️  IndexedDB save failed, using localStorage fallback...');
      // Fallback to localStorage if IndexedDB failed
      await page.evaluate((projectDataString: string) => {
        localStorage.setItem('wick_test_cached_project', projectDataString);
        console.log('[ProjectLoad] cache:localStorage:fallback:save', { 
          key: 'wick_test_cached_project',
          size: projectDataString.length
        });
      }, projectData);
    }

    // Load from IndexedDB/localStorage
    console.log('\nLoading project from IndexedDB/localStorage...');
    await page.evaluate(() => {
      return new Promise<void>((resolve, reject) => {
        (async () => {
          try {
            let cachedData: string | null = null;
            let source = 'none';
            
            // Try IndexedDB first if localforage is available
            if (window.localforage) {
              try {
                cachedData = await window.localforage.getItem('wick_test_cached_project');
                if (cachedData) {
                  source = 'indexeddb';
                  console.log('[ProjectLoad] cache:indexeddb:load:success', { 
                    found: true,
                    size: cachedData?.length 
                  });
                } else {
                  console.log('[ProjectLoad] cache:indexeddb:load:notfound');
                }
              } catch (e: unknown) {
                const err = e as { message?: string };
                console.warn('[ProjectLoad] cache:indexeddb:load:error', { message: err.message });
              }
            } else {
              console.log('[ProjectLoad] cache:indexeddb:load:unavailable');
            }
            
            // Fallback to localStorage
            if (!cachedData) {
              cachedData = localStorage.getItem('wick_test_cached_project');
              if (cachedData) {
                source = 'localStorage';
                console.log('[ProjectLoad] cache:localStorage:load:success', { 
                  found: true,
                  size: cachedData?.length 
                });
              } else {
                console.log('[ProjectLoad] cache:localStorage:load:notfound');
              }
            }

            if (!cachedData) {
              // Debug: check what's actually in storage
              const allKeys = Object.keys(localStorage);
              console.error('[ProjectLoad] cache:load:debug', {
                localStorageKeys: allKeys,
                hasLocalForage: !!window.localforage,
                searchedKey: 'wick_test_cached_project'
              });
              reject(new Error(`No cached project found in ${source}. Checked indexeddb and localStorage.`));
              return;
            }

            const blob = new Blob([cachedData], { type: 'application/json' });
            window.Wick.WickFile.fromWickFile(blob, (result: unknown) => {
              if (result && window.editor) {
                window.editor.setupNewProject(result);
                resolve();
              } else {
                reject(new Error('Failed to load project'));
              }
            });
          } catch (e) {
            reject(e);
          }
        })();
      });
    });

    await page.waitForTimeout(1000);

    const projectState = await page.evaluate(() => ({
      projectExists: !!window.project || !!window.editor?.project,
      projectName: window.project?.name || window.editor?.project?.name
    }));

    expect(projectState.projectExists).toBe(true);
    console.log('✅ IndexedDB cache load test completed');
    
    // Keep browser open for a few seconds so you can see the result
    console.log('Keeping browser open for 5 seconds...');
    await page.waitForTimeout(5000);
  });
});
