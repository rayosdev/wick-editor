import { type ComponentProps, ReactNode, useEffect, useMemo, useRef } from "react";
import ErrorBoundary from "./Util/ErrorBoundary";
import { Slide, ToastContainer } from "react-toastify";
import ErrorPage from "./Util/ErrorPage";
import ModalHandler from "./Modals/ModalHandler/ModalHandler";
import {
    attachConsoleListener,
    type ConsoleListenerEntry,
} from "./Util/consoleListener";
import type { HotKeyMap } from "Editor/types/hotkeys";
import type {
    WarningModalInfo,
    CustomHotKeys,
    LocalFileEntry,
    ToastType,
    ToastOptions,
    ToolSettingRestrictions,
    ColorPickerType,
} from "./types";
import type { BasicWarningModalInfo } from "./types/editor.types";
import type { ConsoleLogEntry as EditorConsoleLogEntry } from "./types/editor.types";

type ConsoleLogEntry = EditorConsoleLogEntry;
type ModalRenderType = "video" | "gif" | "image sequence";
type ToolSettingValue = string | number | boolean | { rgba: string };
type HotkeyHandler = (event: KeyboardEvent) => void;
type HotkeyHandlers = Record<string, HotkeyHandler | undefined>;
type HotkeyBinding = {
    id: string;
    sequence: string;
    onKeyUp: boolean;
    handler: HotkeyHandler;
};
type UseHotkeysOptions = {
    enabled?: boolean;
    keydown?: boolean;
    keyup?: boolean;
    enableOnFormTags?: boolean;
};

type ModalHandlerProps = ComponentProps<typeof ModalHandler>;
type ModalProject = ModalHandlerProps["project"];
type ModalLocalFileEntry = ModalHandlerProps["localSavedFiles"][number];

type EditorProjectLike = {
    name: string;
    identifier?: string | null;
};

type EditorLikeState = {
    activeModalName: string | null;
    warningModalInfo: WarningModalInfo | BasicWarningModalInfo;
    renderProgress: number;
    renderStatusMessage: string;
    renderType: string;
    customHotKeys: CustomHotKeys;
    previewPlaying: boolean;
    project: EditorProjectLike | null;
    colorPickerType: string;
    lastColorsUsed: string[];
    renderSize?: string;
    localSavedFiles: LocalFileEntry[] | unknown[];
};

type EditorLike = {
    project: EditorProjectLike;
    state: EditorLikeState;
    hotKeyInterface: {
        createHandlerGroups: () => unknown;
    };
    autoSaveProject: (callback: () => void) => void;
    toast: (
        message: string,
        type?: ToastType,
        options?: ToastOptions
    ) => number | string | void;
    getKeyMap: (fullKeyMap?: boolean) => HotKeyMap;
    getKeyHandlers: (fullKeyHandlers?: boolean) => HotkeyHandlers;
    getRenderSize: () => string;
    openModal: (name: string, options?: Record<string, unknown>) => void;
    closeActiveModal: () => void;
    queueModal: (name: string) => void;
    setSkipWelcomeMessage: (skip: boolean) => void;
    openWarningModal: (info: WarningModalInfo) => void;
    createClipFromSelection: (name: string) => void;
    createButtonFromSelection: (name: string) => void;
    createAnimationFromSelection: (name: string) => void;
    updateProjectSettings: (settings: Partial<Record<string, unknown>>) => void;
    exportProjectAsAnimatedGIF: () => void;
    exportProjectAsVideo: () => void;
    exportProjectAsStandaloneZip: () => void;
    exportProjectAsStandaloneHTML: () => void;
    exportProjectAsImageSequence: () => void;
    exportProjectAsAudioTrack: () => void;
    loadAutosavedProject: (callback: () => void) => void;
    clearAutoSavedProject: (callback: () => void) => void;
    addCustomHotKeys: (
        newHotKeys: Array<{ actionName: string; index: number; sequence: string }>
    ) => void;
    resetCustomHotKeys: () => void;
    importFileAsAsset: (file: File) => void;
    changeColorPickerType: (type: string) => void;
    updateLastColors: (color: string) => void;
    createCombinedHotKeyMap: (
        hotKeyMap: CustomHotKeys,
        hotKeyArray: Array<{ actionName: string; index: number; sequence: string }>
    ) => CustomHotKeys;
    getToolSetting: (setting: string) => ToolSettingValue;
    setToolSetting: (setting: string, value: string | number | boolean) => void;
    getToolSettingRestrictions: (setting: string) => ToolSettingRestrictions;
    exportProjectAsImageSVG: () => void;
    builtinPreviews: unknown;
    addFileToBuiltinPreviews: (filename: string, file: File) => void;
    isAssetInLibrary: (filename: string) => boolean;
    openProjectFileDialog: () => void;
    openNewProjectConfirmation: () => void;
    setConsoleLogs: (
        logsOrUpdater:
            | ConsoleLogEntry[]
            | ((logs: ConsoleLogEntry[]) => ConsoleLogEntry[])
    ) => void;
    loadLocalWickFile: (file: LocalFileEntry) => void;
    deleteLocalWickFile: (file: LocalFileEntry) => void;
    reloadSavedWickFiles: () => void;
    editorVersion?: string;
};

const isLocalFileEntry = (value: unknown): value is ModalLocalFileEntry => {
    if (!value || typeof value !== "object") {
        return false;
    }

    const maybeFile = value as Partial<ModalLocalFileEntry>;
    return (
        typeof maybeFile.name === "string" &&
        typeof maybeFile.lastModified === "number" &&
        "handle" in maybeFile
    );
};

const normalizeColorPickerType = (value: ColorPickerType | string): ColorPickerType => {
    return value === "spectrum" ? "spectrum" : "swatches";
};

const customHotKeysToArray = (
    keys: CustomHotKeys
): Array<{ actionName: string; index: number; sequence: string }> => {
    const updates: Array<{ actionName: string; index: number; sequence: string }> = [];

    Object.entries(keys).forEach(([actionName, sequences]) => {
        sequences.forEach((sequence, index) => {
            const resolvedSequence =
                typeof sequence === "string" ? sequence : sequence.sequence;
            if (!resolvedSequence) {
                return;
            }

            updates.push({
                actionName,
                index,
                sequence: resolvedSequence,
            });
        });
    });

    return updates;
};

const isWarningModalInfo = (value: unknown): value is WarningModalInfo => {
    if (!value || typeof value !== "object") {
        return false;
    }

    const maybeWarning = value as Partial<WarningModalInfo>;
    return (
        typeof maybeWarning.title === "string" &&
        typeof maybeWarning.description === "string" &&
        typeof maybeWarning.acceptText === "string" &&
        typeof maybeWarning.acceptAction === "function" &&
        typeof maybeWarning.cancelAction === "function"
    );
};

type EditorWrapperProps = {
    editor: EditorLike;
    children?: ReactNode;
};

const MAX_CONSOLE_LOGS = 500;

const normalizeHotkeyToken = (token: string): string => {
    const normalized = token.trim().toLowerCase();
    if (normalized === "space" || normalized === "spacebar") {
        return "space";
    }
    if (normalized === "return") {
        return "enter";
    }
    if (normalized === "esc") {
        return "escape";
    }
    if (normalized === "del") {
        return "delete";
    }
    return normalized;
};

const normalizeEventKey = (event: KeyboardEvent): string => {
    const key = event.key?.toLowerCase?.() ?? "";
    if (key === " ") {
        return "space";
    }
    return normalizeHotkeyToken(key);
};

const isModifierToken = (token: string): boolean =>
    token === "meta" || token === "ctrl" || token === "alt" || token === "shift";

const hotkeyMatches = (sequence: string, event: KeyboardEvent): boolean => {
    const tokens = sequence
        .split("+")
        .map(normalizeHotkeyToken)
        .filter(Boolean);

    if (tokens.length === 0) {
        return false;
    }

    const requiredModifiers = {
        meta: tokens.includes("meta"),
        ctrl: tokens.includes("ctrl"),
        alt: tokens.includes("alt"),
        shift: tokens.includes("shift"),
    };

    if (event.metaKey !== requiredModifiers.meta) return false;
    if (event.ctrlKey !== requiredModifiers.ctrl) return false;
    if (event.altKey !== requiredModifiers.alt) return false;
    if (event.shiftKey !== requiredModifiers.shift) return false;

    const nonModifierTokens = tokens.filter((token) => !isModifierToken(token));
    if (nonModifierTokens.length === 0) {
        return false;
    }

    const eventKey = normalizeEventKey(event);
    return nonModifierTokens.includes(eventKey);
};

const shouldIgnoreHotkeyForTarget = (
    event: KeyboardEvent,
    enableOnFormTags: boolean
): boolean => {
    if (enableOnFormTags) {
        return false;
    }

    const target = event.target as HTMLElement | null;
    if (!target) {
        return false;
    }

    const tag = target.tagName?.toLowerCase?.() ?? "";
    return (
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        target.isContentEditable
    );
};

const useHotkeys = (
    sequence: string,
    callback: (event: KeyboardEvent) => void,
    options: UseHotkeysOptions = {},
    deps: unknown[] = []
): void => {
    const {
        enabled = true,
        keydown = true,
        keyup = false,
        enableOnFormTags = false,
    } = options;

    useEffect(() => {
        if (!enabled || !sequence) {
            return;
        }

        const handler = (event: KeyboardEvent) => {
            if (shouldIgnoreHotkeyForTarget(event, enableOnFormTags)) {
                return;
            }

            if (!hotkeyMatches(sequence, event)) {
                return;
            }

            callback(event);
        };

        if (keydown) {
            window.addEventListener("keydown", handler);
        }

        if (keyup) {
            window.addEventListener("keyup", handler);
        }

        return () => {
            if (keydown) {
                window.removeEventListener("keydown", handler);
            }
            if (keyup) {
                window.removeEventListener("keyup", handler);
            }
        };
    }, [
        callback,
        enabled,
        enableOnFormTags,
        keydown,
        keyup,
        sequence,
        ...deps,
    ]);
};

const normalizeHotkeySequence = (sequence: string): string => {
    return sequence
        .trim()
        .replace(/\bcmd\b/gi, "meta")
        .replace(/\bdel\b/gi, "delete");
};

const buildHotkeyBindings = (
    keyMap: HotKeyMap,
    handlers: HotkeyHandlers
): HotkeyBinding[] => {
    const bindings: HotkeyBinding[] = [];

    Object.entries(keyMap).forEach(([actionName, entry]) => {
        const handler = handlers[actionName];
        if (!handler) {
            return;
        }

        entry.sequences.forEach((sequence, index) => {
            const rawSequence =
                typeof sequence === "string" ? sequence : sequence.sequence;
            const normalizedSequence = normalizeHotkeySequence(rawSequence);

            if (!normalizedSequence) {
                return;
            }

            bindings.push({
                id: `${actionName}-${index}-${normalizedSequence}`,
                sequence: normalizedSequence,
                onKeyUp:
                    typeof sequence === "object" && sequence.action === "keyup",
                handler,
            });
        });
    });

    return bindings;
};

const BoundHotkey = ({ binding }: { binding: HotkeyBinding }): null => {
    useHotkeys(
        binding.sequence,
        (event: KeyboardEvent) => {
            binding.handler(event);
        },
        {
            enabled: true,
            keydown: !binding.onKeyUp,
            keyup: binding.onKeyUp,
            enableOnFormTags: true,
        },
        [binding]
    );

    return null;
};

const GlobalHotkeyBindings = ({
    keyMap,
    handlers,
}: {
    keyMap: HotKeyMap;
    handlers: HotkeyHandlers;
}): JSX.Element => {
    const bindings = useMemo(
        () => buildHotkeyBindings(keyMap, handlers),
        [keyMap, handlers]
    );

    return (
        <>
            {bindings.map((binding) => (
                <BoundHotkey key={binding.id} binding={binding} />
            ))}
        </>
    );
};

function EditorWrapper({ editor, children }: EditorWrapperProps) {
    const pendingEntriesRef = useRef<ConsoleLogEntry[]>([]);
    const flushScheduledRef = useRef(false);
    const clearQueuedRef = useRef(false);

    useEffect(() => {
        let cancelled = false;

        const flushPending = () => {
            flushScheduledRef.current = false;
            if (cancelled) {
                return;
            }

            if (clearQueuedRef.current) {
                clearQueuedRef.current = false;
                editor.setConsoleLogs(() => []);
            }

            if (pendingEntriesRef.current.length) {
                const additions = pendingEntriesRef.current;
                pendingEntriesRef.current = [];
                editor.setConsoleLogs((previous = []) => {
                    const merged = [...previous, ...additions];
                    if (merged.length > MAX_CONSOLE_LOGS) {
                        return merged.slice(-MAX_CONSOLE_LOGS);
                    }
                    return merged;
                });
            }
        };

        const scheduleFlush = () => {
            if (flushScheduledRef.current || cancelled) {
                return;
            }
            flushScheduledRef.current = true;
            Promise.resolve().then(flushPending).catch(() => {
                flushScheduledRef.current = false;
            });
        };

        const detach = attachConsoleListener((entry: ConsoleListenerEntry) => {
            if ("type" in entry && entry.type === "clear") {
                clearQueuedRef.current = true;
                pendingEntriesRef.current = [];
            } else {
                const logEntry: ConsoleLogEntry = {
                    id: entry.id,
                    method: entry.method,
                    data: entry.data,
                    timestamp: entry.timestamp,
                };
                pendingEntriesRef.current.push(logEntry);
            }

            scheduleFlush();
        });

        return () => {
            cancelled = true;
            detach();
        };
    }, [editor]);

    const modalRenderType: ModalRenderType =
        editor.state.renderType === "video"
            ? "video"
            : editor.state.renderType === "image-sequence"
                ? "image sequence"
                : "gif";
    const modalWarningModalInfo = isWarningModalInfo(editor.state.warningModalInfo)
        ? editor.state.warningModalInfo
        : null;
    const addCustomHotKeysForModal: ModalHandlerProps["addCustomHotKeys"] = (keys) => {
        editor.addCustomHotKeys(customHotKeysToArray(keys));
    };
    const addFileToBuiltinPreviewsForModal: ModalHandlerProps["addFileToBuiltinPreviews"] = (
        file
    ) => {
        const filename = typeof file.name === "string" && file.name
            ? file.name
            : "builtin-asset";
        editor.addFileToBuiltinPreviews(filename, file);
    };
    const createCombinedHotKeyMapForModal: ModalHandlerProps["createCombinedHotKeyMap"] = () => {
        return editor.getKeyMap(true) as HotKeyMap;
    };
    const modalProject = editor.project as ModalProject;
    const modalColorPickerType = normalizeColorPickerType(editor.state.colorPickerType);
    const modalLocalSavedFiles: ModalHandlerProps["localSavedFiles"] = Array.isArray(editor.state.localSavedFiles)
        ? editor.state.localSavedFiles.reduce<ModalHandlerProps["localSavedFiles"]>(
            (entries, candidate) => {
                if (isLocalFileEntry(candidate)) {
                    entries.push(candidate);
                }
                return entries;
            },
            []
        )
        : [];
    const setToolSettingForModal = (
        setting: string,
        value: ToolSettingValue
    ): void => {
        if (typeof value === "object" && value !== null && "rgba" in value) {
            editor.setToolSetting(setting, value.rgba);
            return;
        }
        editor.setToolSetting(setting, value);
    };
    const currentKeyMap = editor.getKeyMap() as HotKeyMap;
    const currentKeyHandlers = editor.getKeyHandlers();

    return (
        <ErrorBoundary
            fallback={ErrorPage}
            processError={(_error, _errorInfo) => {
                editor.autoSaveProject(() => {
                    editor.toast("Project Autosaved", "info");
                });
            }}
        >
            <ToastContainer
                transition={Slide}
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <GlobalHotkeyBindings
                keyMap={currentKeyMap}
                handlers={currentKeyHandlers}
            />
            <div id="editor" className="theme-default">
                <ModalHandler
                    getRenderSize={editor.getRenderSize}
                    activeModalName={editor.state.activeModalName as string | null}
                    openModal={editor.openModal as (name: string) => void}
                    closeActiveModal={editor.closeActiveModal}
                    queueModal={editor.queueModal as (name: string) => void}
                    setSkipWelcomeMessage={editor.setSkipWelcomeMessage}
                    project={modalProject}
                    createClipFromSelection={editor.createClipFromSelection}
                    createButtonFromSelection={editor.createButtonFromSelection}
                    createAnimationFromSelection={editor.createAnimationFromSelection}
                    updateProjectSettings={editor.updateProjectSettings}
                    exportProjectAsGif={editor.exportProjectAsAnimatedGIF}
                    exportProjectAsVideo={editor.exportProjectAsVideo}
                    exportProjectAsStandaloneZip={editor.exportProjectAsStandaloneZip}
                    exportProjectAsStandaloneHTML={editor.exportProjectAsStandaloneHTML}
                    exportProjectAsImageSequence={editor.exportProjectAsImageSequence}
                    exportProjectAsAudioTrack={editor.exportProjectAsAudioTrack}
                    openWarningModal={editor.openWarningModal}
                    warningModalInfo={modalWarningModalInfo}
                    loadAutosavedProject={editor.loadAutosavedProject}
                    clearAutoSavedProject={editor.clearAutoSavedProject}
                    renderProgress={editor.state.renderProgress}
                    renderStatusMessage={editor.state.renderStatusMessage}
                    renderType={modalRenderType}
                    addCustomHotKeys={addCustomHotKeysForModal}
                    resetCustomHotKeys={editor.resetCustomHotKeys}
                    customHotKeys={editor.state.customHotKeys}
                    keyMap={editor.getKeyMap(true) as HotKeyMap}
                    keyMapGroups={editor.hotKeyInterface.createHandlerGroups()}
                    importFileAsAsset={editor.importFileAsAsset}
                    colorPickerType={modalColorPickerType}
                    changeColorPickerType={editor.changeColorPickerType}
                    updateLastColors={editor.updateLastColors}
                    lastColorsUsed={editor.state.lastColorsUsed}
                    editorVersion={editor.editorVersion ?? ""}
                    toast={editor.toast}
                    createCombinedHotKeyMap={createCombinedHotKeyMapForModal}
                    getToolSetting={editor.getToolSetting}
                    setToolSetting={setToolSettingForModal}
                    getToolSettingRestrictions={editor.getToolSettingRestrictions}
                    exportProjectAsImageSVG={editor.exportProjectAsImageSVG}
                    builtinPreviews={editor.builtinPreviews}
                    addFileToBuiltinPreviews={addFileToBuiltinPreviewsForModal}
                    isAssetInLibrary={editor.isAssetInLibrary}
                    openProjectFileDialog={editor.openProjectFileDialog}
                    openNewProjectConfirmation={editor.openNewProjectConfirmation}
                    localSavedFiles={modalLocalSavedFiles}
                    loadLocalWickFile={editor.loadLocalWickFile}
                    deleteLocalWickFile={editor.deleteLocalWickFile}
                    reloadSavedWickFiles={editor.reloadSavedWickFiles}
                />
                {children}
            </div>
        </ErrorBoundary>
    );
}

export default EditorWrapper;
