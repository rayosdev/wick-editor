import type { Meta, StoryObj } from "@storybook/react-vite";
import WickComponentStory from "Editor/storybook/WickComponentStory";
import { createCanvasStoryArgs } from "Editor/storybook/wickStoryFixtures";

const loadComponent = () => import("./Canvas");
const defaultArgs = createCanvasStoryArgs();

const meta: Meta = {
  title: "Editor/Panels/Canvas/Canvas",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <WickComponentStory
      componentName="Canvas"
      loader={loadComponent}
      defaultArgs={defaultArgs}
      args={defaultArgs}
    />
  ),
};
