import type { Meta, StoryObj } from "@storybook/react-vite";
import WickComponentStory from "Editor/storybook/WickComponentStory";
import { createExportMediaStoryArgs } from "Editor/storybook/wickStoryFixtures";

const loadComponent = () => import("./ExportMedia");
const defaultArgs = createExportMediaStoryArgs();

const meta: Meta = {
  title: "Editor/Modals/ExportMedia/ExportMedia",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <WickComponentStory
      componentName="ExportMedia"
      loader={loadComponent}
      defaultArgs={defaultArgs}
      args={defaultArgs}
    />
  ),
};
