const fs = require('fs');
const path = require('path');

// Function to recursively find all JSX files
function findJsxFiles(dir, files = []) {
  const entries = fs.readdirSync(dir);
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      findJsxFiles(fullPath, files);
    } else if (entry.endsWith('.jsx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Function to fix require statements in a file
function fixRequires(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  // Fix classnames requires with various patterns
  const classNamesPatterns = [
    /var classNames = require\(['"]classnames['"]\);/g,
    /let classNames = require\(['"]classnames['"]\);/g,
    /const classNames = require\(['"]classnames['"]\);/g,
    /let classNames=require\(['"]classnames['"]\);/g,
    /var classNames=require\(['"]classnames['"]\);/g,
    /const classNames=require\(['"]classnames['"]\);/g
  ];
  
  for (const pattern of classNamesPatterns) {
    if (pattern.test(content)) {
      content = content.replace(pattern, "import classNames from 'classnames';");
      changed = true;
    }
  }
  
  // Fix package.json import
  if (content.includes("require('../../package.json')")) {
    content = content.replace(/const { version } = require\(['"]..\/..\/package\.json['"]\);/g, 
      "import packageJson from '../../package.json';\nconst { version } = packageJson;");
    changed = true;
  }
  
  // Fix other require patterns if they exist
  const otherPatterns = [
    {
      pattern: /var tinycolor = require\(['"]tinycolor2['"]\);/g,
      replacement: "import tinycolor from 'tinycolor2';"
    }
  ];
  
  for (const {pattern, replacement} of otherPatterns) {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      changed = true;
    }
  }
  
  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed: ${filePath}`);
  }
}

// Main execution
const srcDir = path.join(__dirname, 'src', 'Editor');
const jsxFiles = findJsxFiles(srcDir);

console.log(`Found ${jsxFiles.length} JSX files`);

for (const file of jsxFiles) {
  fixRequires(file);
}

console.log('Done!');
