import type { Meta, StoryObj } from "@storybook/react-vite";
import { DotsVertical, Edit01, Eye, Mail01, SlashCircle01 } from "@untitledui/icons";
import { Menu } from "./Menu";
import { IconButton } from "@/atoms/IconButton";

const meta: Meta<typeof Menu> = { title: "Molecules/Menu", component: Menu };
export default meta;
type Story = StoryObj<typeof Menu>;

export const Default: Story = {
    render: () => (
        <Menu
            aria-label="Row actions"
            trigger={<IconButton icon={DotsVertical} variant="tertiary" aria-label="Open actions" />}
            items={[
                { id: "view", label: "View details", icon: Eye, onAction: () => {} },
                { id: "edit", label: "Edit reservation", icon: Edit01, onAction: () => {} },
                { id: "message", label: "Message guest", icon: Mail01, onAction: () => {} },
                { id: "cancel", label: "Cancel reservation", icon: SlashCircle01, danger: true, onAction: () => {} },
            ]}
        />
    ),
};
