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

import AudioPlayer from 'Editor/Util/AudioPlayer/AudioPlayer';

interface InspectorPreviewInfo {
  type: 'image' | 'sound' | string;
  src?: string;
  loadSrc?: () => void;
}

interface InspectorPreviewProps {
  info: InspectorPreviewInfo;
  icon?: string;
  preview?: boolean;
}

const InspectorPreview: React.FC<InspectorPreviewProps> = ({ info }) => {
  if (info.type === "image") {
    return (
      <div className="inspector-image-preview-container my-[10px] flex h-[100px] w-full items-center justify-center">
        <img alt='' className="inspector-image-preview h-[100px] w-auto" src={info.src} />
      </div>
    );
  } else if (info.type === 'sound') {
    return (
      <div className="inspector-sound-preview-container m-[5px]">
        <AudioPlayer key={Math.random()} src={info.src} loadSrc={info.loadSrc || (() => { })} />
      </div>
    );
  } else {
    return (
      <div />
    );
  }
};

export default InspectorPreview;
