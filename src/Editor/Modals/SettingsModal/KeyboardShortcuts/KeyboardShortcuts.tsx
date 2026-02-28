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

import React, { useState } from "react";
import ActionButton from "Editor/Util/ActionButton/ActionButton";
import HotKeyInterface from "Editor/hotKeyMap";

import classNames from "classnames";
import type { HotKeyMap, HotKeySequence } from "Editor/types/hotkeys";
import type { CustomHotKeys } from "Editor/types";

// Hotkey groups structure from editor.hotKeyInterface.createHandlerGroups()
// Maps group names to arrays of action names
type KeyMapGroups = Record<string, string[]>;

// Structure for tracking action edits
interface EditingAction {
  name: string;
  actionName: string;
  actionIndex: number;
  index?: number;
}

// Structure for new/modified actions
interface ActionChange {
  actionName: string;
  name: string;
  index: number;
  sequence: string;
}

interface RecordedKeyCombination {
  id: string;
  keys: Record<string, boolean>;
}

interface GroupedRow {
  name: string;
  type: "header" | "member";
}

interface KeyboardShortcutsProps {
  keyMap: HotKeyMap;
  keyMapGroups: KeyMapGroups;
  customHotKeys: CustomHotKeys;
  addCustomHotKeys: (keys: CustomHotKeys) => void;
  resetCustomHotKeys: () => void;
  createCombinedHotKeyMap: () => HotKeyMap;
  toast?: (message: string, type?: string) => void;
  toggle?: () => void;
}

const MODIFIER_KEYS = new Set(["meta", "control", "ctrl", "alt", "shift"]);

const normalizeShortcutKey = (key: string): string | null => {
  const normalized = key.toLowerCase();

  if (MODIFIER_KEYS.has(normalized)) {
    return null;
  }

  if (normalized === " ") {
    return "space";
  }

  if (normalized === "+") {
    return "plus";
  }

  if (normalized === "arrowup") {
    return "up";
  }
  if (normalized === "arrowdown") {
    return "down";
  }
  if (normalized === "arrowleft") {
    return "left";
  }
  if (normalized === "arrowright") {
    return "right";
  }
  if (normalized === "delete") {
    return "del";
  }
  if (normalized === "escape") {
    return "esc";
  }
  if (normalized === "unidentified") {
    return null;
  }

  return normalized;
};

const actionChangesToCustomHotKeys = (
  actionChanges: ActionChange[]
): CustomHotKeys => {
  const result: CustomHotKeys = {};

  actionChanges.forEach((actionChange) => {
    const existing = result[actionChange.actionName] ?? [];
    const next = [...existing];
    next[actionChange.index] = actionChange.sequence;
    result[actionChange.actionName] = next;
  });

  return result;
};

const recordKeyCombination = (
  callback: (value: RecordedKeyCombination) => void
): (() => void) => {
  const handleKeyDown = (event: KeyboardEvent): void => {
    const key = normalizeShortcutKey(event.key);
    if (!key) {
      return;
    }

    const sequenceParts: string[] = [];
    if (event.metaKey || event.ctrlKey) {
      sequenceParts.push("meta");
    }
    if (event.altKey) {
      sequenceParts.push("alt");
    }
    if (event.shiftKey) {
      sequenceParts.push("shift");
    }
    sequenceParts.push(key);

    const dedupedParts = Array.from(new Set(sequenceParts));
    const combination: RecordedKeyCombination = {
      id: dedupedParts.join("+"),
      keys: dedupedParts.reduce<Record<string, boolean>>((acc, part) => {
        acc[part] = true;
        return acc;
      }, {}),
    };

    event.preventDefault();
    event.stopPropagation();
    stopRecording();
    callback(combination);
  };

  const stopRecording = (): void => {
    window.removeEventListener("keydown", handleKeyDown, true);
  };

  window.addEventListener("keydown", handleKeyDown, true);

  return stopRecording;
};

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = (props) => {
  const [editingAction, setEditingAction] = useState<EditingAction>({
    name: "",
    actionName: "",
    actionIndex: 0,
  });
  const [newActions, setNewActions] = useState<ActionChange[]>([]);
  const [cancelKeyRecording, setCancelKeyRecording] = useState<() => void>(() => () => { });
  const [openTabs, setOpenTabs] = useState<string[]>([]);

  const isRecordedKeyCombination = (
    value: unknown
  ): value is RecordedKeyCombination => {
    return (
      typeof value === "object" &&
      value !== null &&
      "id" in value &&
      typeof (value as { id?: unknown }).id === "string" &&
      "keys" in value &&
      typeof (value as { keys?: unknown }).keys === "object" &&
      (value as { keys?: unknown }).keys !== null
    );
  };

  /**
   * Toggles a tab in the hotkey interface.
   * @param {string} name - Tab to toggle.
   */
  const toggleTab = (tabName: string): void => {
    let tabs = openTabs.concat([]);
    const tabIndex = tabs.indexOf(tabName);
    if (tabIndex > -1) {
      // Tab is open.
      tabs = tabs.filter((tab) => tab !== tabName);
    } else {
      // Tab is closed.
      tabs.push(tabName);
    }
    setOpenTabs(tabs);
  };

  // Creates the key icons to show on each row.
  const makeKey = (sequence: HotKeySequence | undefined, labelledby: string): JSX.Element => {
    let sequenceStr: string;

    if (sequence === undefined) {
      sequenceStr = "";
    } else if (typeof sequence === "object") {
      // Swap text for icons.
      let key = HotKeyInterface.replaceKeys(sequence.sequence);
      let action = sequence.action ? "+" + sequence.action : "";
      sequenceStr = key + action;
    } else {
      sequenceStr = sequence;
    }

    let sequenceItems = sequenceStr.split("+");

    // Adds plus signs to keys that are not the last key...
    return (
      <button
        aria-labelledby={labelledby + " shortcut key"}
        className="keyboard-shortcut-key m-px border-none bg-transparent"
      >
        {sequenceItems.map((key: string, i: number) => {
          return (
            <span
              key={"keyboard-commands-" + key + i}
              className="keyboard-shortcuts-key-icon-container text-editor-modal-text"
            >
              <kbd className="whitespace-nowrap rounded-[3px] border border-[#b4b4b4] bg-[#eee] px-1 py-[2px] text-[0.85em] font-bold leading-none text-[#333] shadow-[0_1px_1px_rgba(0,0,0,.2),0_2px_0_0_rgba(255,255,255,.7)_inset]">
                {key}
              </kbd>
              {sequenceItems.length > i + 1 && " + "}
            </span>
          );
        })}
      </button>
    );
  };

  // Returns the action if it is edited, undefined otherwise.
  // Returns the edited action if it exists.
  const isEdited = (actionName: string, index: number): ActionChange | undefined => {
    let actions = newActions.filter(
      (obj) => obj.actionName === actionName
    );

    return actions.find((obj) => obj.index === index);
  };

  // Returns true if the action is currently being edited.
  const isEditing = (actionName: string, index: number): boolean => {
    return (
      actionName === editingAction.actionName &&
      editingAction.index === index
    );
  };

  const createHeader = (headerInfo: { name: string }): JSX.Element => {
    let { name } = headerInfo;

    return (
      <tr
        className="keyboard-shortcuts-modal-row table w-full border-b border-black text-left"
        key={name}
      >
        <td
          className="hotkey-action-column hotkey-header-column w-full border-l-0 bg-editor-primary py-0 pl-2 text-left align-middle text-[20px] font-bold text-editor-modal-text has-hover:cursor-pointer has-hover:bg-editor-secondary has-hover:text-wick-green"
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.which === 13) {
              toggleTab(name);
            }
          }}
          onClick={() => {
            toggleTab(name);
          }}
        >
          {openTabs.indexOf(name) === -1 && (
            <i className="wick-brand-arrow arrow-right" />
          )}
          {openTabs.indexOf(name) > -1 && (
            <i className="wick-brand-arrow arrow-down" />
          )}
          {name}
        </td>
      </tr>
    );
  };

  const createRow = (rowInfo: { actionName: string; name: string; sequence1?: HotKeySequence; sequence2?: HotKeySequence }): JSX.Element => {
    let { actionName, name, sequence1, sequence2 } = rowInfo;

    // Only check each column once.
    let action0 = {
      edited: isEdited(actionName, 0),
      editing: isEditing(actionName, 0),
    };

    let action1 = {
      edited: isEdited(actionName, 1),
      editing: isEditing(actionName, 1),
    };

    return (
      <tr
        className="keyboard-shortcuts-modal-row table w-full border-b border-black text-left"
        key={name}
      >
        <td
          id={name}
          className="hotkey-action-column w-[45%] border-l border-black pl-6 text-editor-modal-text"
        >
          {name}
        </td>
        <td
          className={classNames(
            "hotkey-column w-[27.5%] border-l border-black has-hover:cursor-pointer has-hover:bg-editor-secondary",
            { edited: action0.edited && !action0.editing },
            { editing: action0.editing },
            {
              "bg-[#F6E78A] text-black": action0.editing,
            },
            {
              "bg-[#EC6CB9] text-black": action0.edited && !action0.editing,
            }
          )}
          onClick={() => beginEdit(actionName, 0)}
        >
          {
            // Displays edited action if it exists...
            action0.edited
              ? makeKey(action0.edited.sequence, name)
              : makeKey(sequence1, name)
          }
        </td>
        <td
          className={classNames(
            "hotkey-column w-[27.5%] border-l border-black has-hover:cursor-pointer has-hover:bg-editor-secondary",
            { edited: action1.edited && !action1.editing },
            { editing: action1.editing },
            {
              "bg-[#F6E78A] text-black": action1.editing,
            },
            {
              "bg-[#EC6CB9] text-black": action1.edited && !action1.editing,
            }
          )}
          onClick={() => beginEdit(actionName, 1)}
        >
          {
            // Displays edited action if it exists...
            action1.edited
              ? makeKey(action1.edited.sequence, name)
              : makeKey(sequence2, name)
          }
        </td>
      </tr>
    );
  };

  const beginEdit = (actionName: string, index: number): void => {
    // Begin recording that we are editing a key.
    const cancelKeyRecordingFn = recordKeyCombination((sequenceRaw: unknown) => {
      if (!isRecordedKeyCombination(sequenceRaw)) {
        return;
      }

      const sequence: RecordedKeyCombination = {
        id: sequenceRaw.id,
        keys: { ...sequenceRaw.keys },
      };
      if (sequence.keys[" "]) {
        sequence.id = sequence.id.replace(" ", "space");
        delete sequence.keys[" "];
        sequence.keys.space = true;
      }
      changeKey(actionName, index, sequence);
    });

    // Set that we are editing a key.
    setEditingAction({
      actionName: actionName,
      name: actionName,
      actionIndex: index || 0,
      index: index || 0,
    });
    setCancelKeyRecording(() => cancelKeyRecordingFn);
  };

  // Initiate custom hotkey change locally.
  const changeKey = (
    actionName: string,
    sequenceIndex: number,
    sequence: RecordedKeyCombination
  ): void => {
    let actions: ActionChange[] = [];

    let keyCommand = sequence.id.toLowerCase();

    let newAction = {
      actionName: actionName,
      name: actionName,
      index: sequenceIndex,
      sequence: keyCommand,
    };

    actions.push(newAction);

    // Check if we have overwritten any previous keys and make that change. Remove duplicates if they exist.
    Object.keys(props.keyMap).forEach((key) => {
      const action = props.keyMap[key];
      if (!action) {
        return;
      }

      action.sequences.forEach((seq: HotKeySequence, index: number) => {
        if (typeof seq === "string" && seq.toLowerCase() === keyCommand) {
          // Remove Sequence
          let act = {
            actionName: key,
            name: key,
            index: index,
            sequence: "",
          };

          actions.push(act);
          const name = action.actionName || action.name;
          props.toast?.(
            "Key Command Overwritten: " +
            name +
            ". Please reset this key command.",
            "warning"
          );
        }
      });
    });

    // Check if this sequence will override a newly added sequence.
    let newActionsArray = newActions.concat([]);
    for (var i = 0; i < newActionsArray.length; i++) {
      let action = newActionsArray[i];
      if (action && action.sequence === keyCommand) {
        newActionsArray.splice(i, 1);
        let name = action.actionName || action.name;
        props.toast?.(
          "Key Command Overwritten: " +
          name +
          ". Please reset this key command.",
          "warning"
        );
        break;
      }
    }

    setNewActions(newActionsArray.concat(actions));

    stopEditingKey();
  };

  // Stop the recording / editing process.
  const stopEditingKey = () => {
    cancelKeyRecording();
    setEditingAction({ actionName: "", name: "", actionIndex: 0 });
    setCancelKeyRecording(() => () => { });
  };

  // Remove all potential hotkeys.
  const resetAndToggle = () => {
    stopEditingKey();
    setNewActions([]);
    if (props.toggle) props.toggle();
  };

  // Apply all new hotkeys to the editor.
  const applyNewKeys = () => {
    props.addCustomHotKeys(actionChangesToCustomHotKeys(newActions));
    resetNewActions();
    stopEditingKey();

    props.toggle && props.toggle();
  };

  const resetNewActions = () => {
    // Remove existing actions as they've already been applied.
    setNewActions([]);
  };

  const resetHotkeys = () => {
    resetNewActions();
    stopEditingKey();
    props.resetCustomHotKeys();
  };

  const getGroupedRows = () => {
    let keyGroups = Object.keys(props.keyMapGroups);

    const groupedRows: GroupedRow[] = [];
    keyGroups.forEach((groupName) => {
      groupedRows.push({ name: groupName, type: "header" });
      if (openTabs.indexOf(groupName) > -1) {
        let groupMembers = props.keyMapGroups[groupName];
        if (groupMembers) {
          groupMembers.forEach((member: string) => {
            groupedRows.push({ name: member, type: "member" });
          });
        }
      }
    });
    return groupedRows;
  };

  let keyMap = props.keyMap || {};
  let groupedRows = getGroupedRows();
  return (
    <div id="keyboard-shortcuts-body" className="h-[85%] w-full overflow-hidden">
      <table className="tableSection table w-full [display:table]">
        <thead className="float-left w-full text-editor-text-secondary">
          <tr className="table w-full text-left">
            <th className="hotkey-action-column w-[45%] pl-6">Action</th>
            <th className="hotkey-column header w-[27.5%] text-white">Hotkey 1</th>
            <th className="hotkey-column header w-[27.5%] text-white">Hotkey 2</th>
          </tr>
        </thead>
        <tbody className="float-left h-[220px] w-full overflow-auto border-b border-r border-black">
          {groupedRows.map((action) => {
            if (action.type === "header") {
              return createHeader(action);
            }

            const actionName = action.name;
            const entry = keyMap[actionName];
            if (!entry) {
              return null;
            }

            const { sequences, name } = entry;
            return createRow({
              actionName: actionName,
              name: name || actionName,
              sequence1: sequences[0],
              sequence2: sequences[1],
            });
          })}
        </tbody>
      </table>
      {/* Footer */}
      <div
        id="keyboard-shortcuts-modal-footer"
        className="absolute bottom-[18px] right-[18px] mt-1 flex flex-row justify-end"
      >
        <div
          className="keyboard-shortcuts-footer-button-container ml-0 w-20"
          id="keyboard-shortcuts-modal-reset"
        >
          <ActionButton
            className="keyboard-shortcuts-modal-button h-7"
            textClassName="keyboard-shortcuts-modal-button-text h-6"
            id="keyboard-shorcuts-reset-button"
            color="flame"
            action={resetHotkeys}
            text="Reset"
            tooltip="Reset hotkeys to default settings."
            tooltipPlace="top"
          />
        </div>
        <div
          className="keyboard-shortcuts-footer-button-container ml-2 w-20"
          id="keyboard-shortcuts-modal-cancel"
        >
          <ActionButton
            className="keyboard-shortcuts-modal-button h-7"
            textClassName="keyboard-shortcuts-modal-button-text h-6"
            id="keyboard-shorcuts-cancel-button"
            color="gray"
            action={resetAndToggle}
            text="Cancel"
          />
        </div>
        <div
          className="keyboard-shortcuts-footer-button-container ml-2 w-20"
          id="keyboard-shortcuts-modal-accept"
        >
          <ActionButton
            className="keyboard-shortcuts-modal-button h-7"
            textClassName="keyboard-shortcuts-modal-button-text h-6"
            id="keyboard-shorcuts-apply-button"
            color="green"
            action={applyNewKeys}
            text="Apply"
          />
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcuts;
