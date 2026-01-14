import "./_savedprojectitem.scss";

import classNames from "classnames";

interface SavedProjectItemData {
  name: string;
  date?: string;
  size?: string;
}

interface SavedProjectItemProps {
  item: SavedProjectItemData;
  onClick: () => void;
  selected?: boolean;
}

/**
 * SavedProjectItem - A list item displaying a saved project.
 * @param props - Component props
 * @returns JSX.Element
 */
export default function SavedProjectItem(props: SavedProjectItemProps): JSX.Element {
  return (
    <div
      onClick={props.onClick}
      className={classNames("saved-project-item", { selected: props.selected })}
    >
      <h4 className="saved-project-item-name">{props.item.name}</h4>
      {/* <div className="saved-project-item-detail-container">
            <div className="saved-project-item-date">{props.item.date}</div>
            <div className="saved-project-item-size">{props.item.size}</div>
         </div> */}
    </div>
  );
}
