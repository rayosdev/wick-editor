import { Component } from "react";

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

class CanvasActions extends Component<CanvasActionsProps> {
  renderActionButton(action: CanvasAction): JSX.Element {
    return (
      <ActionButton
        color="tool"
        id={"canvas-action-button-" + action.icon}
        tooltip={action.tooltip}
        action={action.action}
        tooltipPlace={"bottom"}
        icon={action.icon}
        className="canvas-action-button"
      />
    );
  }

  renderActions = (): JSX.Element => {
    return (
      <div
        className={classNames(
          "actions-container",
          this.props.renderSize === "small" && "vertical"
        )}
      >
        {this.renderActionButton(this.props.editorActions.sendToBack)}
        {this.renderActionButton(this.props.editorActions.sendBackward)}
        {this.renderActionButton(this.props.editorActions.sendForward)}
        {this.renderActionButton(this.props.editorActions.sendToFront)}
        <ToolboxBreak vertical={this.props.renderSize === "small"} />
        {this.renderActionButton(this.props.editorActions.flipHorizontal)}
        {this.renderActionButton(this.props.editorActions.flipVertical)}
        <ToolboxBreak vertical={this.props.renderSize === "small"} />
        {this.renderActionButton(this.props.editorActions.booleanUnite)}
        {this.renderActionButton(this.props.editorActions.booleanSubtract)}
        {this.renderActionButton(this.props.editorActions.booleanIntersect)}
      </div>
    );
  };

  render(): JSX.Element {
    return (
      <PopupMenu
        mobile={this.props.renderSize === "small"}
        isOpen={this.props.showCanvasActions}
        toggle={this.props.toggleCanvasActions}
        target="more-canvas-actions-popover-button"
      >
        <div
          className={classNames(
            "canvas-actions-widget",
            "more-canvas-actions-popover",
            this.props.renderSize === "small" && "vertical"
          )}
        >
          {!this.props.previewPlaying && this.renderActions()}
        </div>
      </PopupMenu>
    );
  }
}

export default CanvasActions;
