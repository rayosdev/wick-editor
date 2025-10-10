import { ReactNode, useEffect, useRef } from "react";
import ErrorBoundary from "./Util/ErrorBoundary";
import { Slide, ToastContainer } from "react-toastify";
import { GlobalHotKeys, KeyMap, GlobalHotKeysProps } from "react-hotkeys";
import ErrorPage from "./Util/ErrorPage";
import ModalHandler from "./Modals/ModalHandler/ModalHandler";
import { attachConsoleListener } from "./Util/consoleListener";
import type { HotKeyMap } from "Editor/types/hotkeys";

type AnyFunction = (...args: unknown[]) => unknown;

type ConsoleLogEntry = {
    id: string;
    method: string;
    data: unknown[];
    timestamp: number;
};

type ConsoleListenerEntry = ConsoleLogEntry | { type: "clear" };

type WarningModalInfo = {
    description: string;
    title: string;
    acceptText: string;
    cancelText: string;
    acceptAction: AnyFunction;
    cancelAction: AnyFunction;
};

type ProjectLike = {
    name?: string;
    [key: string]: unknown;
};

type EditorLikeState = {
    activeModalName: string | null;
    warningModalInfo: WarningModalInfo;
    renderProgress: number;
    renderStatusMessage: string;
    renderType: "video" | "gif" | "image sequence";
    customHotKeys: Record<string, unknown>;
    previewPlaying: boolean;
    project: ProjectLike;
    colorPickerType: string;
    lastColorsUsed: string[];
    renderSize?: string;
    localSavedFiles: unknown[];
};

type EditorLike = {
    project: ProjectLike;
    state: EditorLikeState;
    hotKeyInterface: {
        createHandlerGroups: () => unknown;
    };
    autoSaveProject: (callback: AnyFunction) => void;
    toast: AnyFunction;
    getKeyMap: (fullKeyMap?: boolean) => HotKeyMap;
    getKeyHandlers: (
        fullKeyHandlers?: boolean
    ) => GlobalHotKeysProps["handlers"];
    getRenderSize: () => string;
    openModal: (name: string, options?: unknown) => void;
    closeActiveModal: () => void;
    queueModal: (name: string) => void;
    openWarningModal: (info: unknown) => void;
    createClipFromSelection: (name: string) => void;
    createButtonFromSelection: (name: string) => void;
    createAnimationFromSelection: (name: string) => void;
    updateProjectSettings: AnyFunction;
    exportProjectAsAnimatedGIF: () => void;
    exportProjectAsVideo: () => void;
    exportProjectAsStandaloneZip: () => void;
    exportProjectAsStandaloneHTML: () => void;
    exportProjectAsImageSequence: () => void;
    exportProjectAsAudioTrack: () => void;
    loadAutosavedProject: AnyFunction;
    clearAutoSavedProject: AnyFunction;
    addCustomHotKeys: AnyFunction;
    resetCustomHotKeys: () => void;
    importFileAsAsset: (file: unknown) => void;
    changeColorPickerType: (type: string) => void;
    updateLastColors: (color: string) => void;
    createCombinedHotKeyMap: AnyFunction;
    getToolSetting: (setting: string) => unknown;
    setToolSetting: (setting: string, value: unknown) => void;
    getToolSettingRestrictions: (setting: string) => unknown;
    exportProjectAsImageSVG: () => void;
    builtinPreviews: unknown;
    addFileToBuiltinPreviews: (file: unknown) => void;
    isAssetInLibrary: (asset: unknown) => boolean;
    openProjectFileDialog: () => void;
    openNewProjectConfirmation: () => void;
    setConsoleLogs: (
        updater:
            | ConsoleLogEntry[]
            | ((previous: ConsoleLogEntry[]) => ConsoleLogEntry[])
    ) => void;
    loadLocalWickFile: (file: unknown) => void;
    deleteLocalWickFile: (file: unknown) => void;
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
                    return "Project Autosaved";
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
                    activeModalName={editor.state.activeModalName}
                    openModal={editor.openModal}
                    closeActiveModal={editor.closeActiveModal}
                    queueModal={editor.queueModal}
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
                    renderType={editor.state.renderType}
                    addCustomHotKeys={editor.addCustomHotKeys}
                    resetCustomHotKeys={editor.resetCustomHotKeys}
                    customHotKeys={editor.state.customHotKeys}
                    keyMap={editor.getKeyMap(true)}
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
