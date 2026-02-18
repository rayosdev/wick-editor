import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./ColorPicker");

const meta: Meta = {
  title: "Editor/Util/ColorPicker/ColorPicker",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: "storybook-color-picker",
    color: "#ffffff",
    placement: "bottom",
    colorPickerType: "swatches",
    changeColorPickerType: () => undefined,
    disableAlpha: false,
    onChangeComplete: () => undefined,
    lastColorsUsed: [
      "#000000",
      "#FFFFFF",
      "#1EE29A",
      "#00ADEF",
      "#F86868",
      "#FFC835",
      "#4F4F4F",
      "#303030",
    ],
  },
  render: (args) => (
    <DynamicComponentStory
      componentName="ColorPicker"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};
