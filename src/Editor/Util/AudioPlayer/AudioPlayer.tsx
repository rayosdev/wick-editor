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

import { useState, useRef, useEffect } from 'react';

import WickInput from 'Editor/Util/WickInput/WickInput';
import ActionButton from 'Editor/Util/ActionButton/ActionButton';

import ClipLoader from "react-spinners/ClipLoader";

interface AudioPlayerProps {
  src?: string;
  loadSrc: () => void;
}

/**
 * AudioPlayer - A component that plays audio files with playback controls.
 * @param props - Component props
 * @param props.src - Optional audio source URL
 * @param props.loadSrc - Function to load the audio source
 * @returns JSX.Element
 */
export const AudioPlayer = ({src, loadSrc}: AudioPlayerProps): JSX.Element => {
    const [currentT, setCurrentT] = useState<number>(0);
    const [paused, setPaused] = useState<boolean>(true);

    const [canPlay, setCanPlay] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(!!src);

    const audioRef = useRef<HTMLAudioElement>(null);

    function togglePlaying(): void {
        if (canPlay && audioRef.current) {
            if (paused) {
                audioRef.current.currentTime = currentT * audioRef.current.duration;
                audioRef.current.play();
                setPaused(false);
            }
            else {
                audioRef.current.pause();
                setCurrentT(audioRef.current.currentTime / audioRef.current.duration);
                setPaused(true);
            }
        }
        else if (paused && !loading) {
            setPaused(false);
            setLoading(true);
            loadSrc();
        }
    }

    // Update currentTime while playing
    useEffect(
        () => {
            let interval: ReturnType<typeof setInterval> | null = null;
            if (!paused && canPlay && audioRef.current) {
                interval = setInterval(() => {
                    if (audioRef.current) {
                        setCurrentT(audioRef.current.currentTime / audioRef.current.duration);
                    }
                }, 100);
            }
            return () => {
                if (interval) clearInterval(interval);
            };
        }
    );

    function seconds_to_string(t: number): string {
        let d = Math.trunc((t % 1) * 10);
        let s = Math.trunc(t) % 60;
        let m = Math.floor(t / 60);
        return m + ":" + ('0' + s).slice(-2) + "." + d;
    }

    function get_time_string(): string {
        let t = seconds_to_string(canPlay && audioRef.current ? audioRef.current.currentTime : 0);
        let d = seconds_to_string(canPlay && audioRef.current ? audioRef.current.duration : 0);
        return t + " / " + d;
    }

    return (
        <div className="audio-player-container w-full h-[50px] rounded-[4px] bg-editor-primary pt-[5px] pl-[5px]">
            {src &&
            <audio
                ref={audioRef}
                src={src}
                onCanPlay={() => {
                    setCanPlay(true);
                    setLoading(false);
                    if (!paused && audioRef.current) {
                        audioRef.current.play();
                    }
                }}
                onEnded={() => {
                    setCurrentT(1);
                    setPaused(true);
                }}
            />
            }
            <span className="playbutton inline-flex h-[40px] w-[40px] flex-col">
                {loading ? 
                <ClipLoader
                color={"#ffffff"}
                loading={loading}
                />
                :
                <ActionButton 
                    action={togglePlaying}
                    color="gray"
                    icon={paused ? "play" : "pause"}/>
                }
                
            </span>
            <span className="controls inline-flex h-[90%] w-[calc(100%-40px)] flex-col align-top">
                <div className="info-text overflow-hidden text-center text-white">{get_time_string()}</div>
                <div className="control mx-auto w-[90%]">
                    <WickInput
                    type="slider"
                    containerclassname="time-slider-container"
                    className="time-slider"
                    aria-label="audio control slider"
                    onChange={(t: number) => {
                        setCurrentT(t);
                        if (canPlay && audioRef.current) {
                            audioRef.current.currentTime = t * audioRef.current.duration;
                        }
                    }}
                    value={currentT}
                    min={0}
                    max={1}
                    step={0.01}
                    />
                </div>
            </span>
        </div>
    );
}

export default AudioPlayer
