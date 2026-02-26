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

export const CachedProjectDataSchema = z
  .object({
    export: z
      .object({
        object: z.unknown().optional(),
        children: z.array(z.unknown()).optional(),
      })
      .passthrough()
      .optional(),
    project: z.unknown().optional(),
    metadata: z.unknown().optional(),
  })
  .passthrough()
  .refine((value) => Boolean(value.export || value.project), {
    message: "Cached project must include either export or project payload",
  });

export type ProjectData = z.infer<typeof ProjectDataSchema>;
export type SerializedAutosaveObject = z.infer<typeof SerializedAutosaveObjectSchema>;
export type AutosavePayload = z.infer<typeof AutosavePayloadSchema>;
export type AutosaveRecord = z.infer<typeof AutosaveRecordSchema>;
export type CurrentProjectRecord = z.infer<typeof CurrentProjectRecordSchema>;
export type SettingsRecord = z.infer<typeof SettingsRecordSchema>;
export type CachedProjectData = z.infer<typeof CachedProjectDataSchema>;

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

export function parseCachedProjectData(input: unknown): CachedProjectData {
  return CachedProjectDataSchema.parse(input);
}

function parseJsonUnknown(input: string): unknown {
  return JSON.parse(input);
}

export function parseCachedProjectString(input: string): CachedProjectData {
  const parsed = parseJsonUnknown(input);
  return parseCachedProjectData(parsed);
}
