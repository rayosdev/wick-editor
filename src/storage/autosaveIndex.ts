import { defaultSorter, type SortKey } from "tinybase/common";
import { createIndexes } from "tinybase/indexes";
import { createStore } from "tinybase/store";

export type AutosaveSource = "dexie" | "legacy";

export type AutosaveIndexEntry = {
  source: AutosaveSource;
  uuid: string;
  lastModified: number;
  updatedAt: number;
};

type LegacyAutosaveLikeEntry = {
  uuid: string;
  lastModified?: number;
};
type AutosaveIndexRow = {
  source: string;
  uuid: string;
  lastModified: number;
  updatedAt: number;
};
type AutosavesTable = Record<string, AutosaveIndexRow>;

const AUTOSAVES_TABLE_ID = "autosaves";
const BY_SOURCE_INDEX_ID = "by_source";
const BY_RECENCY_INDEX_ID = "by_recency";
const ALL_SOURCES_SLICE_ID = "all";
const AUTOSAVE_INDEX_STORAGE_KEY = "wickEditor_autosaveIndex_tinybase_v1";
let didHydrateFromStorage = false;

const store = createStore();
store.setTablesSchema({
  [AUTOSAVES_TABLE_ID]: {
    source: { type: "string" },
    uuid: { type: "string" },
    lastModified: { type: "number" },
    updatedAt: { type: "number" },
  },
});

const indexes = createIndexes(store)
  .setIndexDefinition(
    BY_SOURCE_INDEX_ID,
    AUTOSAVES_TABLE_ID,
    "source",
    "lastModified",
    defaultSorter,
    sortDescending,
  )
  .setIndexDefinition(
    BY_RECENCY_INDEX_ID,
    AUTOSAVES_TABLE_ID,
    () => ALL_SOURCES_SLICE_ID,
    "lastModified",
    defaultSorter,
    sortDescending,
  );

function canUseLocalStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function sanitizeAutosavesTable(input: Record<string, unknown>): AutosavesTable {
  const sanitized: AutosavesTable = {};

  Object.entries(input).forEach(([rowId, rowValue]) => {
    if (!isRecord(rowValue)) {
      return;
    }

    const source = rowValue.source;
    const uuid = rowValue.uuid;
    const lastModified = toFiniteNumber(rowValue.lastModified);
    const updatedAt = toFiniteNumber(rowValue.updatedAt);

    if (
      typeof source !== "string" ||
      source.length === 0 ||
      typeof uuid !== "string" ||
      uuid.length === 0 ||
      lastModified === null
    ) {
      return;
    }

    sanitized[rowId] = {
      source,
      uuid,
      lastModified,
      updatedAt: updatedAt ?? lastModified,
    };
  });

  return sanitized;
}

function hydrateFromLocalStorageIfNeeded(): void {
  if (didHydrateFromStorage) {
    return;
  }

  didHydrateFromStorage = true;
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    const raw = window.localStorage.getItem(AUTOSAVE_INDEX_STORAGE_KEY);
    if (!raw) {
      return;
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed) || parsed.length === 0 || !isRecord(parsed[0])) {
      return;
    }

    const tables = parsed[0];
    const autosavesTable = tables[AUTOSAVES_TABLE_ID];
    if (!isRecord(autosavesTable)) {
      return;
    }

    store.setTable(AUTOSAVES_TABLE_ID, sanitizeAutosavesTable(autosavesTable));
  } catch {
    // Ignore parse or storage errors and continue with an empty in-memory index.
  }
}

function persistToLocalStorage(): void {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    const content = JSON.stringify([store.getTables(), {}]);
    window.localStorage.setItem(AUTOSAVE_INDEX_STORAGE_KEY, content);
  } catch {
    // Ignore quota/security errors and keep in-memory index.
  }
}

function toFiniteNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function sortDescending(sortKey1: SortKey, sortKey2: SortKey): number {
  const left = toFiniteNumber(sortKey1);
  const right = toFiniteNumber(sortKey2);

  if (left !== null && right !== null) {
    return right - left;
  }

  return defaultSorter(sortKey1, sortKey2);
}

function isAutosaveSource(value: unknown): value is AutosaveSource {
  return value === "dexie" || value === "legacy";
}

function getRowId(source: AutosaveSource, uuid: string): string {
  return `${source}:${uuid}`;
}

function readEntryFromRowId(rowId: string): AutosaveIndexEntry | null {
  const row = store.getRow(AUTOSAVES_TABLE_ID, rowId) as Record<
    string,
    unknown
  >;

  const source = row.source;
  const uuid = row.uuid;
  const lastModified = toFiniteNumber(row.lastModified);
  const updatedAt = toFiniteNumber(row.updatedAt);

  if (
    !isAutosaveSource(source) ||
    typeof uuid !== "string" ||
    uuid.length === 0 ||
    lastModified === null
  ) {
    store.delRow(AUTOSAVES_TABLE_ID, rowId);
    return null;
  }

  return {
    source,
    uuid,
    lastModified,
    updatedAt: updatedAt ?? lastModified,
  };
}

function normalizeLastModified(lastModified: unknown): number {
  return toFiniteNumber(lastModified) ?? Date.now();
}

function getRowIdsForSource(source: AutosaveSource): string[] {
  return indexes.getSliceRowIds(BY_SOURCE_INDEX_ID, source) as string[];
}

function getAllRowIdsByRecency(): string[] {
  return indexes.getSliceRowIds(
    BY_RECENCY_INDEX_ID,
    ALL_SOURCES_SLICE_ID,
  ) as string[];
}

export function upsertAutosaveIndexEntry(
  source: AutosaveSource,
  uuid: string,
  lastModified: number,
): void {
  hydrateFromLocalStorageIfNeeded();

  if (!uuid) {
    return;
  }

  const normalizedLastModified = normalizeLastModified(lastModified);
  store.setRow(AUTOSAVES_TABLE_ID, getRowId(source, uuid), {
    source,
    uuid,
    lastModified: normalizedLastModified,
    updatedAt: Date.now(),
  });
  persistToLocalStorage();
}

export function removeAutosaveIndexEntry(
  source: AutosaveSource,
  uuid: string,
): void {
  hydrateFromLocalStorageIfNeeded();

  if (!uuid) {
    return;
  }

  store.delRow(AUTOSAVES_TABLE_ID, getRowId(source, uuid));
  persistToLocalStorage();
}

export function removeAutosaveIndexEntriesByUUID(uuid: string): void {
  if (!uuid) {
    return;
  }

  removeAutosaveIndexEntry("dexie", uuid);
  removeAutosaveIndexEntry("legacy", uuid);
}

export function replaceAutosaveIndexSource(
  source: AutosaveSource,
  entries: LegacyAutosaveLikeEntry[],
): void {
  hydrateFromLocalStorageIfNeeded();

  const nextEntries = new Map<string, number>();

  entries.forEach((entry) => {
    if (!entry || !entry.uuid) {
      return;
    }

    const normalizedLastModified = normalizeLastModified(entry.lastModified);
    const current = nextEntries.get(entry.uuid);
    if (current === undefined || normalizedLastModified > current) {
      nextEntries.set(entry.uuid, normalizedLastModified);
    }
  });

  const existingRowIds = getRowIdsForSource(source);
  const nextRowIds = new Set<string>();

  nextEntries.forEach((lastModified, uuid) => {
    const rowId = getRowId(source, uuid);
    nextRowIds.add(rowId);
    store.setRow(AUTOSAVES_TABLE_ID, rowId, {
      source,
      uuid,
      lastModified,
      updatedAt: Date.now(),
    });
  });

  existingRowIds.forEach((rowId) => {
    if (!nextRowIds.has(rowId)) {
      store.delRow(AUTOSAVES_TABLE_ID, rowId);
    }
  });

  persistToLocalStorage();
}

export function getLatestAutosaveIndexEntry(
  source?: AutosaveSource,
): AutosaveIndexEntry | null {
  hydrateFromLocalStorageIfNeeded();

  const rowIds = source ? getRowIdsForSource(source) : getAllRowIdsByRecency();

  for (const rowId of rowIds) {
    const entry = readEntryFromRowId(rowId);
    if (entry) {
      return entry;
    }
  }

  return null;
}

export function hasAutosaveIndexSource(source: AutosaveSource): boolean {
  hydrateFromLocalStorageIfNeeded();
  return getRowIdsForSource(source).length > 0;
}

export function clearAutosaveIndexForTests(): void {
  hydrateFromLocalStorageIfNeeded();

  getAllRowIdsByRecency().forEach((rowId) => {
    store.delRow(AUTOSAVES_TABLE_ID, rowId);
  });

  if (canUseLocalStorage()) {
    try {
      window.localStorage.removeItem(AUTOSAVE_INDEX_STORAGE_KEY);
    } catch {
      // ignore
    }
  }
}
