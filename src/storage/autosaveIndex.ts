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

const AUTOSAVES_TABLE_ID = "autosaves";
const BY_SOURCE_INDEX_ID = "by_source";
const BY_RECENCY_INDEX_ID = "by_recency";
const ALL_SOURCES_SLICE_ID = "all";

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
}

export function removeAutosaveIndexEntry(
  source: AutosaveSource,
  uuid: string,
): void {
  if (!uuid) {
    return;
  }

  store.delRow(AUTOSAVES_TABLE_ID, getRowId(source, uuid));
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
}

export function getLatestAutosaveIndexEntry(
  source?: AutosaveSource,
): AutosaveIndexEntry | null {
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
  return getRowIdsForSource(source).length > 0;
}

export function clearAutosaveIndexForTests(): void {
  getAllRowIdsByRecency().forEach((rowId) => {
    store.delRow(AUTOSAVES_TABLE_ID, rowId);
  });
}
