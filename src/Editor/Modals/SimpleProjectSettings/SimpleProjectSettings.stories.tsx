import type { Meta, StoryObj } from "@storybook/react-vite";
import WickComponentStory from "Editor/storybook/WickComponentStory";
import { createSimpleProjectSettingsStoryArgs } from "Editor/storybook/wickStoryFixtures";

const loadComponent = () => import("./SimpleProjectSettings");
const defaultArgs = createSimpleProjectSettingsStoryArgs();

const meta: Meta = {
  title: "Editor/Modals/SimpleProjectSettings/SimpleProjectSettings",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <WickComponentStory
      componentName="SimpleProjectSettings"
      loader={loadComponent}
      defaultArgs={defaultArgs}
      args={defaultArgs}
    />
  ),
};
