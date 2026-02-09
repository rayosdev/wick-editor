import { z } from "zod";

const NonEmptyStringSchema = z.string().min(1);

export const ProjectDataSchema = z
  .object({
    uuid: NonEmptyStringSchema,
  })
  .passthrough();

export const SerializedAutosaveObjectSchema = z
  .object({
    uuid: NonEmptyStringSchema,
    classname: NonEmptyStringSchema,
  })
  .passthrough();

export const AutosavePayloadSchema = z.object({
  projectData: ProjectDataSchema,
  objectsData: z.array(SerializedAutosaveObjectSchema),
  lastModified: z.number().finite(),
});

export const AutosaveRecordSchema = AutosavePayloadSchema.extend({
  uuid: NonEmptyStringSchema,
});

export const CurrentProjectRecordSchema = z.object({
  key: NonEmptyStringSchema,
  uuid: NonEmptyStringSchema,
  lastModified: z.number().finite(),
  autosaveData: AutosavePayloadSchema,
});

export const SettingsRecordSchema = z.object({
  key: NonEmptyStringSchema,
  value: z.unknown(),
});

export type ProjectData = z.infer<typeof ProjectDataSchema>;
export type SerializedAutosaveObject = z.infer<typeof SerializedAutosaveObjectSchema>;
export type AutosavePayload = z.infer<typeof AutosavePayloadSchema>;
export type AutosaveRecord = z.infer<typeof AutosaveRecordSchema>;
export type CurrentProjectRecord = z.infer<typeof CurrentProjectRecordSchema>;
export type SettingsRecord = z.infer<typeof SettingsRecordSchema>;

export function parseAutosavePayload(input: unknown): AutosavePayload {
  return AutosavePayloadSchema.parse(input);
}

export function parseAutosaveRecord(input: unknown): AutosaveRecord {
  return AutosaveRecordSchema.parse(input);
}

export function parseCurrentProjectRecord(input: unknown): CurrentProjectRecord {
  return CurrentProjectRecordSchema.parse(input);
}

export function parseSettingsRecord(input: unknown): SettingsRecord {
  return SettingsRecordSchema.parse(input);
}
