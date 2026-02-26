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
  "src/Editor/Modals/ExportOptions/_exportoptions.scss",
  "src/Editor/Modals/SettingsModal/_settingsmodal.scss",
  "src/Editor/Modals/SettingsModal/EditorSettings/_editorsettings.scss",
  "src/Editor/Modals/SettingsModal/KeyboardShortcuts/_keyboardshortcuts.scss",
  "src/Editor/Modals/SettingsModal/ProjectSettings/_projectsettings.scss",
  "src/Editor/Util/TabbedInterface/_tabbedinterface.scss",
  "src/Editor/Util/MobileTabbedInterface/_mobiletabbedinterface.scss",
  "src/Editor/Util/PlayButton/_playbutton.scss",
  "src/Editor/Util/ErrorPage/_index.scss",
  "src/Editor/Util/ColorPicker/_colorpicker.scss",
  "src/Editor/Util/AudioPlayer/_audioplayer.scss",
  "src/Editor/Util/ToolIcon/_toolbutton.scss",
  "src/Editor/Util/PopupMenu/_popupmenu.scss",
  "src/Editor/Util/ColorPicker/_wickcolorpicker.scss",
  "src/Editor/Panels/MenuBar/_menubar.scss",
  "src/Editor/Panels/MenuBar/MenuBarButton/_menubarbutton.scss",
  "src/Editor/Panels/MenuBar/MenuBarIconButton/_menubariconbutton.scss",
  "src/Editor/Panels/MenuBar/MenuBarSupportButton/_menubarsupportbutton.scss",
  "src/Editor/Panels/Canvas/_canvas.scss",
  "src/Editor/Panels/AssetLibrary/_assetlibrary.scss",
  "src/Editor/Panels/AssetLibrary/Asset/_asset.scss",
  "src/Editor/Panels/DockedPanel/_dockedpanel.scss",
  "src/Editor/Panels/DeleteCopyPaste/_deletecopypaste.scss",
  "src/Editor/Panels/CanvasTransforms/_canvastransforms.scss",
  "src/Editor/Panels/Inspector/InspectorActionButton/_inspectoractionbutton.scss",
  "src/Editor/Panels/Inspector/InspectorTitle/_inspectortitle.scss",
  "src/Editor/Panels/Inspector/InspectorPreview/_inspectorpreview.scss",
  "src/Editor/Panels/Inspector/_inspector.scss",
  "src/Editor/Panels/Inspector/inspector.scss",
  "src/Editor/Panels/Inspector/inspector-shim.scss",
  "src/Editor/Panels/Inspector/InspectorScriptWindow/_inspectorscriptwindow.scss",
  "src/Editor/Panels/Inspector/InspectorScriptWindow/ScriptWindowRow/_scriptwindowrow.scss",
  "src/Editor/Panels/Inspector/InspectorRow/_inspectorrow.scss",
  "src/Editor/Panels/Inspector/InspectorRow/InspectorInput/_inspectorinput.scss",
  "src/Editor/Panels/OutlinerExpandButton/_outlinerexpandbutton.scss",
  "src/Editor/Panels/Outliner/OutlinerTitle/_outlinertitle.scss",
  "src/Editor/Panels/Outliner/OutlinerName/_outlinername.scss",
  "src/Editor/Panels/Outliner/OutlinerObject/OutlinerDropdown/_outlinerdropdown.scss",
  "src/Editor/Panels/Outliner/OutlinerRow/_outlinerrow.scss",
  "src/Editor/Panels/Outliner/OutlinerFilterMenu/_outlinerfiltermenu.scss",
  "src/Editor/Panels/Outliner/_outliner.scss",
  "src/Editor/Panels/Outliner/outliner.scss",
  "src/Editor/Panels/Outliner/outliner-shim.scss",
  "src/Editor/Panels/Toolbox/ToolboxBreak/_toolboxbreak.scss",
  "src/Editor/Panels/Toolbox/ToolButton/_toolbutton.scss",
  "src/Editor/Panels/Toolbox/CanvasActions/_canvasactions.scss",
  "src/Editor/Panels/Toolbox/_toolbox.scss",
  "src/Editor/Panels/Toolbox/toolbox.scss",
  "src/Editor/Panels/Toolbox/toolbox-shim.scss",
  "src/Editor/Panels/Toolbox/ToolSettings/_toolsettings.scss",
  "src/Editor/Panels/Toolbox/ToolSettings/ToolSettingsInput/_toolsettingsinput.scss",
  "src/Editor/Panels/MobileContainer/_mobilecontainer.scss",
  "src/Editor/Panels/MobileContainer/MobileAssetLibrary/_mobileassetlibrary.scss",
  "src/Editor/Panels/MobileContainer/MobileAssetLibrary/Asset/_asset.scss",
  "src/Editor/Panels/MobileContainer/MobileInspector/_mobileinspector.scss",
  "src/Editor/Panels/MobileContainer/MobileInspector/mobileinspector-shim.scss",
  "src/Editor/Panels/MobileContainer/MobileInspector/MobileInspectorRow/_mobileinspectorrow.scss",
  "src/Editor/Panels/MobileContainer/MobileInspector/MobileInspectorRow/mobileinspectorrow-shim.scss",
  "src/Editor/Panels/MobileContainer/MobileInspector/MobileInspectorRow/MobileInspectorInput/_mobileinspectorinput.scss",
  "src/Editor/Panels/MobileContainer/MobileInspector/MobileInpsectorTabbedInterface/_mobileinspectortabbedinterface.scss",
]);

const ALLOWLIST_PATTERNS = [
  /^src\/Editor\/_editor\.scss$/,
  /^src\/Editor\/_wickbrand\.module\.scss$/,
  /^src\/Editor\/brand\.scss$/,
  /^src\/Editor\/Modals\/(?!WickModal\/_wickmodal\.scss|SimpleProjectSettings\/_simpleprojectsettings\.scss|AutosaveWarning\/_autosavewarning\.scss|GeneralWarning\/_generalwarning\.scss|EditorInfo\/_editorinfo\.scss|SavedProjects\/_savedprojects\.scss|SavedProjects\/SavedProjectItem\/_savedprojectitem\.scss|MobileMenu\/_mobilemenu\.scss|Util\/ObjectInfo\/_objectinfo\.scss|MakeAnimated\/_makeanimated\.scss|MakeInteractive\/_makeinteractive\.scss|SupportUs\/_supportus\.scss|OpenSourceNotices\/_opensourcenotices\.scss|BuiltinLibrary\/_builtinlibrary\.scss|ExportMedia\/_exportmedia\.scss|WelcomeMessage\/_welcomemessage\.scss|ExportOptions\/_exportoptions\.scss|SettingsModal\/_settingsmodal\.scss|SettingsModal\/EditorSettings\/_editorsettings\.scss|SettingsModal\/KeyboardShortcuts\/_keyboardshortcuts\.scss|SettingsModal\/ProjectSettings\/_projectsettings\.scss).+\.scss$/,
  /^src\/Editor\/Panels\/.+\.scss$/,
  /^src\/Editor\/Util\/(?!ActionButton\/_actionbutton\.scss|WickInput\/_wickinput\.scss|TabbedInterface\/_tabbedinterface\.scss|MobileTabbedInterface\/_mobiletabbedinterface\.scss|PlayButton\/_playbutton\.scss|ErrorPage\/_index\.scss|ColorPicker\/_colorpicker\.scss|ColorPicker\/_wickcolorpicker\.scss|AudioPlayer\/_audioplayer\.scss|ToolIcon\/_toolbutton\.scss|PopupMenu\/_popupmenu\.scss).+\.scss$/,
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
