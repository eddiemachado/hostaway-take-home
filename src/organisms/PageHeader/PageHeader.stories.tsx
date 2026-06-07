import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Plus, UploadCloud02 } from "@untitledui/icons";
import { PageHeader } from "./PageHeader";
import { Button } from "@/atoms/Button";
import { TabNav } from "@/molecules/TabNav";

const meta: Meta<typeof PageHeader> = { title: "Organisms/PageHeader", component: PageHeader };
export default meta;
type Story = StoryObj<typeof PageHeader>;

/** Composed: Title + description + ActionGroup + TabNav — replaces the monolithic variant block. */
const Demo = () => {
    const [tab, setTab] = useState("all");
    return (
        <PageHeader
                title="Reservations"
                description="Manage bookings across every channel."
                actions={
                    <>
                        <Button variant="secondary" iconLeading={UploadCloud02}>Import</Button>
                        <Button variant="primary" iconLeading={Plus}>New reservation</Button>
                    </>
                }
                tabs={
                    <TabNav
                        aria-label="Views"
                        selectedKey={tab}
                        onSelectionChange={setTab}
                        tabs={[
                            { id: "all", label: "All", count: 36 },
                            { id: "upcoming", label: "Upcoming", count: 14 },
                            { id: "cancelled", label: "Cancelled", count: 7 },
                        ]}
                    />
                }
        />
    );
};

export const Default: Story = { render: () => <Demo /> };

export const TitleOnly: Story = { args: { title: "Listings", description: "Your published properties." } };
