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
import WickInput, { SelectOption } from "Editor/Util/WickInput/WickInput";

import "./_projectsettings.scss";

import classNames from "classnames";

interface ProjectSettingsProps {
  project: any;
  updateProjectSettings: (settings: any) => void;
  toggle?: () => void;
  isMobile?: boolean;
  colorPickerType?: any;
  changeColorPickerType?: (type: any) => void;
  updateLastColors?: (color: string) => void;
  lastColorsUsed?: string[];
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

  const [name, setName] = useState<string>(props.project.name);
  const [width, setWidth] = useState<number>(props.project.width);
  const [height, setHeight] = useState<number>(props.project.height);
  const [framerate, setFramerate] = useState<number>(props.project.framerate);
  const [backgroundColor, setBackgroundColor] = useState<string>(
    props.project.backgroundColor.rgba
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
    setBackgroundColor(props.project.backgroundColor.rgba);
    setPreset(getPreset(props.project.width, props.project.height));
  }, [
    props.project.name,
    props.project.width,
    props.project.height,
    props.project.framerate,
    props.project.backgroundColor.rgba,
  ]);

  const reset = (): void => {
    setName(props.project.name);
    setWidth(props.project.width);
    setHeight(props.project.height);
    setFramerate(props.project.framerate);
    setBackgroundColor(props.project.backgroundColor.rgba);
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
      backgroundColor: new window.Wick.Color(backgroundColor),
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
          "project-setting-element",
          props.isMobile && "mobile"
        )}
      >
        <label
          htmlFor="project name"
          className="project-settings-property-label"
        >
          Name
        </label>
        <div className="project-settings-property-container">
          <WickInput
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
          "project-setting-element",
          props.isMobile && "mobile"
        )}
      >
        <label
          htmlFor="project framerate"
          className="project-settings-property-label"
        >
          Framerate (FPS)
        </label>
        <div className="project-settings-property-container">
          <WickInput
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
      <div className={classNames("project-setting-element", "mobile")}>
        <div className="project-settings-property-container project-settings-size-input-container mobile">
          <label
            htmlFor="projectWidth"
            className="project-settings-property-label mobile-size"
          >
            Width (px)
          </label>
          <WickInput
            id="projectWidth"
            type="numeric"
            min={projectMinWidth}
            value={width}
            onChange={changeProjectWidth}
            className="project-settings-size-input"
          />
        </div>
        <div className="project-settings-property-container project-settings-size-input-container mobile">
          <label
            htmlFor="projectHeight"
            className="project-settings-property-label mobile-size"
          >
            Height (px)
          </label>
          <WickInput
            id="projectHeight"
            type="numeric"
            min={projectMinHeight}
            value={height}
            onChange={changeProjectHeight}
            className="project-settings-size-input"
          />
        </div>
      </div>
    );
  };

  const renderBackgroundColorObject = (): JSX.Element => {
    return (
      <div
        className={classNames(
          "project-setting-element",
          props.isMobile && "mobile"
        )}
      >
        <label
          htmlFor="project-background-color-picker"
          className="project-settings-property-label"
        >
          Background Color
        </label>
        <div className="project-settings-property-container">
          <WickInput
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
      <div className="preset-boxes">
        {presets.map((presetItem, i) => {
          return (
            <ActionButton
              buttonProps={{ "aria-labelledby": "resolution-presets" }}
              key={"preset" + i}
              className="project-settings-modal-preset"
              text={presetItem.name}
              textClassName={classNames(
                "project-settings-modal-preset-text",
                preset === presetItem.name && "selected"
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
      <div className="project-setting-element project-settings-presets-container">
        <label
          id="resolution-presets"
          className="project-settings-property-label"
        >
          Presets
        </label>
        <div className="project-settings-presets-body-container">
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
      <div className="project-setting-element project-settings-presets-container">
        <div className="project-settings-property-label">Presets</div>
        <div className="project-settings-presets-body-container">
          <WickInput
            type="select"
            value={preset}
            onChange={(option: SelectOption) => {
              const foundPreset = presets.find((preset) => option.value === preset.name);
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
          "project-setting-element",
          props.isMobile && "mobile"
        )}
      >
        <div className="project-settings-property-container project-settings-size-input-container">
          <span>
            <label
              htmlFor="project width"
              className="project-settings-property-label"
            >
              Width (px)
            </label>
            <WickInput
              id="project width"
              type="numeric"
              min={projectMinWidth}
              value={width}
              onChange={changeProjectWidth}
              className="project-settings-size-input"
            />
          </span>
          <span>
            <div className="project-settings-split">x</div>
          </span>
          <span>
            <label
              htmlFor="project height"
              className="project-settings-property-label"
            >
              Height (px)
            </label>
            <WickInput
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
      <div id="project-settings-interior-content">
        {/* Body */}
        <div id="project-settings-modal-body">
          <div className="project-settings-modal-row">
            {renderNameObject()}
            {renderBackgroundColorObject()}
          </div>
          <div className="project-settings-modal-row">
            {renderSizeObject()}
            {renderFramerateObject()}
          </div>
          <div className="project-settings-modal-row">
            {renderPresets()}
          </div>
        </div>
        {/* Footer */}
        <div id="project-settings-modal-footer">
          <div className="project-settings-modal-cancel">
            <ActionButton
              className="project-settings-modal-button"
              color="gray"
              action={resetAndToggle}
              text="Cancel"
            />
          </div>
          <div className="project-settings-modal-accept">
            <ActionButton
              className="project-settings-modal-button"
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
      <div id="project-settings-interior-content">
        {/* Body */}
        <div id="project-settings-modal-body">
          <div className="project-settings-modal-row">
            {renderNameObject()}
          </div>
          <div className="project-settings-modal-row">
            {renderBackgroundColorObject()}
          </div>
          <div className="project-settings-modal-row">
            {renderFramerateObject()}
          </div>
          <div className="project-settings-modal-row">
            {renderPresetsMobile()}
          </div>
          <div className="project-settings-modal-row">
            {renderSizeObjectMobile()}
          </div>
        </div>
        {/* Footer */}
        <div id="project-settings-modal-footer">
          <div className="project-settings-modal-cancel mobile">
            <ActionButton
              className="project-settings-modal-button"
              color="gray"
              action={resetAndToggle}
              text="Cancel"
            />
          </div>
          <div className="project-settings-modal-accept mobile">
            <ActionButton
              className="project-settings-modal-button"
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
