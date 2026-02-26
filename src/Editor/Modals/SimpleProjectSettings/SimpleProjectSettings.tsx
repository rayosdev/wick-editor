import { useState, useEffect } from 'react';
import WickModal from 'Editor/Modals/WickModal/WickModal';
import WickInputV2LegacyAdapter from 'Editor/Util/WickInputV2/WickInputV2LegacyAdapter';

import ActionButton from '../../Util/ActionButton/ActionButton';

interface WickProject {
  name: string;
  framerate: number;
  width: number;
  height: number;
}

interface ProjectSettingsUpdate {
  name: string;
  framerate: number;
  width: number;
  height: number;
}

interface SimpleProjectSettingsProps {
  open: boolean;
  toggle: () => void;
  project: WickProject;
  updateProjectSettings: (settings: ProjectSettingsUpdate) => void;
}

/**
 * SimpleProjectSettings modal for editing basic project properties.
 * Allows users to change name, framerate, width, and height.
 */
export default function SimpleProjectSettings(props: SimpleProjectSettingsProps): JSX.Element {
  const [newProjectName, setNewProjectName] = useState<string>(props.project.name);
  const [newProjectFrameRate, setNewProjectFrameRate] = useState<number>(props.project.framerate);
  const [newWidth, setNewWidth] = useState<number>(props.project.width);
  const [newHeight, setNewHeight] = useState<number>(props.project.height);

  useEffect(() => {
    resetProjectDetails();
  }, [props.open]);

  function resetProjectDetails(): void {
    setNewProjectName(props.project.name);
    setNewProjectFrameRate(props.project.framerate);
    setNewWidth(props.project.width);
    setNewHeight(props.project.height);
  }

  function updateProjectSettings(): void {
    props.updateProjectSettings({
      name: newProjectName,
      framerate: newProjectFrameRate,
      width: newWidth,
      height: newHeight
    });

    props.toggle();
  }

  return (
    <WickModal
      open={props.open}
      toggle={props.toggle}
      className="simple-settings-modal-container w-[240px] p-4 pb-8"
      overlayClassName="settings-modal-overlay">
      <h2 className="simple-settings-modal-title mt-4 text-2xl text-white">Project Settings</h2>
      <div className="simple-settings-modal-body flex flex-col">
        <div className="simple-settings-form-row mb-2 w-full">
          <label htmlFor="name" className="simple-settings-input-label mb-0 flex items-baseline text-white">Name</label>
          <WickInputV2LegacyAdapter
            className="simple-settings-input h-8 w-full rounded"
            name="name"
            type="text"
            value={newProjectName}
            onChange={setNewProjectName} />
        </div>

        <div className="simple-settings-form-row mb-2 w-full">
          <label htmlFor="name" className="simple-settings-input-label mb-0 flex items-baseline text-white">Framerate (FPS)</label>
          <WickInputV2LegacyAdapter
            className="simple-settings-input h-8 w-full rounded"
            name="framerate"
            type="numeric"
            value={newProjectFrameRate}
            onChange={setNewProjectFrameRate} />
        </div>

        <div className="simple-settings-dual-form-row flex justify-between">
          <div className="simple-settings-dual-input w-[45%]">
            <label htmlFor="width" className="simple-settings-input-label mb-0 flex items-baseline text-white">Width</label>
            <WickInputV2LegacyAdapter
              className="simple-settings-input h-8 w-full rounded"
              name="width"
              type="numeric"
              value={newWidth}
              min={1}
              max={5000}
              onChange={setNewWidth} />
          </div>
          <div className="simple-settings-dual-input w-[45%]">
            <label htmlFor="height" className="simple-settings-input-label mb-0 flex items-baseline text-white">Height</label>
            <WickInputV2LegacyAdapter
              className="simple-settings-input h-8 w-full rounded"
              name="height"
              type="numeric"
              value={newHeight}
              min={1}
              max={5000}
              onChange={setNewHeight} />
          </div>

        </div>

      </div>
      <div className="simple-settings-modal-footer mt-4 flex h-[35px] w-full justify-center">
        <ActionButton
          className="simple-settings-action-button mx-2 w-[40%]"
          text="Cancel"
          color="gray"
          action={resetProjectDetails} />
        <ActionButton
          className="simple-settings-action-button mx-2 w-[40%]"
          text="Apply"
          color="green"
          action={updateProjectSettings} />
      </div>
    </WickModal>
  )
}
