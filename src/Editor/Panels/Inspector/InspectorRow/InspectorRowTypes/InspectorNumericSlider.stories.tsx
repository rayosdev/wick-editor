import type { Meta, StoryObj } from "@storybook/react-vite";
import WickComponentStory from "Editor/storybook/WickComponentStory";
import { createInspectorNumericSliderStoryArgs } from "Editor/storybook/wickStoryFixtures";

const loadComponent = () => import("./InspectorNumericSlider");
const defaultArgs = createInspectorNumericSliderStoryArgs();

const meta: Meta = {
  title: "Editor/Panels/Inspector/InspectorRow/InspectorRowTypes/InspectorNumericSlider",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <WickComponentStory
      componentName="InspectorNumericSlider"
      loader={loadComponent}
      defaultArgs={defaultArgs}
      args={defaultArgs}
    />
  ),
};
