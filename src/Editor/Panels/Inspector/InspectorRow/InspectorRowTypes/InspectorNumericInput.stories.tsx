import type { Meta, StoryObj } from "@storybook/react-vite";
import WickComponentStory from "Editor/storybook/WickComponentStory";
import { createInspectorNumericInputStoryArgs } from "Editor/storybook/wickStoryFixtures";

const loadComponent = () => import("./InspectorNumericInput");
const defaultArgs = createInspectorNumericInputStoryArgs();

const meta: Meta = {
  title: "Editor/Panels/Inspector/InspectorRow/InspectorRowTypes/InspectorNumericInput",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <WickComponentStory
      componentName="InspectorNumericInput"
      loader={loadComponent}
      defaultArgs={defaultArgs}
      args={defaultArgs}
    />
  ),
};
