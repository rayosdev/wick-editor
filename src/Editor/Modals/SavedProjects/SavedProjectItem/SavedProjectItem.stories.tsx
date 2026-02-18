import type { Meta, StoryObj } from "@storybook/react-vite";
import WickComponentStory from "Editor/storybook/WickComponentStory";
import { createSavedProjectItemStoryArgs } from "Editor/storybook/wickStoryFixtures";

const loadComponent = () => import("./SavedProjectItem");
const defaultArgs = createSavedProjectItemStoryArgs();

const meta: Meta = {
  title: "Editor/Modals/SavedProjects/SavedProjectItem/SavedProjectItem",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <WickComponentStory
      componentName="SavedProjectItem"
      loader={loadComponent}
      defaultArgs={defaultArgs}
      args={defaultArgs}
    />
  ),
};
