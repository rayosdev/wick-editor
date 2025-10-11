import React from "react";

import ActionButton from "Editor/Util/ActionButton/ActionButton";
import ToolboxBreak from "../ToolboxBreak/ToolboxBreak";
import PopupMenu from "Editor/Util/PopupMenu/PopupMenu";
import "./_canvasactions.scss";

import classNames from "classnames";

export interface CanvasAction {
  icon: string;
  tooltip: string;
  action: (e?: React.MouseEvent) => void;
}

export interface EditorActions {
  sendToBack: CanvasAction;
  sendBackward: CanvasAction;
  sendForward: CanvasAction;
  sendToFront: CanvasAction;
  flipHorizontal: CanvasAction;
  flipVertical: CanvasAction;
  booleanUnite: CanvasAction;
  booleanSubtract: CanvasAction;
  booleanIntersect: CanvasAction;
}

export interface CanvasActionsProps {
  renderSize: string;
  editorActions: EditorActions;
  showCanvasActions: boolean;
  toggleCanvasActions: () => void;
  previewPlaying: boolean;
}

const CanvasActions: React.FC<CanvasActionsProps> = ({ 
  renderSize,
  editorActions,
  showCanvasActions,
  toggleCanvasActions,
  previewPlaying
}) => {
  const renderActionButton = (action: CanvasAction): JSX.Element => {
    return (
      <ActionButton
        color="tool"
        id={`canvas-action-button-${action.icon}`}
        tooltip={action.tooltip}
        action={action.action}
        tooltipPlace={"bottom"}
        icon={action.icon}
        className="canvas-action-button"
      />
    );
  };

  const renderActions = (): JSX.Element => {
    return (
      <div
        className={classNames(
          "actions-container",
          renderSize === "small" && "vertical"
        )}
      >
        {renderActionButton(editorActions.sendToBack)}
        {renderActionButton(editorActions.sendBackward)}
        {renderActionButton(editorActions.sendForward)}
        {renderActionButton(editorActions.sendToFront)}
        <ToolboxBreak vertical={renderSize === "small"} />
        {renderActionButton(editorActions.flipHorizontal)}
        {renderActionButton(editorActions.flipVertical)}
        <ToolboxBreak vertical={renderSize === "small"} />
        {renderActionButton(editorActions.booleanUnite)}
        {renderActionButton(editorActions.booleanSubtract)}
        {renderActionButton(editorActions.booleanIntersect)}
      </div>
    );
  };

  return (
    <PopupMenu
      mobile={renderSize === "small"}
      isOpen={showCanvasActions}
      toggle={toggleCanvasActions}
      target="more-canvas-actions-popover-button"
    >
      <div
        className={classNames(
          "canvas-actions-widget",
          "more-canvas-actions-popover",
          renderSize === "small" && "vertical"
        )}
      >
        {!previewPlaying && renderActions()}
      </div>
    </PopupMenu>
  );
};

export default CanvasActions;
