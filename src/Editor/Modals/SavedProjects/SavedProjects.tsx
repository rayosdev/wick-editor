import { useState } from "react";

import WickModal from "../WickModal/WickModal";
import ActionButton from "../../Util/ActionButton/ActionButton";

import "./_savedprojects.scss";
import SavedProjectItem from "./SavedProjectItem/SavedProjectItem";
import classNames from "classnames";

interface SavedProject {
  name: string;
  date?: string;
  size?: string;
}

interface WarningModalInfo {
  title: string;
  description: string;
  acceptAction: () => void;
  cancelAction: () => void;
  acceptText: string;
  canceltText: string;
}

interface SavedProjectsProps {
  open: boolean;
  toggle: () => void;
  localSavedFiles?: SavedProject[];
  isMobile?: boolean;
  loadLocalWickFile: (project: SavedProject) => void;
  deleteLocalWickFile: (project: SavedProject) => void;
  reloadSavedWickFiles: () => void;
  openWarningModal?: (info: WarningModalInfo) => void;
}

/**
 * SavedProjects modal displays a list of locally saved Wick projects.
 * Allows users to open or delete saved projects with confirmation dialogs.
 */
export default function SavedProjects(props: SavedProjectsProps): JSX.Element {
  // Use an empty list if saved files are not provided.
  const projects = props.localSavedFiles ? props.localSavedFiles : [];

  const [selectedProject, setSelectedProject] = useState<SavedProject | null>(null);

  const openSelectedFile = (): void => {
    if (selectedProject) {
      props.loadLocalWickFile(selectedProject);
      props.toggle();
    }
  };

  const deleteSelectedFile = (): void => {
    if (selectedProject) {
      props.deleteLocalWickFile(selectedProject);
      props.reloadSavedWickFiles();
    }
  };

  const attemptOpenFile = (): void => {
    if (props.openWarningModal) {
      props.openWarningModal({
        title: "Lose Unsaved",
        description: "Any unsaved work will be lost.",
        acceptAction: openSelectedFile,
        cancelAction: () => { },
        acceptText: "Open",
        canceltText: "Cancel",
      });
    }
  };

  const attemptDeleteFile = (): void => {
    if (props.openWarningModal && selectedProject) {
      props.openWarningModal({
        title: `Delete ${selectedProject.name}`,
        description: "This cannot be undone!",
        acceptAction: deleteSelectedFile,
        cancelAction: () => { },
        acceptText: "Delete",
        canceltText: "Cancel",
      });
    }
  };

  return (
    <WickModal
      open={props.open}
      toggle={props.toggle}
      className={classNames(
        "saved-projects-modal-container",
        props.isMobile && "mobile"
      )}
      overlayClassName="settings-modal-overlay"
    >
      <h3 className="saved-projects-modal-title">Saved Projects</h3>
      <div className="saved-projects-modal-body">
        {projects.map((project) => (
          <SavedProjectItem
            key={project.name}
            onClick={() => setSelectedProject(project)}
            selected={selectedProject !== null && selectedProject.name === project.name}
            item={project}
          />
        ))}

        {projects.length === 0 && "No Saved Files"}
      </div>
      <div className="saved-projects-modal-footer">
        <ActionButton
          className="saved-projects-modal-button"
          disabled={selectedProject === null}
          color={selectedProject ? "red" : "gray"}
          action={attemptDeleteFile}
          text="Delete"
        />
        <ActionButton
          className="saved-projects-modal-button"
          disabled={selectedProject === null}
          color={selectedProject ? "green" : "gray"}
          action={attemptOpenFile}
          text="Open"
        />
      </div>
    </WickModal>
  );
}
