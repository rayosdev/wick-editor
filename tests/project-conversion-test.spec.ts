import { test, expect } from '@playwright/test';

test.describe('Project.js Conversion Testing', () => {
  test('tests Project.js functionality before conversion', async ({ page }) => {
    // Navigate to the editor
    await page.goto('http://localhost:3004');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Wait for the canvas to be visible
    await expect(page.locator('#canvas-container-wrapper')).toBeVisible();
    
    // Test Project.js functionality
    const projectTest = await page.evaluate(() => {
      try {
        // Test project creation
        const project = new window.Wick.Project();
        
        // Test basic properties
        const hasTimeline = project.timeline !== null;
        const hasSelection = project.selection !== null;
        const hasHistory = project.history !== null;
        const hasToolSettings = project.toolSettings !== null;
        
        // Test project dimensions
        const width = project.width;
        const height = project.height;
        const framerate = project.framerate;
        
        // Test project methods
        const hasAddLayer = typeof project.addLayer === 'function';
        const hasPlay = typeof project.play === 'function';
        const hasPause = typeof project.pause === 'function';
        const hasStop = typeof project.stop === 'function';
        const hasSeek = typeof project.seek === 'function';
        const hasExport = typeof project.export === 'function';
        const hasImport = typeof project.import === 'function';
        
        // Test project state
        const isPlaying = project.isPlaying;
        const currentFrame = project.currentFrame;
        const totalFrames = project.totalFrames;
        
        return {
          success: true,
          hasTimeline,
          hasSelection,
          hasHistory,
          hasToolSettings,
          width,
          height,
          framerate,
          hasAddLayer,
          hasPlay,
          hasPause,
          hasStop,
          hasSeek,
          hasExport,
          hasImport,
          isPlaying,
          currentFrame,
          totalFrames,
          projectType: typeof project,
          projectClass: project.constructor.name
        };
      } catch (error: unknown) {
        return {
          success: false,
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        };
      }
    });
    
    console.log('Project.js functionality test result:', projectTest);
    
    expect(projectTest.success).toBe(true);
    expect(projectTest.hasTimeline).toBe(true);
    expect(projectTest.hasSelection).toBe(true);
    expect(projectTest.hasHistory).toBe(true);
    expect(projectTest.hasToolSettings).toBe(true);
    expect(projectTest.hasAddLayer).toBe(true);
    expect(projectTest.hasPlay).toBe(true);
    expect(projectTest.hasPause).toBe(true);
    expect(projectTest.hasStop).toBe(true);
    expect(projectTest.hasSeek).toBe(true);
    expect(projectTest.hasExport).toBe(true);
    expect(projectTest.hasImport).toBe(true);
    expect(projectTest.projectType).toBe('object');
    expect(projectTest.projectClass).toBe('Project');
    
    console.log('Project.js functionality test completed successfully');
  });
  
  test('tests Project.js layer management', async ({ page }) => {
    // Navigate to the editor
    await page.goto('http://localhost:3004');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Wait for the canvas to be visible
    await expect(page.locator('#canvas-container-wrapper')).toBeVisible();
    
    // Test layer management
    const layerTest = await page.evaluate(() => {
      try {
        const project = new window.Wick.Project();
        
        // Test adding layers
        const layer1 = project.addLayer();
        const layer2 = project.addLayer();
        
        // Test layer properties
        const layerCount = project.timeline.layers.length;
        const layer1Name = layer1.name;
        const layer2Name = layer2.name;
        
        // Test layer operations
        const hasRemoveLayer = typeof project.removeLayer === 'function';
        const hasMoveLayer = typeof project.moveLayer === 'function';
        const hasDuplicateLayer = typeof project.duplicateLayer === 'function';
        
        // Test layer state
        const layer1Active = layer1.active;
        const layer2Active = layer2.active;
        
        return {
          success: true,
          layerCount,
          layer1Name,
          layer2Name,
          hasRemoveLayer,
          hasMoveLayer,
          hasDuplicateLayer,
          layer1Active,
          layer2Active,
          layer1Type: typeof layer1,
          layer2Type: typeof layer2,
          layer1Class: layer1.constructor.name,
          layer2Class: layer2.constructor.name
        };
      } catch (error: unknown) {
        return {
          success: false,
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        };
      }
    });
    
    console.log('Project.js layer management test result:', layerTest);
    
    expect(layerTest.success).toBe(true);
    expect(layerTest.layerCount).toBe(2);
    expect(layerTest.hasRemoveLayer).toBe(true);
    expect(layerTest.hasMoveLayer).toBe(true);
    expect(layerTest.hasDuplicateLayer).toBe(true);
    expect(layerTest.layer1Type).toBe('object');
    expect(layerTest.layer2Type).toBe('object');
    expect(layerTest.layer1Class).toBe('Layer');
    expect(layerTest.layer2Class).toBe('Layer');
    
    console.log('Project.js layer management test completed successfully');
  });
  
  test('tests Project.js frame management', async ({ page }) => {
    // Navigate to the editor
    await page.goto('http://localhost:3004');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Wait for the canvas to be visible
    await expect(page.locator('#canvas-container-wrapper')).toBeVisible();
    
    // Test frame management
    const frameTest = await page.evaluate(() => {
      try {
        const project = new window.Wick.Project();
        const layer = project.addLayer();
        
        // Test adding frames
        const frame1 = layer.addFrame();
        const frame2 = layer.addFrame();
        
        // Test frame properties
        const frameCount = layer.frames.length;
        const frame1Start = frame1.start;
        const frame2Start = frame2.start;
        
        // Test frame operations
        const hasRemoveFrame = typeof layer.removeFrame === 'function';
        const hasMoveFrame = typeof layer.moveFrame === 'function';
        const hasDuplicateFrame = typeof layer.duplicateFrame === 'function';
        
        // Test frame state
        const frame1Active = frame1.active;
        const frame2Active = frame2.active;
        
        return {
          success: true,
          frameCount,
          frame1Start,
          frame2Start,
          hasRemoveFrame,
          hasMoveFrame,
          hasDuplicateFrame,
          frame1Active,
          frame2Active,
          frame1Type: typeof frame1,
          frame2Type: typeof frame2,
          frame1Class: frame1.constructor.name,
          frame2Class: frame2.constructor.name
        };
      } catch (error: unknown) {
        return {
          success: false,
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        };
      }
    });
    
    console.log('Project.js frame management test result:', frameTest);
    
    expect(frameTest.success).toBe(true);
    expect(frameTest.frameCount).toBe(2);
    expect(frameTest.hasRemoveFrame).toBe(true);
    expect(frameTest.hasMoveFrame).toBe(true);
    expect(frameTest.hasDuplicateFrame).toBe(true);
    expect(frameTest.frame1Type).toBe('object');
    expect(frameTest.frame2Type).toBe('object');
    expect(frameTest.frame1Class).toBe('Frame');
    expect(frameTest.frame2Class).toBe('Frame');
    
    console.log('Project.js frame management test completed successfully');
  });
  
  test('tests Project.js playback controls', async ({ page }) => {
    // Navigate to the editor
    await page.goto('http://localhost:3004');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Wait for the canvas to be visible
    await expect(page.locator('#canvas-container-wrapper')).toBeVisible();
    
    // Test playback controls
    const playbackTest = await page.evaluate(() => {
      try {
        const project = new window.Wick.Project();
        
        // Test initial state
        const initialIsPlaying = project.isPlaying;
        const initialCurrentFrame = project.currentFrame;
        
        // Test play
        project.play();
        const afterPlayIsPlaying = project.isPlaying;
        
        // Test pause
        project.pause();
        const afterPauseIsPlaying = project.isPlaying;
        
        // Test stop
        project.stop();
        const afterStopIsPlaying = project.isPlaying;
        const afterStopCurrentFrame = project.currentFrame;
        
        // Test seek
        project.seek(5);
        const afterSeekCurrentFrame = project.currentFrame;
        
        return {
          success: true,
          initialIsPlaying,
          initialCurrentFrame,
          afterPlayIsPlaying,
          afterPauseIsPlaying,
          afterStopIsPlaying,
          afterStopCurrentFrame,
          afterSeekCurrentFrame
        };
      } catch (error: unknown) {
        return {
          success: false,
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        };
      }
    });
    
    console.log('Project.js playback controls test result:', playbackTest);
    
    expect(playbackTest.success).toBe(true);
    expect(playbackTest.initialIsPlaying).toBe(false);
    expect(playbackTest.afterPlayIsPlaying).toBe(true);
    expect(playbackTest.afterPauseIsPlaying).toBe(false);
    expect(playbackTest.afterStopIsPlaying).toBe(false);
    expect(playbackTest.afterSeekCurrentFrame).toBe(5);
    
    console.log('Project.js playback controls test completed successfully');
  });
  
  test('tests Project.js export/import functionality', async ({ page }) => {
    // Navigate to the editor
    await page.goto('http://localhost:3004');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Wait for the canvas to be visible
    await expect(page.locator('#canvas-container-wrapper')).toBeVisible();
    
    // Test export/import functionality
    const exportTest = await page.evaluate(() => {
      try {
        const project = new window.Wick.Project();
        
        // Test export methods
        const hasExportHTML = typeof project.exportHTML === 'function';
        const hasExportZIP = typeof project.exportZIP === 'function';
        const hasExportSVG = typeof project.exportSVG === 'function';
        const hasExportGIF = typeof project.exportGIF === 'function';
        
        // Test import methods
        const hasImport = typeof project.import === 'function';
        const hasLoad = typeof project.load === 'function';
        const hasSave = typeof project.save === 'function';
        
        // Test serialization
        const hasSerialize = typeof project.serialize === 'function';
        const hasDeserialize = typeof project.deserialize === 'function';
        
        return {
          success: true,
          hasExportHTML,
          hasExportZIP,
          hasExportSVG,
          hasExportGIF,
          hasImport,
          hasLoad,
          hasSave,
          hasSerialize,
          hasDeserialize
        };
      } catch (error: unknown) {
        return {
          success: false,
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        };
      }
    });
    
    console.log('Project.js export/import functionality test result:', exportTest);
    
    expect(exportTest.success).toBe(true);
    expect(exportTest.hasExportHTML).toBe(true);
    expect(exportTest.hasExportZIP).toBe(true);
    expect(exportTest.hasExportSVG).toBe(true);
    expect(exportTest.hasExportGIF).toBe(true);
    expect(exportTest.hasImport).toBe(true);
    expect(exportTest.hasLoad).toBe(true);
    expect(exportTest.hasSave).toBe(true);
    expect(exportTest.hasSerialize).toBe(true);
    expect(exportTest.hasDeserialize).toBe(true);
    
    console.log('Project.js export/import functionality test completed successfully');
  });
});
