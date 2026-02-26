import React, { useEffect, useRef } from "react";

import ActionButton from "Editor/Util/ActionButton/ActionButton";
import PlayButton from "Editor/Util/PlayButton/PlayButton";
import ReactTooltip from "react-tooltip";
import HotKeyInterface from "Editor/hotKeyMap";
import { isMobile } from "react-device-detect";
import {
  TOOLTIP_HOVER_DELAY_MS,
  TOOLTIP_LONG_PRESS_MS,
} from "Editor/Util/WickInput/tooltipBehavior";

import classNames from "classnames";
import type { HotKeyMap } from "Editor/types/hotkeys";

interface TransformButtonOptions {
  action: () => void;
  name: string;
  tooltip: string;
  className?: string;
  isActive?: () => boolean;
  tooltipHotkey?: string;
  hasLongPressAction?: boolean;
}

interface CanvasTransformsProps {
  keyMap: HotKeyMap;
  activeToolName: string;
  toggleOnionSkin: () => void;
  onionSkinEnabled: boolean;
  setActiveTool: (tool: string) => void;
  recenterCanvas: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  previewPlaying: boolean;
  togglePreviewPlaying: () => void;
  renderSize?: string;
}

const CanvasTransforms: React.FC<CanvasTransformsProps> = ({
  keyMap,
  activeToolName,
  toggleOnionSkin,
  onionSkinEnabled,
  setActiveTool,
  recenterCanvas,
  zoomIn,
  zoomOut,
  previewPlaying,
  togglePreviewPlaying,
  renderSize
}) => {
  const hidePlayTooltipListenerRef = useRef<(() => void) | null>(null);
  const playButtonId = "play-button-object";
  const playTooltipId = "play-button-tooltip";

  const clearPlayTooltipHideListener = (): void => {
    if (hidePlayTooltipListenerRef.current) {
      window.removeEventListener("touchend", hidePlayTooltipListenerRef.current, true);
      window.removeEventListener("touchcancel", hidePlayTooltipListenerRef.current, true);
      hidePlayTooltipListenerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearPlayTooltipHideListener();
    };
  }, []);

  const getHotkey = (action: string): string => {
    return HotKeyInterface.getHotKey(keyMap, action);
  };

  const showPlayButtonTooltip = (): void => {
    if (!isMobile) {
      return;
    }

    const anchorElement = document.getElementById(playButtonId);
    if (!anchorElement) {
      return;
    }

    clearPlayTooltipHideListener();
    ReactTooltip.show(anchorElement);

    const hideTooltip = () => {
      ReactTooltip.hide(anchorElement);
      clearPlayTooltipHideListener();
    };

    hidePlayTooltipListenerRef.current = hideTooltip;
    window.addEventListener("touchend", hideTooltip, true);
    window.addEventListener("touchcancel", hideTooltip, true);
  };

  const renderTransformButton = (options: TransformButtonOptions): JSX.Element => {
    const isThinButton = options.className?.includes("thin-transform-button");

    return (
      <ActionButton
        color="tool"
        isActive={
          options.isActive
            ? options.isActive
            : () => activeToolName === options.name
        }
        id={`canvas-transform-button-${options.name}`}
        tooltip={options.tooltip}
        tooltipPlace={"top"}
        tooltipHotkey={options.tooltipHotkey ? getHotkey(options.tooltipHotkey) : undefined}
        hasLongPressAction={options.hasLongPressAction}
        action={options.action}
        icon={options.name}
        className={classNames(
          "canvas-transform-button !h-[40px] p-[3px] pl-[1.5px] pr-[1.5px]",
          isThinButton ? "!w-[24px]" : "!w-[40px]",
          options.className
        )}
        buttonClassName={"canvas-transform-wick-button rounded-none"}
        iconClassName="canvas-transform-icon w-[90%]"
      />
    );
  };

  const renderTransformations = () => {
    return (
      <div className="transforms-container flex flex-row items-center pl-[2px]">
        {renderTransformButton({
          action: toggleOnionSkin,
          name: "onionskinning",
          tooltip: "Onion Skinning",
          className: "canvas-transform-item onion-skin-button",
          isActive: () => {
            return onionSkinEnabled;
          },
          tooltipHotkey: "toggle-onion-skinning",
        })}
        {renderTransformButton({
          action: () => setActiveTool("pan"),
          name: "pan",
          tooltip: "Pan",
          className: "canvas-transform-item",
          tooltipHotkey: "activate-pan",
        })}
        {renderZoomIn()}
        {renderZoomTool()}
        {renderZoomOut()}
        {renderTransformButton({
          action: recenterCanvas,
          name: "recenter",
          tooltip: "Recenter",
          className: "canvas-transform-item",
          hasLongPressAction: true,
        })}
      </div>
    );
  };

  const renderZoomTool = () => {
    return (
      <div id="zoom-tool-container">
        {/* Zoom Tool / NumericInput*/}
        {renderTransformButton({
          action: () => setActiveTool("zoom"),
          name: "zoom",
          tooltip: "Zoom",
          className: "zoom-tool !px-0",
          tooltipHotkey: "activate-zoom",
        })}
      </div>
    );
  };

  const renderZoomIn = () => {
    return renderTransformButton({
      action: () => zoomIn(),
      name: "zoomin",
      tooltip: "Zoom In",
      className: "thin-transform-button zoom-in-button !pr-0",
    });
  };

  const renderZoomOut = () => {
    return renderTransformButton({
      action: () => zoomOut(),
      name: "zoomout",
      tooltip: "Zoom Out",
      className: "thin-transform-button zoom-out-button !pl-0",
    });
  };

  const renderPlayButtonTooltip = (): JSX.Element => {
    return (
      <ReactTooltip
        delayShow={TOOLTIP_HOVER_DELAY_MS}
        id={playTooltipId}
        type="info"
        place={"top"}
        effect="solid"
        aria-haspopup="true"
        className="wick-tooltip"
      >
        <span>{`Preview Play (${getHotkey(
          "preview-play-toggle"
        ).toUpperCase()})`}</span>
      </ReactTooltip>
    );
  };

  return (
    <div
      className={classNames(
        "canvas-transforms-widget absolute bottom-0 right-0 mb-[15px] mr-[15px] flex h-[40px] items-center rounded-[4px] bg-[#191919]",
        renderSize === "small" && "mobile mr-0 rounded-r-none"
      )}
    >
      {!previewPlaying && renderTransformations()}
      <div className="play-button-container flex h-[60px] w-[60px] items-center justify-center rounded-[30px] bg-[#191919]">
        {renderPlayButtonTooltip()}
        <PlayButton
          id={playButtonId}
          tooltipID={playTooltipId}
          className="play-button canvas-transform-button !h-full !w-full !p-[3px]"
          playing={previewPlaying}
          action={togglePreviewPlaying}
          onLongPress={isMobile ? showPlayButtonTooltip : undefined}
          longPressMs={TOOLTIP_LONG_PRESS_MS}
          consumeClickAfterLongPress={isMobile}
        />
      </div>
    </div>
  );
};

export default CanvasTransforms;
