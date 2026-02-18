import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import DeleteCopyPaste from "./DeleteCopyPaste";

const meta: Meta<typeof DeleteCopyPaste> = {
  title: "Editor/Panels/DeleteCopyPaste/DeleteCopyPaste",
  parameters: {
    layout: "padded",
  },
  args: {
    previewPlaying: false,
    selectionEmpty: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [counts, setCounts] = useState({ del: 0, copy: 0, paste: 0 });
    return (
      <div className="relative h-32 w-64 bg-[#3d3d3d]">
        <DeleteCopyPaste
          {...args}
          editorActions={{
            delete: { action: () => setCounts((s) => ({ ...s, del: s.del + 1 })) },
            copy: { action: () => setCounts((s) => ({ ...s, copy: s.copy + 1 })) },
            paste: { action: () => setCounts((s) => ({ ...s, paste: s.paste + 1 })) },
          }}
        />
        <output data-testid="delete-copy-paste-counts">
          D:{counts.del} C:{counts.copy} P:{counts.paste}
        </output>
      </div>
    );
  },
};

export const DisabledSelection: Story = {
  args: {
    selectionEmpty: true,
  },
  render: Default.render,
};
