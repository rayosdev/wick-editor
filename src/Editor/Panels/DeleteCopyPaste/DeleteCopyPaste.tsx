import React from "react";

import ActionButton from "Editor/Util/ActionButton/ActionButton";

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
    <div className="delete-copy-paste-widget absolute left-0 top-0 mr-[15px] mt-[15px] flex h-[40px] items-center rounded-[4px] bg-[#191919]">
      {!props.previewPlaying && (
        <div className="delete-copy-paste-container flex flex-row items-center pr-[2px]">
          <ActionButton
            disabled={props.selectionEmpty}
            color="tool"
            action={props.editorActions.delete.action}
            icon="delete"
            className={classNames(
              "canvas-transform-button",
              "canvas-transform-item",
              "!h-[40px] !w-[40px] p-[3px] pl-[1.5px] pr-[1.5px]"
            )}
            buttonClassName={"canvas-transform-wick-button rounded-none"}
            iconClassName={classNames(
              "canvas-transform-icon",
              "w-[90%]",
              props.selectionEmpty && "opacity-25"
            )}
          />
          <ActionButton
            disabled={props.selectionEmpty}
            color="tool"
            action={props.editorActions.copy.action}
            icon="copy"
            className={classNames(
              "canvas-transform-button",
              "canvas-transform-item",
              "!h-[40px] !w-[40px] p-[3px] pl-[1.5px] pr-[1.5px]"
            )}
            buttonClassName={"canvas-transform-wick-button rounded-none"}
            iconClassName={classNames(
              "canvas-transform-icon",
              "w-[90%]",
              props.selectionEmpty && "opacity-25"
            )}
          />
          <ActionButton
            color="tool"
            action={props.editorActions.paste.action}
            icon="paste"
            className={classNames(
              "canvas-transform-button",
              "canvas-transform-item",
              "!h-[40px] !w-[40px] p-[3px] pl-[1.5px] pr-[1.5px]"
            )}
            buttonClassName={"canvas-transform-wick-button rounded-none"}
            iconClassName="canvas-transform-icon w-[90%]"
          />
        </div>
      )}
    </div>
  );
}
