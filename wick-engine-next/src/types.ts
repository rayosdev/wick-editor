export type AnyRecord = Record<string, any>;

export interface WickCompatMeta {
  mode: "bridge";
  rewriteVersion: string;
  legacyVersion: string;
  requiredSurface: readonly string[];
  getMissingSurface: () => string[];
  registerOverride: (path: string, value: unknown) => void;
  resolve: <T = unknown>(path: string) => T | undefined;
}

export interface WickCompatApi extends AnyRecord {
  version?: string;
  resourcepath?: string;
  _originals?: Record<string, unknown>;
  project?: unknown;
  __compat?: WickCompatMeta;
}
