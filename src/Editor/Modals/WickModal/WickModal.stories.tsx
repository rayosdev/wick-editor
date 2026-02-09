import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import WickModal from "./WickModal";

const meta: Meta<typeof WickModal> = {
  title: "Editor/Modals/WickModal/WickModal",
  component: WickModal,
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    const toggle = (): void => {
      setOpen((isOpen) => !isOpen);
    };

    return (
      <div style={{ display: "grid", gap: "0.75rem", maxWidth: "320px" }}>
        <button type="button" onClick={toggle}>
          Open Modal
        </button>
        <output data-testid="wick-modal-state">
          State: {open ? "Open" : "Closed"}
        </output>
        <WickModal open={open} toggle={toggle}>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            <div data-testid="wick-modal-content">Story modal content</div>
            <button type="button" onClick={toggle}>
              Close Modal
            </button>
          </div>
        </WickModal>
      </div>
    );
  },
};
