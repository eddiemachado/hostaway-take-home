import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Download01, Mail01, SlashCircle01 } from "@untitledui/icons";
import { FilterBar } from "./FilterBar";
import { BulkActionBar } from "./BulkActionBar";
import { SavedViews } from "./SavedViews";
import { Button } from "@/components/base/buttons/button";
import type { AppliedFilter } from "@/lib/filtering";
import type { SavedView } from "@/lib/savedViews";
import { RESERVATION_FIELDS } from "@/pages/ReservationsPage/data";

const meta: Meta = { title: "Organisms/Bars", parameters: { layout: "padded" } };
export default meta;
type Story = StoryObj;

const FilterBarDemo = () => {
    const [filters, setFilters] = useState<AppliedFilter[]>([
        { fieldId: "channel", value: ["Airbnb", "Vrbo"] },
        { fieldId: "status", value: ["Confirmed"] },
    ]);
    return (
        <FilterBar
            fields={RESERVATION_FIELDS}
            filters={filters}
            onRemoveFilter={(i) => setFilters((f) => f.filter((_, idx) => idx !== i))}
            onClearAll={() => setFilters([])}
            resultCount={18}
            totalCount={36}
        />
    );
};

export const FilterBarStory: Story = { name: "FilterBar", render: () => <FilterBarDemo /> };

export const BulkActionBarStory: Story = {
    name: "BulkActionBar",
    render: () => (
        <BulkActionBar count={3} onClear={() => {}}>
            <Button color="secondary" size="sm" iconLeading={Mail01}>Message</Button>
            <Button color="secondary" size="sm" iconLeading={Download01}>Export</Button>
            <Button color="primary-destructive" size="sm" iconLeading={SlashCircle01}>Cancel</Button>
        </BulkActionBar>
    ),
};

const SavedViewsDemo = () => {
    const [views, setViews] = useState<SavedView[]>([
        { id: "1", name: "Airbnb · Confirmed", filters: [{ fieldId: "channel", value: ["Airbnb"] }] },
        { id: "2", name: "Cancelled this month", filters: [{ fieldId: "status", value: ["Cancelled"] }] },
    ]);
    return (
        <SavedViews
            views={views}
            canSave
            onApply={() => {}}
            onDelete={(id) => setViews((v) => v.filter((x) => x.id !== id))}
            onSave={(name) => setViews((v) => [...v, { id: String(Date.now()), name, filters: [] }])}
        />
    );
};

export const SavedViewsStory: Story = { name: "SavedViews", render: () => <SavedViewsDemo /> };
