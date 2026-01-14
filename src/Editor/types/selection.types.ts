/**
 * Selection Interface Type Definitions
 *
 * Defines the API for interacting with selected objects in the editor.
 */

import type {
  WickProject,
  WickClip,
  WickFrame,
  WickPath,
  WickAsset,
  WickTween,
  WickLayer,
  CanvasObject,
  TimelineObject,
  ScriptableObject,
  SelectableObject,
} from "./core.types";

// ============================================================================
// Selection Interface
// ============================================================================

export interface SelectionInterface {
  // -------------------------------------------------------------------------
  // Getters - Timeline Objects
  // -------------------------------------------------------------------------

  /**
   * Get all selected timeline objects (frames and tweens)
   */
  getSelectedTimelineObjects(): TimelineObject[];

  /**
   * Get all selected frames
   */
  getSelectedFrames(): WickFrame[];

  /**
   * Get all selected tweens
   */
  getSelectedTweens(): WickTween[];

  // -------------------------------------------------------------------------
  // Getters - Canvas Objects
  // -------------------------------------------------------------------------

  /**
   * Get all selected canvas objects (paths, clips, etc.)
   */
  getSelectedCanvasObjects(): CanvasObject[];

  /**
   * Get all selected paths
   */
  getSelectedPaths(): WickPath[];

  /**
   * Get all selected clips
   */
  getSelectedClips(): WickClip[];

  /**
   * Get all selected buttons (clips with isButton flag)
   */
  getSelectedButtons(): WickClip[];

  // -------------------------------------------------------------------------
  // Getters - Assets
  // -------------------------------------------------------------------------

  /**
   * Get all selected asset library objects
   */
  getSelectedAssetLibraryObjects(): WickAsset[];

  /**
   * Get all selected sound assets
   */
  getSelectedSoundAssets(): WickAsset[];

  /**
   * Get all selected image assets
   */
  getSelectedImageAssets(): WickAsset[];

  // -------------------------------------------------------------------------
  // Getters - Scripts
  // -------------------------------------------------------------------------

  /**
   * Get the script of the currently selected object (if scriptable)
   */
  getSelectedObjectScript(): string | null;

  /**
   * Get the currently selected scriptable object
   */
  getSelectedScriptableObject(): ScriptableObject | null;

  // -------------------------------------------------------------------------
  // Selection Operations
  // -------------------------------------------------------------------------

  /**
   * Select a single object
   */
  selectObject(object: SelectableObject): void;

  /**
   * Select multiple objects
   */
  selectObjects(objects: SelectableObject[]): void;

  /**
   * Deselect specific objects
   */
  deselectObjects(objects: SelectableObject[]): void;

  /**
   * Deselect all objects
   */
  deselectAll(): void;

  /**
   * Check if an object is selected
   */
  isObjectSelected(object: SelectableObject): boolean;

  // -------------------------------------------------------------------------
  // Selection Attributes
  // -------------------------------------------------------------------------

  /**
   * Get a common attribute value from all selected objects
   * Returns null if values differ or no objects selected
   */
  getSelectionAttribute(
    attributeName: string
  ): string | number | boolean | null;

  /**
   * Set an attribute on all selected objects
   */
  setSelectionAttribute(
    attribute: string,
    newValue: string | number | boolean
  ): void;

  // -------------------------------------------------------------------------
  // Selection Movement
  // -------------------------------------------------------------------------

  /**
   * Move selected objects to a new parent/layer at specified index
   */
  moveSelection(target: WickFrame | WickLayer, index: number): void;

  // -------------------------------------------------------------------------
  // Focus Management
  // -------------------------------------------------------------------------

  /**
   * Set the focus object (e.g., which clip to edit)
   */
  setFocusObject(object: WickClip | WickProject): void;

  /**
   * Get the current focus object
   */
  getFocusObject(): WickClip | WickProject;
}

// ============================================================================
// Selection Helper Types
// ============================================================================

/**
 * Attributes that can be set on multiple objects
 */
export type SelectionAttribute =
  | "x"
  | "y"
  | "scaleX"
  | "scaleY"
  | "rotation"
  | "opacity"
  | "fillColor"
  | "strokeColor"
  | "strokeWidth"
  | "name"
  | "locked"
  | "hidden";

/**
 * Result of getting a selection attribute
 */
export type SelectionAttributeValue = string | number | boolean | null;
