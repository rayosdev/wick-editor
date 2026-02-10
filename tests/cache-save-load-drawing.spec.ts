import { test, expect } from '@playwright/test';

test.describe('Cache Save/Load Drawing Test', () => {
  test('draw line, save to cache, refresh, load from cache, verify line persists', async ({ page }) => {
    // Navigate to editor
    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => window.Wick && window.Wick.Project && window.editor);
    
    console.log('✅ Page loaded and Wick engine available');

    // Step 1: Create a drawing using the editor API
    console.log('\n=== STEP 1: CREATING DRAWING ===');
    const drawingResult = await page.evaluate(() => {
      if (typeof window.editor === 'undefined' || typeof window.project === 'undefined') {
        return { error: 'Editor or project not found' };
      }

      const editor = window.editor;
      const project = window.project;
      const Wick = window.Wick;
      const paper = window.paper;

      if (!paper || !paper.Path) {
        return { error: 'Paper.js not available' };
      }

      try {
        // Ensure we have an active frame
        if (!project.activeFrame) {
          project.insertBlankFrame();
        }

        const activeFrame = project.activeFrame;

        // Create a simple line path using paper.js
        // This mimics what the line tool does
        const startPoint = new paper.Point(100, 100);
        const endPoint = new paper.Point(500, 500);
        
        // Create a paper.js path (without inserting it)
        const paperPath = new paper.Path.Line(startPoint, endPoint);
        paperPath.strokeColor = new paper.Color(0, 0, 0); // Black
        paperPath.strokeWidth = 3;
        paperPath.strokeCap = 'round';

        // Export the path JSON and create a Wick path from it
        const pathJson = paperPath.exportJSON({ asString: false });
        
        // Create Wick path from the JSON - this is the proper way
        const wickPath = new Wick.Path({
          json: pathJson,
          project: project
        });

        // Debug: Check frame state before adding path
        const childrenBefore = activeFrame.getChildren ? activeFrame.getChildren().length : 0;
        
        // Add the Wick path to the active frame
        // This should call addChild internally which adds to _children
        activeFrame.addPath(wickPath);
        
        // Debug: Check frame state after adding path
        const childrenAfter = activeFrame.getChildren ? activeFrame.getChildren().length : 0;
        const allChildren = activeFrame.getChildren ? activeFrame.getChildren() : [];
        const pathInChildrenAfter = allChildren.some((child: { uuid?: string }) => {
          return child === wickPath || child.uuid === wickPath.uuid;
        });
        
        // Ensure the path has a view and is rendered
        // The view creates the paper.js representation
        if (wickPath.view) {
          wickPath.view.render();
        }
        
        // Render the project view to update the canvas
        if (project.view && typeof project.view.render === 'function') {
          project.view.render();
        }

        // Trigger project change to ensure it's saved
        if (typeof editor.projectDidChange === 'function') {
          editor.projectDidChange({ actionName: 'Draw Line' });
        }

        // Verify the path was added
        const paths = activeFrame.paths || [];
        const pathCount = paths.length;
        const hasPath = pathCount > 0;
        
        // Also check if path is in children (this is what gets serialized)
        // Use getChildren() instead of children property
        const children = activeFrame.getChildren ? activeFrame.getChildren() : [];
        const pathInChildren = children.some((child: { classname?: string }) => {
          return child && (child.classname === 'Path' || child instanceof Wick.Path);
        });
        const pathChildrenCount = children.filter((child: { classname?: string }) => {
          return child && (child.classname === 'Path' || child instanceof Wick.Path);
        }).length;
        
        // Check path structure more carefully
        let pathHasJson = false;
        let pathSegments = 0;
        let pathJsonData = null;
        
        if (hasPath && paths[0]) {
          pathJsonData = paths[0].json;
          if (pathJsonData) {
            pathHasJson = true;
            // Check if segments exist and get count
            if (pathJsonData.segments && Array.isArray(pathJsonData.segments)) {
              pathSegments = pathJsonData.segments.length;
            } else if (pathJsonData.pathData) {
              // Alternative: check pathData
              pathSegments = 1; // At least has path data
            }
          }
        }

        return {
          success: true,
          pathCount,
          hasPath,
          pathHasJson,
          pathSegments,
          pathInChildren,
          pathChildrenCount,
          totalChildren: children.length,
          childrenBefore,
          childrenAfter,
          pathInChildrenAfter,
          pathJsonKeys: pathJsonData ? Object.keys(pathJsonData) : [],
          message: 'Line created successfully'
        };
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        const errorStack = e instanceof Error ? e.stack : undefined;
        return {
          error: 'Failed to create path',
          errorMessage,
          stack: errorStack
        };
      }
    });

    console.log('Drawing result:', drawingResult);
    expect(drawingResult.error).toBeUndefined();
    expect(drawingResult.success).toBe(true);
    expect(drawingResult.hasPath).toBe(true);
    expect(drawingResult.pathCount).toBeGreaterThan(0);
    // Path should have JSON data (either segments or pathData)
    expect(drawingResult.pathHasJson || (drawingResult.pathSegments ?? 0) > 0).toBe(true);

    // Step 2: Save to cache
    console.log('\n=== STEP 2: SAVING TO CACHE ===');
    
    // Check which storage system is available before save
    const storageCheck = await page.evaluate(() => {
      return {
        hasDexie: !!(window as any).__wickStorage && !!(window as any).__wickStorage.db,
        hasLocalforage: !!(window as any).localforage,
        dexieDbName: (window as any).__wickStorage?.db?.name,
        dexieVersion: (window as any).__wickStorage?.db?.verno,
      };
    });
    console.log('Storage system check:', storageCheck);
    
    // Check project state before save
    const beforeSaveState = await page.evaluate(() => {
      if (!window.project || !window.project.activeFrame) {
        return { error: 'No project or active frame' };
      }
      const project = window.project;
      const activeFrame = project.activeFrame;
      const paths = activeFrame.paths || [];
      const serialized = project.serialize();
      
      return {
        pathCount: paths.length,
        pathDetails: paths.length > 0 ? {
          hasJson: !!paths[0].json,
          jsonType: typeof paths[0].json,
          jsonKeys: paths[0].json ? Object.keys(paths[0].json) : [],
          uuid: paths[0].uuid
        } : null,
        serializedStructure: (() => {
          if (!serialized || !serialized.children) {
            return { error: 'No serialized data or children' };
          }
          
          const debug: any = {
            projectChildrenCount: serialized.children ? serialized.children.length : 0,
            projectChildrenTypes: serialized.children ? serialized.children.map((c: any) => c.classname) : []
          };
          
          const layer = serialized.children.find((c: any) => c.classname === 'Layer');
          if (layer) {
            debug.layerFound = true;
            debug.layerChildrenCount = layer.children ? layer.children.length : 0;
            debug.layerChildrenTypes = layer.children ? layer.children.map((c: any) => c.classname) : [];
            
            const frame = layer.children ? layer.children.find((c: any) => c.classname === 'Frame') : null;
            if (frame) {
              debug.frameFound = true;
              debug.frameChildrenCount = frame.children ? frame.children.length : 0;
              debug.frameChildrenTypes = frame.children ? frame.children.map((c: any) => c.classname) : [];
              debug.frameChildrenUuids = frame.children ? frame.children.map((c: any) => c.uuid || c) : [];
              debug.pathsInFrame = frame.children ? frame.children.filter((c: any) => c.classname === 'Path').length : 0;
            } else {
              debug.frameFound = false;
            }
          } else {
            debug.layerFound = false;
          }
          
          return debug;
        })(),
        serializedPaths: (() => {
          if (!serialized || !serialized.children) return 0;
          const layer = serialized.children.find((c: any) => c.classname === 'Layer');
          if (!layer || !layer.children) return 0;
          const frame = layer.children.find((c: any) => c.classname === 'Frame');
          if (!frame || !frame.children) return 0;
          return frame.children.filter((c: any) => c.classname === 'Path').length;
        })(),
        activeFrameChildren: activeFrame.getChildren ? activeFrame.getChildren().length : 0,
        activeFrameChildrenTypes: activeFrame.getChildren ? 
          activeFrame.getChildren().map((c: any) => c.classname || c.constructor?.name) : []
      };
    });
    
    console.log('Before save state:', JSON.stringify(beforeSaveState, null, 2));
    
    const cacheSaveButton = page.getByRole('button', { name: 'cache save' });
    await cacheSaveButton.click();
    
    // Wait a moment for save to complete
    await page.waitForTimeout(1000);

    // Verify save completed by checking console or project state
    const saveVerification = await page.evaluate(() => {
      return {
        projectExists: typeof window.project !== 'undefined',
        projectName: window.project ? window.project.name : null,
        activeFrameExists: window.project && window.project.activeFrame ? true : false,
        pathCount: window.project && window.project.activeFrame ? 
          (window.project.activeFrame.paths || []).length : 0
      };
    });

    console.log('Save verification:', saveVerification);
    expect(saveVerification.projectExists).toBe(true);
    expect(saveVerification.pathCount).toBeGreaterThan(0);

    // Step 3: Refresh the page
    console.log('\n=== STEP 3: REFRESHING PAGE ===');
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.Wick && window.Wick.Project && window.editor);
    
    console.log('✅ Page refreshed');

    // Step 4: Check cached data before loading
    console.log('\n=== STEP 4: CHECKING CACHED DATA ===');
    const cachedDataCheck = await page.evaluate(() => {
      // Check which storage system is available
      const hasDexie = !!(window as any).__wickStorage && (window as any).__wickStorage.db;
      const hasLocalforage = !!(window as any).localforage;
      
      // Check Dexie database directly
      if (hasDexie) {
        try {
          // Access Dexie database
          const db = (window as any).__wickStorage.db;
          if (db && db.projectCache) {
            // Try to read from Dexie
            // Note: This is async, so we'll check localStorage as fallback
          }
        } catch (e) {
          console.warn('Dexie check error:', e);
        }
      }
      
      const cached = localStorage.getItem('wick_cached_project');
      if (!cached) {
        return { 
          error: 'No cached data found',
          hasDexie,
          hasLocalforage,
          storageUsed: 'none'
        };
      }
      
      try {
        const parsed = JSON.parse(cached);
        // Check if path data is in the cached file
        const hasProject = !!parsed.project;
        const hasExport = !!parsed.export;
        const hasObjects = !!parsed.objects && Array.isArray(parsed.objects);
        
        // Look for Path objects in the export.objects array
        const pathObjects = hasObjects ? parsed.objects.filter((obj: any) => 
          obj && (obj.classname === 'Path' || obj.classname === 'path')
        ) : [];
        
        // Check project structure for path references
        let pathUuidsInProject = 0;
        if (parsed.project && parsed.project.children) {
          // Recursively search for Path UUIDs
          const findPathUuids = (children: any[]): string[] => {
            const uuids: string[] = [];
            if (!children) return uuids;
            children.forEach((child: any) => {
              if (child && typeof child === 'string') {
                // It's a UUID - check if it's a path
                const obj = parsed.objects?.find((o: any) => o.uuid === child);
                if (obj && obj.classname === 'Path') {
                  uuids.push(child);
                }
              } else if (child && child.children) {
                uuids.push(...findPathUuids(child.children));
              }
            });
            return uuids;
          };
          pathUuidsInProject = findPathUuids(parsed.project.children).length;
        }
        
        return {
          success: true,
          cachedSize: cached.length,
          hasProject,
          hasExport,
          hasObjects,
          objectsCount: hasObjects ? parsed.objects.length : 0,
          pathObjectsCount: pathObjects.length,
          pathUuidsInProject,
          pathObjects: pathObjects.slice(0, 2), // First 2 for debugging
          hasDexie,
          hasLocalforage,
          storageUsed: hasDexie ? 'dexie' : (hasLocalforage ? 'localforage' : 'localStorage')
        };
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        return {
          error: 'Failed to parse cached data',
          errorMessage
        };
      }
    });
    
    console.log('Cached data check:', JSON.stringify(cachedDataCheck, null, 2));
    
    // NOTE: If pathObjectsCount is 0, this indicates a bug where paths aren't being
    // included in the WickFile export. The path exists in memory but isn't serialized.
    if (cachedDataCheck.pathObjectsCount === 0 && cachedDataCheck.pathUuidsInProject === 0) {
      console.warn('⚠️  WARNING: Path is not in cached data! This indicates a serialization bug.');
      console.warn('   The path exists in memory but is not being saved to the cache.');
    }
    
    // Step 5: Load from cache (click Load in autosave dialog if it appears)
    console.log('\n=== STEP 5: LOADING FROM CACHE ===');
    
    // Check if autosave dialog appears
    const autosaveDialog = page.locator('[role="dialog"]').filter({ hasText: 'Load Autosave' });
    const dialogVisible = await autosaveDialog.isVisible().catch(() => false);
    
    if (dialogVisible) {
      console.log('Autosave dialog found, clicking Load...');
      const loadButton = page.getByRole('button', { name: /load/i }).filter({ hasText: 'Load' });
      await loadButton.click();
      // Wait for the dialog to disappear and project to load
      await autosaveDialog.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(2000); // Wait for load to complete
    } else {
      console.log('No autosave dialog found, checking if project auto-loaded...');
      await page.waitForTimeout(2000);
    }
    
    // Wait for project to be fully loaded
    await page.waitForFunction(() => {
      return typeof window.project !== 'undefined' && 
             window.project && 
             window.project.activeFrame;
    }, { timeout: 10000 });

    // Step 6: Verify the drawing persisted
    console.log('\n=== STEP 6: VERIFYING DRAWING PERSISTED ===');
    const loadVerification = await page.evaluate(() => {
      if (typeof window.project === 'undefined') {
        return { error: 'Project not found after load' };
      }

      const project = window.project;
      const activeFrame = project.activeFrame;

      if (!activeFrame) {
        return { error: 'No active frame after load' };
      }

      const paths = activeFrame.paths || [];
      const pathCount = paths.length;
      
      // Check if we have paths with valid JSON data
      const pathsWithData = paths.filter((p: { json?: { segments?: unknown[] } }) => {
        return p.json && 
               p.json.segments && 
               Array.isArray(p.json.segments) && 
               p.json.segments.length > 0;
      });

      // Get details about the first path if it exists
      let firstPathDetails = null;
      if (paths.length > 0 && paths[0].json) {
        const json = paths[0].json;
        firstPathDetails = {
          hasSegments: !!json.segments,
          segmentCount: json.segments ? json.segments.length : 0,
          hasStrokeColor: !!json.strokeColor,
          strokeWidth: json.strokeWidth || null,
          segments: json.segments ? json.segments.map((s: any) => ({
            point: s.point ? { x: s.point.x, y: s.point.y } : null
          })) : []
        };
      }

      return {
        success: true,
        projectName: project.name || 'Unknown',
        hasActiveFrame: true,
        pathCount,
        pathsWithDataCount: pathsWithData.length,
        firstPathDetails,
        allPathsValid: pathsWithData.length === pathCount && pathCount > 0
      };
    });

    console.log('Load verification:', JSON.stringify(loadVerification, null, 2));

    // Assertions
    expect(loadVerification.error).toBeUndefined();
    expect(loadVerification.success).toBe(true);
    expect(loadVerification.hasActiveFrame).toBe(true);
    expect(loadVerification.pathCount).toBeGreaterThan(0);
    expect(loadVerification.pathsWithDataCount).toBeGreaterThan(0);
    expect(loadVerification.allPathsValid).toBe(true);
    
    if (loadVerification.firstPathDetails) {
      expect(loadVerification.firstPathDetails.hasSegments).toBe(true);
      expect(loadVerification.firstPathDetails.segmentCount).toBeGreaterThan(0);
      expect(loadVerification.firstPathDetails.segments.length).toBeGreaterThan(0);
    }

    // Step 7: Visual verification - take screenshot
    console.log('\n=== STEP 7: TAKING SCREENSHOT FOR VISUAL VERIFICATION ===');
    await page.screenshot({ 
      path: 'test-results/cache-load-drawing-verification.png',
      fullPage: false 
    });

    console.log('\n✅ TEST COMPLETE: Drawing successfully saved and loaded from cache!');
  });
});
