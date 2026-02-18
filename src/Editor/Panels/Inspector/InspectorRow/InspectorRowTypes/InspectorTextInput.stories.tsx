import type { Meta, StoryObj } from "@storybook/react-vite";
import WickComponentStory from "Editor/storybook/WickComponentStory";
import { createInspectorTextInputStoryArgs } from "Editor/storybook/wickStoryFixtures";

const loadComponent = () => import("./InspectorTextInput");
const defaultArgs = createInspectorTextInputStoryArgs();

const meta: Meta = {
  title: "Editor/Panels/Inspector/InspectorRow/InspectorRowTypes/InspectorTextInput",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <WickComponentStory
      componentName="InspectorTextInput"
      loader={loadComponent}
      defaultArgs={defaultArgs}
      args={defaultArgs}
    />
  ),
};
