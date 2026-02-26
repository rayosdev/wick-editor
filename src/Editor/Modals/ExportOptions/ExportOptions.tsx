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
import WickModal from "Editor/Modals/WickModal/WickModal";
import WickInputV2LegacyAdapter from "Editor/Util/WickInputV2/WickInputV2LegacyAdapter";
import ObjectInfo from "../Util/ObjectInfo/ObjectInfo";
import TabbedInterface from "Editor/Util/TabbedInterface/TabbedInterface";

import classNames from "classnames";

interface ExportArgs {
  name: string;
  width?: number;
  height?: number;
}

interface ExportOptionsProps {
  open: boolean;
  toggle: () => void;
  projectName: string;
  exportProjectAsGif: (args: ExportArgs) => void;
  exportProjectAsVideo: (args: ExportArgs) => void;
  exportProjectAsStandaloneZip: (args: ExportArgs) => void;
  exportProjectAsStandaloneHTML: (args: ExportArgs) => void;
  exportProjectAsImageSequence: (args: ExportArgs) => void;
  exportProjectAsAudioTrack: (args: ExportArgs) => void;
  exportProjectAsImageSVG: (name: string) => void;
  queueModal: (name: string) => void;
  project: unknown;
  isMobile?: boolean;
}

interface AdvancedSizes {
  [key: string]: {
    width: number;
    height: number;
  };
}

const ExportOptions: React.FC<ExportOptionsProps> = (props) => {
  const placeholderName = "Filename";
  const customSizeTag = "custom";

  const advancedSizes: AdvancedSizes = {
    "1080p": {
      width: 1920,
      height: 1080,
    },
    "720p": {
      width: 1080,
      height: 720,
    },
    "480p": {
      width: 720,
      height: 480,
    },
  };

  const [name, setName] = useState<string>(props.projectName || "");
  const [subTab, setSubTab] = useState<string>("Animation");
  const [exportWidth, setExportWidth] = useState<number>(1920);
  const [exportHeight, setExportHeight] = useState<number>(1080);
  const [exportResolution, setExportResolution] = useState<string>("1080p");
  const [useAdvanced, setUseAdvanced] = useState<boolean>(false);

  // componentDidUpdate replacement
  useEffect(() => {
    setName(props.projectName);
  }, [props.projectName]);

  const resetCustomSize = (): void => {
    setExportResolution(customSizeTag);
    setExportWidth(720);
    setExportHeight(405);
  };

  /**
   * Creates an item of type and toggles the modal.
   * @param {string} type Either 'GIF', 'VIDEO', 'ZIP', or 'HTML'.
   */
  const createAndToggle = (type: string): void => {
    const exportName = name !== "" ? name : type;

    const args: ExportArgs = {
      name: exportName,
      width: useAdvanced ? exportWidth : undefined,
      height: useAdvanced ? exportHeight : undefined,
    };

    if (type === "GIF") {
      props.exportProjectAsGif(args);
    } else if (type === "VIDEO") {
      props.exportProjectAsVideo(args);
    } else if (type === "ZIP") {
      props.exportProjectAsStandaloneZip(args);
      props.toggle();
    } else if (type === "HTML") {
      props.exportProjectAsStandaloneHTML(args);
      props.toggle();
    } else if (type === "IMAGE_SEQUENCE") {
      props.exportProjectAsImageSequence(args);
    } else if (type === "AUDIO_TRACK") {
      props.exportProjectAsAudioTrack(args);
      props.toggle();
    } else if (type === "IMAGE_SVG") {
      props.exportProjectAsImageSVG(exportName);
      props.toggle();
    }
  };

  // Updates the clip name in the state.
  const updateExportName = (newName: string): void => {
    setName(newName);
  };

  const handleSetSubTab = (tabName: string): void => {
    setSubTab(tabName);
  };

  const updateExportSize = (width: number, height: number): void => {
    let res = customSizeTag;

    Object.keys(advancedSizes).forEach((key) => {
      const size = advancedSizes[key];
      if (size && size.width === width && size.height === height) {
        res = key;
      }
    });

    setExportResolution(res);
    setExportWidth(width);
    setExportHeight(height);
  };

  const updateExportResolutionType = (value: string): void => {

    if (value === customSizeTag) {
      resetCustomSize();
    } else if (advancedSizes[value]) {
      let dimensions = advancedSizes[value];
      setExportResolution(value);
      setExportWidth(dimensions.width);
      setExportHeight(dimensions.height);
    }
  };

  const toNumber = (value: unknown, fallback: number): number => {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  const renderAdvancedOptions = (): JSX.Element => {
    let optionsValues = Object.keys(advancedSizes).concat([
      customSizeTag,
    ]);
    let options = optionsValues.map((val) => {
      return { label: val, value: val };
    });

    return (
      <div className="export-modal-advanced-options flex flex-col">
        <div className="export-modal-advanced-checkbox-container mt-2 ml-auto flex">
          <WickInputV2LegacyAdapter
            type="checkbox"
            value={useAdvanced}
            onChange={(nextValue) => setUseAdvanced(Boolean(nextValue))}
            label="Resolution Options"
          />
        </div>
        {useAdvanced && (
          <div className="export-modal-advanced-options-content">
            {/* label is this because overwriting default library react-select */}

            <table>
              <tbody className="advanced-resolution-table">
                <tr>
                  <td>
                    <label
                      htmlFor="advanced-resolution-dropdown"
                      className="export-modal-advanced-option-title mb-0 text-[18px] text-white"
                    >
                      Export Resolution
                    </label>
                  </td>
                  <td></td>
                  <td></td>
                </tr>

                <tr>
                  <td></td>
                  <td>
                    <label
                      htmlFor="export-width"
                      className="export-modal-resolution-label mb-[2px] text-left text-editor-modal-text"
                    >
                      Width (px)
                    </label>
                  </td>
                  <td>
                    <label
                      htmlFor="export-height"
                      className="export-modal-resolution-label mb-[2px] text-left text-editor-modal-text"
                    >
                      Height (px)
                    </label>
                  </td>
                </tr>

                <tr>
                  <td className="border-l-0 pl-1 text-white">
                    <WickInputV2LegacyAdapter
                      id="advanced-resolution-dropdown"
                      type="select"
                      value={exportResolution}
                      className="mr-2 w-[100px]"
                      options={options}
                      onChange={(selectedValue) => {
                        const resolution = String(selectedValue);
                        if (resolution) {
                          updateExportResolutionType(resolution);
                        }
                      }}
                    />
                  </td>
                  <td className="border-l-0 pl-1 text-white">
                    <WickInputV2LegacyAdapter
                      id="export-width"
                      type="numeric"
                      value={exportWidth}
                      onChange={(val: unknown) => {
                        updateExportSize(toNumber(val, exportWidth), exportHeight);
                      }}
                    />
                  </td>
                  <td className="border-l-0 pl-1 text-white">
                    <WickInputV2LegacyAdapter
                      id="export-height"
                      type="numeric"
                      value={exportHeight}
                      onChange={(val: unknown) => {
                        updateExportSize(exportWidth, toNumber(val, exportHeight));
                      }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderGifObject = (): JSX.Element => {
    return (
      <div
        className={classNames(
          "export-info-item min-w-0 basis-0 flex-1 flex-col",
          props.isMobile && "mobile mb-[5px] w-full"
        )}
      >
        <ObjectInfo
          className="export-object-info h-[120px]"
          title="Animated GIF"
          rows={[
            { text: "Creates a .gif file", icon: "check" },
            { text: "No Sound", icon: "cancel" },
            { text: "Not Interactive", icon: "cancel" },
          ]}
        />
        <div className="export-modal-button-container mt-[10px] h-[28px] w-full">
          <ActionButton
            color="gray-green"
            action={() => {
              createAndToggle("GIF");
            }}
            text="Export GIF"
          />
        </div>
      </div>
    );
  };

  const renderVideoObject = (): JSX.Element => {
    return (
      <div
        className={classNames(
          "export-info-item min-w-0 basis-0 flex-1 flex-col",
          props.isMobile && "mobile mb-[5px] w-full"
        )}
      >
        <ObjectInfo
          className="export-object-info h-[120px]"
          title="Video (Beta)"
          rows={[
            { text: "Creates an .mp4 file", icon: "check" },
            { text: "Has Sound", icon: "check" },
            { text: "Not Interactive", icon: "cancel" },
          ]}
        />
        <div className="export-modal-button-container mt-[10px] h-[28px] w-full">
          <ActionButton
            color="gray-green"
            action={() => {
              createAndToggle("VIDEO");
            }}
            text="Export Video (Beta)"
          />
        </div>
      </div>
    );
  };

  const renderStandaloneVideoObject = (componentFn: () => JSX.Element): JSX.Element => {
    return (
      <div>
        {componentFn()}
        {renderAdvancedOptions()}
      </div>
    );
  };

  // Renders the body of the "Animation" tab.
  const renderAnimatedInfo = (): JSX.Element => {
    return (
      <div>
        <div
          className={classNames(
            "export-info-container flex w-full",
            props.isMobile ? "mobile flex-col" : "flex-row gap-3"
          )}
        >
          {renderGifObject()}
          {renderVideoObject()}
        </div>
        {renderAdvancedOptions()}
      </div>
    );
  };

  // Renders the body of the "Interactive" tab.
  const renderInteractiveInfo = (): JSX.Element => {
    return (
      <div className="export-info-container flex w-full flex-row gap-3">
        <div className="export-info-item min-w-0 basis-0 flex-1 flex-col">
          <ObjectInfo
            className="export-object-info h-[120px]"
            title="ZIP Archive"
            rows={[
              { text: "Fully Interactive", icon: "check" },
              { text: "Works on other sites", icon: "check" },
              { text: "Exports a .zip file", icon: "check" },
            ]}
          ></ObjectInfo>
          <div className="export-modal-button-container mt-[10px] h-[28px] w-full">
            <ActionButton
              color="gray-green"
              action={() => {
                createAndToggle("ZIP");
              }}
              text="Export ZIP"
            />
          </div>
        </div>
        <div className="export-info-item min-w-0 basis-0 flex-1 flex-col">
          <ObjectInfo
            className="export-object-info h-[120px]"
            title="HTML"
            rows={[
              { text: "1-Click open", icon: "check" },
              { text: "Easily share projects", icon: "check" },
              { text: "Exports a .html file", icon: "check" },
            ]}
          ></ObjectInfo>
          <div className="export-modal-button-container mt-[10px] h-[28px] w-full">
            <ActionButton
              color="gray-green"
              action={() => {
                createAndToggle("HTML");
              }}
              text="Export HTML"
            />
          </div>
        </div>
      </div>
    );
  };

  // Renders the body of the "Animation" tab.
  const renderImageInfo = (): JSX.Element => {
    return (
      <div>
        <div
          className={classNames(
            "export-info-container flex w-full",
            props.isMobile ? "mobile flex-col" : "flex-row gap-3"
          )}
        >
          <div
            className={classNames(
              "export-info-item min-w-0 basis-0 flex-1 flex-col",
              props.isMobile && "mobile mb-[5px] w-full"
            )}
          >
            <ObjectInfo
              className="export-object-info h-[120px]"
              title="Image Sequence"
              rows={[
                {
                  text: "Creates a .zip archive",
                  icon: "check",
                },
                {
                  text: "Exports .png files",
                  icon: "check",
                },
                {
                  text: "Not interactive",
                  icon: "cancel",
                },
              ]}
            />
            <div className="export-modal-button-container mt-[10px] h-[28px] w-full">
              <ActionButton
                color="gray-green"
                action={() => {
                  createAndToggle("IMAGE_SEQUENCE");
                }}
                text="Export Image Sequence"
              />
            </div>
          </div>
          <div
            className={classNames(
              "export-info-item min-w-0 basis-0 flex-1 flex-col",
              props.isMobile && "mobile mb-[5px] w-full"
            )}
          >
            <ObjectInfo
              className="export-object-info h-[120px]"
              title="Image SVG"
              rows={[
                {
                  text: "Creates a .svg file",
                  icon: "check",
                },
                {
                  text: "Not Animated",
                  icon: "cancel",
                },
                {
                  text: "Not ineractive",
                  icon: "cancel",
                },
              ]}
            />
            <div className="export-modal-button-container mt-[10px] h-[28px] w-full">
              <ActionButton
                color="gray-green"
                action={() => {
                  createAndToggle("IMAGE_SVG");
                }}
                text="Export Image SVG"
              />
            </div>
          </div>
        </div>
        {renderAdvancedOptions()}
      </div>
    );
  };

  const renderAudioInfo = (): JSX.Element => {
    return (
      <div className="export-info-container flex w-full flex-row">
        <div className="wide-export-info-item !ml-0 flex w-full flex-col">
          <ObjectInfo
            className="export-object-info h-[120px]"
            title="Audio"
            rows={[
              {
                text: "Creates a .wav file of all audio in the project",
                icon: "check",
              },
              {
                text: "Not Interactive",
                icon: "cancel",
              },
            ]}
          />
          <div className="export-modal-button-container mt-[10px] h-[28px] w-full">
            <ActionButton
              color="gray-green"
              action={() => {
                createAndToggle("AUDIO_TRACK");
              }}
              text="Export Audio"
            />
          </div>
        </div>
      </div>
    );
  }

  const renderDesktop = (): JSX.Element => {
    const order = ["Animation", "Interactive", "Audio", "Images"];
    const allowedExportTypes = [...(window.allowedExportTypes ?? order)].sort(
      (a, b) => order.indexOf(a) - order.indexOf(b)
    );

    return (
      <WickModal
        open={props.open}
        toggle={props.toggle}
        className={classNames(
          "export-modal-body w-[450px] min-w-[240px] p-5 transition-[height,width] duration-500 ease-in-out"
        )}
        overlayClassName="export-modal-overlay"
      >
        <div
          id="export-modal-interior-content"
          className="flex h-full w-full flex-col items-center justify-center"
        >
          <div
            id="export-modal-title"
            className="w-full text-left text-[18px] font-bold text-editor-modal-text"
          >
            Export
          </div>
          <div id="export-modal-name-input" className="mt-[10px] w-full">
            <WickInputV2LegacyAdapter
              type="text"
              value={name}
              onChange={updateExportName}
              placeholder={placeholderName}
              aria-label="project name"
            />
          </div>
          <TabbedInterface
            tabNames={allowedExportTypes}
            onTabSelect={handleSetSubTab}
          >
            {allowedExportTypes.indexOf("Animation") > -1 &&
              renderAnimatedInfo()}
            {allowedExportTypes.indexOf("Interactive") > -1 &&
              renderInteractiveInfo()}
            {allowedExportTypes.indexOf("Audio") > -1 && renderAudioInfo()}
            {allowedExportTypes.indexOf("Images") > -1 &&
              renderImageInfo()}
          </TabbedInterface>
        </div>
      </WickModal>
    );
  };

  const renderMobile = (): JSX.Element => {
    return (
      <WickModal
        open={props.open}
        toggle={props.toggle}
        className={classNames(
          "export-modal-body w-[450px] min-w-[240px] p-5 transition-[height,width] duration-500 ease-in-out",
          {
            "advanced-options":
              useAdvanced &&
              (subTab === "Animation" ||
                subTab === "Images"),
          },
          "mobile w-[90%] max-w-[400px]"
        )}
        overlayClassName={classNames("export-modal-overlay", "mobile")}
      >
        <div
          id="export-modal-interior-content"
          className="flex h-full w-full flex-col items-center justify-center"
        >
          <div
            id="export-modal-title"
            className="w-full text-left text-[18px] font-bold text-editor-modal-text"
          >
            Export
          </div>
          <div id="export-modal-name-input" className="mt-[10px] w-full">
            <WickInputV2LegacyAdapter
              type="text"
              value={name}
              onChange={updateExportName}
              placeholder={placeholderName}
              aria-label="project name"
            />
          </div>
          <TabbedInterface
            tabNames={["GIF", "Video"]}
            onTabSelect={handleSetSubTab}
          >
            {renderStandaloneVideoObject(renderGifObject)}
            {renderStandaloneVideoObject(renderVideoObject)}
          </TabbedInterface>
        </div>
      </WickModal>
    );
  };

  if (props.isMobile) {
    return renderMobile();
  } else {
    return renderDesktop();
  }
};

export default ExportOptions;
