import type { Meta, StoryObj } from "@storybook/react-vite";
import WickComponentStory from "Editor/storybook/WickComponentStory";
import { createEditorSettingsStoryArgs } from "Editor/storybook/wickStoryFixtures";

const loadComponent = () => import("./EditorSettings");
const defaultArgs = createEditorSettingsStoryArgs();

const meta: Meta = {
  title: "Editor/Modals/SettingsModal/EditorSettings/EditorSettings",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <WickComponentStory
      componentName="EditorSettings"
      loader={loadComponent}
      defaultArgs={defaultArgs}
      args={defaultArgs}
    />
  ),
};
