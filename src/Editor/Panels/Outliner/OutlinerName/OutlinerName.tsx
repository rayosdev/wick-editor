import React from 'react';
import classNames from "classnames";

interface OutlinerNameProps {
  type: string;
  name: string;
}

const OutlinerName: React.FC<OutlinerNameProps> = ({ type, name }) => {
  const typeClassName = `outliner-name-${type}`;
  const isKnownType = type === "layer" || type === "frame" || type === "object";

  return (
    <div
      className={classNames(
        typeClassName,
        isKnownType && "inline-block"
      )}
    >
      {name}
    </div>
  );
};

export default OutlinerName;
