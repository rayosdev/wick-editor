type StoryArgs = Record<string, unknown>;

const noop = (): void => {};
const noopBoolean = (): boolean => false;

function createMockFrame(): StoryArgs {
  const frame: StoryArgs = {
    uuid: "storybook-frame-1",
    identifier: "Frame 1",
    name: "Frame 1",
    start: 1,
    end: 24,
    length: 24,
    contentful: true,
    tweens: [],
    inPosition: () => true,
    inRange: () => true,
    remove: noop,
    addTween: noop,
    removeSound: noop,
  };

  return frame;
}

function createMockLayer(frame: StoryArgs): StoryArgs {
  const layer: StoryArgs = {
    uuid: "storybook-layer-1",
    name: "Layer 1",
    identifier: "Layer 1",
    index: 0,
    frames: [frame],
    hidden: false,
    locked: false,
    activate: noop,
    addFrame: noop,
    remove: noop,
    getFrameAtPlayheadPosition: () => frame,
  };

  frame.parentLayer = layer;
  return layer;
}

function createMockTimelineProject(): StoryArgs {
  const frame = createMockFrame();
  const layer = createMockLayer(frame);

  const activeTimeline: StoryArgs = {
    layers: [layer],
    activeLayerIndex: 0,
    playheadPosition: 1,
    fillGapsMethod: "blank_frames",
    activeFrames: [frame],
    addLayer: noop,
    moveLayer: noop,
    deferFrameGapResolve: noop,
    resolveFrameGaps: noop,
  };

  return {
    focus: {
      isRoot: true,
      identifier: "Scene 1",
    },
    name: "Storybook Project",
    width: 1280,
    height: 720,
    framerate: 24,
    view: {
      render: noop,
    },
    guiElement: {
      onProjectModified: (_callback: unknown) => undefined,
      onProjectSoftModified: (_callback: unknown) => undefined,
      draw: noop,
      canvasContainer: null,
      _canvas: {
        getBoundingClientRect: () =>
          ({
            x: 0,
            y: 0,
            left: 0,
            top: 0,
            right: 800,
            bottom: 300,
            width: 800,
            height: 300,
            toJSON: () => ({}),
          } as DOMRect),
      },
      checkForPlayheadAutoscroll: noop,
      scrollX: 0,
      scrollY: 0,
    },
    activeTimeline,
    selection: {
      clear: noop,
      select: noop,
      deselect: noop,
      isObjectSelected: noopBoolean,
      getSelectedObjects: () => [],
      getLeftmostFrames: () => [frame],
      getRightmostFrames: () => [frame],
    },
    getAssetByUUID: () => null,
  };
}

function createMockColor(value: string): StoryArgs {
  return {
    rgba: value,
    alpha: 1,
    toString: () => value,
    toCSS: () => value,
  };
}

export function createEditorWrapperStoryArgs(): StoryArgs {
  const project = createMockTimelineProject();
  const consoleLogs: StoryArgs[] = [];

  const editor: StoryArgs = {
    project,
    state: {
      activeModalName: null,
      warningModalInfo: null,
      renderProgress: 0,
      renderStatusMessage: "",
      renderType: "default",
      customHotKeys: {},
      previewPlaying: false,
      project,
      colorPickerType: "swatches",
      lastColorsUsed: [
        "#000000",
        "#FFFFFF",
        "#1EE29A",
        "#00ADEF",
        "#F86868",
        "#FFC835",
        "#4F4F4F",
        "#303030",
      ],
      localSavedFiles: [],
    },
    hotKeyInterface: {
      createHandlerGroups: () => ({}),
    },
    autoSaveProject: (callback: () => void) => callback(),
    toast: noop,
    getKeyMap: () => ({}),
    getKeyHandlers: () => ({}),
    getRenderSize: () => "large",
    openModal: noop,
    closeActiveModal: noop,
    queueModal: noop,
    setSkipWelcomeMessage: noop,
    openWarningModal: noop,
    createClipFromSelection: noop,
    createButtonFromSelection: noop,
    createAnimationFromSelection: noop,
    updateProjectSettings: noop,
    exportProjectAsAnimatedGIF: noop,
    exportProjectAsVideo: noop,
    exportProjectAsStandaloneZip: noop,
    exportProjectAsStandaloneHTML: noop,
    exportProjectAsImageSequence: noop,
    exportProjectAsAudioTrack: noop,
    loadAutosavedProject: (callback: () => void) => callback(),
    clearAutoSavedProject: (callback: () => void) => callback(),
    addCustomHotKeys: noop,
    resetCustomHotKeys: noop,
    importFileAsAsset: noop,
    changeColorPickerType: noop,
    updateLastColors: noop,
    createCombinedHotKeyMap: () => ({}),
    getToolSetting: () => 1,
    setToolSetting: noop,
    getToolSettingRestrictions: () => ({}),
    exportProjectAsImageSVG: noop,
    builtinPreviews: new Map(),
    addFileToBuiltinPreviews: noop,
    isAssetInLibrary: noopBoolean,
    openProjectFileDialog: noop,
    openNewProjectConfirmation: noop,
    setConsoleLogs: (
      updater:
        | StoryArgs[]
        | ((previous: StoryArgs[]) => StoryArgs[])
    ) => {
      if (typeof updater === "function") {
        const nextLogs = updater(consoleLogs);
        consoleLogs.splice(0, consoleLogs.length, ...nextLogs);
        return;
      }

      consoleLogs.splice(0, consoleLogs.length, ...updater);
    },
    loadLocalWickFile: noop,
    deleteLocalWickFile: noop,
    reloadSavedWickFiles: noop,
    editorVersion: "storybook",
  };

  return { editor };
}

export function createBuiltinLibraryStoryArgs(): StoryArgs {
  return {
    open: true,
    toggle: noop,
    project: createMockTimelineProject(),
    importFileAsAsset: noop,
    builtinPreviews: {},
    addFileToBuiltinPreviews: noop,
    isAssetInLibrary: noopBoolean,
  };
}

export function createCanvasStoryArgs(): StoryArgs {
  const projectView = {
    canvasBGColor: "#ffffff",
    canvasContainer: null,
    canvas:
      typeof document !== "undefined" ? document.createElement("canvas") : null,
    resize: noop,
    on: (_event: string, _handler: unknown) => undefined,
  };

  return {
    project: {
      view: projectView,
    },
    onRef: noop,
    projectDidChange: noop,
    onEyedropperPickedColor: noop,
    importProjectAsWickFile: noop,
    createAssets: noop,
    createImageFromAsset: noop,
  };
}

export function createInspectorNumericInputStoryArgs(): StoryArgs {
  return {
    tooltip: "Opacity",
    val: 72,
    onChange: noop,
    id: "storybook-inspector-numeric-input",
    type: "numeric",
  };
}

export function createMobileContainerStoryArgs(): StoryArgs {
  const project = createMockTimelineProject();

  return {
    project,
    projectData: project,
    projectDidChange: noop,
    getSelectedTimelineObjects: () => [],
    setOnionSkinOptions: noop,
    getOnionSkinOptions: () => ({
      active: false,
      backward: 1,
      forward: 1,
      colorMode: "standard",
    }),
    setFocusObject: noop,
    addTweenKeyframe: noop,
    createTween: noop,
    cutFrame: noop,
    insertBlankFrame: noop,
    movePlayheadForwards: noop,
    movePlayheadBackwards: noop,
    focusTimelineOfParentClip: noop,
    onRef: noop,
    dragSoundOntoTimeline: noop,
    timelineRendererMode: "classic",
    onTimelineRendererModeChange: noop,
    timelineShortcutPreset: "wick",
    onTimelineShortcutPresetChange: noop,
    timelinePlaybackFollowMode: "off",
    onTimelinePlaybackFollowModeChange: noop,
    timelineSnapMode: "frames",
    onTimelineSnapModeChange: noop,
    timelineDensityMode: "compact",
    onTimelineDensityModeChange: noop,
    timelineSoftRenderTick: 0,
    getToolSetting: () => 1,
    setToolSetting: noop,
    getSelectionType: () => "unknown",
    getAllSoundAssets: () => [],
    getAllSelectionAttributes: () => ({
      fillColor: createMockColor("#2f80ed"),
      strokeColor: createMockColor("#1f1f1f"),
      strokeWidth: 1,
      opacity: 1,
    }),
    setSelectionAttribute: noop,
    editorActions: {},
    selectionIsScriptable: () => false,
    script: {
      name: "default",
      src: "",
    },
    scriptInfoInterface: {},
    deleteScript: noop,
    editScript: noop,
    fontInfoInterface: {
      allFontNames: ["Arial", "Helvetica"],
      isExistingFont: () => true,
      hasFont: () => true,
      getFontFile: ({ callback }: { callback: (blob: Blob) => void }) => {
        callback(new Blob());
      },
    },
    importFileAsAsset: noop,
    colorPickerType: "swatches",
    changeColorPickerType: noop,
    updateLastColors: noop,
    lastColorsUsed: [
      "#000000",
      "#FFFFFF",
      "#1EE29A",
      "#00ADEF",
      "#F86868",
      "#FFC835",
      "#4F4F4F",
      "#303030",
    ],
    getClipAnimationTypes: () => [],
    assets: [],
    openModal: noop,
    openImportAssetFileDialog: noop,
    selectObjects: noop,
    clearSelection: noop,
    isObjectSelected: noopBoolean,
    createAssets: noop,
    importProjectAsWickFile: noop,
    createImageFromAsset: noop,
    toast: noop,
    deleteSelectedObjects: noop,
    addSoundToActiveFrame: noop,
  };
}

export function createColorPickerStoryArgs(): StoryArgs {
  return {
    id: "storybook-color-picker",
    color: "#ffffff",
    placement: "bottom",
    colorPickerType: "swatches",
    changeColorPickerType: noop,
    disableAlpha: false,
    onChangeComplete: noop,
    lastColorsUsed: [
      "#000000",
      "#FFFFFF",
      "#1EE29A",
      "#00ADEF",
      "#F86868",
      "#FFC835",
      "#4F4F4F",
      "#303030",
    ],
  };
}

export function createExportMediaStoryArgs(): StoryArgs {
  return {
    open: true,
    toggle: noop,
    project: {
      name: "Storybook Project",
    },
    renderType: "gif",
    renderProgress: 45,
    renderStatusMessage: "Rendering frames...",
  };
}

export function createGeneralWarningStoryArgs(): StoryArgs {
  return {
    open: true,
    toggle: noop,
    info: {
      title: "Delete object?",
      description: "This action cannot be undone.",
      acceptText: "Delete",
      acceptIcon: "delete-black",
      acceptAction: noop,
      cancelText: "Cancel",
      cancelIcon: "cancel",
      cancelAction: noop,
      finalAction: noop,
    },
  };
}

export function createSavedProjectItemStoryArgs(): StoryArgs {
  return {
    item: {
      name: "Storyboard-Concept-A",
      date: "2026-02-18",
      size: "2.1 MB",
    },
    selected: false,
    onClick: noop,
  };
}

export function createEditorSettingsStoryArgs(): StoryArgs {
  return {
    getToolSetting: (setting: string) => {
      if (setting === "onionSkinStyle") return "standard";
      if (setting === "backwardOnionSkinTint") return createMockColor("#00ff00");
      if (setting === "forwardOnionSkinTint") return createMockColor("#ff0000");
      return 1;
    },
    setToolSetting: noop,
    getToolSettingRestrictions: (setting: string) => {
      if (setting === "onionSkinStyle") {
        return {
          options: ["standard", "tint"],
        };
      }

      return {
        options: [],
      };
    },
    colorPickerType: "swatches",
    changeColorPickerType: noop,
    updateLastColors: noop,
    lastColorsUsed: [
      "#000000",
      "#FFFFFF",
      "#1EE29A",
      "#00ADEF",
      "#F86868",
      "#FFC835",
      "#4F4F4F",
      "#303030",
    ],
  };
}

export function createSimpleProjectSettingsStoryArgs(): StoryArgs {
  return {
    open: true,
    toggle: noop,
    project: {
      name: "Storybook Project",
      framerate: 24,
      width: 1280,
      height: 720,
    },
    updateProjectSettings: noop,
  };
}

export function createObjectInfoStoryArgs(): StoryArgs {
  return {
    title: "Object Details",
    rows: [
      { text: "Name: Clip 1", icon: "clip" },
      { text: "Type: Interactive", icon: "button" },
      { text: "Frames: 24", icon: "timeline" },
    ],
  };
}

export function createModalHandlerStoryArgs(): StoryArgs {
  const editorWrapperArgs = createEditorWrapperStoryArgs();
  const editor = editorWrapperArgs.editor as StoryArgs;
  const editorState = (editor.state as StoryArgs) ?? {};
  const lastColorsUsed =
    (editorState.lastColorsUsed as string[] | undefined) ??
    [
      "#000000",
      "#FFFFFF",
      "#1EE29A",
      "#00ADEF",
      "#F86868",
      "#FFC835",
      "#4F4F4F",
      "#303030",
    ];

  return {
    activeModalName: "GeneralWarning",
    openModal: editor.openModal as (...args: unknown[]) => unknown,
    closeActiveModal: editor.closeActiveModal as (...args: unknown[]) => unknown,
    createClipFromSelection: editor.createClipFromSelection as (...args: unknown[]) => unknown,
    createButtonFromSelection: editor.createButtonFromSelection as (...args: unknown[]) => unknown,
    createAnimationFromSelection:
      editor.createAnimationFromSelection as (...args: unknown[]) => unknown,
    openWarningModal: editor.openWarningModal as (...args: unknown[]) => unknown,
    warningModalInfo: {
      title: "Discard changes?",
      description: "Unsaved edits will be lost.",
      acceptText: "Discard",
      acceptIcon: "delete-black",
      acceptAction: noop,
      cancelText: "Cancel",
      cancelIcon: "cancel",
      cancelAction: noop,
      finalAction: noop,
    },
    exportProjectAsVideo: editor.exportProjectAsVideo as (...args: unknown[]) => unknown,
    renderProgress: 25,
    renderType: "gif",
    renderStatusMessage: "Rendering...",
    project: editor.project as StoryArgs,
    updateProjectSettings: editor.updateProjectSettings as (...args: unknown[]) => unknown,
    addCustomHotKeys: editor.addCustomHotKeys as (...args: unknown[]) => unknown,
    resetCustomHotKeys: editor.resetCustomHotKeys as (...args: unknown[]) => unknown,
    keyMap: {},
    keyMapGroups: {},
    customHotKeys: {},
    colorPickerType: "swatches",
    changeColorPickerType: editor.changeColorPickerType as (...args: unknown[]) => unknown,
    updateLastColors: editor.updateLastColors as (...args: unknown[]) => unknown,
    lastColorsUsed,
    toast: noop,
    createCombinedHotKeyMap: editor.createCombinedHotKeyMap as (...args: unknown[]) => unknown,
    getToolSetting: (setting: string) => {
      if (setting === "onionSkinStyle") return "standard";
      if (setting === "backwardOnionSkinTint") return createMockColor("#00ff00");
      if (setting === "forwardOnionSkinTint") return createMockColor("#ff0000");
      return 1;
    },
    setToolSetting: noop,
    getToolSettingRestrictions: () => ({ options: ["standard", "tint"] }),
    importFileAsAsset: editor.importFileAsAsset as (...args: unknown[]) => unknown,
    builtinPreviews: new Map(),
    addFileToBuiltinPreviews: editor.addFileToBuiltinPreviews as (...args: unknown[]) => unknown,
    isAssetInLibrary: editor.isAssetInLibrary as (...args: unknown[]) => unknown,
    editorVersion: "storybook",
    openProjectFileDialog: editor.openProjectFileDialog as (...args: unknown[]) => unknown,
    openNewProjectConfirmation: editor.openNewProjectConfirmation as (...args: unknown[]) => unknown,
    localSavedFiles: [],
    loadLocalWickFile: editor.loadLocalWickFile as (...args: unknown[]) => unknown,
    deleteLocalWickFile: editor.deleteLocalWickFile as (...args: unknown[]) => unknown,
    reloadSavedWickFiles: editor.reloadSavedWickFiles as (...args: unknown[]) => unknown,
    getRenderSize: () => "large",
    loadAutosavedProject: editor.loadAutosavedProject as (...args: unknown[]) => unknown,
    clearAutoSavedProject: editor.clearAutoSavedProject as (...args: unknown[]) => unknown,
    queueModal: editor.queueModal as (...args: unknown[]) => unknown,
    exportProjectAsGif: editor.exportProjectAsAnimatedGIF as (...args: unknown[]) => unknown,
    exportProjectAsStandaloneZip:
      editor.exportProjectAsStandaloneZip as (...args: unknown[]) => unknown,
    exportProjectAsStandaloneHTML:
      editor.exportProjectAsStandaloneHTML as (...args: unknown[]) => unknown,
    exportProjectAsImageSequence:
      editor.exportProjectAsImageSequence as (...args: unknown[]) => unknown,
    exportProjectAsAudioTrack:
      editor.exportProjectAsAudioTrack as (...args: unknown[]) => unknown,
    exportProjectAsImageSVG:
      editor.exportProjectAsImageSVG as (...args: unknown[]) => unknown,
    setSkipWelcomeMessage: editor.setSkipWelcomeMessage as (...args: unknown[]) => unknown,
  };
}

export function createInspectorCheckboxStoryArgs(): StoryArgs {
  return {
    tooltip: "Loop",
    checked: true,
    onChange: noop,
  };
}

export function createInspectorColorNumericInputStoryArgs(): StoryArgs {
  return {
    tooltip1: "Fill",
    tooltip2: "Opacity",
    val1: "#00a8ff",
    val2: 0.8,
    onChange1: noop,
    onChange2: noop,
    id: "storybook-inspector-color-numeric",
    stroke: false,
    colorPickerType: "swatches",
    changeColorPickerType: noop,
    updateLastColors: noop,
    lastColorsUsed: [
      "#000000",
      "#FFFFFF",
      "#1EE29A",
      "#00ADEF",
      "#F86868",
      "#FFC835",
      "#4F4F4F",
      "#303030",
    ],
  };
}

export function createInspectorDualNumericInputStoryArgs(): StoryArgs {
  return {
    tooltip1: "Width",
    tooltip2: "Height",
    val1: 320,
    val2: 180,
    onChange1: noop,
    onChange2: noop,
  };
}

export function createInspectorNumericSliderStoryArgs(): StoryArgs {
  return {
    tooltip: "Opacity",
    val: 0.65,
    onChange: noop,
    inputProps: {
      min: 0,
      max: 1,
      step: 0.01,
    },
  };
}

export function createInspectorSelectorStoryArgs(): StoryArgs {
  return {
    tooltip: "Blend Mode",
    value: "normal",
    onChange: noop,
    options: [
      { label: "Normal", value: "normal" },
      { label: "Multiply", value: "multiply" },
      { label: "Screen", value: "screen" },
    ],
    className: "inspector-select-storybook",
  };
}

export function createInspectorTextInputStoryArgs(): StoryArgs {
  return {
    tooltip: "Name",
    val: "Layer 1",
    onChange: noop,
    placeholder: "Enter name",
    readOnly: false,
    id: "storybook-inspector-text-input",
  };
}

const STORYBOOK_LAST_COLORS = [
  "#000000",
  "#FFFFFF",
  "#1EE29A",
  "#00ADEF",
  "#F86868",
  "#FFC835",
  "#4F4F4F",
  "#303030",
];

const STORYBOOK_IMAGE_DATA_URI =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

function createMockAsset(overrides: StoryArgs = {}): StoryArgs {
  return {
    uuid: "storybook-asset-1",
    name: "Storybook Asset",
    classname: "ImageAsset",
    isGifImage: false,
    ...overrides,
  };
}

function createCanvasAction(icon: string, tooltip: string): StoryArgs {
  return {
    icon,
    tooltip,
    action: noop,
  };
}

function createMockKeyMap(): StoryArgs {
  return {
    "preview-play-toggle": {
      name: "Preview Play",
      sequences: ["k"],
    },
    "activate-pan": {
      name: "Pan",
      sequences: ["x"],
    },
    "activate-zoom": {
      name: "Zoom",
      sequences: ["z"],
    },
    "activate-cursor": {
      name: "Cursor",
      sequences: ["c"],
    },
  };
}

function createOutlinerTree(): {
  timeline: StoryArgs;
  layer: StoryArgs;
  frame: StoryArgs;
} {
  const frame: StoryArgs = {
    uuid: "storybook-outliner-frame-1",
    classname: "Frame",
    identifier: "Frame 1",
    start: 1,
    end: 24,
    isSelected: false,
    hidden: false,
    locked: false,
    hasContentfulScripts: false,
    scripts: [],
    getChildren: () => [],
  };

  const layer: StoryArgs = {
    uuid: "storybook-outliner-layer-1",
    classname: "Layer",
    name: "Layer 1",
    index: 0,
    isSelected: false,
    hidden: false,
    locked: false,
    hasContentfulScripts: false,
    scripts: [],
    getChildren: () => [frame],
  };

  const timeline: StoryArgs = {
    classname: "Timeline",
    playheadPosition: 1,
    getChildren: () => [layer],
  };

  frame.parent = layer;
  frame.parentLayer = layer;
  layer.parent = timeline;

  return {
    timeline,
    layer,
    frame,
  };
}

function createMockScriptInfoInterface(): StoryArgs {
  return {
    scriptsByType: {
      mouse: ["update", "click"],
    },
    scriptTypeColors: {
      mouse: "blue",
    },
  };
}

export function createAssetStoryArgs(): StoryArgs {
  return {
    asset: createMockAsset(),
    isSelected: true,
    onClick: noop,
    addSoundToActiveFrame: noop,
    importProjectAsWickFile: noop,
    createAssets: noop,
    createImageFromAsset: noop,
    clearSelection: noop,
    selectObjects: noop,
    deleteSelectedObjects: noop,
  };
}

export function createAssetLibraryStoryArgs(): StoryArgs {
  return {
    assets: [
      createMockAsset({
        uuid: "storybook-asset-image",
        name: "Background",
        classname: "ImageAsset",
      }),
      createMockAsset({
        uuid: "storybook-asset-sound",
        name: "Theme Song",
        classname: "SoundAsset",
      }),
    ],
    projectData: createMockTimelineProject(),
    openImportAssetFileDialog: noop,
    openModal: noop,
    selectObjects: noop,
    clearSelection: noop,
    isObjectSelected: noopBoolean,
    createAssets: noop,
    importProjectAsWickFile: noop,
    createImageFromAsset: noop,
    deleteSelectedObjects: noop,
    addSoundToActiveFrame: noop,
    toast: noop,
  };
}

export function createCanvasTransformsStoryArgs(): StoryArgs {
  return {
    keyMap: createMockKeyMap(),
    activeToolName: "cursor",
    toggleOnionSkin: noop,
    onionSkinEnabled: false,
    setActiveTool: noop,
    recenterCanvas: noop,
    zoomIn: noop,
    zoomOut: noop,
    previewPlaying: false,
    togglePreviewPlaying: noop,
    renderSize: "large",
  };
}

export function createDeleteCopyPasteStoryArgs(): StoryArgs {
  return {
    previewPlaying: false,
    selectionEmpty: false,
    editorActions: {
      delete: { action: noop },
      copy: { action: noop },
      paste: { action: noop },
    },
  };
}

export function createInspectorStoryArgs(): StoryArgs {
  return createMobileContainerStoryArgs();
}

export function createInspectorPreviewStoryArgs(): StoryArgs {
  return {
    info: {
      type: "image",
      src: STORYBOOK_IMAGE_DATA_URI,
      loadSrc: noop,
    },
  };
}

export function createInspectorScriptWindowStoryArgs(): StoryArgs {
  return {
    scriptInfoInterface: createMockScriptInfoInterface(),
    script: {
      scripts: [
        { name: "update" },
        { name: "click" },
      ],
    },
    deleteScript: noop,
    editScript: noop,
  };
}

export function createScriptWindowRowStoryArgs(): StoryArgs {
  return {
    name: "update",
    scriptInfoInterface: createMockScriptInfoInterface(),
    editScript: noop,
    deleteScript: noop,
  };
}

export function createMenuBarStoryArgs(): StoryArgs {
  return {
    renderSize: "large",
    projectName: "Storybook Project",
    exporting: false,
    openModal: noop,
    openNewProjectConfirmation: noop,
    openProjectFileDialog: noop,
    exportProjectAsWickFile: noop,
    openExportMedia: noop,
    openExportOptions: noop,
  };
}

export function createMenuBarIconButtonStoryArgs(): StoryArgs {
  return {
    id: "storybook-menu-icon-button",
    tooltip: "Editor Settings",
    tooltipPlace: "bottom",
    action: noop,
    icon: "gear",
  };
}

export function createMenuBarSupportButtonStoryArgs(): StoryArgs {
  return {
    id: "storybook-support-button",
    action: noop,
    text: "support us",
    icon: "redheart",
  };
}

export function createMobileAssetLibraryStoryArgs(): StoryArgs {
  return {
    assets: [
      createMockAsset({
        uuid: "storybook-mobile-asset-image",
        name: "Character",
        classname: "ImageAsset",
      }),
      createMockAsset({
        uuid: "storybook-mobile-asset-sound",
        name: "Voiceover",
        classname: "SoundAsset",
      }),
    ],
    openImportAssetFileDialog: noop,
    openModal: noop,
    isObjectSelected: noopBoolean,
    clearSelection: noop,
    selectObjects: noop,
    createAssets: noop,
    importProjectAsWickFile: noop,
    createImageFromAsset: noop,
    deleteSelectedObjects: noop,
    addSoundToActiveFrame: noop,
  };
}

export function createMobileInspectorStoryArgs(): StoryArgs {
  return createMobileContainerStoryArgs();
}

export function createMobileInspectorCheckboxStoryArgs(): StoryArgs {
  return {
    tooltip: "Loop",
    checked: true,
    onChange: noop,
  };
}

export function createMobileInspectorColorStoryArgs(): StoryArgs {
  return {
    tooltip: "Fill",
    val: "#00a8ff",
    onChange: noop,
    id: "storybook-mobile-inspector-color",
    stroke: false,
    colorPickerType: "swatches",
    changeColorPickerType: noop,
    updateLastColors: noop,
    lastColorsUsed: STORYBOOK_LAST_COLORS,
  };
}

export function createMobileInspectorDualNumericInputStoryArgs(): StoryArgs {
  return {
    tooltip1: "X",
    tooltip2: "Y",
    val1: 120,
    val2: 80,
    onChange1: noop,
    onChange2: noop,
  };
}

export function createMobileInspectorNumericInputStoryArgs(): StoryArgs {
  return {
    tooltip: "Opacity",
    val: 72,
    onChange: noop,
    type: "numeric",
  };
}

export function createMobileInspectorNumericSliderStoryArgs(): StoryArgs {
  return {
    tooltip: "Opacity",
    val: 0.65,
    onChange: noop,
    inputProps: {
      min: 0,
      max: 1,
      step: 0.01,
    },
  };
}

export function createMobileInspectorSelectorStoryArgs(): StoryArgs {
  return {
    tooltip: "Blend Mode",
    value: "normal",
    onChange: noop,
    options: [
      { label: "Normal", value: "normal" },
      { label: "Multiply", value: "multiply" },
      { label: "Screen", value: "screen" },
    ],
    className: "mobile-inspector-select-storybook",
    type: "select",
    isSearchable: true,
  };
}

export function createMobileInspectorTextInputStoryArgs(): StoryArgs {
  return {
    tooltip: "Name",
    val: "Layer 1",
    onChange: noop,
    placeholder: "Enter name",
    readOnly: false,
    id: "storybook-mobile-inspector-text-input",
  };
}

export function createOutlinerStoryArgs(): StoryArgs {
  const tree = createOutlinerTree();

  return {
    project: {
      activeTimeline: tree.timeline,
    },
    selectObjects: noop,
    deselectObjects: noop,
    clearSelection: noop,
    editScript: noop,
    setFocusObject: noop,
    setActiveLayerIndex: noop,
    moveSelection: noop,
    toggleHidden: noop,
    toggleLocked: noop,
  };
}

export function createOutlinerObjectStoryArgs(): StoryArgs {
  const tree = createOutlinerTree();

  return {
    clearSelection: noop,
    selectObjects: noop,
    editScript: noop,
    playhead: 1,
    depth: 1,
    maxDepth: 3,
    display: {
      path: true,
      button: true,
      clip: true,
      text: true,
      image: true,
    },
    highlighted: null,
    toggle: noop,
    data: tree.layer,
    isActive: () => true,
    collapsedUUIDs: {},
    dragging: false,
    setDragging: noop,
    setFocusObject: noop,
    setActiveLayerIndex: noop,
    moveSelection: noop,
  };
}

export function createOutlinerDisplayStoryArgs(): StoryArgs {
  return {
    tooltip: "Display",
    display: {
      path: true,
      button: true,
      clip: true,
      text: true,
      image: true,
    },
    onChange: noop,
  };
}

export function createOutlinerWidgetStoryArgs(): StoryArgs {
  return {
    tooltip: "Hide Layer",
    onClick: noop,
    icon: "outliner-hide",
    on: true,
  };
}

export function createTimelineStoryArgs(): StoryArgs {
  return createMobileContainerStoryArgs();
}

export function createCanvasActionsStoryArgs(): StoryArgs {
  return {
    renderSize: "large",
    showCanvasActions: true,
    toggleCanvasActions: noop,
    previewPlaying: false,
    editorActions: {
      sendToBack: createCanvasAction("sendtoback", "Send to Back"),
      sendBackward: createCanvasAction("sendbackward", "Send Backward"),
      sendForward: createCanvasAction("sendforward", "Bring Forward"),
      sendToFront: createCanvasAction("sendtofront", "Bring to Front"),
      flipHorizontal: createCanvasAction("fliphorizontal", "Flip Horizontal"),
      flipVertical: createCanvasAction("flipvertical", "Flip Vertical"),
      booleanUnite: createCanvasAction("booleanunite", "Unite"),
      booleanSubtract: createCanvasAction("booleansubtract", "Subtract"),
      booleanIntersect: createCanvasAction("booleanintersect", "Intersect"),
    },
  };
}

export function createToolboxStoryArgs(): StoryArgs {
  const canvasActionsArgs = createCanvasActionsStoryArgs();
  const canvasEditorActions = canvasActionsArgs.editorActions as StoryArgs;

  return {
    renderSize: "large",
    showCanvasActions: true,
    toggleCanvasActions: noop,
    previewPlaying: false,
    editorActions: {
      ...canvasEditorActions,
      showMoreCanvasActions: createCanvasAction("moreactions", "More Actions"),
      delete: createCanvasAction("delete", "Delete"),
      copy: createCanvasAction("copy", "Copy"),
      paste: createCanvasAction("paste", "Paste"),
      undo: createCanvasAction("undo", "Undo"),
      redo: createCanvasAction("redo", "Redo"),
    },
    setActiveTool: noop,
    getActiveToolName: () => "cursor",
    activeToolName: "cursor",
    keyMap: createMockKeyMap(),
    getToolSetting: (setting: string) => {
      if (setting === "fillColor" || setting === "strokeColor") {
        return "#00a8ff";
      }
      if (setting === "brushMode") {
        return "none";
      }
      if (setting === "pressureEnabled" || setting === "relativeBrushSize") {
        return false;
      }
      return 1;
    },
    setToolSetting: noop,
    getToolSettingRestrictions: () => ({
      min: 0,
      max: 100,
      step: 1,
      options: ["none", "inside", "behind"],
    }),
    toggleBrushModes: noop,
    showBrushModes: false,
    colorPickerType: "swatches",
    changeColorPickerType: noop,
    updateLastColors: noop,
    lastColorsUsed: STORYBOOK_LAST_COLORS,
  };
}

export function createToolSettingsInputStoryArgs(): StoryArgs {
  return {
    type: "numeric",
    name: "Brush Size",
    value: 12,
    icon: "brush",
    onChange: noop,
    inputRestrictions: {
      min: 1,
      max: 100,
      step: 1,
    },
    isMobile: false,
    renderSize: "large",
  };
}

export function createToolButtonStoryArgs(): StoryArgs {
  return {
    name: "cursor",
    tooltip: "Cursor",
    keyMap: createMockKeyMap(),
    getActiveToolName: () => "cursor",
    setActiveTool: noop,
    action: noop,
    secondaryAction: noop,
    dropdown: false,
    className: "toolbox-item",
  };
}

export function createWickCodeEditorStoryArgs(): StoryArgs {
  const scripts: StoryArgs[] = [
    {
      name: "update",
      src: "function update() {\n  // Storybook script\n}\n",
    },
    {
      name: "click",
      src: "function click() {\n  // Storybook click\n}\n",
    },
  ];

  return {
    selectionType: "clip",
    renderSize: "small",
    script: {
      scripts,
      addScript: noop,
      updateScript: noop,
      getAvailableScripts: () => ["update", "click", "load"],
    },
    scriptToEdit: "update",
    scriptInfoInterface: {
      sortScripts: (a: { name: string }, b: { name: string }) =>
        a.name.localeCompare(b.name),
      scriptData: [
        {
          type: "Mouse",
          name: "update",
          description: "Runs every frame.",
          snippet: "function update() {\n  \n}\n",
        },
        {
          type: "Mouse",
          name: "click",
          description: "Runs on click.",
          snippet: "function click() {\n  \n}\n",
        },
      ],
      referenceItems: {
        Mouse: [
          {
            name: "update",
            description: "Runs every frame.",
            snippet: "function update() {\n  \n}\n",
          },
        ],
      },
      getScriptType: () => "mouse",
    },
    codeEditorWindowProperties: {
      width: 720,
      height: 520,
      x: 32,
      y: 32,
      minWidth: 460,
      minHeight: 320,
      consoleHeight: 140,
      consoleOpen: true,
      fontSize: 14,
      theme: "monokai",
    },
    updateCodeEditorWindowProperties: noop,
    toggleCodeEditor: noop,
    editScript: noop,
    clearCodeEditorError: noop,
    requestAutosave: noop,
    onScriptUpdate: noop,
    setConsoleLogs: noop,
    consoleLogs: [],
    error: null,
  };
}

export function createActionButtonStoryArgs(): StoryArgs {
  return {
    id: "storybook-action-button",
    text: "Action",
    icon: "gear",
    tooltip: "Run action",
    action: noop,
    color: "tool",
    disabled: false,
  };
}

export function createAudioPlayerStoryArgs(): StoryArgs {
  return {
    src: STORYBOOK_IMAGE_DATA_URI,
    loadSrc: noop,
  };
}

export function createWickSwatchStoryArgs(): StoryArgs {
  return {
    color: "#00ADEF",
    selectedColor: "#00ADEF",
    onChangeComplete: noop,
  };
}

const dynamicStoryArgsFactories: Record<string, () => StoryArgs> = {
  ActionButton: createActionButtonStoryArgs,
  Asset: createAssetStoryArgs,
  AssetLibrary: createAssetLibraryStoryArgs,
  AudioPlayer: createAudioPlayerStoryArgs,
  CanvasActions: createCanvasActionsStoryArgs,
  CanvasTransforms: createCanvasTransformsStoryArgs,
  DeleteCopyPaste: createDeleteCopyPasteStoryArgs,
  Inspector: createInspectorStoryArgs,
  InspectorPreview: createInspectorPreviewStoryArgs,
  InspectorScriptWindow: createInspectorScriptWindowStoryArgs,
  MenuBar: createMenuBarStoryArgs,
  MenuBarIconButton: createMenuBarIconButtonStoryArgs,
  MenuBarIconButtonComponent: createMenuBarIconButtonStoryArgs,
  MenuBarSupportButton: createMenuBarSupportButtonStoryArgs,
  MobileAssetLibrary: createMobileAssetLibraryStoryArgs,
  MobileInspector: createMobileInspectorStoryArgs,
  MobileInspectorCheckbox: createMobileInspectorCheckboxStoryArgs,
  MobileInspectorColor: createMobileInspectorColorStoryArgs,
  MobileInspectorDualNumericInput: createMobileInspectorDualNumericInputStoryArgs,
  MobileInspectorNumericInput: createMobileInspectorNumericInputStoryArgs,
  MobileInspectorNumericSlider: createMobileInspectorNumericSliderStoryArgs,
  MobileInspectorSelector: createMobileInspectorSelectorStoryArgs,
  MobileInspectorTextInput: createMobileInspectorTextInputStoryArgs,
  Outliner: createOutlinerStoryArgs,
  OutlinerDisplay: createOutlinerDisplayStoryArgs,
  OutlinerObject: createOutlinerObjectStoryArgs,
  OutlinerWidget: createOutlinerWidgetStoryArgs,
  ScriptWindowRow: createScriptWindowRowStoryArgs,
  Timeline: createTimelineStoryArgs,
  ToolButton: createToolButtonStoryArgs,
  ToolSettingsInput: createToolSettingsInputStoryArgs,
  Toolbox: createToolboxStoryArgs,
  WickCodeEditor: createWickCodeEditorStoryArgs,
  WickSwatch: createWickSwatchStoryArgs,
};

export function createDynamicStoryDefaultArgs(componentName: string): StoryArgs {
  const factory = dynamicStoryArgsFactories[componentName];
  if (!factory) {
    return {};
  }

  return factory();
}
