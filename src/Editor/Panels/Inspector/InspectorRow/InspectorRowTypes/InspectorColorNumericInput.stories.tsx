import type { Meta, StoryObj } from "@storybook/react-vite";
import WickComponentStory from "Editor/storybook/WickComponentStory";
import { createInspectorColorNumericInputStoryArgs } from "Editor/storybook/wickStoryFixtures";

const loadComponent = () => import("./InspectorColorNumericInput");
const defaultArgs = createInspectorColorNumericInputStoryArgs();

const meta: Meta = {
  title: "Editor/Panels/Inspector/InspectorRow/InspectorRowTypes/InspectorColorNumericInput",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <WickComponentStory
      componentName="InspectorColorNumericInput"
      loader={loadComponent}
      defaultArgs={defaultArgs}
      args={defaultArgs}
    />
  ),
};
