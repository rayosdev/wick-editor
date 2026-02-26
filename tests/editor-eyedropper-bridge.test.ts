import { afterEach, describe, expect, it, vi } from "vitest";
import { activateEditorEyedropper } from "Editor/Util/ColorPicker/editorEyedropperBridge";
import type { PickerColorChange } from "Editor/Util/ColorPicker/ColorPicker";

type WindowWithEditorBridge = Window &
  typeof globalThis & {
    editor?: unknown;
  };

const windowWithEditorBridge = window as WindowWithEditorBridge;
const originalEditorBridge = windowWithEditorBridge.editor;

afterEach(() => {
  if (typeof originalEditorBridge === "undefined") {
    delete windowWithEditorBridge.editor;
  } else {
    windowWithEditorBridge.editor = originalEditorBridge;
  }
});

describe("editor eyedropper bridge", () => {
  it("returns false when editor bridge is missing", () => {
    delete windowWithEditorBridge.editor;
    const onChange = vi.fn<(color: PickerColorChange) => void>();

    const activated = activateEditorEyedropper(onChange);

    expect(activated).toBe(false);
  });

  it("returns false when editor bridge lacks setActiveTool", () => {
    windowWithEditorBridge.editor = { _onEyedropperPickedColor: undefined };
    const onChange = vi.fn<(color: PickerColorChange) => void>();

    const activated = activateEditorEyedropper(onChange);

    expect(activated).toBe(false);
  });

  it("activates eyedropper and stores callback when bridge is valid", () => {
    const setActiveTool = vi.fn<(toolName: string) => void>();
    const editorBridge: {
      setActiveTool: (toolName: string) => void;
      _onEyedropperPickedColor?: ((color: PickerColorChange) => void) | undefined;
    } = {
      setActiveTool,
    };
    const onChange = vi.fn<(color: PickerColorChange) => void>();
    windowWithEditorBridge.editor = editorBridge;

    const activated = activateEditorEyedropper(onChange);

    expect(activated).toBe(true);
    expect(setActiveTool).toHaveBeenCalledWith("eyedropper");
    expect(editorBridge._onEyedropperPickedColor).toBe(onChange);
  });
});
