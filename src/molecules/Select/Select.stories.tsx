import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select } from "./Select";

const meta: Meta<typeof Select> = { title: "Molecules/Select", component: Select };
export default meta;
type Story = StoryObj<typeof Select>;

const Demo = () => {
    const [key, setKey] = useState<string | null>(null);
    return (
        <div className="w-64">
            <Select
                aria-label="Channel"
                placeholder="Select a channel"
                selectedKey={key}
                onChange={setKey}
                options={[
                    { id: "airbnb", label: "Airbnb" },
                    { id: "booking", label: "Booking.com" },
                    { id: "vrbo", label: "Vrbo" },
                    { id: "direct", label: "Direct" },
                ]}
            />
        </div>
    );
};

export const Default: Story = { render: () => <Demo /> };
