import type { Meta, StoryObj } from "@storybook/react-vite";
import WickComponentStory from "Editor/storybook/WickComponentStory";
import { createObjectInfoStoryArgs } from "Editor/storybook/wickStoryFixtures";

const loadComponent = () => import("./ObjectInfo");
const defaultArgs = createObjectInfoStoryArgs();

const meta: Meta = {
  title: "Editor/Modals/Util/ObjectInfo/ObjectInfo",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <WickComponentStory
      componentName="ObjectInfo"
      loader={loadComponent}
      defaultArgs={defaultArgs}
      args={defaultArgs}
    />
  ),
};
