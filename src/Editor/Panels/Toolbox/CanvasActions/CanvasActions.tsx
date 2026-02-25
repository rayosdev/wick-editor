import React from "react";

import ToolIcon from "Editor/Util/ToolIcon/ToolIcon";
import PopupMenu from "Editor/Util/PopupMenu/PopupMenu";

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
        className="canvas-actions-menu-item flex min-h-8 w-full items-center gap-2 rounded-[4px] border-0 bg-transparent px-2 py-[5px] text-left font-nunito text-[12px] font-bold text-editor-text-primary has-hover:bg-editor-secondary active:bg-editor-modal-gray max-[800px]:min-h-10 max-[800px]:text-[13px]"
        onClick={(event) => action.action(event)}
      >
        <ToolIcon className="canvas-actions-menu-item-icon !h-4 !w-4 shrink-0" name={action.icon} />
        <span className="canvas-actions-menu-item-label flex-1 whitespace-nowrap">{action.tooltip}</span>
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
          "canvas-actions-menu flex max-w-[560px] gap-[10px]",
          renderSize === "small" && "vertical max-w-none flex-col"
        )}
      >
        {actionGroups.map((group) => (
          <div key={group.title} className="canvas-actions-menu-group flex min-w-[180px] flex-col gap-[6px] max-[800px]:min-w-full">
            <div className="canvas-actions-menu-group-title px-[6px] py-[2px] font-nunito text-[10px] font-bold uppercase tracking-[0.03em] text-editor-text-secondary">{group.title}</div>
            <div className="canvas-actions-menu-group-items flex flex-col gap-1">
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
          "canvas-actions-widget m-0 flex flex-col bg-editor-primary p-[6px]",
          renderSize === "small" && "vertical w-full"
        )}
      >
        {!previewPlaying && renderActions()}
      </div>
    </PopupMenu>
  );
};

export default CanvasActions;
