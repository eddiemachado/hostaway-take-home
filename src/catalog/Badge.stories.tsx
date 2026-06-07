import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, BadgeWithDot } from "@/components/base/badges/badges";

/** Untitled UI Badge + BadgeWithDot (real components). */
const meta: Meta = {
    title: "Atoms/Badge",
    component: Badge,
    tags: ["autodocs"],
    args: { children: "Label", color: "gray", type: "pill-color", size: "md" },
    argTypes: {
        children: { control: "text" },
        color: { control: "select", options: ["gray", "brand", "success", "warning", "error", "blue", "indigo", "purple", "pink", "orange"] },
        type: { control: "select", options: ["pill-color", "badge-color", "badge-modern"] },
        size: { control: "select", options: ["sm", "md", "lg"] },
    },
};
export default meta;
type Story = StoryObj;

/** Tweak color / type / size live from the Controls panel. */
export const Playground: Story = {};

export const Colors: Story = {
    render: () => (
        <div className="flex flex-wrap gap-2">
            {(["gray", "brand", "success", "warning", "error", "blue", "indigo", "purple", "pink", "orange"] as const).map((c) => (
                <Badge key={c} color={c} type="pill-color" size="md">
                    {c}
                </Badge>
            ))}
        </div>
    ),
};

export const WithDot: Story = {
    render: () => (
        <div className="flex flex-wrap gap-2">
            <BadgeWithDot color="success" type="pill-color" size="md">Confirmed</BadgeWithDot>
            <BadgeWithDot color="warning" type="pill-color" size="md">Pending</BadgeWithDot>
            <BadgeWithDot color="error" type="pill-color" size="md">Cancelled</BadgeWithDot>
            <BadgeWithDot color="blue" type="pill-color" size="md">Checked-in</BadgeWithDot>
            <BadgeWithDot color="gray" type="pill-color" size="md">Checked-out</BadgeWithDot>
        </div>
    ),
};
