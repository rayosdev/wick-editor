declare module "react-hotkeys-hook" {
  export interface UseHotkeysOptions {
    enabled?: boolean;
    keydown?: boolean;
    keyup?: boolean;
    enableOnFormTags?: boolean;
  }

  export function useHotkeys(
    keys: string,
    callback: (event: KeyboardEvent) => void,
    options?: UseHotkeysOptions,
    deps?: ReadonlyArray<unknown>,
  ): void;
}
