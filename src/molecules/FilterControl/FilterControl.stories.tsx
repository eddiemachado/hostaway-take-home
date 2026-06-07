import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FilterControl } from "./FilterControl";
import { emptyValue, type FieldDef, type FilterValue } from "@/lib/filtering";

const meta: Meta = { title: "Molecules/FilterControl" };
export default meta;
type Story = StoryObj;

const FIELDS: FieldDef[] = [
    { id: "channel", label: "Channel", type: "enum", options: ["Airbnb", "Booking.com", "Vrbo", "Direct"].map((v) => ({ value: v, label: v })), accessor: () => "" },
    { id: "guest", label: "Guest", type: "text", accessor: () => "" },
    { id: "total", label: "Total", type: "number", accessor: () => "" },
    { id: "checkIn", label: "Check-in", type: "date", accessor: () => "" },
];

const One = ({ field }: { field: FieldDef }) => {
    const [value, setValue] = useState<FilterValue>(emptyValue(field.type));
    return (
        <div className="w-72 rounded-lg border border-secondary p-3">
            <p className="mb-2 text-xs font-semibold text-tertiary">{field.label} · {field.type}</p>
            <FilterControl field={field} value={value} onChange={setValue} />
        </div>
    );
};

/** One editor per field type: enum → checkboxes, text → contains, number → range, date → range. */
export const AllTypes: Story = {
    render: () => (
        <div className="flex flex-wrap gap-4">
            {FIELDS.map((f) => (
                <One key={f.id} field={f} />
            ))}
        </div>
    ),
};
