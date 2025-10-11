import { ReactNode, useEffect, useRef } from "react";
import ErrorBoundary from "./Util/ErrorBoundary";
import { Slide, ToastContainer } from "react-toastify";
import { GlobalHotKeys, KeyMap, GlobalHotKeysProps } from "react-hotkeys";
import ErrorPage from "./Util/ErrorPage";
import ModalHandler from "./Modals/ModalHandler/ModalHandler";
import { attachConsoleListener } from "./Util/consoleListener";
import type { HotKeyMap } from "Editor/types/hotkeys";
import type {
    WickProject,
    WickAsset,
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
    getKeyHandlers: (
        fullKeyHandlers?: boolean
    ) => GlobalHotKeysProps["handlers"];
    getRenderSize: () => string;
    openModal: (name: ModalName, options?: Record<string, unknown>) => void;
    closeActiveModal: () => void;
    queueModal: (name: ModalName) => void;
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
    isAssetInLibrary: (asset: WickAsset) => boolean;
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
            <GlobalHotKeys
                allowChanges={true}
                keyMap={editor.getKeyMap() as unknown as KeyMap}
                handlers={editor.getKeyHandlers()}
            />
            <div id="editor" className="theme-default">
                <ModalHandler
                    getRenderSize={editor.getRenderSize}
                    activeModalName={editor.state.activeModalName as string | null}
                    openModal={editor.openModal as (name: string) => void}
                    closeActiveModal={editor.closeActiveModal}
                    queueModal={editor.queueModal as (name: string) => void}
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
                    renderType={editor.state.renderType as any}
                    addCustomHotKeys={editor.addCustomHotKeys}
                    resetCustomHotKeys={editor.resetCustomHotKeys}
                    customHotKeys={editor.state.customHotKeys}
                    keyMap={editor.getKeyMap(true) as HotKeyMap}
                    keyMapGroups={editor.hotKeyInterface.createHandlerGroups()}
                    importFileAsAsset={editor.importFileAsAsset}
                    colorPickerType={editor.state.colorPickerType as string}
                    changeColorPickerType={editor.changeColorPickerType as (type: string) => void}
                    updateLastColors={editor.updateLastColors}
                    lastColorsUsed={editor.state.lastColorsUsed}
                    editorVersion={editor.editorVersion ?? ""}
                    toast={editor.toast}
                    createCombinedHotKeyMap={editor.createCombinedHotKeyMap}
                    getToolSetting={editor.getToolSetting}
                    setToolSetting={editor.setToolSetting}
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
