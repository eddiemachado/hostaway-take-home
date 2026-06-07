import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "./Avatar";

const meta: Meta<typeof Avatar> = {
    title: "Atoms/Avatar",
    component: Avatar,
    args: { name: "Ava Reyes", size: "md" },
    argTypes: { size: { control: "select", options: ["xs", "sm", "md", "lg"] } },
};
export default meta;
type Story = StoryObj<typeof Avatar>;

export const Initials: Story = {};

export const Image: Story = { args: { src: "https://i.pravatar.cc/120?img=5" } };

export const Sizes: Story = {
    render: () => (
        <div className="flex items-center gap-3">
            <Avatar name="Ava Reyes" size="xs" />
            <Avatar name="Liam Khan" size="sm" />
            <Avatar name="Noah Silva" size="md" />
            <Avatar name="Emma Brooks" size="lg" />
        </div>
    ),
};
