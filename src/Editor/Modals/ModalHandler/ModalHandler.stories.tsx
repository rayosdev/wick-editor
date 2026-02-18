import type { Meta, StoryObj } from "@storybook/react-vite";
import WickComponentStory from "Editor/storybook/WickComponentStory";
import { createModalHandlerStoryArgs } from "Editor/storybook/wickStoryFixtures";

const loadComponent = () => import("./ModalHandler");
const defaultArgs = createModalHandlerStoryArgs();

const meta: Meta = {
  title: "Editor/Modals/ModalHandler/ModalHandler",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <WickComponentStory
      componentName="ModalHandler"
      loader={loadComponent}
      defaultArgs={defaultArgs}
      args={defaultArgs}
    />
  ),
};
