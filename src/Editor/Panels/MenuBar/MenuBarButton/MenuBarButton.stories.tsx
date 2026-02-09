import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import MenuBarButton from "./MenuBarButton";

const meta: Meta<typeof MenuBarButton> = {
  title: "Editor/Panels/MenuBar/MenuBarButton/MenuBarButton",
  component: MenuBarButton,
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [count, setCount] = useState(0);

    return (
      <div style={{ display: "grid", gap: "0.75rem", justifyItems: "start" }}>
        <MenuBarButton text="File" action={() => setCount((value) => value + 1)} />
        <output data-testid="menu-bar-button-count">Clicks: {count}</output>
      </div>
    );
  },
};
