import type { Meta, StoryObj } from "@storybook/react-vite";
import WickComponentStory from "Editor/storybook/WickComponentStory";
import { createColorPickerStoryArgs } from "Editor/storybook/wickStoryFixtures";

const loadComponent = () => import("./ColorPicker");
const defaultArgs = createColorPickerStoryArgs();

const meta: Meta = {
  title: "Editor/Util/ColorPicker/ColorPicker",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <WickComponentStory
      componentName="ColorPicker"
      loader={loadComponent}
      defaultArgs={defaultArgs}
      args={defaultArgs}
    />
  ),
};
