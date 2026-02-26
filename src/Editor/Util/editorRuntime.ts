type WindowWithEditor = Window & {
  editor?: unknown;
};

export const getEditorRuntime = <T extends object>(): T | null => {
  const editorRuntime = (window as WindowWithEditor).editor;
  if (!editorRuntime || typeof editorRuntime !== "object") {
    return null;
  }

  return editorRuntime as T;
};

export const setEditorRuntime = (editorRuntime: object): void => {
  (window as WindowWithEditor).editor = editorRuntime;
};
