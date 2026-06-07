import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TabNav } from "./TabNav";

const meta: Meta<typeof TabNav> = { title: "Molecules/TabNav", component: TabNav };
export default meta;
type Story = StoryObj<typeof TabNav>;

const Demo = () => {
    const [key, setKey] = useState("all");
    return (
        <TabNav
            aria-label="Reservation views"
            selectedKey={key}
            onSelectionChange={setKey}
            tabs={[
                { id: "all", label: "All", count: 36 },
                { id: "upcoming", label: "Upcoming", count: 14 },
                { id: "inhouse", label: "In-house", count: 6 },
                { id: "completed", label: "Completed", count: 9 },
                { id: "cancelled", label: "Cancelled", count: 7 },
            ]}
        />
    );
};

export const Default: Story = { render: () => <Demo /> };
