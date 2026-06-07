import type { Meta, StoryObj } from "@storybook/react-vite";
import { DotsVertical, Plus, Trash01 } from "@untitledui/icons";
import { IconButton } from "./IconButton";

const meta: Meta<typeof IconButton> = {
    title: "Atoms/IconButton",
    component: IconButton,
    args: { icon: Plus, "aria-label": "Add", variant: "secondary", size: "md" },
    argTypes: {
        variant: { control: "select", options: ["secondary", "tertiary"] },
        size: { control: "select", options: ["sm", "md"] },
    },
};
export default meta;
type Story = StoryObj<typeof IconButton>;

export const Playground: Story = {};

export const Examples: Story = {
    render: () => (
        <div className="flex items-center gap-3">
            <IconButton icon={Plus} aria-label="Add" variant="secondary" />
            <IconButton icon={DotsVertical} aria-label="More" variant="tertiary" />
            <IconButton icon={Trash01} aria-label="Delete" variant="tertiary" />
        </div>
    ),
};
