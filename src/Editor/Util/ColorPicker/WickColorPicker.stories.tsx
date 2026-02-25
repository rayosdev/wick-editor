import type { Meta, StoryObj } from "@storybook/react-vite";
import WickColorPicker from "./WickColorPicker";

const meta: Meta<typeof WickColorPicker> = {
  title: "Editor/Util/ColorPicker/WickColorPicker",
  parameters: {
    layout: "padded",
  },
  args: {
    color: "#ffffff",
    colorPickerType: "swatches",
    changeColorPickerType: () => undefined,
    disableAlpha: false,
    onChangeComplete: () => undefined,
    onChange: () => undefined,
    lastColorsUsed: ["#111111", "#333333", "#555555", "#777777", "#999999", "#bbbbbb", "#dddddd", "#ffffff"],
    toggle: () => undefined,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <WickColorPicker {...args} />,
};

export const Spectrum: Story = {
  args: {
    colorPickerType: "spectrum",
    disableAlpha: true,
  },
  render: Default.render,
};
