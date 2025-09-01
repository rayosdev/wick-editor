/*
 * Copyright 2020 WICKLETS LLC
 *
 * This file is part of Wick Editor.
 *
 * Wick Editor is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Wick Editor is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Wick Editor.  If not, see <https://www.gnu.org/licenses/>.
 */

import React, { Component } from 'react';
import './_toolbutton.scss'

// Tools
import iconBrush from 'resources/toolbar-icons/brush.svg';
import iconCursor from 'resources/toolbar-icons/cursor.svg';
import iconEllipse from 'resources/toolbar-icons/ellipse.svg';
import iconRectangle from 'resources/toolbar-icons/rectangle.svg';
import iconLine from 'resources/toolbar-icons/line.svg';
import iconPencil from 'resources/toolbar-icons/pencil.svg';
import iconEyeDropper from 'resources/toolbar-icons/eyedropper.svg';
import iconEraser from 'resources/toolbar-icons/eraser.svg';
import iconText from 'resources/toolbar-icons/text.svg';
import iconFillBucket from 'resources/toolbar-icons/fillbucket.svg';
import iconPathCursor from 'resources/toolbar-icons/pathcursor.svg';
import iconSpectrum from 'resources/toolbar-icons/spectrum.svg';
import iconSwatches from 'resources/toolbar-icons/swatches.svg';

import iconDelete from 'resources/toolbar-icons/delete.svg';
import iconUndo from 'resources/toolbar-icons/undo.svg';
import iconRedo from 'resources/toolbar-icons/redo.svg';
import iconCopy from 'resources/toolbar-icons/copy.svg';
import iconPaste from 'resources/toolbar-icons/paste.svg';
import iconMoreActions from 'resources/toolbar-icons/moreactions.svg';

import iconPan from 'resources/tool-icons/pan.svg';
import iconZoom from 'resources/tool-icons/zoom.svg';
import iconZoomIn from 'resources/tool-icons/zoomin.svg';
import iconZoomOut from 'resources/tool-icons/zoomout.svg';
import iconCurve from 'resources/tool-icons/curve.svg';
import iconPoint from 'resources/tool-icons/point.svg';
import iconBrushPressure from 'resources/tool-icons/brushpressure.png';
import iconRelativeBrushSize from 'resources/tool-icons/relativebrush.png';

import iconBrushModeNone from 'resources/tool-icons/brush-mode-none.png';
import iconBrushModeInside from 'resources/tool-icons/brush-mode-inside.png';
import iconBrushModeOutside from 'resources/tool-icons/brush-mode-outside.png';

// Actions
import iconAction from 'resources/tool-icons/action.svg';
import iconDuplicate from 'resources/tool-icons/duplicate.svg';
import iconFlipHorizontal from 'resources/tool-icons/flipHorizontal.svg';
import iconFlipVertical from 'resources/tool-icons/flipVertical.svg';
import iconBringForwards from 'resources/tool-icons/bringForwards.svg';
import iconBringToFront from 'resources/tool-icons/bringToFront.svg';
import iconSendBackwards from 'resources/tool-icons/sendBackwards.svg';
import iconSendToBack from 'resources/tool-icons/sendToBack.svg';
import iconTimeline from 'resources/tool-icons/timeline.svg';
import iconTimelineDark from 'resources/tool-icons/timeline-dark.svg';
import iconScript from 'resources/tool-icons/script.svg';
import iconSymbol from 'resources/tool-icons/symbol.svg';
import iconLeaveUp from 'resources/tool-icons/leaveUp.svg';
import iconBreakApart from 'resources/tool-icons/breakApart.svg';
import iconBreakApartDark from 'resources/tool-icons/breakApart-dark.svg';
import iconClose from 'resources/tool-icons/close.svg';
import iconRecenter from 'resources/tool-icons/recenter.svg';
import iconAdd from 'resources/asset-library-icons/add.svg';
import iconUpload from 'resources/asset-library-icons/upload.svg';
import iconSubtract from 'resources/tool-icons/subtract.svg';
import iconIntersect from 'resources/tool-icons/intersect.svg';
import iconUnite from 'resources/tool-icons/unite.svg';
import iconAddDark from 'resources/asset-library-icons/add-icon-dark.svg';
import iconUploadDark from 'resources/asset-library-icons/upload-icon-dark.svg';

// Assets
import iconImage from 'resources/tool-icons/image.svg';
import iconGear from 'resources/tool-icons/settings.svg';
import iconGearWhite from 'resources/tool-icons/settings-white.png';
import iconGroup from 'resources/tool-icons/group.svg';
import iconSearch from 'resources/tool-icons/search.svg';
import iconClip from 'resources/asset-library-icons/clip.svg';

// Objects
import iconPathObject from 'resources/object-icons/path.svg';
import iconButtonObject from 'resources/object-icons/button.svg';
import iconButtonObjectDark from 'resources/object-icons/button-dark.svg';
import iconClipObject from 'resources/object-icons/clip.svg';
import iconClipObjectDark from 'resources/object-icons/clip-dark.svg';
import iconTextObject from 'resources/object-icons/text.svg';
import iconImageObject from'resources/object-icons/image.svg';

// Rows
import iconBrushSize from "resources/inspector-icons/property-icons/brushsize.svg";
import iconGapFillAmount from "resources/inspector-icons/property-icons/gapfillamount.png";
import iconFillSmoothing from "resources/inspector-icons/property-icons/fillsmoothing.png";
import iconBrushSmoothness from "resources/inspector-icons/property-icons/brushsmoothness.svg";
import iconCornerRadius from "resources/inspector-icons/property-icons/cornerradius.svg";
import iconEase from "resources/inspector-icons/property-icons/ease.svg";
import iconFillColor from "resources/inspector-icons/property-icons/fillcolor.svg";
import iconFontFamily from "resources/inspector-icons/property-icons/fontfamily.svg";
import iconFontSize from "resources/inspector-icons/property-icons/fontsize.svg";
import iconFrameLength from "resources/inspector-icons/property-icons/framelength.svg";
import iconFrameRate from "resources/inspector-icons/property-icons/framerate.svg";
import iconMultipleObjects from "resources/inspector-icons/property-icons/multipleobjects.svg";
import iconName from "resources/inspector-icons/property-icons/name.svg";
import iconOpacity from "resources/inspector-icons/property-icons/opacity.svg";
import iconPaint from "resources/inspector-icons/property-icons/paint.svg";
import iconOnionSkinning from "resources/tool-icons/onionskinning.svg";
import iconPressure from "resources/inspector-icons/property-icons/brushsmoothness.svg";
import iconPosition from "resources/inspector-icons/property-icons/position.svg";
import iconRotation from "resources/inspector-icons/property-icons/rotation.svg";
import iconScale from "resources/inspector-icons/property-icons/scale.svg";
import iconSize from "resources/inspector-icons/property-icons/size.svg";
import iconSound from "resources/inspector-icons/property-icons/sound.svg";
import iconStrokeColor from "resources/inspector-icons/property-icons/strokecolor.svg";
import iconStrokeWidth from "resources/tool-icons/strokewidth.svg";
import iconVolume from "resources/inspector-icons/property-icons/volume.svg";
import iconUnknown from 'resources/inspector-icons/selection-icons/unknown.svg';
import iconTween from 'resources/tool-icons/tween.svg';
import iconFont from 'resources/tool-icons/font.svg';

// Outliner
import iconEditTimeline from 'resources/outliner-icons/edit_timeline.svg';
import iconHideOutliner from 'resources/outliner-icons/hidden.svg';
import iconLockOutliner from 'resources/outliner-icons/locked.svg';

// Interface
import iconCloseModal from 'resources/interface-images/close.svg';
import iconAutosave from 'resources/interface-images/accept.svg';
import iconCancel from 'resources/interface-images/cancel.svg';
import iconWarning from 'resources/interface-images/warning.svg';
import iconCheck from 'resources/interface-images/check.svg';
import iconCircle from 'resources/tool-icons/circle.svg';
import iconCloseTab from 'resources/tool-icons/closetab.svg';
import iconWarningDelete from 'resources/interface-images/warning_delete.svg';
import iconOutliner from 'resources/interface/gnurl.svg';
import iconPlay from 'resources/interface/play.svg';
import iconPause from 'resources/interface/pause.svg';
import iconLoad from 'resources/interface/load.svg';
import iconLoadWhite from 'resources/interface/load-white.svg';
import iconDeleteBlack from 'resources/interface/delete.svg';
import iconCreate from 'resources/interface/create.svg';
import iconCreateWhite from 'resources/interface/create-white.svg';
import iconCancelWhite from 'resources/interface/cancel.svg';
import iconHamburger from 'resources/interface/hamburger.svg';
import iconExport from 'resources/interface/export.svg';

// Timeline
import iconLock from 'resources/tool-icons/lock.svg';
import iconUnlock from 'resources/tool-icons/unlock.svg';
import iconHidden from 'resources/tool-icons/hidden.svg';
import iconShown from 'resources/tool-icons/shown.svg';
import iconCopyForward from 'resources/tool-icons/copyForward.svg';
import iconSplit from 'resources/tool-icons/split.svg';
import iconLayerTween from 'resources/tool-icons/layerTween.svg';

// Marks
import mascotMarkWhite from 'resources/logo-icons/mascot-mark-white.svg';
import mascotMarkDark from 'resources/logo-icons/mascot-mark-dark.svg';
import mascotMark from 'resources/logo-icons/mascot-mark.svg';
import mascot from 'resources/logo-icons/mascot.svg';

// Code Editor
import iconClear from 'resources/tool-icons/clear.svg';
import iconCodeObject from 'resources/code-icons/object.svg';
import iconCodeEvent from 'resources/code-icons/event.svg';
import iconCodeInput from 'resources/code-icons/input.svg';
import iconCodeProject from 'resources/code-icons/project.svg';
import iconCodeRandom from 'resources/code-icons/random.svg';
import iconCodeSound from 'resources/code-icons/sound.svg';
import iconCodeTimeline from 'resources/code-icons/timeline.svg';
import iconCodeConsole from 'resources/code-icons/console.svg';
import iconCodeBack from 'resources/code-icons/back.svg';

// Support Us
import iconRedHeart from 'resources/support-us-icons/red-heart.svg';

const icons = {
  "brush":iconBrush,
  "cursor":iconCursor,
  "ellipse":iconEllipse,
  "rectangle":iconRectangle,
  "line":iconLine,
  "pencil":iconPencil,
  "eyedropper":iconEyeDropper,
  "eraser":iconEraser,
  "pan":iconPan,
  "zoom":iconZoom,
  "zoomin":iconZoomIn,
  "zoomout":iconZoomOut,
  "fillbucket": iconFillBucket,
  "pathcursor": iconPathCursor,
  "copy": iconCopy,
  "paste": iconPaste,
  "text": iconText,
  "image": iconImage,
  "imageAsset": iconImage,
  "clip": iconClip,
  "leaveUp": iconLeaveUp,
  "upload": iconUpload,
  "action": iconAction,
  "breakApart": iconBreakApart,
  "breakApart-dark": iconBreakApartDark,
  "brushsmoothness": iconBrushSmoothness,
  "brushpressure": iconBrushPressure,
  "brushrelativesize": iconRelativeBrushSize,
  "cornerradius": iconCornerRadius,
  "close": iconClose,
  "delete": iconDelete,
  "search": iconSearch,
  "duplicate": iconDuplicate,
  "ease": iconEase,
  "curve": iconCurve,
  "point": iconPoint,
  "fillcolor": iconFillColor,
  "fontfamily": iconFontFamily,
  "fontsize": iconFontSize,
  "framelength": iconFrameLength,
  "framerate": iconFrameRate,
  "flipHorizontal": iconFlipHorizontal,
  "flipVertical": iconFlipVertical,
  "gapfillamount": iconGapFillAmount,
  "fillsmoothing": iconFillSmoothing,
  "brushsize": iconBrushSize,
  "multipleobjects": iconMultipleObjects,
  "name": iconName,
  "opacity": iconOpacity,
  "paint": iconPaint,
  "onionskinning": iconOnionSkinning,
  "position": iconPosition,
  "pressure": iconPressure,
  "rotation": iconRotation,
  "undo": iconUndo,
  "redo": iconRedo,
  "scale": iconScale,
  "sendToBack": iconSendToBack,
  "sendBackwards": iconSendBackwards,
  "bringToFront": iconBringToFront,
  "bringForwards": iconBringForwards,
  "gear": iconGear,
  "gear-white": iconGearWhite,
  "recenter": iconRecenter,
  "size": iconSize,
  "sound": iconSound,
  "SoundAsset": iconSound,
  "strokecolor": iconStrokeColor,
  "strokewidth": iconStrokeWidth,
  "symbol": iconSymbol,
  "timeline": iconTimeline,
  "timeline-dark": iconTimelineDark,
  "script": iconScript,
  "volume": iconVolume,
  "closemodal": iconCloseModal,
  "autosave": iconAutosave,
  "warning": iconWarning,
  "cancel": iconCancel,
  "check": iconCheck,
  "add": iconAdd,
  "circle": iconCircle,
  "closetab": iconCloseTab,
  "warningdelete": iconWarningDelete,
  "tween": iconTween,
  "font": iconFont,
  "moreactions": iconMoreActions,
  "unite": iconUnite,
  "subtract": iconSubtract,
  "intersect": iconIntersect,
  "lock": iconLock,
  "unlock": iconUnlock,
  "hidden": iconHidden,
  "shown": iconShown,
  "copyForward": iconCopyForward,
  "split": iconSplit,
  "layerTween": iconLayerTween,
  "spectrum": iconSpectrum,
  "swatches": iconSwatches,
  "group": iconGroup,
  "mascotmark": mascotMark,
  "mascotmarkdark": mascotMarkDark,
  "mascotmarkwhite": mascotMarkWhite,
  "mascot": mascot,
  "brushmodenone": iconBrushModeNone,
  "brushmodeinside": iconBrushModeInside,
  "brushmodeoutside": iconBrushModeOutside,
  "outliner": iconOutliner,
  "play": iconPlay,
  "pause": iconPause,
  "load": iconLoad,
  "load-white": iconLoadWhite,
  "delete-black": iconDeleteBlack,
  "create": iconCreate,
  "create-white": iconCreateWhite,
  "cancel-white": iconCancelWhite,
  "hamburger": iconHamburger,
  "export": iconExport,
  "path-object": iconPathObject,
  "button-object": iconButtonObject,
  "button-object-dark": iconButtonObjectDark,
  "clip-object": iconClipObject,
  "clip-object-dark": iconClipObjectDark,
  "image-object": iconImageObject,
  "text-object": iconTextObject,
  "edit-timeline": iconEditTimeline,
  "outliner-lock": iconLockOutliner,
  "outliner-hide": iconHideOutliner,
  "clear": iconClear,
  "codeObject": iconCodeObject,
  "codeEvent": iconCodeEvent,
  "codeRandom": iconCodeRandom,
  "codeInput": iconCodeInput,
  "codeProject": iconCodeProject,
  "codeSound": iconCodeSound,
  "codeTimeline": iconCodeTimeline,
  "codeConsole": iconCodeConsole,
  "codeBack": iconCodeBack,
  "redheart": iconRedHeart,
  "add-dark": iconAddDark,
  "upload-dark": iconUploadDark
}

import classNames from 'classnames';

interface ToolIconProps {
  name?: string;
  className?: string;
  default?: React.ReactNode;
}

class ToolIcon extends Component<ToolIconProps, any> {
  getSource() {
    if (this.props.name in icons) {
      return icons[this.props.name];
    } else {
      return iconUnknown;
    }
  }

  render() {
    if (this.props.name in icons || this.props.default === undefined) {
      return (
        <img
          className={classNames("img-tool-icon", this.props.className)}
          alt={this.props.name+" icon"}
          src={this.getSource()}>
        </img>
      );
    } else {
      return (
        <div className="img-tool-icon">{this.props.default}</div>
      )
    }
  }
}

export default ToolIcon
