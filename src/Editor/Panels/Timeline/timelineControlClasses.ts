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
