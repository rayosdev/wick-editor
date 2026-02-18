import type { Meta, StoryObj } from "@storybook/react-vite";
import WickComponentStory from "Editor/storybook/WickComponentStory";
import { createGeneralWarningStoryArgs } from "Editor/storybook/wickStoryFixtures";

const loadComponent = () => import("./GeneralWarning");
const defaultArgs = createGeneralWarningStoryArgs();

const meta: Meta = {
  title: "Editor/Modals/GeneralWarning/GeneralWarning",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <WickComponentStory
      componentName="GeneralWarning"
      loader={loadComponent}
      defaultArgs={defaultArgs}
      args={defaultArgs}
    />
  ),
};
