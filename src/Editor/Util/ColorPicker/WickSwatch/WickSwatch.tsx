import { Component } from "react";
import tinycolor from "tinycolor2";
import { Swatch } from "react-color/lib/components/common";

interface WickSwatchProps {
  color: string;
  selectedColor: string;
  onChangeComplete: (color: any) => void;
}

interface WickSwatchState {
  hovered: boolean;
  focused: boolean;
}

/**
 * WickSwatch component - single color swatch in the color picker
 * Handles hover, focus, and selection states
 */
class WickSwatch extends Component<WickSwatchProps, WickSwatchState> {
  constructor(props: WickSwatchProps) {
    super(props);
    this.state = {
      hovered: false,
      focused: false,
    };
  }

  setHovered = (hoverState: boolean): void => {
    this.setState({
      hovered: hoverState,
    });
  };

  render(): JSX.Element {
    let colorInfo = tinycolor(this.props.color);
    let selectedColorInfo = tinycolor(this.props.selectedColor);
    let contrastColor = "#CCCCCC";

    let selected = this.props.color === "#" + selectedColorInfo.toHex(); // TODO clean this check.

    if (colorInfo.isLight()) {
      contrastColor = "#333333";
    }

    let selectedStyle: React.CSSProperties = {
      border: "3px solid" + contrastColor,
    };

    let style: React.CSSProperties = {};
    if (this.state.hovered || this.state.focused) {
      style.border = "2px solid " + contrastColor;
    }
    if (selected) {
      style = selectedStyle;
    }

    return (
      <div
        onFocus={() => {
          this.setState({ focused: true });
        }}
        onBlur={() => {
          this.setState({ focused: false });
        }}
        onMouseEnter={() => this.setHovered(true)}
        onMouseLeave={() => this.setHovered(false)}
        className="column-swatch"
        style={style}
      >
        <Swatch
          color={this.props.color}
          onClick={(color: any) => {
            this.props.onChangeComplete(color);
          }}
        />
      </div>
    );
  }
}

export default WickSwatch;
