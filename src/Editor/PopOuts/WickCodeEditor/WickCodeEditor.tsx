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

import { useMemo, useRef, useState } from "react";
import { ReflexContainer, ReflexSplitter, ReflexElement } from "react-reflex";
import { Rnd } from "react-rnd";
import AceEditor from "react-ace";
import type { Ace } from "ace-builds";
import type { IMarker, IAnnotation } from "react-ace/lib/types";

import WickInput from "Editor/Util/WickInput/WickInput";
import ActionButton from "Editor/Util/ActionButton/ActionButton";
import AddScriptPanel from "./AddScriptPanel/AddScriptPanel";
import ConsolePanel, { type ConsoleEntry } from "./ConsolePanel";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/ext-searchbox";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-cobalt";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/theme-eclipse";
import "ace-builds/src-noconflict/theme-github";

// Configure ACE editor worker path and disable workers
import ace from "ace-builds";
ace.config.set("workerPath", "/");
ace.config.set("useWorker", false);

import "Editor/styles/PopOuts/_wickcodeeditor.css";

import capitalize from "Editor/Util/DataFunctions/capitalize";
import ToolIcon from "Editor/Util/ToolIcon/ToolIcon";
import classNames from "classnames";

const editorThemes = [
    {
        value: "monokai",
        label: "Monokai",
    },
    {
        value: "cobalt",
        label: "Cobalt",
    },
    {
        value: "dracula",
        label: "Dracula",
    },
    {
        value: "eclipse",
        label: "Eclipse",
    },
    {
        value: "github",
        label: "Github",
    },
] as const;

interface ScriptOption {
    name: string;
    src: string;
}

interface ScriptLike {
    scripts: ScriptOption[];
    addScript: (scriptName: string) => void;
    updateScript: (scriptName: string, source: string) => void;
    getAvailableScripts: () => string[];
}

interface ScriptInfoReferenceItem {
    name: string;
    description: string;
    snippet: string;
}

interface ScriptInfoData extends ScriptInfoReferenceItem {
    type: string;
}

interface ScriptInfoInterface {
    sortScripts: (a: ScriptOption, b: ScriptOption) => number;
    scriptData: ScriptInfoData[];
    referenceItems: Record<string, ScriptInfoReferenceItem[]>;
    getScriptType: (scriptName: string) => string;
}

interface CodeEditorWindowProperties {
    width: number;
    height: number;
    x: number;
    y: number;
    minWidth: number;
    minHeight: number;
    consoleHeight: number;
    consoleOpen: boolean;
    fontSize: number;
    theme: string;
}

interface CodeError {
    lineNumber: number;
    message: string;
}

export interface WickCodeEditorProps {
    selectionType: string;
    renderSize?: "small" | string;
    script?: ScriptLike | null;
    scriptToEdit: string;
    scriptInfoInterface: ScriptInfoInterface;
    codeEditorWindowProperties: CodeEditorWindowProperties;
    updateCodeEditorWindowProperties: (properties: Partial<CodeEditorWindowProperties>) => void;
    toggleCodeEditor: () => void;
    editScript: (scriptName: string) => void;
    clearCodeEditorError: () => void;
    requestAutosave: () => void;
    onScriptUpdate: (source: string) => void;
    setConsoleLogs: (logs: ConsoleEntry[]) => void;
    consoleLogs?: ConsoleEntry[] | null;
    error?: CodeError | null;
}

type ConsoleView = "console" | "options";

const mapErrorToMarkers = (error?: CodeError | null): IMarker[] => {
    if (!error) {
        return [];
    }

    return [
        {
            startRow: error.lineNumber - 1,
            endRow: error.lineNumber - 1,
            startCol: 0,
            endCol: 1000,
            className: "error-marker",
            type: "fullLine",
        },
    ];
};

const mapErrorToAnnotations = (error?: CodeError | null): IAnnotation[] => {
    if (!error) {
        return [];
    }

    return [
        {
            row: error.lineNumber - 1,
            column: 0,
            type: "error",
            text: error.message,
        },
    ];
};

const WickCodeEditor = ({
    selectionType,
    renderSize,
    script,
    scriptToEdit,
    scriptInfoInterface,
    codeEditorWindowProperties,
    updateCodeEditorWindowProperties,
    toggleCodeEditor,
    editScript,
    clearCodeEditorError,
    requestAutosave,
    onScriptUpdate,
    setConsoleLogs,
    consoleLogs,
    error,
}: WickCodeEditorProps): JSX.Element => {
    const [addScriptTab, setAddScriptTab] = useState<string>("Mouse");
    const [consoleType, setConsoleType] = useState<ConsoleView>("console");
    const [aceEditor, setAceEditor] = useState<Ace.Editor | null>(null);

    const editorThemeSelectRef = useRef<HTMLSelectElement | null>(null);

    const onDragHandler = (_e: unknown, data: { x: number; y: number }): void => {
        updateCodeEditorWindowProperties({
            x: data.x,
            y: data.y,
        });
    };

    const onResizeHandler = (
        _event: unknown,
        _direction: unknown,
        ref: HTMLElement,
        _delta: { width: number; height: number },
        position: { x: number; y: number }
    ): void => {
        updateCodeEditorWindowProperties({
            width: parseFloat(ref.style.width) || codeEditorWindowProperties.width,
            height: parseFloat(ref.style.height) || codeEditorWindowProperties.height,
            x: position.x,
            y: position.y,
        });
    };

    const resizeConsole = (panel: any): void => {
        const element = panel?.domElement;
        if (element instanceof HTMLElement) {
            updateCodeEditorWindowProperties({
                consoleHeight: element.offsetHeight,
            });
        }
    };

    const addScriptHandler = (scriptName: string): void => {
        if (!script) return;

        script.addScript(scriptName);
        editScript(scriptName);
    };

    const scriptOnChange = (newScript: string): void => {
        if (!script) {
            return;
        }
        requestAutosave();
        script.updateScript(scriptToEdit, newScript);
        onScriptUpdate(newScript);
    };

    const clearConsole = (): void => {
        setConsoleLogs([]);
    };

    if (script) {
        script.scripts.sort(scriptInfoInterface.sortScripts);
    }

    const addCodeToTab = (code: string): void => {
        if (aceEditor && script && scriptToEdit !== "add") {
            aceEditor.session.insert(aceEditor.getCursorPosition(), code);
        }
    };

    const scriptToShow = useMemo(() => {
        if (!script) {
            return "No Scriptable Object Selected";
        }

        const match = script.scripts.find((item) => item.name === scriptToEdit);
        if (match) {
            return match.src;
        }

        return scriptToEdit === "add" ? "" : "Can't Find Script...";
    }, [script, scriptToEdit]);

    const renderCodeEditorOptions = (): JSX.Element => {
        return (
            <div className="we-code-options-panel">
                <table>
                    <tbody>
                        <tr>
                            <th>Option</th>
                            <th></th>
                        </tr>
                        <tr>
                            <td>Font Size</td>
                            <td>
                                <WickInput
                                    className="code-editor-option-input"
                                    id="code-editor-font"
                                    type="numeric"
                                    value={codeEditorWindowProperties.fontSize}
                                    onChange={(value) => {
                                        const nextValue = typeof value === "number" ? value : Number(value);
                                        if (!Number.isNaN(nextValue)) {
                                            updateCodeEditorWindowProperties({ fontSize: nextValue });
                                        }
                                    }}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Editor Style</td>
                            <td>
                                <select
                                    aria-label="Code editor theme"
                                    value={codeEditorWindowProperties.theme}
                                    ref={editorThemeSelectRef}
                                    onChange={(event) => {
                                        updateCodeEditorWindowProperties({
                                            theme: event.currentTarget.value,
                                        });
                                    }}
                                >
                                    {editorThemes.map((theme) => (
                                        <option value={theme.value} key={`code-theme-${theme.value}`}>
                                            {theme.label}
                                        </option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    };

    const renderCodeTabs = (): JSX.Element => {
        return (
            <div className="wick-code-editor-tabs">
                {script &&
                    script.scripts.map((entry) => (
                        <button
                            key={`script-tab-${entry.name}`}
                            onClick={() => {
                                editScript(entry.name);
                                clearCodeEditorError();
                            }}
                            className={classNames(
                                "we-code-script-button",
                                "we-event",
                                scriptInfoInterface.getScriptType(entry.name),
                                { selected: scriptToEdit === entry.name }
                            )}
                        >
                            {capitalize(entry.name)}
                        </button>
                    ))}
                {script && (
                    <button
                        onClick={() => {
                            editScript("add");
                            clearCodeEditorError();
                        }}
                        className={classNames("we-code-script-button", "we-code-add")}
                        aria-label="Add Script"
                    >
                        +
                    </button>
                )}
            </div>
        );
    };

    const renderCodeEditor = (): JSX.Element => {
        const markers = mapErrorToMarkers(error);
        const annotations = mapErrorToAnnotations(error);

        return (
            <div
                className={classNames(
                    "wick-code-editor-code",
                    `theme${codeEditorWindowProperties.theme}`
                )}
            >
                {scriptToEdit === "add" && (
                    <AddScriptPanel
                        availableScripts={script?.getAvailableScripts()}
                        scripts={scriptInfoInterface.scriptData.filter(
                            (item) => item.type === addScriptTab
                        )}
                        changeTab={setAddScriptTab}
                        addScript={addScriptHandler}
                        addScriptTab={addScriptTab}
                    />
                )}
                {scriptToEdit !== "add" && (
                    <AceEditor
                        value={scriptToShow}
                        mode="javascript"
                        theme={codeEditorWindowProperties.theme}
                        fontSize={codeEditorWindowProperties.fontSize}
                        width="100%"
                        height="100%"
                        name="wick-ace-editor"
                        focus={true}
                        editorProps={{ $blockScrolling: true }}
                        onChange={scriptOnChange}
                        onLoad={(editor: Ace.Editor) => setAceEditor(editor)}
                        markers={markers}
                        annotations={annotations}
                        readOnly={!script}
                    />
                )}
            </div>
        );
    };

    const renderSmallLayout = (): JSX.Element => {
        return (
            <Rnd
                id="wick-code-editor-resizeable-small"
                bounds="window"
                dragHandleClassName="wick-code-editor-drag-handle"
                width={window.innerWidth}
                onResizeStop={onResizeHandler}
                onDragStop={onDragHandler}
                default={codeEditorWindowProperties}
            >
                <div className="we-code-editor-small">
                    <div className="wick-code-editor-drag-handle small">
                        <div className="we-code-editor-title small">
                            Code Editor |
                            <div className="we-code-editor-title-selected">{`editing ${selectionType}`}</div>
                        </div>
                        <ActionButton
                            className="we-code-close-button"
                            color="tool"
                            icon="cancel-white"
                            action={toggleCodeEditor}
                        />
                    </div>

                    <div className="wick-code-editor-body-small">
                        {renderCodeTabs()}
                        {renderCodeEditor()}
                    </div>
                </div>
            </Rnd>
        );
    };

    const renderDefaultLayout = (): JSX.Element => {
        return (
            <Rnd
                id="wick-code-editor-resizeable"
                bounds="window"
                dragHandleClassName="wick-code-editor-drag-handle"
                minWidth={codeEditorWindowProperties.minWidth}
                minHeight={codeEditorWindowProperties.minHeight}
                onResizeStop={onResizeHandler}
                onDragStop={onDragHandler}
                default={codeEditorWindowProperties}
            >
                <div className="wick-code-editor-drag-handle">
                    <div className="wick-code-editor-icon">{"</>"}</div>
                    <div className="we-code-editor-title">
                        Code Editor |
                        {!error && (
                            <div className="we-code-editor-title-selected">
                                {`editing ${selectionType}`}
                            </div>
                        )}
                        {error && (
                            <div className="we-code-editor-title-error">
                                {`error - line ${error.lineNumber}`}
                            </div>
                        )}
                    </div>
                    <ActionButton
                        className="we-code-close-button"
                        color="tool"
                        icon="cancel-white"
                        action={toggleCodeEditor}
                    />
                </div>

                <div className="wick-code-editor-body">
                    <div className="wick-code-editor-reference">
                        <CodeReference
                            referenceItems={scriptInfoInterface.referenceItems}
                            addCodeToTab={addCodeToTab}
                        />
                    </div>
                    <div className="wick-code-editor-content">
                        {renderCodeTabs()}
                        <ReflexContainer>
                            <ReflexElement>{renderCodeEditor()}</ReflexElement>

                            <ReflexSplitter />

                            <ReflexElement
                                minSize={40}
                                size={
                                    codeEditorWindowProperties.consoleOpen
                                        ? codeEditorWindowProperties.consoleHeight
                                        : 1
                                }
                                onStopResize={resizeConsole}
                            >
                                <div className="wick-code-editor-console">
                                    <div className="we-code-console-bar">
                                        <div className="we-code-console-title">
                                            {consoleType === "options"
                                                ? "Text Editor Options"
                                                : "Console"}
                                        </div>
                                        <div className="we-code-console-options-container">
                                            {consoleType === "options" && (
                                                <ActionButton
                                                    className="we-code-console-option"
                                                    id="console-console-button"
                                                    icon="codeConsole"
                                                    action={() => setConsoleType("console")}
                                                    tooltip="Show Console"
                                                    tooltipPlace="left"
                                                    color="tool"
                                                />
                                            )}

                                            {consoleType === "console" && (
                                                <ActionButton
                                                    className="we-code-console-option"
                                                    id="console-option-button"
                                                    icon="gear"
                                                    action={() => setConsoleType("options")}
                                                    tooltip="Show Options"
                                                    tooltipPlace="left"
                                                    color="tool"
                                                />
                                            )}

                                            {consoleType === "console" && (
                                                <ActionButton
                                                    className="we-code-console-option we-code-clear-console"
                                                    id="clear-console-button"
                                                    icon="clear"
                                                    action={clearConsole}
                                                    tooltip="Clear Console"
                                                    tooltipPlace="left"
                                                    color="tool"
                                                />
                                            )}
                                        </div>
                                    </div>

                                    {consoleType === "console" && (
                                        <ConsolePanel logs={consoleLogs ?? []} />
                                    )}
                                    {consoleType === "options" && renderCodeEditorOptions()}
                                </div>
                            </ReflexElement>
                        </ReflexContainer>
                    </div>
                </div>
            </Rnd>
        );
    };

    if (renderSize === "small") {
        return renderSmallLayout();
    }

    return renderDefaultLayout();
};

interface CodeReferenceProps {
    referenceItems: Record<string, ScriptInfoReferenceItem[]>;
    addCodeToTab: (code: string) => void;
}

const CodeReference = ({ referenceItems, addCodeToTab }: CodeReferenceProps): JSX.Element => {
    const [selected, setSelected] = useState<string>("");

    const referenceKeys = Object.keys(referenceItems);
    const codeOptions = selected ? referenceItems[selected] ?? [] : [];

    const renderChoices = () =>
        referenceKeys.map((refKey) => (
            <button
                key={`code-reference-button-${refKey}`}
                className={classNames("reference-button", "we-code", refKey)}
                onClick={() => setSelected(refKey)}
            >
                <ToolIcon name={`code${refKey}`} className="reference-icon" />
                <div className="reference-button-title">{refKey}</div>
            </button>
        ));

    const renderCodeOptions = () => (
        <div className="we-code-options">
            <div className="we-code-options-body">
                {codeOptions.map((option) => (
                    <div key={`code-option-button-${option.name}`} className="code-option-button">
                        <ActionButton
                            id={`code-reference-button-${option.name}`}
                            action={() => addCodeToTab(option.snippet)}
                            tooltip={option.description}
                            tooltipPlace="right"
                            color="reference"
                            text={option.name}
                        />
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="we-code-reference">
            <div className="we-code-reference-title">
                <div className="we-code-reference-title-text">Reference</div>

                {selected !== "" && (
                    <div className="we-code-options-selected">
                        <button
                            className="we-code-options-back"
                            onClick={() => setSelected("")}
                            aria-label="Back to reference categories"
                        >
                            <ToolIcon name="codeBack" />
                        </button>
                        <button
                            key={`code-reference-selected-${selected}`}
                            className={classNames("reference-button", "we-code", selected)}
                        >
                            <ToolIcon name={`code${selected}`} className="reference-icon" />
                            <div className="reference-button-title">{selected}</div>
                        </button>
                    </div>
                )}
            </div>

            <div className="we-code-reference-body">
                {selected === "" && renderChoices()}
                {selected !== "" && renderCodeOptions()}
            </div>
        </div>
    );
};

export default WickCodeEditor;
