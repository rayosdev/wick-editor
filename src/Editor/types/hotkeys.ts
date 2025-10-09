export type HotKeySequence = string | {
  sequence: string;
  action?: string;
};

export interface HotKeyEntry {
  name: string;
  sequences: HotKeySequence[];
  repeatable?: boolean;
  actionName?: string;
}

export type HotKeyMap = Record<string, HotKeyEntry>;
