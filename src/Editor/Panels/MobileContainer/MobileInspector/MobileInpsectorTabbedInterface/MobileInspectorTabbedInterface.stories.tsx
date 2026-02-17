import type { Meta, StoryObj } from "@storybook/react-vite";
import MobileInspectorTabbedInterface from "./MobileInspectorTabbedInterface";

const meta: Meta<typeof MobileInspectorTabbedInterface> = {
  title: "Editor/Panels/MobileContainer/MobileInspector/MobileInpsectorTabbedInterface/MobileInspectorTabbedInterface",
  component: MobileInspectorTabbedInterface,
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const INACTIVE_ICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' rx='4' fill='%23484848'/%3E%3C/svg%3E";
const ACTIVE_ICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' rx='4' fill='%231EE29A'/%3E%3C/svg%3E";

export const Default: Story = {
  render: () => (
    <div style={{ width: "420px", height: "320px", backgroundColor: "#191919", padding: "8px" }}>
      <MobileInspectorTabbedInterface
        tabs={[
          {
            label: "properties",
            icon: INACTIVE_ICON,
            iconActive: ACTIVE_ICON,
            alt: "properties icon",
          },
          {
            label: "script",
            icon: INACTIVE_ICON,
            iconActive: ACTIVE_ICON,
            alt: "script icon",
          },
          {
            label: "filters",
            icon: INACTIVE_ICON,
            iconActive: ACTIVE_ICON,
            alt: "filters icon",
          },
        ]}
      >
        <div style={{ color: "#fff", padding: "12px" }}>Properties Tab</div>
        <div style={{ color: "#fff", padding: "12px" }}>Script Tab</div>
        <div style={{ color: "#fff", padding: "12px" }}>Filters Tab</div>
      </MobileInspectorTabbedInterface>
    </div>
  ),
};
