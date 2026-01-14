import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Engine Build Output', () => {
  const distPath = path.resolve(process.cwd(), 'engine/dist');

  beforeAll(() => {
    // Ensure build has run
    if (!fs.existsSync(distPath)) {
      throw new Error('Engine dist/ not found. Run: cd engine && npm run build');
    }
  });

  it('creates wickengine.js', () => {
    const file = path.join(distPath, 'wickengine.js');
    expect(fs.existsSync(file), 'wickengine.js should exist').toBe(true);
  });

  it('wickengine.js is not empty', () => {
    const file = path.join(distPath, 'wickengine.js');
    const stats = fs.statSync(file);
    expect(stats.size).toBeGreaterThan(100000); // At least 100KB
  });

  it('wickengine.js contains IIFE wrapper', () => {
    const file = path.join(distPath, 'wickengine.js');
    const content = fs.readFileSync(file, 'utf8');
    expect(content).toContain('(function()');
  });

  it('wickengine.js contains build version', () => {
    const file = path.join(distPath, 'wickengine.js');
    const content = fs.readFileSync(file, 'utf8');
    expect(content).toMatch(/WICK_ENGINE_BUILD_VERSION/);
  });

  it('creates emptyproject.html', () => {
    const file = path.join(distPath, 'emptyproject.html');
    expect(fs.existsSync(file), 'emptyproject.html should exist').toBe(true);
  });

  it('emptyproject.html contains wickengine', () => {
    const file = path.join(distPath, 'emptyproject.html');
    const content = fs.readFileSync(file, 'utf8');
    expect(content).toContain('WICK_ENGINE_BUILD_VERSION');
  });

  it('creates ZIP export resources', () => {
    const files = [
      'index.html',
      'preloadjs.min.js',
      'project.html'
    ];
    
    files.forEach(filename => {
      const file = path.join(distPath, filename);
      expect(fs.existsSync(file), `${filename} should exist`).toBe(true);
    });
  });

  it('bundle size is reasonable', () => {
    const file = path.join(distPath, 'wickengine.js');
    const stats = fs.statSync(file);
    const sizeMB = stats.size / 1024 / 1024;
    console.log(`   Bundle size: ${sizeMB.toFixed(2)} MB`);
    expect(sizeMB).toBeLessThan(10); // Less than 10MB
    expect(sizeMB).toBeGreaterThan(0.5); // More than 0.5MB (sanity check)
  });
});

