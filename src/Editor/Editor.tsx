/*
 * Copyright 2020 WICKLETS LLC
 *
 * This file is part of Wick Editor.
 *
 * Wick Editor is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Wick Editor is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Wick Editor.  If not, see <https://www.gnu.org/licenses/>.
 */

// @ts-nocheck - TODO: full Editor shell typing migration

import "./editor-legacy.css";
import "./styles/tokens.css";
import "./styles/default_theme.css";
import "./styles/default_styles.css";

import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import "react-reflex/styles.css";
import { ReflexContainer, ReflexSplitter, ReflexElement } from "react-reflex";
import { throttle } from "./Util/throttle";
import { localforageAdapter as localForage, ProjectStorage } from "../storage";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

import HotKeyInterface from "./hotKeyMap";
import ActionMapInterface from "./actionMap";
import ScriptInfoInterface from "./scriptInfo";
import FontInfoInterface from "./fontInfo";
import EditorCore from "./EditorCore";
import { setEditorRuntime } from "./Util/editorRuntime";
import { getPaperRuntime, setProjectRuntime } from "./Util/appRuntime";

import DockedPanel from "./Panels/DockedPanel/DockedPanel";
import Canvas from "./Panels/Canvas/Canvas";
import Inspector from "./Panels/Inspector/Inspector";
import MenuBar from "./Panels/MenuBar/MenuBar";
import Timeline from "./Panels/Timeline/Timeline";
import MobileContainer from "./Panels/MobileContainer/MobileContainer";
import DeleteCopyPaste from "./Panels/DeleteCopyPaste/DeleteCopyPaste";
import CanvasTransforms from "./Panels/CanvasTransforms/CanvasTransforms";
import Toolbox from "./Panels/Toolbox/Toolbox";
import AssetLibrary from "./Panels/AssetLibrary/AssetLibrary";
import Outliner from "./Panels/Outliner/Outliner";
import OutlinerExpandButton from "./Panels/OutlinerExpandButton/OutlinerExpandButton";
import WickCodeEditor from "./PopOuts/WickCodeEditor/WickCodeEditor";

import EditorWrapper from "./EditorWrapper";
import classNames from "classnames";
import pkg from "../../package.json";

// Import types
import type {
  EditorState,
  ResizeProps,
  ColorPickerType,
  CodeEditorWindowProperties,
  CustomHotKeys,
  ToastType,
  ToastOptions,
  ConsoleLogEntry,
} from "./types/editor.types";
import type { ProjectDidChangeOptions } from "./types";
import type {
  WickBase as WickBaseEngine,
  WickToolName,
} from "./types/engine.types";

const { version } = pkg;

type ViteImportMeta = ImportMeta & {
  env?: {
    DEV?: boolean;
  };
};

type BuiltinPreviewEntry = {
  blob: Blob;
  src?: string;
};

type WickFileInputEvent = {
  target: {
    files: FileList | File[] | null;
  };
};

type ScriptRuntimeError = {
  uuid?: string;
  message?: string;
  lineNumber?: number;
  name?: string;
};

type ResizeStopArgs = {
  domElement: Element | Text;
  component: unknown;
};

type WarningModalArgs = {
  description?: string;
  title?: string;
  acceptText?: string;
  cancelText?: string;
  acceptIcon?: string;
  cancelIcon?: string;
  acceptAction?: () => void;
  cancelAction?: () => void;
  finalAction?: () => void;
};

type StorageBridge = {
  db: unknown;
  ProjectCache: unknown;
  ProjectStorage: typeof ProjectStorage;
  localforage: typeof localForage;
};

type ToastRuntimeOptions = ToastOptions & {
  className?: string;
  bodyClassName?: string;
  progressClassName?: string;
  render?: string;
  text?: string;
  type?: ToastType;
};

// Check if we're in development mode
const isDevelopment =
  (import.meta as ViteImportMeta).env?.DEV ||
  (window.location && window.location.hostname === "localhost");

const normalizeColorPickerType = (type: unknown): ColorPickerType =>
  type === "spectrum" ? "spectrum" : "swatches";

const isScriptRuntimeError = (value: unknown): value is ScriptRuntimeError => {
  if (!value || typeof value !== "object") {
    return false;
  }

  return true;
};

const isCustomHotKeys = (value: unknown): value is CustomHotKeys => {
  if (!value || typeof value !== "object") {
    return false;
  }

  return Object.values(value as Record<string, unknown>).every(
    (entry) => Array.isArray(entry),
  );
};

class Editor extends EditorCore {
  // Instance properties with types
  paper: unknown = null;
  editorVersion: string = version + "";
  error: Error | null = null;
  _lastAutosave: number = 0;
  _autosaveDebounceTimeoutID?: number;
  _showWaitOverlayTimeoutID?: number;
  _timelinePreviewSoftRenderRaf?: number;

  fontInfoInterface: FontInfoInterface;
  hotKeyInterface: HotKeyInterface;
  actionMapInterface: ActionMapInterface;
  scriptInfoInterface: ScriptInfoInterface;

  openProjectFileFromClient!: () => void;
  openAssetFileFromClient!: () => void;

  maxLastColors: number = 8;
  _onEyedropperPickedColor: (color: string) => void = () => { };

  RESIZE_THROTTLE_AMOUNT_MS: number = 100;
  WINDOW_RESIZE_THROTTLE_AMOUNT_MS: number = 300;
  resizeProps: ResizeProps;

  canvasComponent: unknown = null;
  timelineComponent: unknown = null;
  lastUsedTool: WickToolName = "cursor";
  builtinPreviews: Record<string, BuiltinPreviewEntry> = {};

  customHotKeysKey: string = "wickEditorcustomHotKeys";
  colorPickerTypeKey: string = "wickEditorColorPickerType";
  timelineRendererModeKey: string = "wickEditorTimelineRendererMode";
  timelineShortcutPresetKey: string = "wickEditorTimelineShortcutPreset";
  timelinePlaybackFollowModeKey: string = "wickEditorTimelinePlaybackFollowMode";
  timelineSnapModeKey: string = "wickEditorTimelineSnapMode";
  timelineDensityModeKey: string = "wickEditorTimelineDensityMode";

  // TypeScript requires we define state type
  state: EditorState & Record<string, unknown>;

  private getFileAssetAcceptExtensions = (): string => {
    const extensions = this.getWickNamespace()?.FileAsset?.getValidExtensions?.();
    if (!Array.isArray(extensions)) {
      return "";
    }

    return extensions.join(", ");
  };

  private getHistoryVisibleObjectsStateType = (): string | null => {
    return this.getWickNamespace()?.History?.StateType?.ONLY_VISIBLE_OBJECTS ?? null;
  };

  protected getWickObjectByUUID = (uuid: string): WickBaseEngine | null => {
    return this.getWickNamespace()?.ObjectCache?.getObjectByUUID?.(uuid) ?? null;
  };

  constructor(props: Record<string, never>) {
    super(props);
    // Set path for engine dependencies
    const wickGlobal = this.getWickNamespace();
    if (wickGlobal) {
      wickGlobal.resourcepath = "corelibs/wick-engine/";
    }

    // "Live" editor states
    this.paper = null;
    this.editorVersion = version + "";

    // GUI state
    const defaultTimelineDensityMode =
      typeof window !== "undefined" && window.matchMedia("(max-width: 800px)").matches
        ? "standard"
        : "compact";

    this.state = {
      project: null,
      previewPlaying: false,
      // Skip welcome message in development or if user has dismissed it before
      activeModalName:
        window.localStorage.skipWelcomeMessage || isDevelopment
          ? null
          : "WelcomeMessage",
      activeModalQueue: [],
      codeEditorOpen: false,
      scriptToEdit: "default",
      showCanvasActions: false,
      showBrushModes: false,
      showCodeErrors: false,
      codeError: null,
      popoutOutlinerSize: 250,
      outlinerPoppedOut: false,
      inspectorSize: 250,
      timelineSize: 280,
      timelineRendererMode: "dom",
      timelineShortcutPreset: "wick",
      timelinePlaybackFollowMode: "follow-playhead",
      timelineSnapMode: "frames",
      timelineDensityMode: defaultTimelineDensityMode,
      timelineSoftRenderTick: 0,
      assetLibrarySize: 150,
      consoleLogs: [],
      warningModalInfo: {
        description: "No Description Given",
        title: "Title",
        acceptText: "Accept",
        cancelText: "Cancel",
        acceptAction: () => {
          console.warn("No Accept Action");
        },
        cancelAction: () => {
          console.warn("No Cancel Action");
        },
      },
      renderProgress: 0,
      renderType: "default",
      renderStatusMessage: "",
      customHotKeys: {},
      colorPickerType: "swatches",
      isAutosaving: false,
      lastColorsUsed: [
        "#FFFFFF",
        "#FFFFFF",
        "#FFFFFF",
        "#FFFFFF",
        "#FFFFFF",
        "#FFFFFF",
        "#FFFFFF",
        "#FFFFFF",
      ],
      exporting: false,
      useCustomOnionSkinningColors: false,
      customOnionSkinningColors: {
        backward: "rgba(0, 255, 0, .3)",
        forward: "rgba(255, 0, 0, .3)",
      },
      onionSkinningWasOn: false,
      localSavedFiles: [], // Files to display in savedProjects Modal.
    };

    // Catch all errors that happen in the editor.
    window.onerror = function (error, url, line) {
      console.error(error);
      console.log("Error Details:", {
        error,
        url,
        line,
      });
      return true;
    };

    // Set up error.
    this.error = null;

    // Last Autosave
    this._lastAutosave = 0;
    this._timelinePreviewSoftRenderRaf = undefined;

    // Create interfaces.
    this.fontInfoInterface = new FontInfoInterface(this);

    // Init hotkeys
    this.hotKeyInterface = new HotKeyInterface(this);

    // Init actions
    this.actionMapInterface = new ActionMapInterface(
      this as ConstructorParameters<typeof ActionMapInterface>[0]
    );

    // Init Script Info
    this.scriptInfoInterface = new ScriptInfoInterface();

    // Check if we are using local saving (apps)...
    if (window.wickEditorFileSystemType === "local") {
      window.openWickLocalFileViewer = (files) => {
        console.log("Files Received", files);
        this.setState({
          localSavedFiles: files,
          activeModalName: "SavedProjects",
        });
      };

      /**
       * Called if a save is attempted and a file with the same name already exists.
       * @param {Object} args - Wrapper for openWarningModal
       */
      window.warnBeforeSave = (args) => {
        this.openWarningModal(args);
      };
    }

    type FileInputOptions = {
      accept?: string;
      multiple?: boolean;
      onChange?: (event: WickFileInputEvent) => void;
    };

    type CreateFileInput = (args: FileInputOptions) => () => void;

    const createFileInput: CreateFileInput =
      typeof window.createFileInput === "function"
        ? (window.createFileInput as CreateFileInput)
        : (_args: FileInputOptions) => () => undefined;

    // Wick Project File Input
    this.openProjectFileFromClient = createFileInput({
      accept: ".zip, .wick",
      onChange: this.handleWickFileLoad,
    });

    // Wick file input
    this.openAssetFileFromClient = createFileInput({
      accept: this.getFileAssetAcceptExtensions(),
      onChange: this.handleAssetFileImport,
      multiple: true,
    });

    // Set up color picker
    this.maxLastColors = 8;
    this._onEyedropperPickedColor = (_color) => { };

    // Resizable panels
    this.RESIZE_THROTTLE_AMOUNT_MS = 100;
    this.WINDOW_RESIZE_THROTTLE_AMOUNT_MS = 300;
    this.resizeProps = {
      onStopResize: throttle(this.onStopResize, this.RESIZE_THROTTLE_AMOUNT_MS),
      onStopPopoutOutlinerResize: throttle(
        this.onStopPopoutOutlinerResize,
        this.RESIZE_THROTTLE_AMOUNT_MS
      ),
      onStopInspectorResize: throttle(
        this.onStopInspectorResize,
        this.RESIZE_THROTTLE_AMOUNT_MS
      ),
      onStopAssetLibraryResize: throttle(
        this.onStopAssetLibraryResize,
        this.RESIZE_THROTTLE_AMOUNT_MS
      ),
      onStopTimelineResize: throttle(
        this.onStopTimelineResize,
        this.RESIZE_THROTTLE_AMOUNT_MS
      ),
      onResize: throttle(this.onResize, this.RESIZE_THROTTLE_AMOUNT_MS),
      onWindowResize: throttle(
        this.onWindowResize,
        this.WINDOW_RESIZE_THROTTLE_AMOUNT_MS
      ),
    };
    window.addEventListener("resize", this.resizeProps.onWindowResize);

    this.canvasComponent = null;
    this.timelineComponent = null;

    this.lastUsedTool = "cursor";

    this.builtinPreviews = {};
  }

  UNSAFE_componentWillMount = () => {
    document.title = `Wick Editor ${this.editorVersion}`;
    // Initialize "live" engine state
    const projectConstructor = this.getWickNamespace()?.Project;
    if (!projectConstructor) {
      throw new Error("Wick runtime Project constructor is unavailable.");
    }
    this.project = new projectConstructor();
    this.attachErrorHandlers();
    this.paper = getPaperRuntime();

    // Initialize storage (Dexie.js)
    // The localforageAdapter is already configured, but we can set it up here
    localForage.config({
      name: "WickEditor",
      description: "Live Data storage of the Wick Editor app.",
    });

    // Initialize Dexie database and expose to window for index.html access
    import("../storage").then(({ db, ProjectCache }) => {
      // Open database connection
      db.open().catch((err) => {
        console.error("[Storage] Failed to open database:", err);
      });

      // Expose to window for index.html cache functions
      if (typeof window !== 'undefined') {
        (window as Window & { __wickStorage?: StorageBridge }).__wickStorage = {
          db,
          ProjectCache,
          ProjectStorage,
          localforage: localForage,
        };
      }
    });

    this.customHotKeysKey = "wickEditorcustomHotKeys";
    this.colorPickerTypeKey = "wickEditorColorPickerType";
    this.timelineRendererModeKey = "wickEditorTimelineRendererMode";
    this.timelineShortcutPresetKey = "wickEditorTimelineShortcutPreset";
    this.timelinePlaybackFollowModeKey = "wickEditorTimelinePlaybackFollowMode";
    this.timelineSnapModeKey = "wickEditorTimelineSnapMode";
    this.timelineDensityModeKey = "wickEditorTimelineDensityMode";

    // Set up custom hotkeys if they exist.
    localForage.getItem(this.customHotKeysKey).then((customHotKeys) => {
      const normalizedHotKeys: CustomHotKeys = isCustomHotKeys(customHotKeys)
        ? customHotKeys
        : {};
      this.hotKeyInterface.setCustomHotKeys(normalizedHotKeys);

      this.setState({
        customHotKeys: normalizedHotKeys,
      });
    });

    // Set color picker state.
    localForage.getItem(this.colorPickerTypeKey).then((colorPickerType) => {
      const normalizedType = normalizeColorPickerType(colorPickerType);
      if (colorPickerType !== normalizedType) {
        localForage.setItem(this.colorPickerTypeKey, normalizedType);
      }

      this.setState({
        colorPickerType: normalizedType,
      });
    });

    // Set timeline renderer mode state.
    localForage.getItem(this.timelineRendererModeKey).then((timelineRendererMode) => {
      const normalizedMode =
        timelineRendererMode === "classic" || timelineRendererMode === "dom"
          ? timelineRendererMode
          : "dom";

      if (timelineRendererMode !== normalizedMode) {
        localForage.setItem(this.timelineRendererModeKey, normalizedMode);
      }

      this.setState({
        timelineRendererMode: normalizedMode,
      });
    });

    localForage
      .getItem(this.timelineShortcutPresetKey)
      .then((timelineShortcutPreset) => {
        const normalizedPreset =
          timelineShortcutPreset === "flash" || timelineShortcutPreset === "wick"
            ? timelineShortcutPreset
            : "wick";

        if (timelineShortcutPreset !== normalizedPreset) {
          localForage.setItem(this.timelineShortcutPresetKey, normalizedPreset);
        }

        this.hotKeyInterface.setTimelineShortcutPreset(normalizedPreset);
        this.setState({
          timelineShortcutPreset: normalizedPreset,
        });
      });

    localForage
      .getItem(this.timelinePlaybackFollowModeKey)
      .then((timelinePlaybackFollowMode) => {
        const normalizedMode =
          timelinePlaybackFollowMode === "off" ||
            timelinePlaybackFollowMode === "follow-playhead"
            ? timelinePlaybackFollowMode
            : "follow-playhead";

        if (timelinePlaybackFollowMode !== normalizedMode) {
          localForage.setItem(this.timelinePlaybackFollowModeKey, normalizedMode);
        }

        this.setState({
          timelinePlaybackFollowMode: normalizedMode,
        });
      });

    localForage
      .getItem(this.timelineSnapModeKey)
      .then((timelineSnapMode) => {
        const normalizedMode =
          timelineSnapMode === "none" ||
            timelineSnapMode === "markers" ||
            timelineSnapMode === "frames"
            ? timelineSnapMode
            : "frames";

        if (timelineSnapMode !== normalizedMode) {
          localForage.setItem(this.timelineSnapModeKey, normalizedMode);
        }

        this.setState({
          timelineSnapMode: normalizedMode,
        });
      });

    localForage
      .getItem(this.timelineDensityModeKey)
      .then((timelineDensityMode) => {
        const defaultMode =
          typeof window !== "undefined" && window.matchMedia("(max-width: 800px)").matches
            ? "standard"
            : "compact";
        const normalizedMode =
          timelineDensityMode === "standard" || timelineDensityMode === "compact"
            ? timelineDensityMode
            : defaultMode;

        if (timelineDensityMode !== normalizedMode) {
          localForage.setItem(this.timelineDensityModeKey, normalizedMode);
        }

        this.setState({
          timelineDensityMode: normalizedMode,
        });
      });

    // Setup the initial project state
    this.setState({
      ...this.state,
      project: this.project.serialize(),
      codeEditorWindowProperties: this.getDefaultCodeEditorProperties(),
    });

    // Save project state on page unload to ensure persistence across refreshes
    window.onbeforeunload = (event) => {
      if (this._autosaveDebounceTimeoutID !== undefined) {
        clearTimeout(this._autosaveDebounceTimeoutID);
        this._autosaveDebounceTimeoutID = undefined;
      }

      if (this.project && this.project.numUndoStates > 1) {
        this.autoSaveProjectSync();
      }

      if (isDevelopment) {
        return null;
      }

      if (this.project.numUndoStates > 1) {
        return null;
      }

      const confirmationMessage = "Warning: All unsaved changes will be lost!";
      const unloadEvent = (event ?? window.event) as BeforeUnloadEvent | undefined;
      if (unloadEvent) {
        unloadEvent.returnValue = confirmationMessage;
      }
      return confirmationMessage;
    };
  };

  componentDidMount = () => {
    console.log("Project Mounted");
    this.hidePreloader();
    this.onWindowResize();
    if (!this.tryToParseProjectURL()) {
      this.loadAutosavedProjectOnStartup();
    }

    this.watchForHover();
  };

  componentWillUnmount = () => {
    if (this._autosaveDebounceTimeoutID !== undefined) {
      clearTimeout(this._autosaveDebounceTimeoutID);
      this._autosaveDebounceTimeoutID = undefined;
    }

    if (this._timelinePreviewSoftRenderRaf !== undefined) {
      window.cancelAnimationFrame(this._timelinePreviewSoftRenderRaf);
      this._timelinePreviewSoftRenderRaf = undefined;
    }
  };

  componentDidUpdate = (
    _prevProps: Readonly<Record<string, never>>,
    prevState: Readonly<{ previewPlaying?: boolean }>,
    _snapshot?: unknown,
  ): void => {
    const wasPreviewPlaying = Boolean(prevState.previewPlaying);
    if (this.state.previewPlaying && !wasPreviewPlaying) {
      this.project.view.canvas?.focus?.();
      this.project.play({
        onError: (error: unknown) => {
          const scriptError = isScriptRuntimeError(error) ? error : undefined;
          if (scriptError) {
            // Filter out benign "undefined" errors from empty default scripts
            if (
              scriptError.message === undefined &&
              scriptError.lineNumber === undefined &&
              scriptError.name === "default"
            ) {
              // Silently ignore this non-critical error
              this.stopPreviewPlaying(undefined);
              return;
            }

            console.error(
              new Error(
                `${scriptError.message} on line ${scriptError.lineNumber} in script "${scriptError.name}".`
              )
            );
            this.setState({
              codeError: scriptError,
            });
          }

          this.stopPreviewPlaying(scriptError);
        },
        onAfterTick: () => {
          //this.project.view.render();
          this.project.guiElement.draw();
          if (this.state.timelineRendererMode === "dom") {
            this.scheduleTimelinePreviewSoftRender();
          }
        },
        onBeforeTick: () => { },
      });
    }

    if (!this.state.previewPlaying && wasPreviewPlaying) {
      if (this._timelinePreviewSoftRenderRaf !== undefined) {
        window.cancelAnimationFrame(this._timelinePreviewSoftRenderRaf);
        this._timelinePreviewSoftRenderRaf = undefined;
      }
      this.project.stop();
      this.projectDidChange({ skipHistory: true, actionName: "Stop Project" });
    }
  };

  scheduleTimelinePreviewSoftRender = (): void => {
    if (this._timelinePreviewSoftRenderRaf !== undefined) {
      return;
    }

    this._timelinePreviewSoftRenderRaf = window.requestAnimationFrame(() => {
      this._timelinePreviewSoftRenderRaf = undefined;

      if (
        !this.project ||
        !this.state.previewPlaying ||
        this.state.timelineRendererMode !== "dom" ||
        this.project.playing === false
      ) {
        return;
      }

      this.notifyTimelineSoftRender();
    });
  };

  // Detects if the device has hover capability. Adds "hasHover" to the body to avoid 'Sticky-hover' on touch devices.
  // https://stackoverflow.com/questions/23885255/how-to-remove-ignore-hover-css-style-on-touch-devices
  watchForHover = (): void => {
    // lastTouchTime is used for ignoring emulated mousemove events
    let lastTouchTime = 0;

    function enableHover() {
      if (Date.now() - lastTouchTime < 500) return;
      document.body.classList.add("hasHover");
    }

    function disableHover() {
      document.body.classList.remove("hasHover");
    }

    function updateLastTouchTime() {
      lastTouchTime = Date.now();
    }

    document.addEventListener("touchstart", updateLastTouchTime, true);
    document.addEventListener("touchstart", disableHover, true);
    document.addEventListener("mousemove", enableHover, true);

    enableHover();
  };

  //

  hidePreloader = () => {
    let preloader = window.document.getElementById("preloader");
    if (!preloader) {
      this.recenterCanvas();
      this.project?.view?.render();
      return;
    }

    setTimeout(() => {
      if (!preloader) {
        return;
      }

      preloader.style.opacity = "0";
      this.recenterCanvas(); // Recenter the canvas after reload;
      setTimeout(() => {
        if (!preloader) {
          return;
        }

        preloader.style.display = "none";
        preloader.remove();
      }, 500);
      this.project.view.render();
    }, 2000); // Wait two seconds to allow editor to set up... TODO: Should connect this to load events.
  };

  showWaitOverlay = (message?: string): void => {
    window.clearTimeout(this._showWaitOverlayTimeoutID);
    this._showWaitOverlayTimeoutID = window.setTimeout(() => {
      let waitOverlay = window.document.getElementById("wait-overlay");
      if (!waitOverlay) {
        return;
      }

      waitOverlay.innerHTML = message || "Please wait...";
      waitOverlay.style.display = "block";
    }, 250);
  };

  hideWaitOverlay = () => {
    window.clearTimeout(this._showWaitOverlayTimeoutID);
    let waitOverlay = window.document.getElementById("wait-overlay");
    if (!waitOverlay) {
      return;
    }

    waitOverlay.style.display = "none";
  };

  /**
   * Resets the editor in preparation for a project load.
   */
  resetEditorForLoad = () => { };

  /**
   * Updates the color picker type within the editor state.
   * @param {String} type String representing the picker mode ("swatches" or "spectrum").
   */
  changeColorPickerType = (type: string): void => {
    const normalizedType = normalizeColorPickerType(type);
    localForage.setItem(this.colorPickerTypeKey, normalizedType);
    this.setState({
      colorPickerType: normalizedType,
    });
  };

  setTimelineRendererMode = (
    mode: EditorState["timelineRendererMode"],
  ): void => {
    const normalizedMode = mode === "classic" ? "classic" : "dom";
    localForage.setItem(this.timelineRendererModeKey, normalizedMode);
    this.setState({
      timelineRendererMode: normalizedMode,
    });
  };

  setTimelineShortcutPreset = (
    preset: EditorState["timelineShortcutPreset"],
  ): void => {
    const normalizedPreset = preset === "flash" ? "flash" : "wick";
    localForage.setItem(this.timelineShortcutPresetKey, normalizedPreset);
    this.hotKeyInterface.setTimelineShortcutPreset(normalizedPreset);
    this.setState({
      timelineShortcutPreset: normalizedPreset,
    });
  };

  setTimelinePlaybackFollowMode = (
    mode: EditorState["timelinePlaybackFollowMode"],
  ): void => {
    const normalizedMode = mode === "off" ? "off" : "follow-playhead";
    localForage.setItem(this.timelinePlaybackFollowModeKey, normalizedMode);
    this.setState({
      timelinePlaybackFollowMode: normalizedMode,
    });
  };

  setTimelineSnapMode = (mode: EditorState["timelineSnapMode"]): void => {
    const normalizedMode =
      mode === "none" || mode === "markers" ? mode : "frames";
    localForage.setItem(this.timelineSnapModeKey, normalizedMode);
    this.setState({
      timelineSnapMode: normalizedMode,
    });
  };

  setTimelineDensityMode = (
    mode: EditorState["timelineDensityMode"],
  ): void => {
    const normalizedMode = mode === "standard" ? "standard" : "compact";
    localForage.setItem(this.timelineDensityModeKey, normalizedMode);
    this.setState({
      timelineDensityMode: normalizedMode,
    });
  };

  notifyTimelineSoftRender = () => {
    this.setState((prevState) => ({
      timelineSoftRenderTick: (prevState.timelineSoftRenderTick || 0) + 1,
    }));
  };

  onWindowResize = () => {
    // Ensure that all elements resize on window resize.
    this.resizeProps.onResize();

    // reset the code window if we resize the window.
    this.setState({
      codeEditorWindowProperties: this.getDefaultCodeEditorProperties(),
    });

    // re-render project to avoid incorrect pan
    this.project.view.render();
    this.recenterCanvas();
  };

  getDefaultCodeEditorProperties = (): CodeEditorWindowProperties => {
    var width = window.innerWidth / 2;
    var height = window.innerHeight / 2;
    return {
      width: width,
      height: height,
      x: window.innerWidth / 2 - width / 2,
      y: window.innerHeight / 2 - height / 2,
      minWidth: 400,
      minHeight: 250,
      consoleHeight: 100,
      consoleOpen: true,
      fontSize: 16,
      theme: "monokai",
    };
  };

  updateLastColors = (color: string): void => {
    let newArray = this.state.lastColorsUsed.concat([]); // make a deep copy.

    // Remove a color from the array. If the new color is in the array, remove it.
    let index = newArray.indexOf(color);
    if (index > -1) {
      newArray.splice(index, 1);
    } else {
      newArray.pop();
    }

    // Add the new color to the front of the array.
    newArray.unshift(color);

    this.setState({
      lastColorsUsed: newArray,
    });
  };

  toggleOutliner = () => {
    this.setState({ outlinerPoppedOut: !this.state.outlinerPoppedOut });
  };

  onResize = (_e?: unknown): void => {
    this.project.view.resize?.();
    this.project.guiElement.draw();
  };

  onStopResize = (_args: ResizeStopArgs): void => { };

  getSizeHorizontal = (domElement: Element | Text): number => {
    if (!(domElement instanceof HTMLElement)) {
      return 0;
    }

    return domElement.offsetWidth;
  };

  getSizeVertical = (domElement: Element | Text): number => {
    if (!(domElement instanceof HTMLElement)) {
      return 0;
    }

    return domElement.offsetHeight;
  };

  /**
   * Updates the code editor properties in the state.
   * @param  {object} newProperties object with new code editor properties. Can include width, height, x, y.
   */
  updateCodeEditorWindowProperties = (
    newProperties: Partial<CodeEditorWindowProperties>,
  ): void => {
    const finalProperties = {
      ...(this.state.codeEditorWindowProperties ??
        this.getDefaultCodeEditorProperties()),
      ...newProperties,
    };

    this.setState({
      codeEditorWindowProperties: finalProperties,
    });
  };

  /**
   * Called when any script is updated.
   */
  onScriptUpdate = () => {
    if (this.project.error) {
      this.clearCodeEditorError();
    }
  };

  /**
   * Called when the outliner is resized.
   * @param  {DomElement} domElement DOM element containing the outliner
   * @param  {React.Component} component  React component of the outliner.
   */
  onStopPopoutOutlinerResize = ({ domElement }: ResizeStopArgs): void => {
    if (!domElement) return;

    this.setState({
      popoutOutlinerSize: this.getSizeHorizontal(domElement),
    });
  };

  /**
   * Called when the inspector is resized.
   * @param  {DomElement} domElement DOM element containing the inspector
   * @param  {React.Component} component  React component of the inspector.
   */
  onStopInspectorResize = ({ domElement }: ResizeStopArgs): void => {
    if (!domElement) return;
    this.setState({
      inspectorSize: this.getSizeHorizontal(domElement),
    });
  };

  /**
   * Called when the asset library is resized.
   * @param  {DomElement} domElement DOM element containing the asset library
   * @param  {React.Component} component  React component of the asset library
   */
  onStopAssetLibraryResize = ({ domElement }: ResizeStopArgs): void => {
    if (!domElement) return;
    this.setState({
      assetLibrarySize: this.getSizeVertical(domElement),
    });
  };

  /**
   * Called when the timeline is resized.
   * @param  {DomElement} domElement DOM element containing the timeline
   * @param  {React.Component} component  React component of the timeline.
   */
  onStopTimelineResize = ({ domElement }: ResizeStopArgs): void => {
    if (!domElement) return;
    var size = this.getSizeVertical(domElement);

    this.setState({
      timelineSize: size,
    });
  };

  /**
   * Opens the requested modal.
   * @param  {string} name name of the modal to open.
   */
  openModal = (name: string | null): void => {
    this.setState({
      activeModalName: name,
    });
  };

  /**
   * Queues a modal to be opened at the next opportunity.
   * @param  {string} name [description]
   */
  queueModal = (name: string | null): void => {
    if (name === null) {
      return;
    }

    if (this.state.activeModalName !== name) {
      // If there is another modal up, queue the modal.
      if (
        this.state.activeModalName !== null &&
        this.state.activeModalQueue.indexOf(name) === -1
      ) {
        this.setState((prevState) => {
          return {
            activeModalQueue: [name].concat(prevState.activeModalQueue),
          };
        });
        // Otherwise, just open it.
      } else {
        this.openModal(name);
      }
    }
  };

  setSkipWelcomeMessage = (skip: boolean): void => {
    if (skip) {
      window.localStorage.setItem("skipWelcomeMessage", "true");
    } else {
      window.localStorage.removeItem("skipWelcomeMessage");
    }
  };

  /**
   * Closes the active modal, if there is one. Opens the next modal in the
   * if necessary.
   */
  closeActiveModal = () => {
    const oldQueue = [...this.state.activeModalQueue];
    if (oldQueue.length === 0) {
      this.openModal(null);
      return;
    }
    const newModalName = oldQueue.shift() ?? null;
    this.setState(
      {
        activeModalQueue: oldQueue,
      },
      () => this.openModal(newModalName)
    );
  };

  /**
   * Opens and closes the code editor depending on the state of the codeEditor.
   * @param {boolean} state - Optional. True will open the code editor, false will close.
   */
  toggleCodeEditor = (...args: unknown[]): void => {
    let state = typeof args[0] === "boolean" ? args[0] : undefined;

    if (state === undefined || typeof state !== "boolean") {
      state = !this.state.codeEditorOpen;
    }

    this.setState({
      codeEditorOpen: state,
    });
  };

  /**
   * Opens and closes the canvas actions popover.
   * @param {boolean} state - Optional. True will open the canvas actions menu, false will close.
   */
  toggleCanvasActions = (state?: boolean): void => {
    if (state === undefined || typeof state !== "boolean") {
      state = !this.state.showCanvasActions;
    }

    this.setState({
      showCanvasActions: state,
    });
  };

  /**
   * Opens and closes the brush modes popover.
   * @param {boolean} state - Optional. True will open the brush modes menu, false will close.
   */
  toggleBrushModes = (state?: boolean): void => {
    if (state === undefined || typeof state !== "boolean") {
      state = !this.state.showBrushModes;
    }

    this.setState({
      showBrushModes: state,
    });
  };

  /**
   * Show code errors in the code editor by popping it up.
   * @param  {object[]} errors Array of error objects.
   */
  showCodeErrors = (errors: Array<{ uuid?: string }> = []) => {
    this.setState({
      codeEditorOpen: errors === undefined ? this.state.codeEditorOpen : true,
    });

    if (errors.length > 0 && errors[0]?.uuid) {
      const obj = this.getWickObjectByUUID(errors[0].uuid as string) as
        | { parentClip?: unknown }
        | null;
      if (obj?.parentClip) {
        this.setFocusObject(obj.parentClip);
      }
      if (obj) {
        this.selectObject(obj);
      }
      this.projectDidChange({ actionName: "Show Code Errors" });
    }
  };

  /**
   * Update the onion skinning colors in the editor.
   * @param {object} colors An object with colors to be used for onion skinning. colors.backward is used for previous frames. colors.forward is used for following frames.
   */
  changeOnionSkinningColors = (
    colors?: Partial<EditorState["customOnionSkinningColors"]>,
  ): void => {
    if (!colors) return; // ignore change if no colors are passed.

    this.setState({
      customOnionSkinningColors: {
        backward:
          colors.backward || this.state.customOnionSkinningColors.backward,
        forward: colors.forward || this.state.customOnionSkinningColors.forward,
      },
    });
  };

  /**
   * Signals to React that the "live" project changed, so that all components
   * displaying info about the project will render.
   * @param {boolean} skipHistory - If set to true, the current state will not be pushed to the history.
   * @param {string} actionName - Name of the action committed, to save to the history stack.
   * @param {boolean} skipReactRender - If set to true, will not force react to rerender. Use sparingly.
   */
  projectDidChange = (
    options: ProjectDidChangeOptions = { actionName: "Unknown Action" },
  ): void => {
    const actionName = options.actionName || "Unknown Action";

    // Request an autosave, so a save will happen sometime later.
    this.requestAutosave();

    // Save state to history if needed
    if (!options.skipHistory) {
      const stateType = this.getHistoryVisibleObjectsStateType();
      if (stateType) {
        this.project.history.pushState(
          stateType,
          actionName
        );
      }
    }

    // Render engine
    this.project.view.render();
    this.project.guiElement.draw();

    // Force react to render
    // TODO: Determine a non-hack way to do this.
    if (!options.skipReactRender) {
      this.setState({
        project: this.project.serialize(),
      });
    }
  };

  /**
   * Create a toast notification.
   * @param {string} message - the message to display inside the toast.
   * @param {string} type - the type of the toast. ("info", "success", "warning", or "error". See react-toastify docs for more info)
   * @param {object} options - the options for the toast notification. For all options, see the demo for react-toastify: https://fkhadra.github.io/react-toastify/
   */
  toast = (
    message: string,
    type: ToastType = "info",
    options: ToastOptions = {},
  ): number | string | void => {
    if (!message) {
      console.error("toast() requires a message.");
      return;
    }

    // Default options for the toast:
    const defaultOptions: ToastRuntimeOptions = {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      className: type + "-toast-background",
      bodyClassName: type + "-toast-body",
      progressClassName: type + "-toast-progress",
    };

    // Mix default options and options param:
    const mixOptions = Object.assign(
      {},
      defaultOptions,
      options as ToastRuntimeOptions,
    );

    const toastByType: Record<ToastType, typeof toast.info> = {
      info: toast.info,
      success: toast.success,
      warning: toast.warning,
      error: toast.error,
    };
    return toastByType[type](message, mixOptions);
  };

  /**
   * Updates an existing toast to a new toast type
   * @param {string} id ID of the toast to update.
   * @param {object} options options to apply to the newly updated toast.
   */
  updateToast = (
    id: unknown,
    options: ToastOptions & Record<string, unknown> = {},
  ): void => {
    const nextOptions: ToastRuntimeOptions = { ...(options as ToastRuntimeOptions) };

    if (nextOptions.text) {
      nextOptions.render = nextOptions.text;
    }

    if (nextOptions.type) {
      nextOptions.className = nextOptions.type + "-toast-background";
      nextOptions.bodyClassName = nextOptions.type + "-toast-body";
    }

    if (!nextOptions.autoClose) {
      nextOptions.autoClose = 5000;
    }

    if (typeof id === "string" || typeof id === "number") {
      toast.update(id, nextOptions);
    }
  };

  /**
   * Opens a warning modal with a description. If the modal is accepted, the accept action is called.
   * @param {Object} args can contain description {string}, acceptAction {function}, cancelAction {function},
   * acceptText {string}, cancelText {string}, title {string}.
   */
  openWarningModal = (args: WarningModalArgs): void => {
    if (isDevelopment) {
      console.log("[DEV] Skipping confirmation dialog:", args.title || "Warning");
      if (args.acceptAction) {
        args.acceptAction();
      }
      if (args.finalAction) {
        args.finalAction();
      }
      return;
    }

    const modalInfo = {
      description: args.description || "No Description",
      title: args.title || "Title",
      acceptAction:
        args.acceptAction ||
        (() => {
          console.warn("No accept action implemented.");
        }),
      cancelAction:
        args.cancelAction ||
        (() => {
          console.warn("No cancel action implemented.");
        }),
      finalAction:
        args.finalAction ||
        (() => {
          console.warn("No final action implemented.");
        }),
      acceptText: args.acceptText || "Accept",
      acceptIcon: args.acceptIcon,
      cancelText: args.cancelText || "Cancel",
      cancelIcon: args.cancelIcon,
    };

    this.setState({
      warningModalInfo: modalInfo,
      activeModalName: "GeneralWarning",
    });
  };

  /**
   *  Combines two custom hotkey objects into a single custom hotkey object.
   *  Any hotkeys in hotkeys2 will overwrite hotkeys1.
   * @param {Object} hotkeys1 - Custom hotkey map.
   * @param {Object} hotkeys2 - Custom hotkey map.
   * @returns {Object} - Combined custom hotkey map.
   **/

  combineHotKeys = (
    hotkeys1: CustomHotKeys,
    hotkeys2: CustomHotKeys,
  ): CustomHotKeys => {
    // Try to combine all keys

    const newHotKeys: CustomHotKeys = { ...hotkeys1, ...hotkeys2 };

    const keys1 = Object.keys(hotkeys1);
    const keys2 = Object.keys(hotkeys2);

    const similarKeys = keys2.filter((key) => keys1.indexOf(key) > -1);

    similarKeys.forEach((key) => {
      const left = hotkeys1[key] ?? [];
      const right = hotkeys2[key] ?? [];
      const combinedKey = [...left, ...right];
      newHotKeys[key] = combinedKey;
    });

    return newHotKeys;
  };

  /**
   * Converts an array of hotkeys to a custom hotkey object.
   */
  convertHotkeyArray = (
    hotkeys: Array<{ actionName: string; index: number; sequence: string }>,
  ): CustomHotKeys => {
    const keyObj: CustomHotKeys = {};

    hotkeys.forEach((key) => {
      if (keyObj[key.actionName]) {
        keyObj[key.actionName]?.splice(key.index, 1, key.sequence);
      } else {
        const sequences: string[] = [];
        sequences[key.index] = key.sequence;
        keyObj[key.actionName] = sequences;
      }
    });

    return keyObj;
  };

  /**
   * Creates a combined key map from a key map object and key array.
   */
  createCombinedHotKeyMap = (
    hotKeyMap: CustomHotKeys,
    hotKeyArray: Array<{ actionName: string; index: number; sequence: string }>,
  ): CustomHotKeys => {
    return this.combineHotKeys(hotKeyMap, this.convertHotkeyArray(hotKeyArray));
  };

  /**
   * Takes an array of hot key objects. Combines these with existing custom hot keys and syncs the editor
   * to these new hot keys.
   */
  addCustomHotKeys = (
    newHotKeys: Array<{ actionName: string; index: number; sequence: string }>,
  ): void => {
    const combined = this.createCombinedHotKeyMap(
      this.state.customHotKeys,
      newHotKeys
    );

    this.syncHotKeys(combined);
  };

  /**
   * Takes a hotkeys object and sets these as the custom hot keys.
   */
  syncHotKeys = (hotkeys: CustomHotKeys): void => {
    this.hotKeyInterface.setCustomHotKeys(hotkeys);
    localForage.setItem(this.customHotKeysKey, hotkeys);
    this.setState({
      customHotKeys: hotkeys,
    });
  };

  resetCustomHotKeys = () => {
    this.syncHotKeys({});
  };

  handleAssetFileImport = (e: WickFileInputEvent): void => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    this.createAssets(files, []);
  };

  openProjectFileDialog = () => {
    this.openProjectFileFromClient();
  };

  openImportAssetFileDialog = () => {
    this.openAssetFileFromClient();
  };

  /**
   * Returns the appropriate keymap based on the state of the editor.
   * @param fullKeyMap {Bool} If true, returns the full keymap for the editor. Otherwise, the appropriate keymap is returned.
   * @returns {Object} Keymap listed as actionName : Object { 0 : sequence, 1 : sequence }
   */
  getKeyMap = (fullKeyMap?: boolean) => {
    if (this.state.previewPlaying && !fullKeyMap) {
      return this.hotKeyInterface.getEssentialKeyMap(this.state.customHotKeys);
    } else {
      return this.hotKeyInterface.getKeyMap(this.state.customHotKeys);
    }
  };

  /**
   * Returns the appropriate key handlers based on the state of the editor.
   * @param fullKeyHandlers {Bool} If true, returns all key handlers for the editor. Otherwise, the appropriate keyhandlers returned.
   */
  getKeyHandlers = (fullKeyHandlers?: boolean) => {
    if (this.state.previewPlaying && !fullKeyHandlers) {
      return this.hotKeyInterface.getEssentialKeyHandlers(
        this.state.customHotKeys
      );
    } else {
      return this.hotKeyInterface.getHandlers(this.state.customHotKeys);
    }
  };

  /**
   * Returns a string representing the render size elements should use in the editor.
   * @returns {String} "large", "medium" or "small" depending on the width of the window.
   */
  getRenderSize = (): "large" | "medium" | "small" => {
    if (window.innerWidth > 1200) {
      return "large";
    } else if (window.innerWidth > 800) {
      return "medium";
    } else {
      return "small";
    }
  };

  setConsoleLogs = (
    logsOrUpdater:
      | ConsoleLogEntry[]
      | ((logs: ConsoleLogEntry[]) => ConsoleLogEntry[]),
  ): void => {
    this.setState((prevState) => ({
      consoleLogs:
        typeof logsOrUpdater === "function"
          ? logsOrUpdater(prevState.consoleLogs ?? [])
          : logsOrUpdater,
    }));
  };

  render = () => {
    // Create some references to the project and editor to make debugging in the console easier:
    setProjectRuntime(this.project);
    setEditorRuntime(this);

    const renderSize = this.getRenderSize();

    return (
      <DndProvider backend={HTML5Backend}>
        <EditorWrapper editor={this}>
          {this.state.isAutosaving && (
            <div
              style={{
                position: "fixed",
                top: "10px",
                right: "10px",
                zIndex: 10000,
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                borderRadius: "4px",
                padding: "8px 12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#fff",
                fontSize: "12px",
                fontFamily: "system-ui, -apple-system, sans-serif",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                  borderTopColor: "#fff",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              <span>Saving...</span>
              <style>{`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          )}

          {/* Menu Bar */}

          <div id="menu-bar-container">
            {/* Header */}
            <DockedPanel showOverlay={this.state.previewPlaying}>
              <MenuBar
                renderSize={renderSize}
                openModal={this.openModal}
                projectName={this.project.name}
                openProjectFileDialog={this.openProjectFileDialog}
                openNewProjectConfirmation={this.openNewProjectConfirmation}
                exportProjectAsWickFile={this.exportProjectAsWickFile}
                importProjectAsWickFile={this.openProjectFileDialog}
                exporting={this.state.exporting}
                toast={this.toast}
                openExportMedia={() => {
                  this.openModal("ExportMedia");
                }}
                openExportOptions={() => {
                  this.openModal("ExportOptions");
                }}
              />
            </DockedPanel>
          </div>

          {/* Main Editor Panel */}

          <div id="editor-body">
            <div
              className={classNames({
                "mobile-editor-body": renderSize === "small",
              })}
              id="flexible-container"
            >
              {/*App*/}
              <ReflexContainer windowResizeAware={true} orientation="vertical">
                {/* Middle Panel */}
                <ReflexElement {...this.resizeProps}>
                  {/*Toolbox*/}
                  <div
                    className={classNames(
                      "toolbox-container",
                      { "toolbox-container-medium": renderSize === "medium" },
                      { "toolbox-container-small": renderSize === "small" }
                    )}
                  >
                    <DockedPanel showOverlay={this.state.previewPlaying}>
                      <Toolbox
                        project={this.state.project}
                        getActiveToolName={() => this.getActiveTool() || "cursor"}
                        activeToolName={this.getActiveTool() || "cursor"}
                        setActiveTool={this.setActiveTool}
                        getToolSetting={this.getToolSetting}
                        setToolSetting={this.setToolSetting}
                        previewPlaying={this.state.previewPlaying}
                        editorActions={this.actionMapInterface.editorActions}
                        getToolSettingRestrictions={
                          this.getToolSettingRestrictions
                        }
                        showCanvasActions={this.state.showCanvasActions}
                        showBrushModes={this.state.showBrushModes}
                        toggleCanvasActions={this.toggleCanvasActions}
                        toggleBrushModes={this.toggleBrushModes}
                        colorPickerType={this.state.colorPickerType}
                        changeColorPickerType={this.changeColorPickerType}
                        updateLastColors={this.updateLastColors}
                        lastColorsUsed={this.state.lastColorsUsed}
                        keyMap={this.getKeyMap()}
                        renderSize={renderSize}
                      />
                    </DockedPanel>
                  </div>
                  <div
                    className={classNames(
                      "editor-canvas-timeline-panel",
                      {
                        "editor-canvas-timeline-panel-medium":
                          renderSize === "medium",
                      },
                      {
                        "editor-canvas-timeline-panel-small":
                          renderSize === "small",
                      }
                    )}
                  >
                    <ReflexContainer
                      windowResizeAware={true}
                      orientation="horizontal"
                    >
                      {/* Canvas and Popout Outliner */}
                      <ReflexElement>
                        <ReflexContainer
                          windowResizeAware={true}
                          orientation="vertical"
                        >
                          {/*Canvas*/}
                          <ReflexElement {...this.resizeProps}>
                            <DockedPanel>
                              {this.project?.view?.render?.()}
                              <Canvas
                                editor={this}
                                project={this.project}
                                projectDidChange={this.projectDidChange}
                                projectData={this.state.project}
                                paper={this.paper}
                                previewPlaying={this.state.previewPlaying}
                                createImageFromAsset={
                                  this.createImageFromAsset
                                }
                                toast={this.toast}
                                onEyedropperPickedColor={
                                  this.onEyedropperPickedColor
                                }
                                createAssets={this.createAssets}
                                importProjectAsWickFile={
                                  this.importProjectAsWickFile
                                }
                                onRef={(ref) =>
                                  (this.canvasComponent = ref)
                                }
                              />

                              <CanvasTransforms
                                onionSkinEnabled={this.project.onionSkinEnabled}
                                toggleOnionSkin={this.toggleOnionSkin}
                                zoomIn={this.zoomIn}
                                zoomOut={this.zoomOut}
                                recenterCanvas={this.recenterCanvas}
                                activeToolName={this.getActiveTool() || "cursor"}
                                setActiveTool={this.setActiveTool}
                                previewPlaying={this.state.previewPlaying}
                                togglePreviewPlaying={this.togglePreviewPlaying}
                                renderSize={renderSize}
                                keyMap={this.getKeyMap()}
                              />
                              {renderSize === "small" && (
                                <DeleteCopyPaste
                                  previewPlaying={this.state.previewPlaying}
                                  selectionEmpty={
                                    this.project.selection.getSelectedObjects()
                                      .length === 0
                                  }
                                  editorActions={
                                    this.actionMapInterface.editorActions
                                  }
                                />
                              )}
                              {renderSize === "large" && (
                                <OutlinerExpandButton
                                  expanded={this.state.outlinerPoppedOut}
                                  toggleOutliner={this.toggleOutliner}
                                />
                              )}
                            </DockedPanel>
                          </ReflexElement>

                          {/* Popout Outliner */}
                          {renderSize === "large" &&
                            this.state.outlinerPoppedOut && (
                              <ReflexSplitter {...this.resizeProps} />
                            )}
                          {renderSize === "large" &&
                            this.state.outlinerPoppedOut && (
                              <ReflexElement
                                size={250}
                                maxSize={300}
                                minSize={200}
                                onResize={this.resizeProps.onResize}
                                onStopResize={
                                  this.resizeProps.onStopPopoutOutlinerResize
                                }
                              >
                                <Outliner
                                  className="popout-outliner"
                                  project={this.project}
                                  selectObjects={this.selectObjects}
                                  deselectObjects={this.deselectObjects}
                                  clearSelection={this.clearSelection}
                                  editScript={this.editScript}
                                  setFocusObject={this.setFocusObject}
                                  setActiveLayerIndex={this.setActiveLayerIndex}
                                  moveSelection={this.moveSelection}
                                  toggleHidden={this.toggleHidden}
                                  toggleLocked={this.toggleLocked}
                                />
                              </ReflexElement>
                            )}
                        </ReflexContainer>
                      </ReflexElement>

                      {renderSize === "small" && (
                        <ReflexSplitter
                          {...this.resizeProps}
                          className="mobile-reflex-splitter"
                        />
                      )}
                      {!(renderSize === "small") && (
                        <ReflexSplitter {...this.resizeProps} />
                      )}

                      {/*Timeline*/}
                      <ReflexElement
                        minSize={100}
                        size={this.state.timelineSize}
                        onResize={this.resizeProps.onResize}
                        onStopResize={this.resizeProps.onStopTimelineResize}
                      >
                        <DockedPanel showOverlay={this.state.previewPlaying}>
                          {renderSize === "small" && (
                            <MobileContainer
                              project={this.project}
                              projectDidChange={this.projectDidChange}
                              projectData={this.state.project}
                              getSelectedTimelineObjects={
                                this.getSelectedTimelineObjects
                              }
                              setOnionSkinOptions={this.setOnionSkinOptions}
                              getOnionSkinOptions={this.getOnionSkinOptions}
                              setFocusObject={this.setFocusObject}
                              addTweenKeyframe={this.addTweenKeyframe}
                              createTween={this.createTween}
                              cutFrame={this.cutFrame}
                              insertBlankFrame={this.insertBlankFrame}
                              movePlayheadForwards={this.movePlayheadForwards}
                              movePlayheadBackwards={this.movePlayheadBackwards}
                              focusTimelineOfParentClip={
                                this.focusTimelineOfParentClip
                              }
                              onRef={(ref) => (this.timelineComponent = ref)}
                              dragSoundOntoTimeline={this.dragSoundOntoTimeline}
                              timelineRendererMode={this.state.timelineRendererMode}
                              onTimelineRendererModeChange={this.setTimelineRendererMode}
                              timelineShortcutPreset={this.state.timelineShortcutPreset}
                              onTimelineShortcutPresetChange={this.setTimelineShortcutPreset}
                              timelinePlaybackFollowMode={this.state.timelinePlaybackFollowMode}
                              onTimelinePlaybackFollowModeChange={
                                this.setTimelinePlaybackFollowMode
                              }
                              timelineSnapMode={this.state.timelineSnapMode}
                              onTimelineSnapModeChange={this.setTimelineSnapMode}
                              timelineDensityMode={this.state.timelineDensityMode}
                              onTimelineDensityModeChange={this.setTimelineDensityMode}
                              timelineSoftRenderTick={this.state.timelineSoftRenderTick}
                              getToolSetting={this.getToolSetting}
                              setToolSetting={this.setToolSetting}
                              getSelectionType={this.getSelectionType}
                              getAllSoundAssets={this.getAllSoundAssets}
                              getAllSelectionAttributes={
                                this.getAllSelectionAttributes
                              }
                              setSelectionAttribute={this.setSelectionAttribute}
                              editorActions={
                                this.actionMapInterface.editorActions
                              }
                              selectionIsScriptable={this.selectionIsScriptable}
                              script={this.getSelectedObjectScript()}
                              scriptInfoInterface={this.scriptInfoInterface}
                              deleteScript={this.deleteScript}
                              editScript={this.editScript}
                              fontInfoInterface={this.fontInfoInterface}
                              importFileAsAsset={this.importFileAsAsset}
                              colorPickerType={this.state.colorPickerType}
                              changeColorPickerType={this.changeColorPickerType}
                              updateLastColors={this.updateLastColors}
                              lastColorsUsed={this.state.lastColorsUsed}
                              getClipAnimationTypes={this.getClipAnimationTypes}
                              assets={this.project.getAssets()}
                              openModal={this.openModal}
                              openImportAssetFileDialog={
                                this.openImportAssetFileDialog
                              }
                              selectObjects={this.selectObjects}
                              clearSelection={this.clearSelection}
                              isObjectSelected={this.isObjectSelected}
                              createAssets={this.createAssets}
                              importProjectAsWickFile={
                                this.importProjectAsWickFile
                              }
                              createImageFromAsset={this.createImageFromAsset}
                              toast={this.toast}
                              deleteSelectedObjects={this.deleteSelectedObjects}
                              addSoundToActiveFrame={this.addSoundToActiveFrame}
                            />
                          )}
                          {renderSize !== "small" && (
                            <Timeline
                              project={this.project}
                              projectDidChange={this.projectDidChange}
                              projectData={this.state.project}
                              getSelectedTimelineObjects={
                                this.getSelectedTimelineObjects
                              }
                              setOnionSkinOptions={this.setOnionSkinOptions}
                              getOnionSkinOptions={this.getOnionSkinOptions}
                              setFocusObject={this.setFocusObject}
                              addTweenKeyframe={this.addTweenKeyframe}
                              createTween={this.createTween}
                              cutFrame={this.cutFrame}
                              insertBlankFrame={this.insertBlankFrame}
                              deleteSelectedObjects={this.deleteSelectedObjects}
                              movePlayheadForwards={this.movePlayheadForwards}
                              movePlayheadBackwards={this.movePlayheadBackwards}
                              focusTimelineOfParentClip={
                                this.focusTimelineOfParentClip
                              }
                              onRef={(ref) => (this.timelineComponent = ref)}
                              dragSoundOntoTimeline={this.dragSoundOntoTimeline}
                              timelineRendererMode={this.state.timelineRendererMode}
                              onTimelineRendererModeChange={this.setTimelineRendererMode}
                              timelineShortcutPreset={this.state.timelineShortcutPreset}
                              onTimelineShortcutPresetChange={this.setTimelineShortcutPreset}
                              timelinePlaybackFollowMode={this.state.timelinePlaybackFollowMode}
                              onTimelinePlaybackFollowModeChange={
                                this.setTimelinePlaybackFollowMode
                              }
                              timelineSnapMode={this.state.timelineSnapMode}
                              onTimelineSnapModeChange={this.setTimelineSnapMode}
                              timelineDensityMode={this.state.timelineDensityMode}
                              onTimelineDensityModeChange={this.setTimelineDensityMode}
                              timelineSoftRenderTick={this.state.timelineSoftRenderTick}
                              toast={this.toast}
                            />
                          )}
                        </DockedPanel>
                      </ReflexElement>
                    </ReflexContainer>
                  </div>
                </ReflexElement>

                {/* Right Sidebar */}
                {!(renderSize === "small") && (
                  <ReflexSplitter {...this.resizeProps} />
                )}
                {!(renderSize === "small") && (
                  <ReflexElement
                    size={250}
                    maxSize={300}
                    minSize={200}
                    onResize={this.resizeProps.onResize}
                    onStopResize={this.resizeProps.onStopInspectorResize}
                  >
                    <ReflexContainer
                      windowResizeAware={true}
                      orientation="horizontal"
                    >
                      {/* Inspector */}
                      <ReflexElement {...this.resizeProps}>
                        <DockedPanel showOverlay={this.state.previewPlaying}>
                          <Inspector
                            getToolSetting={this.getToolSetting}
                            setToolSetting={this.setToolSetting}
                            getSelectionType={this.getSelectionType}
                            getAllSoundAssets={this.getAllSoundAssets}
                            getAllSelectionAttributes={
                              this.getAllSelectionAttributes
                            }
                            setSelectionAttribute={this.setSelectionAttribute}
                            editorActions={
                              this.actionMapInterface.editorActions
                            }
                            selectionIsScriptable={this.selectionIsScriptable}
                            script={this.getSelectedObjectScript()}
                            scriptInfoInterface={this.scriptInfoInterface}
                            deleteScript={this.deleteScript}
                            editScript={this.editScript}
                            fontInfoInterface={this.fontInfoInterface}
                            project={this.project}
                            importFileAsAsset={this.importFileAsAsset}
                            colorPickerType={this.state.colorPickerType}
                            changeColorPickerType={this.changeColorPickerType}
                            updateLastColors={this.updateLastColors}
                            lastColorsUsed={this.state.lastColorsUsed}
                            getClipAnimationTypes={this.getClipAnimationTypes}
                          />
                        </DockedPanel>
                      </ReflexElement>

                      {/* Outliner */}
                      {renderSize === "medium" && (
                        <ReflexSplitter {...this.resizeProps} />
                      )}
                      {renderSize === "medium" && (
                        <ReflexElement minSize={100}>
                          <DockedPanel showOverlay={this.state.previewPlaying}>
                            <Outliner
                              project={this.project}
                              selectObjects={this.selectObjects}
                              deselectObjects={this.deselectObjects}
                              clearSelection={this.clearSelection}
                              editScript={this.editScript}
                              setFocusObject={this.setFocusObject}
                              setActiveLayerIndex={this.setActiveLayerIndex}
                              moveSelection={this.moveSelection}
                              toggleHidden={this.toggleHidden}
                              toggleLocked={this.toggleLocked}
                            />
                          </DockedPanel>
                        </ReflexElement>
                      )}

                      {window.enableAssetLibrary && (
                        <ReflexSplitter {...this.resizeProps} />
                      )}
                      {/* Asset Library */}
                      {window.enableAssetLibrary && (
                        <ReflexElement
                          minSize={100}
                          size={300}
                          onResize={this.resizeProps.onResize}
                          onStopResize={
                            this.resizeProps.onStopAssetLibraryResize
                          }
                        >
                          <DockedPanel showOverlay={this.state.previewPlaying}>
                            <AssetLibrary
                              projectData={this.state.project}
                              assets={this.project.getAssets()}
                              openModal={this.openModal}
                              openImportAssetFileDialog={
                                this.openImportAssetFileDialog
                              }
                              selectObjects={this.selectObjects}
                              clearSelection={this.clearSelection}
                              isObjectSelected={this.isObjectSelected}
                              createAssets={this.createAssets}
                              importProjectAsWickFile={
                                this.importProjectAsWickFile
                              }
                              createImageFromAsset={this.createImageFromAsset}
                              toast={this.toast}
                              deleteSelectedObjects={this.deleteSelectedObjects}
                              addSoundToActiveFrame={this.addSoundToActiveFrame}
                            />
                          </DockedPanel>
                        </ReflexElement>
                      )}
                    </ReflexContainer>
                  </ReflexElement>
                )}
              </ReflexContainer>
            </div>
            {this.state.codeEditorOpen && (
              <WickCodeEditor
                selectionType={this.getSelectionType()}
                codeEditorWindowProperties={
                  this.state.codeEditorWindowProperties
                }
                updateCodeEditorWindowProperties={
                  this.updateCodeEditorWindowProperties
                }
                scriptInfoInterface={this.scriptInfoInterface}
                selectionIsScriptable={this.selectionIsScriptable}
                script={this.getSelectedObjectScript()}
                scriptToEdit={this.state.scriptToEdit}
                error={this.state.codeError}
                onScriptUpdate={this.onScriptUpdate}
                editScript={this.editScript}
                toggleCodeEditor={this.toggleCodeEditor}
                requestAutosave={this.requestAutosave}
                clearCodeEditorError={this.clearCodeEditorError}
                consoleLogs={this.state.consoleLogs}
                setConsoleLogs={this.setConsoleLogs}
                renderSize={renderSize}
              />
            )}
          </div>
        </EditorWrapper>
      </DndProvider>
    );
  };
}

export default Editor;
