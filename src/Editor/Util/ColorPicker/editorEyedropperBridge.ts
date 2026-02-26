import type { PickerColorChange } from "./ColorPicker";

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
  const editorBridge = window.editor;

  if (!isEditorEyedropperBridge(editorBridge)) {
    return false;
  }

  editorBridge.setActiveTool("eyedropper");
  editorBridge._onEyedropperPickedColor = onColorPicked;
  return true;
}
