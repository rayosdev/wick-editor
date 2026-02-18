import type { Meta, StoryObj } from "@storybook/react-vite";
import WickComponentStory from "Editor/storybook/WickComponentStory";
import { createBuiltinLibraryStoryArgs } from "Editor/storybook/wickStoryFixtures";

const loadComponent = () => import("./BuiltinLibrary");
const defaultArgs = createBuiltinLibraryStoryArgs();

const meta: Meta = {
  title: "Editor/Modals/BuiltinLibrary/BuiltinLibrary",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <WickComponentStory
      componentName="BuiltinLibrary"
      loader={loadComponent}
      defaultArgs={defaultArgs}
      args={defaultArgs}
    />
  ),
};
