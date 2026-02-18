import type { Meta, StoryObj } from "@storybook/react-vite";
import WickComponentStory from "Editor/storybook/WickComponentStory";
import { createInspectorDualNumericInputStoryArgs } from "Editor/storybook/wickStoryFixtures";

const loadComponent = () => import("./InspectorDualNumericInput");
const defaultArgs = createInspectorDualNumericInputStoryArgs();

const meta: Meta = {
  title: "Editor/Panels/Inspector/InspectorRow/InspectorRowTypes/InspectorDualNumericInput",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <WickComponentStory
      componentName="InspectorDualNumericInput"
      loader={loadComponent}
      defaultArgs={defaultArgs}
      args={defaultArgs}
    />
  ),
};
