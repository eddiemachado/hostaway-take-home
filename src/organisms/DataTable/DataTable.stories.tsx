import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataTable, type Column, type SortState } from "./DataTable";
import { Badge } from "@/atoms/Badge";

interface Row {
    id: string;
    guest: string;
    property: string;
    status: "Confirmed" | "Pending" | "Cancelled";
    nights: number;
}

const ROWS: Row[] = [
    { id: "1", guest: "Ava Reyes", property: "Seaside Loft", status: "Confirmed", nights: 4 },
    { id: "2", guest: "Liam Khan", property: "Downtown Studio", status: "Pending", nights: 2 },
    { id: "3", guest: "Noah Silva", property: "Garden Cottage", status: "Cancelled", nights: 7 },
    { id: "4", guest: "Emma Brooks", property: "Skyline Penthouse", status: "Confirmed", nights: 3 },
];

const statusColor = { Confirmed: "success", Pending: "warning", Cancelled: "error" } as const;

const meta: Meta<typeof DataTable<Row>> = { title: "Organisms/DataTable", parameters: { layout: "padded" } };
export default meta;
type Story = StoryObj;

const columns: Column<Row>[] = [
    { id: "guest", header: "Guest", sortable: true, cell: (r) => <span className="font-medium text-primary">{r.guest}</span> },
    { id: "property", header: "Property", cell: (r) => r.property },
    { id: "status", header: "Status", cell: (r) => <Badge color={statusColor[r.status]} dot>{r.status}</Badge> },
    { id: "nights", header: "Nights", align: "right", sortable: true, cell: (r) => r.nights },
];

const Demo = () => {
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [sort, setSort] = useState<SortState | null>({ columnId: "guest", direction: "asc" });
    return (
        <DataTable
            columns={columns}
            rows={ROWS}
            getRowId={(r) => r.id}
            selectable
            selectedIds={selected}
            onSelectionChange={setSelected}
            sort={sort}
            onSortChange={(id) => setSort((s) => (s?.columnId === id ? { columnId: id, direction: s.direction === "asc" ? "desc" : "asc" } : { columnId: id, direction: "asc" }))}
        />
    );
};

export const Default: Story = { render: () => <Demo /> };

export const Loading: Story = { render: () => <DataTable columns={columns} rows={[]} getRowId={(r) => r.id} isLoading /> };

export const Empty: Story = {
    render: () => <DataTable columns={columns} rows={[]} getRowId={(r) => r.id} emptyState={<span className="text-sm text-tertiary">No reservations match your filters.</span>} />,
};
