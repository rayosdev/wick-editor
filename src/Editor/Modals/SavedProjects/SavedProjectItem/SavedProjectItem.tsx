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
      className={classNames(
        "saved-project-item box-border mb-2 inline-block w-full cursor-pointer rounded border-4 border-[#303030] bg-[#303030] p-2 transition-all duration-[600ms] has-hover:border-[#E9AA02]",
        { selected: props.selected, "border-[#01C094]": props.selected }
      )}
    >
      <h4 className="saved-project-item-name m-0 text-left text-[20px]">
        {props.item.name}
      </h4>
      {/* <div className="saved-project-item-detail-container">
            <div className="saved-project-item-date">{props.item.date}</div>
            <div className="saved-project-item-size">{props.item.size}</div>
         </div> */}
    </div>
  );
}
