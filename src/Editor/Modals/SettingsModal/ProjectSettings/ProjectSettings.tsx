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

import React, { useState, useEffect } from "react";
import ActionButton from "Editor/Util/ActionButton/ActionButton";
import WickInputV2LegacyAdapter from "Editor/Util/WickInputV2/WickInputV2LegacyAdapter";
import { createWickColor } from "Editor/Util/wickRuntime";
import type {
  ColorPickerType,
  ProjectSettings as ProjectSettingsType,
  WickProject,
} from "Editor/types";

import classNames from "classnames";

interface ProjectSettingsProps {
  project: WickProject;
  updateProjectSettings: (settings: Partial<ProjectSettingsType>) => void;
  toggle?: () => void;
  isMobile?: boolean;
  colorPickerType?: ColorPickerType;
  changeColorPickerType?: (type: ColorPickerType) => void;
  updateLastColors?: (color: string) => void;
  lastColorsUsed?: string[];
}

function createProjectBackgroundColor(
  color: string,
): string | { rgba: string } {
  const wickColor = createWickColor(color);
  if (typeof wickColor === "string") {
    return wickColor;
  }

  if (typeof wickColor.rgba === "string") {
    return { rgba: wickColor.rgba };
  }

  return color;
}

const ProjectSettings: React.FC<ProjectSettingsProps> = (props) => {
  const defaultName = "New Project";

  // Set minimums for project settings.
  // TODO: Add this to the engine.
  const projectMinWidth = 1;
  const projectMinHeight = 1;
  const projectMinFramerate = 1;

  // Create presets.
  const presets = [
    {
      name: "Default",
      width: 720,
      height: 480,
    },
    {
      name: "Square",
      width: 600,
      height: 600,
    },
    {
      name: "720p",
      width: 1280,
      height: 720,
    },
    {
      name: "1080p",
      width: 1920,
      height: 1080,
    },
  ];

  const getPreset = (width: number, height: number): string => {
    let possiblePreset = presets.find((preset) => preset.width === width);
    if (possiblePreset && possiblePreset.height === height) {
      return possiblePreset.name;
    } else {
      return "Custom";
    }
  };

  const getProjectBackgroundColor = (): string => {
    const color = props.project.backgroundColor;

    if (typeof color === "string") {
      return color;
    }

    if (
      color &&
      typeof color === "object" &&
      "rgba" in color &&
      typeof (color as { rgba?: unknown }).rgba === "string"
    ) {
      return (color as { rgba: string }).rgba;
    }

    return "#ffffff";
  };

  const [name, setName] = useState<string>(props.project.name);
  const [width, setWidth] = useState<number>(props.project.width);
  const [height, setHeight] = useState<number>(props.project.height);
  const [framerate, setFramerate] = useState<number>(props.project.framerate);
  const [backgroundColor, setBackgroundColor] = useState<string>(
    getProjectBackgroundColor()
  );
  const [preset, setPreset] = useState<string>(
    getPreset(props.project.width, props.project.height)
  );

  // Reset state when project properties change
  useEffect(() => {
    setName(props.project.name);
    setWidth(props.project.width);
    setHeight(props.project.height);
    setFramerate(props.project.framerate);
    setBackgroundColor(getProjectBackgroundColor());
    setPreset(getPreset(props.project.width, props.project.height));
  }, [
    props.project.name,
    props.project.width,
    props.project.height,
    props.project.framerate,
    props.project.backgroundColor,
  ]);

  const reset = (): void => {
    setName(props.project.name);
    setWidth(props.project.width);
    setHeight(props.project.height);
    setFramerate(props.project.framerate);
    setBackgroundColor(getProjectBackgroundColor());
    setPreset(getPreset(props.project.width, props.project.height));
  };

  const updatePreset = (newWidth: number, newHeight: number): void => {
    setPreset(getPreset(newWidth, newHeight));
  };

  const changeProjectName = (proposedName: string): void => {
    setName(proposedName);
  };

  const changeProjectWidth = (widthAsNumber: number): void => {
    let cleanWidthAsNumber = !widthAsNumber
      ? projectMinWidth
      : Math.max(projectMinWidth, widthAsNumber);
    setWidth(cleanWidthAsNumber);
    updatePreset(cleanWidthAsNumber, height);
  };

  const changeProjectHeight = (heightAsNumber: number): void => {
    let cleanHeightAsNumber = !heightAsNumber
      ? projectMinHeight
      : Math.max(projectMinHeight, heightAsNumber);
    setHeight(cleanHeightAsNumber);
    updatePreset(width, cleanHeightAsNumber);
  };

  const changeProjectFramerate = (framerateAsNumber: number): void => {
    let cleanFramerateAsNumber = !framerateAsNumber
      ? projectMinFramerate
      : Math.max(projectMinFramerate, framerateAsNumber);
    setFramerate(cleanFramerateAsNumber);
  };

  const changeProjectBackgroundColor = (color: string): void => {
    setBackgroundColor(color);
  };

  const acceptProjectSettings = (): void => {
    let newSettings = {
      name: name === "" ? defaultName : name,
      width: width,
      height: height,
      backgroundColor: createProjectBackgroundColor(backgroundColor),
      framerate: framerate,
    };

    props.updateProjectSettings(newSettings);
    props.toggle && props.toggle();
  };

  const resetAndToggle = (): void => {
    reset();
    if (props.toggle) props.toggle();
  };

  const renderNameObject = (): JSX.Element => {
    return (
      <div
        className={classNames(
          "project-setting-element mt-[15px] mr-[5%] w-[47.5%]",
          props.isMobile && "mobile mr-0 w-full"
        )}
      >
        <label
          htmlFor="project name"
          className="project-settings-property-label mb-0 text-editor-modal-text"
        >
          Name
        </label>
        <div className="project-settings-property-container flex h-[30px] flex-row">
          <WickInputV2LegacyAdapter
            id="project name"
            type="text"
            value={name}
            placeholder={defaultName}
            onChange={changeProjectName}
          />
        </div>
      </div>
    );
  };

  const renderFramerateObject = (): JSX.Element => {
    return (
      <div
        className={classNames(
          "project-setting-element mt-[15px] mr-[5%] w-[47.5%]",
          props.isMobile && "mobile mr-0 w-full"
        )}
      >
        <label
          htmlFor="project framerate"
          className="project-settings-property-label mb-0 text-editor-modal-text"
        >
          Framerate (FPS)
        </label>
        <div className="project-settings-property-container flex h-[30px] flex-row">
          <WickInputV2LegacyAdapter
            id="project framerate"
            type="numeric"
            min={projectMinFramerate}
            value={framerate}
            onChange={changeProjectFramerate}
          />
        </div>
      </div>
    );
  };

  const renderSizeObjectMobile = (): JSX.Element => {
    return (
      <div className={classNames("project-setting-element mt-[15px] mr-0 w-full", "mobile")}>
        <div className="project-settings-property-container project-settings-size-input-container mobile mb-1 flex h-[30px] flex-row">
          <label
            htmlFor="projectWidth"
            className="project-settings-property-label mobile-size mb-0 w-[140px] overflow-hidden whitespace-nowrap text-editor-modal-text"
          >
            Width (px)
          </label>
          <WickInputV2LegacyAdapter
            id="projectWidth"
            type="numeric"
            min={projectMinWidth}
            value={width}
            onChange={changeProjectWidth}
            className="project-settings-size-input w-1/2"
          />
        </div>
        <div className="project-settings-property-container project-settings-size-input-container mobile mb-1 flex h-[30px] flex-row">
          <label
            htmlFor="projectHeight"
            className="project-settings-property-label mobile-size mb-0 w-[140px] overflow-hidden whitespace-nowrap text-editor-modal-text"
          >
            Height (px)
          </label>
          <WickInputV2LegacyAdapter
            id="projectHeight"
            type="numeric"
            min={projectMinHeight}
            value={height}
            onChange={changeProjectHeight}
            className="project-settings-size-input w-1/2"
          />
        </div>
      </div>
    );
  };

  const renderBackgroundColorObject = (): JSX.Element => {
    return (
      <div
        className={classNames(
          "project-setting-element mt-[15px] mr-[5%] w-[47.5%]",
          props.isMobile && "mobile mr-0 w-full"
        )}
      >
        <label
          htmlFor="project-background-color-picker"
          className="project-settings-property-label mb-0 text-editor-modal-text"
        >
          Background Color
        </label>
        <div className="project-settings-property-container flex h-[30px] flex-row">
          <WickInputV2LegacyAdapter
            type="color"
            id="project-background-color-picker"
            disableAlpha={true}
            placement={"bottom"}
            color={backgroundColor}
            onChange={changeProjectBackgroundColor}
            colorPickerType={props.colorPickerType}
            changeColorPickerType={props.changeColorPickerType}
            updateLastColors={props.updateLastColors}
            lastColorsUsed={props.lastColorsUsed}
          />
        </div>
      </div>
    );
  };

  const selectPreset = (presetItem: { name: string; width: number; height: number }): void => {
    setWidth(presetItem.width);
    setHeight(presetItem.height);
    setPreset(presetItem.name);
  };

  const renderPresetBoxes = (): JSX.Element => {
    return (
      <div className="preset-boxes flex h-full w-full flex-row">
        {presets.map((presetItem, i) => {
          return (
            <ActionButton
              buttonProps={{ "aria-labelledby": "resolution-presets" }}
              key={"preset" + i}
              className={classNames(
                "project-settings-modal-preset mr-[1.25%] h-full w-[24%] rounded-[2px] text-center text-[20px]",
                i === presets.length - 1 && "mr-0",
                preset === presetItem.name
                  ? "bg-wick-green text-black has-hover:bg-wick-green-light"
                  : "bg-[#4F4F4F] text-editor-modal-text has-hover:bg-wick-green-light has-hover:text-black"
              )}
              text={presetItem.name}
              textClassName={classNames(
                "project-settings-modal-preset-text text-white",
                preset === presetItem.name && "selected text-black"
              )}
              color={preset === presetItem.name ? "green" : "tool"}
              action={() => selectPreset(presetItem)}
            />
          );
        })}
      </div>
    );
  };

  const renderPresets = (): JSX.Element => {
    return (
      <div className="project-setting-element project-settings-presets-container mt-[15px] mr-0 h-[50px] w-full">
        <label
          id="resolution-presets"
          className="project-settings-property-label mb-0 text-editor-modal-text"
        >
          Presets
        </label>
        <div className="project-settings-presets-body-container flex flex-row">
          {renderPresetBoxes()}
        </div>
      </div>
    );
  };

  const renderPresetsMobile = (): JSX.Element => {
    const options: Array<{ value: string; label: string }> = [];
    for (let i = 0; i < presets.length; i++) {
      const preset = presets[i];
      if (preset) {
        options.push({
          value: preset.name,
          label: preset.name,
        });
      }
    }
    return (
      <div className="project-setting-element project-settings-presets-container mt-[15px] mr-0 h-[50px] w-full">
        <div className="project-settings-property-label mb-0 text-editor-modal-text">Presets</div>
        <div className="project-settings-presets-body-container flex flex-row">
          <WickInputV2LegacyAdapter
            type="select"
            value={preset}
            onChange={(selectedPreset) => {
              const foundPreset = presets.find(
                (presetItem) => String(selectedPreset) === presetItem.name
              );
              if (foundPreset) {
                selectPreset(foundPreset);
              }
            }}
            options={options}
          />
        </div>
      </div>
    );
  };

  const renderSizeObject = (): JSX.Element => {
    return (
      <div
        className={classNames(
          "project-setting-element mt-[15px] mr-[5%] w-[47.5%]",
          props.isMobile && "mobile mr-0 w-full"
        )}
      >
        <div className="project-settings-property-container project-settings-size-input-container flex h-[30px] flex-row">
          <span>
            <label
              htmlFor="project width"
              className="project-settings-property-label mb-0 text-editor-modal-text"
            >
              Width (px)
            </label>
            <WickInputV2LegacyAdapter
              id="project width"
              type="numeric"
              min={projectMinWidth}
              value={width}
              onChange={changeProjectWidth}
              className="project-settings-size-input"
            />
          </span>
          <span>
            <div className="project-settings-split px-[5px] pt-[150%] text-editor-modal-text">x</div>
          </span>
          <span>
            <label
              htmlFor="project height"
              className="project-settings-property-label mb-0 text-editor-modal-text"
            >
              Height (px)
            </label>
            <WickInputV2LegacyAdapter
              id="project height"
              type="numeric"
              min={projectMinHeight}
              value={height}
              onChange={changeProjectHeight}
              className="project-settings-size-input"
            />
          </span>
        </div>
      </div>
    );
  };

  const renderDesktop = (): JSX.Element => {
    return (
      <div id="project-settings-interior-content" className="h-full w-full">
        {/* Body */}
        <div id="project-settings-modal-body" className="project-settings-modal-body flex flex-col">
          <div className="project-settings-modal-row flex flex-row">
            {renderNameObject()}
            {renderBackgroundColorObject()}
          </div>
          <div className="project-settings-modal-row flex flex-row">
            {renderSizeObject()}
            {renderFramerateObject()}
          </div>
          <div className="project-settings-modal-row flex flex-row">
            {renderPresets()}
          </div>
        </div>
        {/* Footer */}
        <div
          id="project-settings-modal-footer"
          className="absolute bottom-[18px] right-[18px] mt-[25px] flex h-7 w-[calc(100%_-_40px)] flex-row items-center justify-end"
        >
          <div className="project-settings-modal-cancel ml-auto h-full w-20">
            <ActionButton
              className="project-settings-modal-button h-full"
              color="gray"
              action={resetAndToggle}
              text="Cancel"
            />
          </div>
          <div className="project-settings-modal-accept ml-2 h-full w-20">
            <ActionButton
              className="project-settings-modal-button h-full"
              color="green"
              action={acceptProjectSettings}
              text="Apply"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderMobile = (): JSX.Element => {
    return (
      <div id="project-settings-interior-content" className="h-full w-full">
        {/* Body */}
        <div id="project-settings-modal-body" className="project-settings-modal-body flex flex-col">
          <div className="project-settings-modal-row flex flex-row">
            {renderNameObject()}
          </div>
          <div className="project-settings-modal-row flex flex-row">
            {renderBackgroundColorObject()}
          </div>
          <div className="project-settings-modal-row flex flex-row">
            {renderFramerateObject()}
          </div>
          <div className="project-settings-modal-row flex flex-row">
            {renderPresetsMobile()}
          </div>
          <div className="project-settings-modal-row flex flex-row">
            {renderSizeObjectMobile()}
          </div>
        </div>
        {/* Footer */}
        <div
          id="project-settings-modal-footer"
          className="absolute bottom-[18px] right-[18px] mt-[25px] flex h-7 w-[calc(100%_-_40px)] flex-row items-center justify-end"
        >
          <div className="project-settings-modal-cancel mobile h-full w-[calc(50%_-_8px)]">
            <ActionButton
              className="project-settings-modal-button h-full"
              color="gray"
              action={resetAndToggle}
              text="Cancel"
            />
          </div>
          <div className="project-settings-modal-accept mobile ml-2 h-full w-[calc(50%_-_8px)]">
            <ActionButton
              className="project-settings-modal-button h-full"
              color="green"
              action={acceptProjectSettings}
              text="Apply"
            />
          </div>
        </div>
      </div>
    );
  };

  if (props.isMobile) {
    return renderMobile();
  } else {
    return renderDesktop();
  }
};

export default ProjectSettings;
