import type { Meta, StoryObj } from "@storybook/react-vite";
import WickComponentStory from "Editor/storybook/WickComponentStory";
import { createMobileContainerStoryArgs } from "Editor/storybook/wickStoryFixtures";

const loadComponent = () => import("./MobileContainer");
const defaultArgs = createMobileContainerStoryArgs();

const meta: Meta = {
  title: "Editor/Panels/MobileContainer/MobileContainer",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <WickComponentStory
      componentName="MobileContainer"
      loader={loadComponent}
      defaultArgs={defaultArgs}
      args={defaultArgs}
    />
  ),
};
