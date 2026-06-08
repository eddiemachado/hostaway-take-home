import { useMemo, useState } from "react";
import { Download01, Edit01, Eye, FilterLines, Mail01, Plus, SearchLg, SlashCircle01, UploadCloud02 } from "@untitledui/icons";
import type { Selection, SortDescriptor } from "react-aria-components";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge, BadgeWithDot, type BadgeColor } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { Input } from "@/components/base/input/input";
import { Table } from "@/components/application/table/table";
import { PaginationLine } from "@/components/application/pagination/pagination-line";
import { PageHeader } from "@/organisms/PageHeader";
import { Toolbar } from "@/organisms/Toolbar";
import { FilterBar } from "@/organisms/FilterBar";
import { FilterBuilder } from "@/organisms/FilterBuilder";
import { ViewTabs, type ViewTab } from "@/organisms/ViewTabs";
import { BulkActionBar } from "@/organisms/BulkActionBar";
import { ListPageTemplate } from "@/templates/ListPageTemplate";
import { applyFilters, filtersEqual, type AppliedFilter } from "@/lib/filtering";
import { useSavedViews } from "@/lib/savedViews";
import { RESERVATIONS, RESERVATION_FIELDS, type Channel, type Reservation, type ReservationStatus } from "./data";

const PAGE_SIZE = 8;

const channelColor: Record<Channel, BadgeColor<"pill-color">> = {
    Airbnb: "pink",
    "Booking.com": "blue",
    Vrbo: "indigo",
    Direct: "gray",
};
const statusColor: Record<ReservationStatus, BadgeColor<"pill-color">> = {
    Confirmed: "success",
    Pending: "warning",
    Cancelled: "error",
    "Checked-in": "blue",
    "Checked-out": "gray",
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const formatDate = (iso: string) => {
    const [y, m, d] = iso.split("-").map(Number);
    return `${MONTHS[m - 1]} ${d}, ${y}`;
};
const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const initialsOf = (name: string) => name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

/**
 * System presets, expressed in the SAME model as user-saved views: a named snapshot of filters.
 * (Previously bespoke `match()` predicates — now just AppliedFilter[] on the `status` field, so
 * tabs and saved views run through one filter pipeline and render in one tab strip.)
 */
const SYSTEM_VIEWS: { id: string; label: string; filters: AppliedFilter[] }[] = [
    { id: "all", label: "All", filters: [] },
    { id: "upcoming", label: "Upcoming", filters: [{ fieldId: "status", value: ["Confirmed", "Pending"] }] },
    { id: "inhouse", label: "In-house", filters: [{ fieldId: "status", value: ["Checked-in"] }] },
    { id: "completed", label: "Completed", filters: [{ fieldId: "status", value: ["Checked-out"] }] },
    { id: "cancelled", label: "Cancelled", filters: [{ fieldId: "status", value: ["Cancelled"] }] },
];

const sortValue: Record<string, (r: Reservation) => string | number> = {
    guestName: (r) => r.guestName,
    property: (r) => r.property,
    checkIn: (r) => r.checkIn,
    checkOut: (r) => r.checkOut,
    nights: (r) => r.nights,
    total: (r) => r.total,
};

export default function ReservationsPage() {
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState<AppliedFilter[]>([]);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({ column: "checkIn", direction: "ascending" });
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
    const [page, setPage] = useState(1);
    const [builderOpen, setBuilderOpen] = useState(false);

    const { views: savedViews, save, remove } = useSavedViews("hostaway.reservations.views");

    const changeSearch = (value: string) => { setSearch(value); setPage(1); };
    const commitFilters = (next: AppliedFilter[]) => { setFilters(next); setPage(1); setSelectedKeys(new Set()); };

    // Search is the only scoping that isn't a filter; the active view's filters live in `filters`.
    const base = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (q === "") return RESERVATIONS;
        return RESERVATIONS.filter(
            (r) => r.guestName.toLowerCase().includes(q) || r.code.toLowerCase().includes(q) || r.property.toLowerCase().includes(q),
        );
    }, [search]);

    // System presets + saved views, unified. Counts are search-aware (relative to `base`).
    const allViews = useMemo(
        () => [...SYSTEM_VIEWS, ...savedViews.map((v) => ({ id: v.id, label: v.name, filters: v.filters }))],
        [savedViews],
    );
    const activeViewId = useMemo(
        () => allViews.find((v) => filtersEqual(v.filters, filters, RESERVATION_FIELDS))?.id ?? null,
        [allViews, filters],
    );
    const viewTabs: ViewTab[] = useMemo(
        () =>
            allViews.map((v) => ({
                id: v.id,
                label: v.label,
                count: applyFilters(base, v.filters, RESERVATION_FIELDS).length,
                system: SYSTEM_VIEWS.some((s) => s.id === v.id),
            })),
        [allViews, base],
    );
    const selectView = (id: string) => {
        const view = allViews.find((v) => v.id === id);
        if (view) commitFilters(view.filters);
    };

    const filtered = useMemo(() => applyFilters(base, filters, RESERVATION_FIELDS), [base, filters]);

    const sorted = useMemo(() => {
        const get = sortValue[String(sortDescriptor.column)];
        if (!get) return filtered;
        const dir = sortDescriptor.direction === "ascending" ? 1 : -1;
        return [...filtered].sort((a, b) => {
            const av = get(a);
            const bv = get(b);
            return (av < bv ? -1 : av > bv ? 1 : 0) * dir;
        });
    }, [filtered, sortDescriptor]);

    const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
    const safePage = Math.min(page, pageCount);
    const pageRows = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

    const previewCount = (candidate: AppliedFilter[]) => applyFilters(base, candidate, RESERVATION_FIELDS).length;
    const selectedCount = selectedKeys === "all" ? pageRows.length : selectedKeys.size;

    const addFilterTrigger = (
        <Button color="secondary" size="sm" iconLeading={FilterLines}>
            Add filter
        </Button>
    );

    return (
        <ListPageTemplate
            header={
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
                        <ViewTabs
                            views={viewTabs}
                            activeId={activeViewId}
                            customCount={filtered.length}
                            onSelect={selectView}
                            onSaveView={(name) => save(name, filters)}
                            onDeleteView={remove}
                            canSave={activeViewId === null}
                        />
                    }
                />
            }
            toolbar={
                <Toolbar
                    left={
                        <div className="w-full max-w-xs">
                            <Input icon={SearchLg} aria-label="Search reservations" placeholder="Search guest, code, property…" value={search} onChange={changeSearch} size="sm" />
                        </div>
                    }
                    right={
                        <FilterBuilder
                            trigger={addFilterTrigger}
                            isOpen={builderOpen}
                            onOpenChange={setBuilderOpen}
                            fields={RESERVATION_FIELDS}
                            appliedFilters={filters}
                            onApply={commitFilters}
                            previewCount={previewCount}
                            totalCount={base.length}
                        />
                    }
                />
            }
            filters={
                <FilterBar
                    fields={RESERVATION_FIELDS}
                    filters={filters}
                    onEditFilters={() => setBuilderOpen(true)}
                    onRemoveFilter={(i) => commitFilters(filters.filter((_, idx) => idx !== i))}
                    onClearAll={() => commitFilters([])}
                    resultCount={sorted.length}
                    totalCount={RESERVATIONS.length}
                />
            }
            footer={<PaginationLine page={safePage} total={pageCount} onPageChange={setPage} />}
        >
            <div className="flex flex-col gap-4">
                {selectedCount > 0 && (
                    <BulkActionBar count={selectedCount} onClear={() => setSelectedKeys(new Set())}>
                        <Button color="secondary" size="sm" iconLeading={Mail01}>Message</Button>
                        <Button color="secondary" size="sm" iconLeading={Download01}>Export</Button>
                        <Button color="primary-destructive" size="sm" iconLeading={SlashCircle01}>Cancel</Button>
                    </BulkActionBar>
                )}

                <Table
                    aria-label="Reservations"
                    selectionMode="multiple"
                    selectedKeys={selectedKeys}
                    onSelectionChange={setSelectedKeys}
                    sortDescriptor={sortDescriptor}
                    onSortChange={setSortDescriptor}
                >
                    <Table.Header>
                        <Table.Head id="guestName" label="Guest" isRowHeader allowsSorting />
                        <Table.Head id="property" label="Property" allowsSorting />
                        <Table.Head id="channel" label="Channel" />
                        <Table.Head id="status" label="Status" />
                        <Table.Head id="checkIn" label="Check-in" allowsSorting />
                        <Table.Head id="checkOut" label="Check-out" allowsSorting />
                        <Table.Head id="nights" label="Nights" allowsSorting />
                        <Table.Head id="total" label="Total" allowsSorting />
                        <Table.Head id="actions" />
                    </Table.Header>
                    <Table.Body items={pageRows}>
                        {(row) => (
                            <Table.Row id={row.id}>
                                <Table.Cell>
                                    <div className="flex items-center gap-3">
                                        <Avatar size="sm" alt={row.guestName} initials={initialsOf(row.guestName)} />
                                        <div className="flex flex-col">
                                            <span className="font-medium text-primary">{row.guestName}</span>
                                            <span className="text-xs text-quaternary">{row.code}</span>
                                        </div>
                                    </div>
                                </Table.Cell>
                                <Table.Cell>{row.property}</Table.Cell>
                                <Table.Cell>
                                    <Badge color={channelColor[row.channel]} type="pill-color" size="sm">{row.channel}</Badge>
                                </Table.Cell>
                                <Table.Cell>
                                    <BadgeWithDot color={statusColor[row.status]} type="pill-color" size="sm">{row.status}</BadgeWithDot>
                                </Table.Cell>
                                <Table.Cell>{formatDate(row.checkIn)}</Table.Cell>
                                <Table.Cell>{formatDate(row.checkOut)}</Table.Cell>
                                <Table.Cell>{row.nights}</Table.Cell>
                                <Table.Cell>
                                    <span className="font-medium text-primary">{currency.format(row.total)}</span>
                                </Table.Cell>
                                <Table.Cell>
                                    <Dropdown.Root>
                                        <Dropdown.DotsButton />
                                        <Dropdown.Popover className="w-min">
                                            <Dropdown.Menu>
                                                <Dropdown.Item icon={Eye}><span className="pr-4">View details</span></Dropdown.Item>
                                                <Dropdown.Item icon={Edit01}><span className="pr-4">Edit reservation</span></Dropdown.Item>
                                                <Dropdown.Item icon={Mail01}><span className="pr-4">Message guest</span></Dropdown.Item>
                                                <Dropdown.Item icon={SlashCircle01}><span className="pr-4">Cancel reservation</span></Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown.Popover>
                                    </Dropdown.Root>
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>
            </div>
        </ListPageTemplate>
    );
}
