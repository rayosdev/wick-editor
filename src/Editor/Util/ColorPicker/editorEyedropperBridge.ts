import type { PickerColorChange } from "./ColorPicker";
import { getEditorRuntime } from "Editor/Util/editorRuntime";

type EyedropperColorCallback = ((color: PickerColorChange) => void) | undefined;

type EditorEyedropperBridge = {
  setActiveTool: (toolName: string) => void;
  _onEyedropperPickedColor?: EyedropperColorCallback;
};

function isEditorEyedropperBridge(value: unknown): value is EditorEyedropperBridge {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return typeof (value as { setActiveTool?: unknown }).setActiveTool === "function";
}

export function activateEditorEyedropper(
  onColorPicked: EyedropperColorCallback,
): boolean {
  const editorBridge = getEditorRuntime<EditorEyedropperBridge>();

  if (!isEditorEyedropperBridge(editorBridge)) {
    return false;
  }

  editorBridge.setActiveTool("eyedropper");
  editorBridge._onEyedropperPickedColor = onColorPicked;
  return true;
}
