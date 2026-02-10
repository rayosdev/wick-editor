import { test, expect } from '@playwright/test';

type TimelineCheckResult = {
  timelineExists: boolean;
  frameAdded: boolean;
  playheadMoved: boolean;
  initialPosition: number;
  newPosition: number;
};

type GuiElementsCheckResult = {
  hasButton: boolean;
  hasTooltip: boolean;
  hasScrollbar: boolean;
  hasActionButton: boolean;
  hasSelectionBox: boolean;
  hasScrollbarGrabber: boolean;
  hasPlayhead: boolean;
  hasOnionSkinRange: boolean;
  hasLayerButton: boolean;
};

test.describe('Timeline and Playhead Functionality', () => {
  test('can create keyframes and move playhead', async ({ page }) => {
    // Navigate to the editor
    await page.goto('http://localhost:3002');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Wait for the Wick engine to load
    await page.waitForFunction(() => window.Wick && window.Wick.Project);
    
    console.log('✅ Page loaded and Wick engine available');
    
    // Check if we can access the project
    const projectExists = await page.evaluate(() => {
      return window.Wick && window.Wick.Project;
    });
    expect(projectExists).toBeTruthy();
    
    console.log('✅ Wick.Project class available');
    
    // Test creating a new project
    const projectCreated = await page.evaluate(() => {
      try {
        const project = new window.Wick.Project();
        return project && project.activeTimeline;
      } catch (e) {
        console.error('Error creating project:', e);
        return false;
      }
    });
    expect(projectCreated).toBeTruthy();
    
    console.log('✅ Project created successfully');
    
    // Test timeline functionality
    const timelineWorks = await page.evaluate<TimelineCheckResult | false>(() => {
      try {
        const project = new window.Wick.Project();
        const timeline = project.activeTimeline;
        
        // Test adding a frame
        const frame = new window.Wick.Frame();
        timeline.addFrame(frame);
        
        // Test playhead position
        const initialPosition = project.playheadPosition;
        project.playheadPosition = 2;
        const newPosition = project.playheadPosition;
        
        return {
          timelineExists: !!timeline,
          frameAdded: timeline.frames.length > 0,
          playheadMoved: newPosition === 2,
          initialPosition,
          newPosition
        };
      } catch (e) {
        console.error('Error testing timeline:', e);
        return false;
      }
    });
    
    expect(timelineWorks).toBeTruthy();
    if (timelineWorks === false) {
      throw new Error('Timeline evaluation failed');
    }
    expect(timelineWorks.timelineExists).toBe(true);
    expect(timelineWorks.frameAdded).toBe(true);
    expect(timelineWorks.playheadMoved).toBe(true);
    
    console.log('✅ Timeline functionality working:');
    console.log(`   - Timeline exists: ${timelineWorks.timelineExists}`);
    console.log(`   - Frame added: ${timelineWorks.frameAdded}`);
    console.log(`   - Playhead moved from ${timelineWorks.initialPosition} to ${timelineWorks.newPosition}`);
    
    // Test GUI elements (our converted TypeScript components)
    const guiElementsWork = await page.evaluate<GuiElementsCheckResult | false>(() => {
      try {
        // Test if our converted GUI elements are available
        const hasButton = !!window.Wick.GUIElement.Button;
        const hasTooltip = !!window.Wick.GUIElement.Tooltip;
        const hasScrollbar = !!window.Wick.GUIElement.Scrollbar;
        const hasActionButton = !!window.Wick.GUIElement.ActionButton;
        const hasSelectionBox = !!window.Wick.GUIElement.SelectionBox;
        const hasScrollbarGrabber = !!window.Wick.GUIElement.ScrollbarGrabber;
        const hasPlayhead = !!window.Wick.GUIElement.Playhead;
        const hasOnionSkinRange = !!window.Wick.GUIElement.OnionSkinRange;
        const hasLayerButton = !!window.Wick.GUIElement.LayerButton;
        
        return {
          hasButton,
          hasTooltip,
          hasScrollbar,
          hasActionButton,
          hasSelectionBox,
          hasScrollbarGrabber,
          hasPlayhead,
          hasOnionSkinRange,
          hasLayerButton
        };
      } catch (e) {
        console.error('Error testing GUI elements:', e);
        return false;
      }
    });
    
    expect(guiElementsWork).toBeTruthy();
    if (guiElementsWork === false) {
      throw new Error('GUI element evaluation failed');
    }
    expect(guiElementsWork.hasButton).toBe(true);
    expect(guiElementsWork.hasTooltip).toBe(true);
    expect(guiElementsWork.hasScrollbar).toBe(true);
    expect(guiElementsWork.hasActionButton).toBe(true);
    expect(guiElementsWork.hasSelectionBox).toBe(true);
    expect(guiElementsWork.hasScrollbarGrabber).toBe(true);
    expect(guiElementsWork.hasPlayhead).toBe(true);
    expect(guiElementsWork.hasOnionSkinRange).toBe(true);
    expect(guiElementsWork.hasLayerButton).toBe(true);
    
    console.log('✅ All converted TypeScript GUI elements available:');
    console.log(`   - Button: ${guiElementsWork.hasButton}`);
    console.log(`   - Tooltip: ${guiElementsWork.hasTooltip}`);
    console.log(`   - Scrollbar: ${guiElementsWork.hasScrollbar}`);
    console.log(`   - ActionButton: ${guiElementsWork.hasActionButton}`);
    console.log(`   - SelectionBox: ${guiElementsWork.hasSelectionBox}`);
    console.log(`   - ScrollbarGrabber: ${guiElementsWork.hasScrollbarGrabber}`);
    console.log(`   - Playhead: ${guiElementsWork.hasPlayhead}`);
    console.log(`   - OnionSkinRange: ${guiElementsWork.hasOnionSkinRange}`);
    console.log(`   - LayerButton: ${guiElementsWork.hasLayerButton}`);
    
    console.log('🎉 All TypeScript conversions working correctly!');
  });
});
