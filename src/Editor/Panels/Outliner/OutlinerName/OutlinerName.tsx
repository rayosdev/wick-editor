import { Component } from 'react';

import './_outlinername.scss';

interface OutlinerNameProps {
  type: string;
  name: string;
}

class OutlinerName extends Component<OutlinerNameProps> {
  render(): JSX.Element {
    const type = this.props.type;
    const name = this.props.name;
    return (
      <div className={"outliner-name-" + type}>
        {name}
      </div>
    );
  }
}

export default OutlinerName;