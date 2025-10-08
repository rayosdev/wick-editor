import { Component } from "react";

import ActionButton from "Editor/Util/ActionButton/ActionButton";
import PlayButton from "Editor/Util/PlayButton/PlayButton";
import ReactTooltip from "react-tooltip";
import HotKeyInterface from "Editor/hotKeyMap";
import "./_canvastransforms.scss";
import { isMobile } from "react-device-detect";

import classNames from "classnames";

interface TransformButtonOptions {
  action: () => void;
  name: string;
  tooltip: string;
  className?: string;
  isActive?: () => boolean;
  tooltipHotkey?: string;
}

interface CanvasTransformsProps {
  keyMap: any;
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

class CanvasTransforms extends Component<CanvasTransformsProps> {
  getHotkey(action: string): string {
    return HotKeyInterface.getHotKey(this.props.keyMap, action);
  }

  renderTransformButton(options: TransformButtonOptions): JSX.Element {
    return (
      <ActionButton
        color="tool"
        isActive={
          options.isActive
            ? options.isActive
            : () => this.props.activeToolName === options.name
        }
        id={"canvas-transform-button-" + options.name}
        tooltip={options.tooltip}
        tooltipPlace={"top"}
        tooltipHotkey={options.tooltipHotkey ? this.getHotkey(options.tooltipHotkey) : undefined}
        action={options.action}
        icon={options.name}
        className={classNames("canvas-transform-button", options.className)}
        buttonClassName={"canvas-transform-wick-button"}
        iconClassName="canvas-transform-icon"
      />
    );
  }

  renderTransformations = () => {
    return (
      <div className="transforms-container">
        {this.renderTransformButton({
          action: this.props.toggleOnionSkin,
          name: "onionskinning",
          tooltip: "Onion Skinning",
          className: "canvas-transform-item onion-skin-button",
          isActive: () => {
            return this.props.onionSkinEnabled;
          },
          tooltipHotkey: "toggle-onion-skinning",
        })}
        {this.renderTransformButton({
          action: () => this.props.setActiveTool("pan"),
          name: "pan",
          tooltip: "Pan",
          className: "canvas-transform-item",
          tooltipHotkey: "activate-pan",
        })}
        {this.renderZoomIn()}
        {this.renderZoomTool()}
        {this.renderZoomOut()}
        {this.renderTransformButton({
          action: this.props.recenterCanvas,
          name: "recenter",
          tooltip: "Recenter",
          className: "canvas-transform-item",
        })}
      </div>
    );
  };

  // TODO: Adjust this when the touch events are added.
  // renderTransformations = () => {
  //   if (this.props.renderSize === "small") {
  //     return (
  //       <div className='transforms-container'>
  //         {this.renderTransformButton({
  //           action:this.props.toggleOnionSkin,
  //           name:'onionskinning',
  //           tooltip:'Onion Skinning',
  //           className:'canvas-transform-item onion-skin-button',
  //           isActive:(() => {return this.props.onionSkinEnabled}),
  //         })}
  //         {this.renderTransformButton({
  //           action: (this.props.recenterCanvas),
  //           name: 'recenter',
  //           tooltip: 'Recenter',
  //           className:'canvas-transform-item'
  //         })}
  //       </div>
  //     );
  //   }
  //   else {
  //     return (
  //       <div className='transforms-container'>
  //         {this.renderTransformButton({
  //           action:this.props.toggleOnionSkin,
  //           name:'onionskinning',
  //           tooltip:'Onion Skinning',
  //           className:'canvas-transform-item onion-skin-button',
  //           isActive:(() => {return this.props.onionSkinEnabled}),
  //         })}
  //         {this.renderTransformButton({
  //           action: (() => this.props.setActiveTool('pan')),
  //           name: 'pan',
  //           tooltip: 'Pan',
  //           className:'canvas-transform-item'
  //         })}
  //         {this.renderZoomIn()}
  //         {this.renderZoomTool()}
  //         {this.renderZoomOut()}
  //         {this.renderTransformButton({
  //           action: (this.props.recenterCanvas),
  //           name: 'recenter',
  //           tooltip: 'Recenter',
  //           className:'canvas-transform-item'
  //         })}
  //       </div>
  //     );
  //   }
  // }

  renderZoomTool = () => {
    return (
      <div id="zoom-tool-container">
        {/* Zoom Tool / NumericInput*/}
        {this.renderTransformButton({
          action: () => this.props.setActiveTool("zoom"),
          name: "zoom",
          tooltip: "Zoom",
          className: "zoom-tool",
          tooltipHotkey: "activate-zoom",
        })}
      </div>
    );
  };

  renderZoomIn = () => {
    return this.renderTransformButton({
      action: () => this.props.zoomIn(),
      name: "zoomin",
      tooltip: "Zoom In",
      className: "thin-transform-button zoom-in-button",
    });
  };

  renderZoomOut = () => {
    return this.renderTransformButton({
      action: () => this.props.zoomOut(),
      name: "zoomout",
      tooltip: "Zoom Out",
      className: "thin-transform-button zoom-out-button",
    });
  };

  renderPlayButtonTooltip = (): JSX.Element => {
    return (
      <ReactTooltip
        disable={isMobile}
        id={"play-button-object"}
        type="info"
        place={"top"}
        effect="solid"
        aria-haspopup="true"
        className="wick-tooltip"
      >
        <span>{`Preview Play (${this.getHotkey(
          "preview-play-toggle"
        ).toUpperCase()})`}</span>
      </ReactTooltip>
    );
  };

  render(): JSX.Element {
    return (
      <div
        className={classNames(
          "canvas-transforms-widget",
          this.props.renderSize === "small" && "mobile"
        )}
      >
        {!this.props.previewPlaying && this.renderTransformations()}
        <div className="play-button-container">
          {this.renderPlayButtonTooltip()}
          <PlayButton
            id="play-button-object"
            className="play-button canvas-transform-button"
            playing={this.props.previewPlaying}
            action={this.props.togglePreviewPlaying}
          />
        </div>
      </div>
    );
  }
}

export default CanvasTransforms;
