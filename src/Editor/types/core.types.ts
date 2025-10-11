/**
 * Core Wick Engine Type Definitions
 *
 * These types represent the core objects in the Wick Engine.
 * They should match the structure of objects from the engine package.
 */

// ============================================================================
// Base Types
// ============================================================================

export interface Transformation {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  opacity: number;
}

export type EasingType = "linear" | "easeIn" | "easeOut" | "easeInOut";

export type AssetType = "image" | "sound" | "clip";

// ============================================================================
// Project Structure
// ============================================================================

export interface WickProject {
  identifier: string;
  name: string;
  width: number;
  height: number;
  framerate: number;
  backgroundColor: string;
  root: WickClip;
  assets: WickAsset[];
  selection: WickSelection;
  focus: WickClip;

  // Additional properties that may exist
  [key: string]: unknown;
}

// ============================================================================
// Timeline Objects
// ============================================================================

export interface WickTimeline {
  identifier: string;
  layers: WickLayer[];
  playheadPosition: number;
}

export interface WickLayer {
  identifier: string;
  name: string;
  frames: WickFrame[];
  locked: boolean;
  hidden: boolean;
}

export interface WickFrame {
  identifier: string;
  start: number;
  end: number;
  paths: WickPath[];
  clips: WickClip[];
  sounds: WickSound[];
  scripts: WickScript[];
  tweens: WickTween[];

  // Frame properties
  name?: string;
  locked?: boolean;

  // Additional properties
  [key: string]: unknown;
}

export interface WickTween {
  identifier: string;
  playheadPosition: number;
  transformation: Transformation;
  easing: EasingType;
  fullRotations: number;
}

// ============================================================================
// Canvas Objects
// ============================================================================

export interface WickClip {
  identifier: string;
  name: string;
  timeline: WickTimeline;
  transformation: Transformation;

  // Clip properties
  isButton?: boolean;
  isSymbol?: boolean;
  breakLinkFromSymbol?: boolean;

  // Additional properties
  [key: string]: unknown;
}

export interface WickPath {
  identifier: string;
  fillColor?: string | null;
  strokeColor?: string | null;
  strokeWidth?: number;
  pathData: string;
  transformation: Transformation;

  // Additional properties
  [key: string]: unknown;
}

export interface WickText {
  identifier: string;
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  fontStyle: string;
  fillColor: string;
  transformation: Transformation;

  // Additional properties
  [key: string]: unknown;
}

// ============================================================================
// Assets
// ============================================================================

export interface WickAsset {
  uuid: string;
  name: string;
  type: AssetType;
  src: string;

  // Additional properties based on type
  [key: string]: unknown;
}

export interface WickImageAsset extends WickAsset {
  type: "image";
  width?: number;
  height?: number;
}

export interface WickSoundAsset extends WickAsset {
  type: "sound";
  duration?: number;
}

// ============================================================================
// Scripts & Code
// ============================================================================

export interface WickScript {
  identifier: string;
  src: string;
  name: string;
}

export interface WickSound {
  identifier: string;
  assetUUID: string;
  volume: number;
  start?: number;
  loop?: boolean;
}

// ============================================================================
// Selection
// ============================================================================

export interface WickSelection {
  getSelectedObjects(): WickObject[];
  getSelectedObject(): WickObject | null;
  clear(): void;
  select(object: WickObject): void;
  deselect(object: WickObject): void;
  isSelected(object: WickObject): boolean;

  // Additional methods
  [key: string]: unknown;
}

// ============================================================================
// Union Types
// ============================================================================

/**
 * Any object that can exist on the canvas
 */
export type CanvasObject = WickPath | WickClip | WickText;

/**
 * Any object that exists in the timeline
 */
export type TimelineObject = WickFrame | WickTween;

/**
 * Any object that can have scripts attached
 */
export type ScriptableObject = WickClip | WickFrame | WickProject;

/**
 * Any object that can be selected
 */
export type SelectableObject = CanvasObject | TimelineObject | WickAsset;

/**
 * All Wick objects
 */
export type WickObject =
  | WickProject
  | WickClip
  | WickFrame
  | WickPath
  | WickText
  | WickTween
  | WickAsset
  | WickLayer
  | WickTimeline;

// ============================================================================
// Type Guards
// ============================================================================

export function isWickProject(obj: unknown): obj is WickProject {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "root" in obj &&
    "assets" in obj &&
    "backgroundColor" in obj
  );
}

export function isWickClip(obj: unknown): obj is WickClip {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "timeline" in obj &&
    "identifier" in obj
  );
}

export function isWickFrame(obj: unknown): obj is WickFrame {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "start" in obj &&
    "end" in obj &&
    "identifier" in obj
  );
}

export function isWickPath(obj: unknown): obj is WickPath {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "pathData" in obj &&
    "identifier" in obj
  );
}

export function isWickTween(obj: unknown): obj is WickTween {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "playheadPosition" in obj &&
    "easing" in obj
  );
}

export function isWickAsset(obj: unknown): obj is WickAsset {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "uuid" in obj &&
    "type" in obj &&
    "src" in obj
  );
}

export function isCanvasObject(obj: unknown): obj is CanvasObject {
  return isWickPath(obj) || isWickClip(obj);
}

export function isTimelineObject(obj: unknown): obj is TimelineObject {
  return isWickFrame(obj) || isWickTween(obj);
}
