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
        <div
          className="relative h-[14px] w-full overflow-hidden rounded-[4px] border border-black/35 bg-[#2E2E2E]"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.max(0, Math.min(100, renderProgress))}
        >
          <div
            className="h-full transition-[width] duration-200"
            style={{
              width: `${Math.max(0, Math.min(100, renderProgress))}%`,
              backgroundColor: renderDone ? "#1EE29A" : "#FFC835",
              backgroundImage: renderDone
                ? "none"
                : "repeating-linear-gradient(45deg, rgba(255,255,255,0.16) 0px, rgba(255,255,255,0.16) 8px, rgba(255,255,255,0.05) 8px, rgba(255,255,255,0.05) 16px)",
              animation: renderDone ? "none" : "export-progress-stripes 900ms linear infinite",
            }}
          />
        </div>
        <div
          id="media-export-modal-status-message"
          className="text-[14px] text-editor-modal-text"
        >
          {renderStatusMessage}
        </div>
      </div>
      <style>{`
        @keyframes export-progress-stripes {
          from { background-position: 0 0; }
          to { background-position: 32px 0; }
        }
      `}</style>
    </WickModal>
  );
};

export default ExportMedia;
