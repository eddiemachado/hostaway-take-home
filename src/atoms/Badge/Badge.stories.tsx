import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, type BadgeColor } from "./Badge";

const meta: Meta<typeof Badge> = {
    title: "Atoms/Badge",
    component: Badge,
    args: { children: "Label", color: "gray", size: "sm" },
    argTypes: {
        color: { control: "select", options: ["gray", "brand", "success", "warning", "error", "blue", "indigo", "purple", "pink", "orange"] },
        size: { control: "select", options: ["sm", "md"] },
        dot: { control: "boolean" },
    },
};
export default meta;
type Story = StoryObj<typeof Badge>;

const COLORS: BadgeColor[] = ["gray", "brand", "success", "warning", "error", "blue", "indigo", "purple", "pink", "orange"];

export const Playground: Story = {};

export const Colors: Story = {
    render: () => (
        <div className="flex flex-wrap gap-2">
            {COLORS.map((c) => (
                <Badge key={c} color={c}>
                    {c}
                </Badge>
            ))}
        </div>
    ),
};

export const WithDot: Story = {
    render: () => (
        <div className="flex flex-wrap gap-2">
            <Badge color="success" dot>Confirmed</Badge>
            <Badge color="warning" dot>Pending</Badge>
            <Badge color="error" dot>Cancelled</Badge>
            <Badge color="blue" dot>Checked-in</Badge>
            <Badge color="gray" dot>Checked-out</Badge>
        </div>
    ),
};
