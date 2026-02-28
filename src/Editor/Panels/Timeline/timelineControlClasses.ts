const withActiveClass = (
  baseClasses: string,
  active: boolean,
  activeClasses: string
): string => (active ? `${baseClasses} ${activeClasses}` : baseClasses);

export const TIMELINE_SHORTCUT_TOGGLE_CLASSES =
  "timeline-shortcut-toggle inline-flex items-center overflow-hidden rounded-[6px] border border-[#191919] bg-[#383434]";

export const TIMELINE_RENDERER_TOGGLE_CLASSES =
  "timeline-renderer-toggle inline-flex items-center overflow-hidden rounded-[6px] border border-[#191919] bg-[#383434]";

export const getTimelineShortcutToggleButtonClasses = (
  active: boolean
): string =>
  withActiveClass(
    "timeline-shortcut-toggle-button h-[26px] min-w-[56px] border-none bg-transparent px-[10px] font-nunito text-[11px] font-extrabold uppercase tracking-[0.03em] text-[#BDBDBD] has-hover:bg-[rgba(255,255,255,0.08)]",
    active,
    "active bg-[rgba(118,189,255,0.24)] text-white"
  );

export const getTimelineRendererToggleButtonClasses = (
  active: boolean
): string =>
  withActiveClass(
    "timeline-renderer-toggle-button h-[26px] min-w-[64px] border-none bg-transparent px-[10px] font-nunito text-[11px] font-extrabold uppercase tracking-[0.04em] text-[#BDBDBD] has-hover:bg-[rgba(255,255,255,0.08)]",
    active,
    "active bg-[#4A4A4A] text-white"
  );

export const getTimelineHeaderOptionsButtonClasses = (
  active: boolean
): string =>
  withActiveClass(
    "timeline-header-options-button h-[26px] min-w-[92px] rounded-[6px] border border-[#191919] bg-[rgba(255,255,255,0.02)] px-[10px] font-nunito text-[11px] font-extrabold uppercase tracking-[0.03em] text-[#BDBDBD] has-hover:bg-[rgba(255,255,255,0.08)]",
    active,
    "active bg-[rgba(118,189,255,0.18)] text-white"
  );

export const TIMELINE_SHELL_CLASSES =
  "timeline-flash-shell flex min-h-0 w-full flex-1 flex-col bg-[#3B3B3B]";

export const TIMELINE_HEADER_CLASSES =
  "timeline-flash-header flex items-center gap-[10px] overflow-x-auto overflow-y-hidden border-b border-[#191919] bg-[linear-gradient(to_bottom,#303030,#3B3B3B)] px-[10px] py-[6px] font-nunito text-[12px] text-white [scrollbar-width:thin]";

export const TIMELINE_BREADCRUMB_CLASSES =
  "timeline-flash-breadcrumb flex min-w-0 shrink-0 items-center gap-2";

export const TIMELINE_HEADER_ACTIONS_CLASSES =
  "timeline-flash-header-actions inline-flex shrink-0 items-center justify-end gap-1";

export const TIMELINE_ACTIONS_CLASSES =
  "timeline-flash-actions flex items-center gap-[6px] overflow-x-auto overflow-y-hidden border-b border-[#191919] bg-[#303030] px-2 py-[6px] [scrollbar-width:thin]";

export const TIMELINE_ACTION_BUTTON_CLASSES =
  "timeline-flash-action-button h-[26px] w-[26px] min-w-[26px] rounded-[4px] border border-[rgba(255,255,255,0.08)]";

export const TIMELINE_BACK_BUTTON_CLASSES =
  "timeline-flash-back-button h-7 w-7";

export const TIMELINE_TEXT_ACTION_CLASSES =
  "timeline-flash-text-action text-[15px] font-extrabold [&_.action-button-text]:leading-none";

export const TIMELINE_HEADER_RIGHT_CLASSES =
  "timeline-flash-header-right flex min-w-0 flex-1 flex-col items-end gap-[6px]";

export const TIMELINE_HEADER_RIGHT_PRIMARY_CLASSES =
  "timeline-flash-header-right-primary inline-flex w-full flex-wrap items-center justify-end gap-2";

export const getTimelineHeaderRightAdvancedClasses = (
  open: boolean
): string =>
  withActiveClass(
    "timeline-flash-header-right-advanced hidden w-full flex-wrap items-center justify-end gap-2 border-t border-t-[rgba(255,255,255,0.08)] pt-1",
    open,
    "open inline-flex"
  );

export const TIMELINE_FOOTER_CLASSES =
  "timeline-flash-footer sticky bottom-0 left-0 z-40 mt-auto flex shrink-0 items-center gap-2 overflow-x-auto overflow-y-hidden border-t border-[#191919] bg-[#303030] px-2 py-[6px] shadow-[0_-6px_12px_rgba(0,0,0,0.22)] [scrollbar-width:thin]";

export const TIMELINE_UNIFIED_WORKSPACE_CLASSES =
  "timeline-unified-workspace relative flex h-full w-full flex-col overflow-auto bg-[#3B3B3B]";

export const TIMELINE_UNIFIED_HEADER_CLASSES =
  "timeline-unified-header sticky top-0 z-20 flex min-w-[fit-content] flex-row border-b border-[#191919] bg-[#3B3B3B]";

export const TIMELINE_UNIFIED_CORNER_CLASSES =
  "timeline-unified-corner sticky left-0 z-[25] flex w-[210px] shrink-0 flex-col border-r border-[#191919] bg-[#3B3B3B]";

export const TIMELINE_UNIFIED_RULER_CLASSES =
  "timeline-unified-ruler relative flex flex-1 flex-col";

export const TIMELINE_UNIFIED_BODY_CLASSES =
  "timeline-unified-body relative z-[1] flex min-h-0 min-w-[min-content] flex-1 flex-col";

export const TIMELINE_UNIFIED_GRID_CANVAS_CLASSES =
  "timeline-unified-grid-canvas pointer-events-none absolute inset-0 z-0";

export const TIMELINE_UNIFIED_OVERLAYS_CLASSES =
  "timeline-unified-overlays pointer-events-none absolute bottom-0 right-0 top-0 z-[5]";

export const TIMELINE_UNIFIED_EMPTY_COVER_CLASSES =
  "timeline-unified-empty-cover pointer-events-none absolute left-0 right-0 z-[7] border-t border-t-[rgba(255,255,255,0.08)] bg-[linear-gradient(to_bottom,rgba(0,0,0,0.2),rgba(0,0,0,0.24)),#3B3B3B]";

export const TIMELINE_UNIFIED_ROW_CLASSES =
  "timeline-unified-row relative z-[2] flex h-[32px] min-w-[fit-content] flex-row";

export const TIMELINE_UNIFIED_LAYER_CONTROLS_CLASSES =
  "timeline-unified-layer-controls sticky left-0 z-10 flex w-[210px] shrink-0 items-center border-r border-[#191919] bg-[#3B3B3B]";

export const TIMELINE_UNIFIED_TRACK_CLASSES =
  "timeline-unified-track relative flex-1 bg-transparent";

export const TIMELINE_DOM_LAYERS_HEADER_CLASSES =
  "timeline-dom-layers-header sticky top-0 z-[3] flex h-[34px] items-center border-b border-[#191919] bg-[#303030] px-[10px] font-nunito text-[11px] font-extrabold uppercase tracking-[0.06em] text-[#BDBDBD]";

export const TIMELINE_DOM_LAYERS_SUBHEADER_CLASSES =
  "timeline-dom-layers-subheader z-[3] flex h-[34px] shrink-0 items-center justify-end border-b border-b-[rgba(255,255,255,0.08)] bg-[#303030] px-2";

export const getTimelineDomLayerRowClasses = (
  active: boolean,
  selected: boolean
): string =>
  [
    "timeline-dom-layer-row grid grid-cols-[1fr_30px_30px_30px] items-center gap-1 border-b border-b-[rgba(255,255,255,0.06)] px-[6px] py-1",
    active ? "active bg-[rgba(255,255,255,0.08)]" : "",
    selected
      ? "selected outline outline-1 -outline-offset-1 outline-[rgba(255,255,255,0.24)]"
      : "",
  ]
    .filter(Boolean)
    .join(" ");

export const TIMELINE_DOM_LAYER_MAIN_CLASSES =
  "timeline-dom-layer-main inline-flex h-[calc(var(--timeline-cell-height)-10px)] min-w-0 items-center rounded-[4px] border border-transparent bg-transparent px-2 text-left text-white";

export const TIMELINE_DOM_LAYER_NAME_CLASSES =
  "timeline-dom-layer-name overflow-hidden text-ellipsis whitespace-nowrap font-nunito text-xs font-bold";

export const TIMELINE_DOM_LAYER_NAME_INPUT_CLASSES =
  "timeline-dom-layer-name-input h-7 w-full rounded-[4px] border border-[#191919] bg-[#383434] px-2 font-nunito text-xs text-white";

export const TIMELINE_DOM_LAYER_ICON_BUTTON_CLASSES =
  "timeline-dom-layer-icon-button inline-flex h-7 w-7 items-center justify-center rounded-[4px] border border-[rgba(255,255,255,0.1)] bg-[#383434] p-0";

export const TIMELINE_DOM_LAYER_DELETE_BUTTON_CLASSES =
  "timeline-dom-layer-delete-button inline-flex h-7 w-7 items-center justify-center rounded-[4px] border border-[rgba(255,255,255,0.1)] bg-[#383434] p-0";

export const TIMELINE_DOM_LAYER_BUTTON_ICON_CLASSES =
  "h-[14px] w-[14px]";

export const TIMELINE_DOM_LAYER_ADD_CLASSES =
  "timeline-dom-layer-add min-h-[calc(var(--timeline-cell-height)-4px)] w-full border-0 border-t border-t-[#191919] bg-[rgba(255,255,255,0.03)] font-nunito text-xs font-extrabold uppercase tracking-[0.03em] text-white";

export const TIMELINE_DOM_MARKER_ROW_CLASSES =
  "timeline-dom-marker-row flex h-[34px] items-stretch overflow-hidden border-b border-[#191919] bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06),rgba(255,255,255,0.02))]";

export const TIMELINE_DOM_WORK_AREA_TRACK_CLASSES =
  "timeline-dom-work-area-track relative min-w-0 flex-1";

export const TIMELINE_DOM_WORK_AREA_SPAN_CLASSES =
  "timeline-dom-work-area-span pointer-events-none absolute bottom-2 top-2 rounded-[4px] border border-[rgba(255,243,192,0.55)] bg-[rgba(255,243,192,0.12)]";

export const TIMELINE_DOM_WORK_AREA_HANDLE_CLASSES =
  "timeline-dom-work-area-handle absolute top-[6px] z-[4] h-[22px] w-[10px] -translate-x-1/2 rounded-full border border-[rgba(255,243,192,0.65)] bg-[rgba(255,243,192,0.65)] p-0 before:absolute before:inset-[-10px] before:content-['']";

export const TIMELINE_DOM_MARKER_CLASSES =
  "timeline-dom-marker absolute top-2 z-[6] inline-flex h-[18px] min-w-4 -translate-x-1/2 touch-none items-center justify-center rounded-full border border-current bg-[rgba(20,27,37,0.92)] px-[5px]";

export const TIMELINE_DOM_MARKER_LABEL_CLASSES =
  "timeline-dom-marker-label pointer-events-none font-nunito text-[10px] font-extrabold leading-none";

export const TIMELINE_DOM_NUMBERLINE_CLASSES =
  "timeline-dom-numberline sticky top-0 z-[2] flex h-[34px] items-stretch overflow-hidden border-b border-[#191919] bg-[#303030]";

export const TIMELINE_UNIFIED_NUMBERLINE_CANVAS_CLASSES =
  "timeline-unified-numberline-canvas block touch-none";

export const TIMELINE_DOM_PLAYHEAD_CAP_CLASSES =
  "timeline-dom-playhead-cap pointer-events-none absolute top-0 z-[5] h-2 w-3 -translate-x-1/2 rounded-b-[6px] bg-[#ee5850]";

export const TIMELINE_DOM_LAYER_FILLER_CLASSES =
  "timeline-dom-layer-filler pointer-events-none w-full bg-[linear-gradient(to_top,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:100%_var(--timeline-cell-height,42px)]";

export const TIMELINE_DOM_GRID_ROW_CLASSES =
  "timeline-dom-grid-row absolute inset-x-0";

export const getTimelineDomGridRowStateClasses = (active: boolean): string =>
  withActiveClass(TIMELINE_DOM_GRID_ROW_CLASSES, active, "active");

export const TIMELINE_DOM_PLAYHEAD_CLASSES =
  "timeline-dom-playhead pointer-events-none absolute bottom-0 top-0 z-[6] w-[2px] bg-[#ee5850]";

export const TIMELINE_DOM_SELECTION_BOX_CLASSES =
  "timeline-dom-selection-box pointer-events-none absolute z-[7] border border-dashed border-[rgba(255,255,255,0.8)] bg-[rgba(255,255,255,0.12)]";

export const TIMELINE_DOM_PLAYHEAD_SELECTED_CELL_CLASSES =
  "timeline-dom-playhead-frame-cell-selected pointer-events-none absolute z-[5] box-border border border-dashed border-[rgba(236,246,255,0.9)] bg-[rgba(255,255,255,0.04)]";

export const TIMELINE_DOM_LAYER_REORDER_LINE_CLASSES =
  "timeline-dom-layer-reorder-line pointer-events-none absolute inset-x-0 z-[8] h-[2px] bg-[#66b6ff]";

export const TIMELINE_DOM_WORK_AREA_OVERLAY_CLASSES =
  "timeline-dom-work-area-overlay pointer-events-none absolute bottom-0 top-0 z-[1] border-x border-x-[rgba(255,243,192,0.36)] bg-[rgba(255,243,192,0.06)]";

export const TIMELINE_DOM_SOUND_HOVER_CLASSES =
  "timeline-dom-sound-hover pointer-events-none absolute bottom-0 top-0 z-[4] border border-dashed border-[rgba(255,230,128,0.9)] bg-[rgba(255,230,128,0.2)]";

export const getTimelineDomDropModeClasses = (
  mode: "overwrite" | "push"
): string =>
  [
    "timeline-dom-drop-mode pointer-events-none absolute right-3 top-[10px] z-[11] inline-flex h-[22px] items-center rounded-full border border-transparent px-2 font-nunito text-[10px] font-extrabold uppercase tracking-[0.03em]",
    mode === "overwrite"
      ? "overwrite bg-[rgba(167,42,42,0.75)] text-[#ffe4e4] border-[rgba(255,196,196,0.45)]"
      : "push bg-[rgba(37,92,132,0.75)] text-[#e5f6ff] border-[rgba(184,228,255,0.45)]",
  ]
    .filter(Boolean)
    .join(" ");

export const TIMELINE_DOM_KEYPRESS_INDICATOR_CLASSES =
  "timeline-dom-keypress-indicator pointer-events-none absolute bottom-[58px] right-3 z-[45] min-h-6 rounded-full border border-[rgba(174,216,248,0.42)] bg-[rgba(14,20,30,0.9)] px-[10px] py-1 font-nunito text-[11px] font-extrabold tracking-[0.03em] text-[rgba(232,245,255,0.96)] shadow-[0_4px_10px_rgba(0,0,0,0.35)]";

export const TIMELINE_DOM_PRESS_FEEDBACK_CLASSES =
  "timeline-dom-press-feedback pointer-events-none fixed z-[2200] -translate-x-1/2 -translate-y-1/2";

export const TIMELINE_DOM_PRESS_FEEDBACK_RING_CLASSES =
  "timeline-dom-press-feedback-ring block h-[34px] w-[34px] rounded-full border-2 border-[rgba(200,235,255,0.95)] bg-[rgba(118,189,255,0.2)]";

export const TIMELINE_DOM_PRESS_FEEDBACK_BADGE_CLASSES =
  "timeline-dom-press-feedback-badge mt-[6px] inline-flex items-center justify-center whitespace-nowrap rounded-full border border-[rgba(200,235,255,0.45)] bg-[rgba(17,22,29,0.92)] px-2 py-[2px] font-nunito text-[10px] font-bold text-[#dff4ff]";

export const TIMELINE_FOOTER_GROUP_CLASSES =
  "timeline-flash-footer-group inline-flex items-center gap-[6px] border-r border-r-[rgba(255,255,255,0.08)] px-1 py-[2px] last:border-r-0";

export const TIMELINE_FOOTER_FIELD_GROUP_CLASSES =
  "timeline-flash-footer-field gap-1";

export const TIMELINE_FOOTER_LABEL_CLASSES =
  "timeline-flash-footer-label whitespace-nowrap font-nunito text-[10px] font-bold uppercase tracking-[0.02em] text-[#BDBDBD]";

export const TIMELINE_FOOTER_ICON_LABEL_CLASSES =
  "timeline-flash-footer-icon-label inline-flex items-center gap-1";

export const TIMELINE_FOOTER_ICON_CLASSES =
  "timeline-flash-footer-icon h-3 w-3";

export const TIMELINE_FOOTER_INPUT_CLASSES =
  "timeline-flash-footer-input h-7 w-[62px] rounded border border-[#191919] bg-[#383434] px-[6px] py-1 font-nunito text-xs font-bold text-white";

export const TIMELINE_FOOTER_INPUT_FPS_CLASSES =
  "timeline-flash-footer-input-fps w-[68px]";

export const TIMELINE_FOOTER_INPUT_JUMP_CLASSES =
  "timeline-flash-footer-input-jump w-[86px]";

export const TIMELINE_FOOTER_INPUT_RANGE_CLASSES =
  "timeline-flash-footer-input-range w-[58px]";

export const TIMELINE_FOOTER_READOUT_CLASSES =
  "timeline-flash-footer-readout min-w-[62px] font-nunito text-[11px] font-bold text-white";

export const TIMELINE_FOOTER_HINT_CLASSES =
  "timeline-flash-footer-hint ml-auto whitespace-nowrap font-nunito text-[10px] text-[#BDBDBD]";

export const TIMELINE_FOOTER_SHORTCUT_HINT_CLASSES =
  "timeline-flash-footer-shortcuts text-[rgba(174,216,248,0.95)]";

export const TIMELINE_FOOTER_BUTTON_CLASSES =
  "timeline-flash-footer-button h-7 min-w-[32px] rounded border border-[rgba(255,255,255,0.12)] bg-[#383434] px-2 font-nunito text-xs font-extrabold text-white has-hover:bg-[#4A4A4A] enabled:active:bg-[#525252]";

export const getTimelineFooterChoiceClasses = (active: boolean): string =>
  withActiveClass(
    "timeline-flash-footer-choice inline-flex h-7 min-w-[34px] items-center justify-center gap-1 rounded border border-[rgba(255,255,255,0.12)] bg-[#383434] px-2 font-nunito text-[11px] font-bold text-white has-hover:bg-[#4A4A4A] enabled:active:bg-[#525252]",
    active,
    "active border-[rgba(255,255,255,0.24)] bg-[#4A4A4A]"
  );

export const TIMELINE_FOOTER_CHOICE_ICON_CLASSES =
  "timeline-flash-footer-choice-icon h-[13px] w-[13px]";

export const TIMELINE_SCENE_LABEL_CLASSES =
  "timeline-flash-scene-label text-[#BDBDBD] tracking-[0.04em] uppercase font-bold";

export const TIMELINE_SCENE_NAME_CLASSES =
  "timeline-flash-scene-name max-w-[260px] overflow-hidden text-ellipsis whitespace-nowrap font-bold text-white";

export const TIMELINE_META_CLASSES =
  "timeline-flash-meta whitespace-nowrap text-[#BDBDBD] [font-variant-numeric:tabular-nums]";
