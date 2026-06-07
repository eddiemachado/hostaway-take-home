import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { Key } from "react-aria-components";
import { Plus, UploadCloud02 } from "@untitledui/icons";
import { PageHeader } from "./PageHeader";
import { Button } from "@/components/base/buttons/button";
import { Tabs } from "@/components/application/tabs/tabs";

const meta: Meta<typeof PageHeader> = { title: "Organisms/PageHeader", component: PageHeader };
export default meta;
type Story = StoryObj<typeof PageHeader>;

/** Composed: Title + description + ActionGroup + Tabs — replaces the monolithic variant block. */
const Demo = () => {
    const [tab, setTab] = useState("all");
    return (
        <PageHeader
            title="Reservations"
            description="Manage bookings across every channel."
            actions={
                <>
                    <Button color="secondary" size="md" iconLeading={UploadCloud02}>Import</Button>
                    <Button color="primary" size="md" iconLeading={Plus}>New reservation</Button>
                </>
            }
            tabs={
                <Tabs selectedKey={tab} onSelectionChange={(k: Key) => setTab(String(k))}>
                    <Tabs.List type="underline" aria-label="Views">
                        <Tabs.Item id="all" label="All" badge={36} />
                        <Tabs.Item id="upcoming" label="Upcoming" badge={14} />
                        <Tabs.Item id="cancelled" label="Cancelled" badge={7} />
                    </Tabs.List>
                </Tabs>
            }
        />
    );
};

export const Default: Story = { render: () => <Demo /> };

export const TitleOnly: Story = { args: { title: "Listings", description: "Your published properties." } };
