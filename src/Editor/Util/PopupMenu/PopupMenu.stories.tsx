import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import PopupMenu from "./PopupMenu";

const meta: Meta<typeof PopupMenu> = {
  title: "Editor/Util/PopupMenu/PopupMenu",
  parameters: {
    layout: "padded",
  },
  args: {
    isOpen: false,
    toggle: () => undefined,
    target: "popup-menu-story-target",
    className: "tool-settings-menu-popover",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
      const timeoutId = window.setTimeout(() => {
        setIsOpen(true);
      }, 0);
      return () => {
        window.clearTimeout(timeoutId);
      };
    }, []);

    return (
      <div className="min-h-[220px]">
        <button id="popup-menu-story-target" className="rounded bg-[#4a4a4a] px-3 py-2 text-white">
          Open Menu
        </button>
        <PopupMenu {...args} isOpen={isOpen} toggle={() => setIsOpen((value) => !value)}>
          <div className="h-10 min-w-[180px]" />
        </PopupMenu>
      </div>
    );
  },
};

export const Mobile: Story = {
  args: {
    mobile: true,
    className: "tool-settings-menu-popover",
  },
  render: Default.render,
};
