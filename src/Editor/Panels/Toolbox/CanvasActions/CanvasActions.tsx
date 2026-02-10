import React from "react";

import ToolIcon from "Editor/Util/ToolIcon/ToolIcon";
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
      <button
        key={action.icon}
        type="button"
        className="canvas-actions-menu-item"
        onClick={(event) => action.action(event)}
      >
        <ToolIcon className="canvas-actions-menu-item-icon" name={action.icon} />
        <span className="canvas-actions-menu-item-label">{action.tooltip}</span>
      </button>
    );
  };

  const actionGroups = [
    {
      title: "Arrange",
      actions: [
        editorActions.sendToBack,
        editorActions.sendBackward,
        editorActions.sendForward,
        editorActions.sendToFront,
      ],
    },
    {
      title: "Transform",
      actions: [editorActions.flipHorizontal, editorActions.flipVertical],
    },
    {
      title: "Boolean",
      actions: [
        editorActions.booleanUnite,
        editorActions.booleanSubtract,
        editorActions.booleanIntersect,
      ],
    },
  ];

  const renderActions = (): JSX.Element => {
    return (
      <div
        className={classNames(
          "canvas-actions-menu",
          renderSize === "small" && "vertical"
        )}
      >
        {actionGroups.map((group) => (
          <div key={group.title} className="canvas-actions-menu-group">
            <div className="canvas-actions-menu-group-title">{group.title}</div>
            <div className="canvas-actions-menu-group-items">
              {group.actions.map(renderActionButton)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <PopupMenu
      mobile={renderSize === "small"}
      isOpen={showCanvasActions}
      toggle={toggleCanvasActions}
      target="more-canvas-actions-popover-button"
      className="canvas-actions-menu-popover"
    >
      <div
        className={classNames(
          "canvas-actions-widget",
          renderSize === "small" && "vertical"
        )}
      >
        {!previewPlaying && renderActions()}
      </div>
    </PopupMenu>
  );
};

export default CanvasActions;
