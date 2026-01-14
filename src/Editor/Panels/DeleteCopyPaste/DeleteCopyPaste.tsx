import React from "react";

import ActionButton from "Editor/Util/ActionButton/ActionButton";
import "../CanvasTransforms/_canvastransforms.scss";
import "./_deletecopypaste.scss";

import classNames from "classnames";

interface EditorAction {
  action: (e?: React.MouseEvent) => void;
}

interface EditorActions {
  delete: EditorAction;
  copy: EditorAction;
  paste: EditorAction;
}

interface DeleteCopyPasteProps {
  previewPlaying: boolean;
  selectionEmpty: boolean;
  editorActions: EditorActions;
}

export default function DeleteCopyPaste(props: DeleteCopyPasteProps): JSX.Element {
  return (
    <div className="delete-copy-paste-widget">
      {!props.previewPlaying && (
        <div className="delete-copy-paste-container">
          <ActionButton
            disabled={props.selectionEmpty}
            color="tool"
            action={props.editorActions.delete.action}
            icon="delete"
            className={classNames(
              "canvas-transform-button",
              "canvas-transform-item"
            )}
            buttonClassName={"canvas-transform-wick-button"}
            iconClassName={classNames(
              "canvas-transform-icon",
              props.selectionEmpty && "disabled"
            )}
          />
          <ActionButton
            disabled={props.selectionEmpty}
            color="tool"
            action={props.editorActions.copy.action}
            icon="copy"
            className={classNames(
              "canvas-transform-button",
              "canvas-transform-item"
            )}
            buttonClassName={"canvas-transform-wick-button"}
            iconClassName={classNames(
              "canvas-transform-icon",
              props.selectionEmpty && "disabled"
            )}
          />
          <ActionButton
            color="tool"
            action={props.editorActions.paste.action}
            icon="paste"
            className={classNames(
              "canvas-transform-button",
              "canvas-transform-item"
            )}
            buttonClassName={"canvas-transform-wick-button"}
            iconClassName="canvas-transform-icon"
          />
        </div>
      )}
    </div>
  );
}
