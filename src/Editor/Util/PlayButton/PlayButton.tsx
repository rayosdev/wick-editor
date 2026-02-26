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

import React, { useEffect, useRef, type TouchEvent } from "react";
import { isMobile } from "react-device-detect";

import iconPlay from "resources/action-icons/play.png";
import iconPause from "resources/action-icons/pause.png";
import {
  TOOLTIP_LONG_PRESS_MS,
  hasMovedBeyondThreshold,
} from "Editor/Util/WickInput/tooltipBehavior";

interface PlayButtonProps {
  id?: string;
  tooltipID?: string;
  className?: string;
  playing: boolean;
  action: () => void;
  onLongPress?: () => void;
  longPressMs?: number;
  consumeClickAfterLongPress?: boolean;
}

/**
 * PlayButton component - toggles between play and pause icons
 * Used throughout the editor for animation playback controls
 */
const PlayButton: React.FC<PlayButtonProps> = ({
  id,
  tooltipID,
  className,
  playing,
  action,
  onLongPress,
  longPressMs,
  consumeClickAfterLongPress = true,
}) => {
  const longPressTimerRef = useRef<number | null>(null);
  const longPressTriggeredRef = useRef(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const clearLongPressTimer = (): void => {
    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearLongPressTimer();
    };
  }, []);

  const handleTouchStart = (event: TouchEvent<HTMLInputElement>): void => {
    const touch = event.touches[0];
    if (touch) {
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    } else {
      touchStartRef.current = null;
    }
    longPressTriggeredRef.current = false;
    clearLongPressTimer();

    if (onLongPress) {
      longPressTimerRef.current = window.setTimeout(() => {
        longPressTriggeredRef.current = true;
        onLongPress();
        longPressTimerRef.current = null;
      }, longPressMs ?? TOOLTIP_LONG_PRESS_MS);
    }
  };

  const handleTouchMove = (event: TouchEvent<HTMLInputElement>): void => {
    const touch = event.touches[0];
    const start = touchStartRef.current;
    if (!touch || !start) {
      return;
    }

    if (
      hasMovedBeyondThreshold(start.x, start.y, touch.clientX, touch.clientY)
    ) {
      clearLongPressTimer();
    }
  };

  const handleTouchEnd = (): void => {
    clearLongPressTimer();
    touchStartRef.current = null;

    if (longPressTriggeredRef.current && consumeClickAfterLongPress) {
      longPressTriggeredRef.current = false;
      return;
    }

    longPressTriggeredRef.current = false;
    action();
  };

  const handleTouchCancel = (): void => {
    clearLongPressTimer();
    touchStartRef.current = null;
    longPressTriggeredRef.current = false;
  };

  return (
    <input
      data-tip
      id={id}
      data-for={tooltipID ?? id}
      type="image"
      className={`play-icon h-full w-full cursor-pointer ${className || ""}`}
      alt="playing button"
      src={playing ? iconPause : iconPlay}
      onTouchStart={isMobile ? handleTouchStart : undefined}
      onTouchMove={isMobile ? handleTouchMove : undefined}
      onTouchEnd={isMobile ? handleTouchEnd : undefined}
      onTouchCancel={isMobile ? handleTouchCancel : undefined}
      onClick={isMobile ? undefined : action}
    />
  );
};

export default PlayButton;
