import type { Meta, StoryObj } from "@storybook/react-vite";
import WickComponentStory from "Editor/storybook/WickComponentStory";
import { createEditorWrapperStoryArgs } from "Editor/storybook/wickStoryFixtures";

const loadComponent = () => import("./EditorWrapper");
const defaultArgs = createEditorWrapperStoryArgs();

const meta: Meta = {
  title: "Editor/EditorWrapper",
  parameters: {
    layout: "padded",
    controls: {
      disable: true,
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <WickComponentStory
      componentName="EditorWrapper"
      loader={loadComponent}
      defaultArgs={defaultArgs}
      args={defaultArgs}
    />
  ),
};
