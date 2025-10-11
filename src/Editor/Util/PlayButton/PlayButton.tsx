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
import './_playbutton.scss'

import iconPlay from 'resources/action-icons/play.png';
import iconPause from 'resources/action-icons/pause.png';

interface PlayButtonProps {
  id?: string;
  className?: string;
  playing: boolean;
  action: () => void;
}

/**
 * PlayButton component - toggles between play and pause icons
 * Used throughout the editor for animation playback controls
 */
const PlayButton: React.FC<PlayButtonProps> = ({ 
  id, 
  className, 
  playing, 
  action 
}) => {
  return (
    <input
      data-tip
      id={id}
      data-for={id}
      type="image"
      className={`play-icon ${className || ''}`}
      alt="playing button"
      src={playing ? iconPause : iconPlay}
      onClick={action}
    />
  );
};

export default PlayButton;
