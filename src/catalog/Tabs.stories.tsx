import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { Key } from "react-aria-components";
import { Tabs } from "@/components/application/tabs/tabs";

/** Untitled UI Tabs (real component). */
const meta: Meta = { title: "Molecules/Tabs" };
export default meta;
type Story = StoryObj;

const Demo = () => {
    const [tab, setTab] = useState("all");
    return (
        <Tabs selectedKey={tab} onSelectionChange={(k: Key) => setTab(String(k))}>
            <Tabs.List type="underline" aria-label="Reservation views">
                <Tabs.Item id="all" label="All" badge={36} />
                <Tabs.Item id="upcoming" label="Upcoming" badge={14} />
                <Tabs.Item id="inhouse" label="In-house" badge={6} />
                <Tabs.Item id="completed" label="Completed" badge={9} />
                <Tabs.Item id="cancelled" label="Cancelled" badge={7} />
            </Tabs.List>
        </Tabs>
    );
};

export const Default: Story = { render: () => <Demo /> };
