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
