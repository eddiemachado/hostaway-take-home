import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { Key } from "react-aria-components";
import { Select } from "@/components/base/select/select";

/** Untitled UI Select (real component). */
const meta: Meta = { title: "Molecules/Select" };
export default meta;
type Story = StoryObj;

const ITEMS = [
    { id: "airbnb", label: "Airbnb" },
    { id: "booking", label: "Booking.com" },
    { id: "vrbo", label: "Vrbo" },
    { id: "direct", label: "Direct" },
];

const Demo = () => {
    const [key, setKey] = useState<string | null>(null);
    return (
        <div className="w-64">
            <Select
                label="Channel"
                placeholder="Select a channel"
                items={ITEMS}
                selectedKey={key}
                onSelectionChange={(k: Key | null) => setKey(k == null ? null : String(k))}
            >
                {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
            </Select>
        </div>
    );
};

export const Default: Story = { render: () => <Demo /> };
