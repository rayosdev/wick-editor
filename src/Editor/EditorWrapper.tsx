import { ReactNode, useEffect, useMemo, useRef } from "react";
import ErrorBoundary from "./Util/ErrorBoundary";
import { Slide, ToastContainer } from "react-toastify";
import { useHotkeys } from "react-hotkeys-hook";
import ErrorPage from "./Util/ErrorPage";
import ModalHandler from "./Modals/ModalHandler/ModalHandler";
import { attachConsoleListener } from "./Util/consoleListener";
import type { HotKeyMap } from "Editor/types/hotkeys";
import type {
    WickProject,
    WarningModalInfo,
    ModalName,
    ProjectSettings,
    CustomHotKeys,
    ColorPickerType,
    RenderType,
    LocalFileEntry,
    BuiltinPreview,
    ToastType,
    ToastOptions,
    ToolSettingRestrictions,
    HotKeyConfig,
} from "./types";

// Note: consoleListener.js uses looser types than our strict types
type ConsoleLogEntry = {
    id: string;
    method: string; // Could be 'log' | 'warn' | 'error' | 'info' | 'debug' but consoleListener uses string
    data: unknown[];
    timestamp: number;
};

type ConsoleClearEntry = { type: "clear" };

type ConsoleListenerEntry = ConsoleLogEntry | ConsoleClearEntry;
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

type EditorLikeState = {
    activeModalName: ModalName;
    warningModalInfo: WarningModalInfo;
    renderProgress: number;
    renderStatusMessage: string;
    renderType: RenderType;
    customHotKeys: CustomHotKeys;
    previewPlaying: boolean;
    project: WickProject;
    colorPickerType: ColorPickerType;
    lastColorsUsed: string[];
    renderSize?: string;
    localSavedFiles: LocalFileEntry[];
};

type EditorLike = {
    project: WickProject;
    state: EditorLikeState;
    hotKeyInterface: {
        createHandlerGroups: () => HotKeyConfig[];
    };
    autoSaveProject: (callback: () => void) => void;
    toast: (message: string, type?: ToastType, options?: ToastOptions) => void;
    getKeyMap: (fullKeyMap?: boolean) => HotKeyMap;
    getKeyHandlers: (fullKeyHandlers?: boolean) => HotkeyHandlers;
    getRenderSize: () => string;
    openModal: (name: ModalName, options?: Record<string, unknown>) => void;
    closeActiveModal: () => void;
    queueModal: (name: ModalName) => void;
    setSkipWelcomeMessage: (skip: boolean) => void;
    openWarningModal: (info: WarningModalInfo) => void;
    createClipFromSelection: (name: string) => void;
    createButtonFromSelection: (name: string) => void;
    createAnimationFromSelection: (name: string) => void;
    updateProjectSettings: (settings: ProjectSettings) => void;
    exportProjectAsAnimatedGIF: () => void;
    exportProjectAsVideo: () => void;
    exportProjectAsStandaloneZip: () => void;
    exportProjectAsStandaloneHTML: () => void;
    exportProjectAsImageSequence: () => void;
    exportProjectAsAudioTrack: () => void;
    loadAutosavedProject: (callback: () => void) => void;
    clearAutoSavedProject: (callback: () => void) => void;
    addCustomHotKeys: (keys: CustomHotKeys) => void;
    resetCustomHotKeys: () => void;
    importFileAsAsset: (file: File) => void;
    changeColorPickerType: (type: ColorPickerType) => void;
    updateLastColors: (color: string) => void;
    createCombinedHotKeyMap: () => HotKeyMap;
    getToolSetting: (setting: string) => string | number | boolean;
    setToolSetting: (setting: string, value: string | number | boolean) => void;
    getToolSettingRestrictions: (setting: string) => ToolSettingRestrictions;
    exportProjectAsImageSVG: () => void;
    builtinPreviews: Map<string, BuiltinPreview>;
    addFileToBuiltinPreviews: (file: File) => void;
    isAssetInLibrary: (filename: string) => boolean;
    openProjectFileDialog: () => void;
    openNewProjectConfirmation: () => void;
    setConsoleLogs: (
        updater:
            | ConsoleLogEntry[]
            | ((previous: ConsoleLogEntry[]) => ConsoleLogEntry[])
    ) => void;
    loadLocalWickFile: (file: LocalFileEntry) => void;
    deleteLocalWickFile: (file: LocalFileEntry) => void;
    reloadSavedWickFiles: () => void;
    editorVersion?: string;
};

type EditorWrapperProps = {
    editor: EditorLike;
    children?: ReactNode;
};

const MAX_CONSOLE_LOGS = 500;

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
                const logEntry = entry as ConsoleLogEntry;
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
                    project={editor.project}
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
                    warningModalInfo={editor.state.warningModalInfo}
                    loadAutosavedProject={editor.loadAutosavedProject}
                    clearAutoSavedProject={editor.clearAutoSavedProject}
                    renderProgress={editor.state.renderProgress}
                    renderStatusMessage={editor.state.renderStatusMessage}
                    renderType={modalRenderType}
                    addCustomHotKeys={editor.addCustomHotKeys}
                    resetCustomHotKeys={editor.resetCustomHotKeys}
                    customHotKeys={editor.state.customHotKeys}
                    keyMap={editor.getKeyMap(true) as HotKeyMap}
                    keyMapGroups={editor.hotKeyInterface.createHandlerGroups()}
                    importFileAsAsset={editor.importFileAsAsset}
                    colorPickerType={editor.state.colorPickerType}
                    changeColorPickerType={editor.changeColorPickerType}
                    updateLastColors={editor.updateLastColors}
                    lastColorsUsed={editor.state.lastColorsUsed}
                    editorVersion={editor.editorVersion ?? ""}
                    toast={editor.toast}
                    createCombinedHotKeyMap={editor.createCombinedHotKeyMap}
                    getToolSetting={editor.getToolSetting}
                    setToolSetting={setToolSettingForModal}
                    getToolSettingRestrictions={editor.getToolSettingRestrictions}
                    exportProjectAsImageSVG={editor.exportProjectAsImageSVG}
                    builtinPreviews={editor.builtinPreviews}
                    addFileToBuiltinPreviews={editor.addFileToBuiltinPreviews}
                    isAssetInLibrary={editor.isAssetInLibrary}
                    openProjectFileDialog={editor.openProjectFileDialog}
                    openNewProjectConfirmation={editor.openNewProjectConfirmation}
                    localSavedFiles={editor.state.localSavedFiles}
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
