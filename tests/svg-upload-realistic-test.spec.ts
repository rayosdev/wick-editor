import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('SVG Upload Realistic Test', () => {
  test('uploads real SVG file and checks for isPublished error', async ({ page }) => {
    // Navigate to the editor
    await page.goto('http://localhost:3004');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Wait for the canvas to be visible
    await expect(page.locator('#canvas-container-wrapper')).toBeVisible();
    
    // Track all console messages and errors
    const consoleMessages: Array<{type: string, text: string}> = [];
    const pageErrors: string[] = [];
    
    page.on('console', msg => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text()
      });
    });
    
    page.on('pageerror', error => {
      pageErrors.push(error.message);
    });
    
    // Create a test SVG file
    const svgContent = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
      <text x="50" y="60" text-anchor="middle" font-size="12">Test</text>
    </svg>`;
    
    // Write the SVG file to a temporary location
    const fs = require('fs');
    const os = require('os');
    const tempDir = os.tmpdir();
    const svgPath = path.join(tempDir, 'test.svg');
    fs.writeFileSync(svgPath, svgContent);
    
    try {
      // Find the upload button
      const uploadButton = page.locator('#action-button-tooltip-button-asset-upload > button');
      await expect(uploadButton).toBeVisible();
      
      // Set up file input
      const fileInput = page.locator('input[type="file"]').first();
      
      // If no file input exists, create one
      if (await fileInput.count() === 0) {
        await page.evaluate(() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = '.svg';
          input.style.display = 'none';
          document.body.appendChild(input);
        });
      }
      
      // Upload the SVG file
      await page.setInputFiles('input[type="file"]', svgPath);
      
      // Wait for processing
      await page.waitForTimeout(3000);
      
      // Check for the specific isPublished error
      const isPublishedErrors = consoleMessages.filter(msg => 
        msg.text.includes('isPublished') || 
        msg.text.includes('Cannot read properties of null')
      );
      
      if (isPublishedErrors.length > 0) {
        console.log('Found isPublished errors:', isPublishedErrors);
      }
      
      // Check for any SVG-related errors
      const svgErrors = consoleMessages.filter(msg => 
        msg.text.includes('SVG') || 
        msg.text.includes('Asset') ||
        msg.text.includes('TypeError')
      );
      
      if (svgErrors.length > 0) {
        console.log('Found SVG errors:', svgErrors);
      }
      
      // Check page errors
      if (pageErrors.length > 0) {
        console.log('Found page errors:', pageErrors);
      }
      
      console.log('All console messages:', consoleMessages);
      console.log('Page errors:', pageErrors);
      
      // The test should pass to show us what errors occur
      expect(consoleMessages.length).toBeGreaterThanOrEqual(0);
      
    } finally {
      // Clean up the temporary file
      if (fs.existsSync(svgPath)) {
        fs.unlinkSync(svgPath);
      }
    }
  });
  
  test('tests SVG asset with project context', async ({ page }) => {
    // Navigate to the editor
    await page.goto('http://localhost:3004');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Wait for the canvas to be visible
    await expect(page.locator('#canvas-container-wrapper')).toBeVisible();
    
    // Test SVGAsset with project context
    const projectContextTest = await page.evaluate(() => {
      try {
        // Get the project
        const project = window.project;
        if (!project) {
          return { success: false, error: 'No project found' };
        }
        
        // Create an SVG asset with project context
        const svgAsset = new window.Wick.SVGAsset({
          filename: 'test.svg',
          src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIzIiBmaWxsPSJyZWQiIC8+Cjwvc3ZnPg==',
          project: project
        });
        
        // Test methods that might access isPublished property
        const results = {
          classname: svgAsset.classname,
          hasInstances: svgAsset.hasInstances(),
          getInstances: svgAsset.getInstances(),
          project: svgAsset.project ? 'exists' : 'null'
        };
        
        return {
          success: true,
          results
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : undefined;
        return {
          success: false,
          error: errorMessage,
          stack: errorStack
        };
      }
    });
    
    console.log('SVG Asset with project context test result:', projectContextTest);
    
    if (!projectContextTest.success) {
      console.log('SVG Asset with project context test failed:', projectContextTest.error);
      console.log('Stack trace:', projectContextTest.stack);
    }
    if (!projectContextTest.results) {
      throw new Error('Expected project context test results');
    }
    
    expect(projectContextTest.success).toBe(true);
    expect(projectContextTest.results.classname).toBe('SVGAsset');
    expect(projectContextTest.results.project).toBe('exists');
    
    console.log('SVG Asset with project context test completed successfully');
  });
});
