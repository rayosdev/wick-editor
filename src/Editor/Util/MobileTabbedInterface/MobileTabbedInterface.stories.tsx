import type { Meta, StoryObj } from "@storybook/react-vite";
import MobileTabbedInterface from "./MobileTabbedInterface";

const meta: Meta<typeof MobileTabbedInterface> = {
  title: "Editor/Util/MobileTabbedInterface/MobileTabbedInterface",
  component: MobileTabbedInterface,
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const INACTIVE_ICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' rx='4' fill='%23626262'/%3E%3C/svg%3E";
const ACTIVE_ICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' rx='4' fill='%231EE29A'/%3E%3C/svg%3E";

export const Default: Story = {
  render: () => (
    <div style={{ width: "420px", height: "320px", backgroundColor: "#666666", padding: "8px" }}>
      <MobileTabbedInterface
        tabs={[
          {
            label: "timeline",
            icon: INACTIVE_ICON,
            iconActive: ACTIVE_ICON,
            alt: "timeline icon",
          },
          {
            label: "inspector",
            icon: INACTIVE_ICON,
            iconActive: ACTIVE_ICON,
            alt: "inspector icon",
          },
          {
            label: "code",
            icon: INACTIVE_ICON,
            iconActive: ACTIVE_ICON,
            alt: "code icon",
          },
          {
            label: "asset",
            icon: INACTIVE_ICON,
            iconActive: ACTIVE_ICON,
            alt: "asset icon",
          },
        ]}
      >
        <div style={{ color: "#fff", padding: "12px" }}>Timeline Panel</div>
        <div style={{ color: "#fff", padding: "12px" }}>Inspector Panel</div>
        <div style={{ color: "#fff", padding: "12px" }}>Code Panel</div>
        <div style={{ color: "#fff", padding: "12px" }}>Asset Panel</div>
      </MobileTabbedInterface>
    </div>
  ),
};
