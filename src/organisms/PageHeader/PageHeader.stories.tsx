import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { Key } from "react-aria-components";
import { Plus, UploadCloud02 } from "@untitledui/icons";
import { PageHeader } from "./PageHeader";
import { Button } from "@/components/base/buttons/button";
import { Tabs } from "@/components/application/tabs/tabs";

/**
 * Composed page header — Title + (description) + ActionGroup + Tabs.
 *
 * `actions` and `tabs` are optional ReactNode slots: omit a prop to remove that region.
 * The booleans below (`withActions`, `withTabs`, `withDescription`) are story-only helpers so
 * you can toggle each slot live from the Controls panel.
 */
interface DemoArgs {
    title: string;
    description: string;
    withDescription: boolean;
    withActions: boolean;
    withTabs: boolean;
}

const Demo = ({ title, description, withDescription, withActions, withTabs }: DemoArgs) => {
    const [tab, setTab] = useState("all");
    return (
        <PageHeader
            title={title}
            description={withDescription ? description : undefined}
            actions={
                withActions ? (
                    <>
                        <Button color="secondary" size="md" iconLeading={UploadCloud02}>Import</Button>
                        <Button color="primary" size="md" iconLeading={Plus}>New reservation</Button>
                    </>
                ) : undefined
            }
            tabs={
                withTabs ? (
                    <Tabs selectedKey={tab} onSelectionChange={(k: Key) => setTab(String(k))}>
                        <Tabs.List type="underline" aria-label="Views">
                            <Tabs.Item id="all" label="All" badge={36} />
                            <Tabs.Item id="upcoming" label="Upcoming" badge={14} />
                            <Tabs.Item id="cancelled" label="Cancelled" badge={7} />
                        </Tabs.List>
                    </Tabs>
                ) : undefined
            }
        />
    );
};

const meta: Meta<typeof Demo> = {
    title: "Organisms/PageHeader",
    component: PageHeader,
    tags: ["autodocs"],
    render: (args) => <Demo {...args} />,
    args: {
        title: "Reservations",
        description: "Manage bookings across every channel.",
        withDescription: true,
        withActions: true,
        withTabs: true,
    },
    argTypes: {
        title: { control: "text" },
        description: { control: "text" },
        withDescription: { control: "boolean", name: "Show description" },
        withActions: { control: "boolean", name: "Show actions" },
        withTabs: { control: "boolean", name: "Show tabs" },
    },
};
export default meta;
type Story = StoryObj<typeof Demo>;

/** Everything on — toggle slots from the Controls panel. */
export const Playground: Story = {};

/** Title + description + actions + tabs. */
export const Full: Story = { args: { withActions: true, withTabs: true } };

/** Just the title block — no actions, no tabs (omit both props). */
export const TitleOnly: Story = { args: { withActions: false, withTabs: false, withDescription: true } };

/** Actions without tabs (omit the `tabs` prop). */
export const WithoutTabs: Story = { args: { withActions: true, withTabs: false } };

/** Tabs without actions (omit the `actions` prop). */
export const WithoutActions: Story = { args: { withActions: false, withTabs: true } };
