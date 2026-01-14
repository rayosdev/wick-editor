import React from 'react';

import './_outlinername.scss';

interface OutlinerNameProps {
  type: string;
  name: string;
}

const OutlinerName: React.FC<OutlinerNameProps> = ({ type, name }) => {
  return (
    <div className={`outliner-name-${type}`}>
      {name}
    </div>
  );
};

export default OutlinerName;