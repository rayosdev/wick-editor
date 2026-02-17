import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./KeyboardShortcuts");

const meta: Meta = {
  title: "Editor/Modals/SettingsModal/KeyboardShortcuts/KeyboardShortcuts",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    keyMap: {
      delete: {
        name: "Delete",
        sequences: ["backspace", "delete"],
      },
      copy: {
        name: "Copy",
        sequences: ["ctrl+c", "meta+c"],
      },
      paste: {
        name: "Paste",
        sequences: ["ctrl+v", "meta+v"],
      },
    },
    keyMapGroups: {
      General: ["delete", "copy", "paste"],
    },
    customHotKeys: {},
    addCustomHotKeys: () => undefined,
    resetCustomHotKeys: () => undefined,
    createCombinedHotKeyMap: () => ({}),
    toast: () => undefined,
    toggle: () => undefined,
  },
  render: (args) => (
    <DynamicComponentStory
      componentName="KeyboardShortcuts"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};
