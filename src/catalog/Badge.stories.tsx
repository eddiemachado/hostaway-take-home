import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, BadgeWithDot } from "@/components/base/badges/badges";

/** Untitled UI Badge + BadgeWithDot (real components). */
const meta: Meta = { title: "Atoms/Badge" };
export default meta;
type Story = StoryObj;

const COLORS = ["gray", "brand", "success", "warning", "error", "blue", "indigo", "purple", "pink", "orange"] as const;

export const Colors: Story = {
    render: () => (
        <div className="flex flex-wrap gap-2">
            {COLORS.map((c) => (
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
