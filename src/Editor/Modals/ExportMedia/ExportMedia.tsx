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

import React from 'react';
import WickModal from 'Editor/Modals/WickModal/WickModal';
import { Progress } from 'reactstrap';

interface WickProject {
  name: string;
}

interface ExportMediaProps {
  open: boolean;
  toggle: () => void;
  project: WickProject;
  renderType: 'video' | 'gif' | 'image sequence';
  renderProgress: number;
  renderStatusMessage: string;
}

/**
 * ExportMedia modal displays export progress for video, GIF, or image sequence.
 * Shows progress bar and status message during rendering.
 */
const ExportMedia: React.FC<ExportMediaProps> = ({
  open,
  toggle,
  project,
  renderType,
  renderProgress,
  renderStatusMessage
}) => {
  const renderDone = renderProgress === 100;

  let renderName = project.name;

  if (renderType === "video") {
    renderName += ".mp4";
  } else if (renderType === "gif") {
    renderName += ".gif";
  } else if (renderType === "image sequence") {
    renderName += " as sequence"
  }

  return (
    <WickModal
      open={open}
      toggle={toggle}
      className="media-export-modal-body h-[160px] w-[300px] min-w-[240px] p-5"
      overlayClassName="media-export-modal-overlay">
      <div
        id="media-export-modal-title"
        className="w-full text-left text-[18px] font-bold text-editor-modal-text"
      >
        Exporting {renderType}
      </div>
      <div className="media-export-modal-content h-full w-full pt-[15px]">
        <div
          id="media-export-modal-subtitle"
          className="pb-1 text-[16px] text-editor-modal-text"
        >
          Creating "{renderName}"
        </div>
        <Progress
          striped
          animated={!renderDone}
          color={renderDone ? 'success' : 'warning'}
          value={renderProgress}
        />
        <div
          id="media-export-modal-status-message"
          className="text-[14px] text-editor-modal-text"
        >
          {renderStatusMessage}
        </div>
      </div>
    </WickModal>
  );
};

export default ExportMedia;
