import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, "src");
const SOURCE_EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx"]);

const DISALLOWED_SCSS_FILES = new Set([
  "src/Editor/Util/ActionButton/_actionbutton.scss",
  "src/Editor/Util/WickInput/_wickinput.scss",
  "src/Editor/Modals/WickModal/_wickmodal.scss",
  "src/Editor/Modals/SimpleProjectSettings/_simpleprojectsettings.scss",
  "src/Editor/Modals/AutosaveWarning/_autosavewarning.scss",
  "src/Editor/Modals/GeneralWarning/_generalwarning.scss",
  "src/Editor/Modals/EditorInfo/_editorinfo.scss",
  "src/Editor/Modals/SavedProjects/_savedprojects.scss",
  "src/Editor/Modals/SavedProjects/SavedProjectItem/_savedprojectitem.scss",
  "src/Editor/Modals/MobileMenu/_mobilemenu.scss",
  "src/Editor/Modals/Util/ObjectInfo/_objectinfo.scss",
  "src/Editor/Modals/MakeAnimated/_makeanimated.scss",
  "src/Editor/Modals/MakeInteractive/_makeinteractive.scss",
  "src/Editor/Modals/SupportUs/_supportus.scss",
  "src/Editor/Modals/OpenSourceNotices/_opensourcenotices.scss",
  "src/Editor/Modals/BuiltinLibrary/_builtinlibrary.scss",
  "src/Editor/Modals/ExportMedia/_exportmedia.scss",
  "src/Editor/Modals/WelcomeMessage/_welcomemessage.scss",
]);

const ALLOWLIST_PATTERNS = [
  /^src\/Editor\/_editor\.scss$/,
  /^src\/Editor\/_wickbrand\.module\.scss$/,
  /^src\/Editor\/brand\.scss$/,
  /^src\/Editor\/Modals\/(?!WickModal\/_wickmodal\.scss|SimpleProjectSettings\/_simpleprojectsettings\.scss|AutosaveWarning\/_autosavewarning\.scss|GeneralWarning\/_generalwarning\.scss|EditorInfo\/_editorinfo\.scss|SavedProjects\/_savedprojects\.scss|SavedProjects\/SavedProjectItem\/_savedprojectitem\.scss|MobileMenu\/_mobilemenu\.scss|Util\/ObjectInfo\/_objectinfo\.scss|MakeAnimated\/_makeanimated\.scss|MakeInteractive\/_makeinteractive\.scss|SupportUs\/_supportus\.scss|OpenSourceNotices\/_opensourcenotices\.scss|BuiltinLibrary\/_builtinlibrary\.scss|ExportMedia\/_exportmedia\.scss|WelcomeMessage\/_welcomemessage\.scss).+\.scss$/,
  /^src\/Editor\/Panels\/.+\.scss$/,
  /^src\/Editor\/Util\/(?!ActionButton\/_actionbutton\.scss|WickInput\/_wickinput\.scss).+\.scss$/,
];

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
const sourceFiles = allFiles.filter((filePath) =>
  SOURCE_EXTENSIONS.has(path.extname(filePath))
);

const importRegex = /import\s+(?:[^'"]+from\s+)?['"]([^'"]+\.scss)['"]/g;
const errors = [];
let checkedImportCount = 0;

for (const sourceFile of sourceFiles) {
  const sourceRelative = toRepoRelative(sourceFile);
  const contents = fs.readFileSync(sourceFile, "utf8");
  const matches = contents.matchAll(importRegex);

  for (const match of matches) {
    const rawImportPath = match[1];
    const resolvedTarget = resolveImportTarget(sourceFile, rawImportPath);
    checkedImportCount += 1;

    if (!resolvedTarget) {
      continue;
    }

    const targetRelative = toRepoRelative(resolvedTarget);

    if (DISALLOWED_SCSS_FILES.has(targetRelative)) {
      errors.push(
        `Disallowed SCSS import: ${sourceRelative} -> ${rawImportPath} (${targetRelative})`
      );
      continue;
    }

    const isAllowed = ALLOWLIST_PATTERNS.some((pattern) =>
      pattern.test(targetRelative)
    );
    if (!isAllowed) {
      errors.push(
        `SCSS import is outside allowlist: ${sourceRelative} -> ${rawImportPath} (${targetRelative})`
      );
    }
  }
}

for (const disallowedPath of DISALLOWED_SCSS_FILES) {
  const absolutePath = path.join(ROOT, disallowedPath);
  if (fs.existsSync(absolutePath)) {
    errors.push(`Disallowed SCSS file still exists: ${disallowedPath}`);
  }
}

if (errors.length > 0) {
  console.error("styles:check failed");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(
  `styles:check passed (${checkedImportCount} SCSS imports validated against allowlist)`
);
