import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, "src");
const SOURCE_EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx"]);

function toPosixPath(filePath) {
  return filePath.split(path.sep).join("/");
}

function toRepoRelative(filePath) {
  return toPosixPath(path.relative(ROOT, filePath));
}

function walkFiles(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(absolutePath));
      continue;
    }
    files.push(absolutePath);
  }

  return files;
}

function resolveImportTarget(fromFile, rawImportPath) {
  if (rawImportPath.startsWith("Editor/")) {
    return path.join(ROOT, "src", rawImportPath);
  }
  if (rawImportPath.startsWith("./") || rawImportPath.startsWith("../")) {
    return path.resolve(path.dirname(fromFile), rawImportPath);
  }
  if (rawImportPath.startsWith("/")) {
    return path.join(ROOT, rawImportPath);
  }
  return null;
}

const allFiles = walkFiles(SRC_DIR);
const scssFiles = allFiles.filter((filePath) => filePath.endsWith(".scss"));

const scssLineStats = scssFiles.map((filePath) => {
  const contents = fs.readFileSync(filePath, "utf8");
  const lines = contents.split(/\r?\n/).length;
  return { file: toRepoRelative(filePath), lines };
});

scssLineStats.sort((a, b) => b.lines - a.lines);
const totalScssLines = scssLineStats.reduce((sum, stat) => sum + stat.lines, 0);

const sourceFiles = allFiles.filter((filePath) =>
  SOURCE_EXTENSIONS.has(path.extname(filePath))
);

const importRegex = /import\s+(?:[^'"]+from\s+)?['"]([^'"]+\.scss)['"]/g;
const importRecords = [];

for (const sourceFile of sourceFiles) {
  const contents = fs.readFileSync(sourceFile, "utf8");
  const matches = contents.matchAll(importRegex);
  for (const match of matches) {
    const rawImportPath = match[1];
    const resolvedTarget = resolveImportTarget(sourceFile, rawImportPath);
    importRecords.push({
      importer: toRepoRelative(sourceFile),
      rawImportPath,
      target: resolvedTarget ? toRepoRelative(resolvedTarget) : "(unresolved)",
    });
  }
}

console.log("SCSS inventory");
console.log(`- files: ${scssFiles.length}`);
console.log(`- lines: ${totalScssLines}`);
console.log(`- TS/JS imports: ${importRecords.length}`);
console.log("");
console.log("Largest SCSS files:");
for (const stat of scssLineStats.slice(0, 20)) {
  console.log(`- ${stat.lines.toString().padStart(4, " ")}  ${stat.file}`);
}
console.log("");
console.log("SCSS imports:");
for (const record of importRecords) {
  console.log(`- ${record.importer} -> ${record.rawImportPath} (${record.target})`);
}
