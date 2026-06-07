import type { Meta, StoryObj } from "@storybook/react-vite";
import { Edit01, Eye, Mail01, SlashCircle01 } from "@untitledui/icons";
import { Dropdown } from "@/components/base/dropdown/dropdown";

/** Untitled UI Dropdown menu (real component). */
const meta: Meta = { title: "Molecules/Dropdown" };
export default meta;
type Story = StoryObj;

export const RowActions: Story = {
    render: () => (
        <Dropdown.Root>
            <Dropdown.DotsButton />
            <Dropdown.Popover className="w-min">
                <Dropdown.Menu>
                    <Dropdown.Item icon={Eye}><span className="pr-4">View details</span></Dropdown.Item>
                    <Dropdown.Item icon={Edit01}><span className="pr-4">Edit reservation</span></Dropdown.Item>
                    <Dropdown.Item icon={Mail01}><span className="pr-4">Message guest</span></Dropdown.Item>
                    <Dropdown.Item icon={SlashCircle01}><span className="pr-4">Cancel reservation</span></Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown.Root>
    ),
};
