import { useMemo, useState } from "react";
import { Download01, DotsVertical, FilterLines, Mail01, Plus, SlashCircle01, UploadCloud02 } from "@untitledui/icons";
import { Avatar } from "@/atoms/Avatar";
import { Badge, type BadgeColor } from "@/atoms/Badge";
import { Button } from "@/atoms/Button";
import { IconButton } from "@/atoms/IconButton";
import { SearchInput } from "@/molecules/SearchInput";
import { TabNav } from "@/molecules/TabNav";
import { Menu } from "@/molecules/Menu";
import { Pagination } from "@/molecules/Pagination";
import { PageHeader } from "@/organisms/PageHeader";
import { Toolbar } from "@/organisms/Toolbar";
import { FilterBar } from "@/organisms/FilterBar";
import { FilterBuilder } from "@/organisms/FilterBuilder";
import { SavedViews } from "@/organisms/SavedViews";
import { BulkActionBar } from "@/organisms/BulkActionBar";
import { DataTable, type Column, type SortState } from "@/organisms/DataTable";
import { ListPageTemplate } from "@/templates/ListPageTemplate";
import { applyFilters, type AppliedFilter } from "@/lib/filtering";
import { useSavedViews } from "@/lib/savedViews";
import { RESERVATIONS, RESERVATION_FIELDS, type Channel, type Reservation, type ReservationStatus } from "./data";

const PAGE_SIZE = 10;

const channelColor: Record<Channel, BadgeColor> = {
    Airbnb: "pink",
    "Booking.com": "blue",
    Vrbo: "indigo",
    Direct: "gray",
};
const statusColor: Record<ReservationStatus, BadgeColor> = {
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

const TABS = [
    { id: "all", label: "All", match: () => true },
    { id: "upcoming", label: "Upcoming", match: (r: Reservation) => r.status === "Confirmed" || r.status === "Pending" },
    { id: "inhouse", label: "In-house", match: (r: Reservation) => r.status === "Checked-in" },
    { id: "completed", label: "Completed", match: (r: Reservation) => r.status === "Checked-out" },
    { id: "cancelled", label: "Cancelled", match: (r: Reservation) => r.status === "Cancelled" },
] as const;

const sortValue: Record<string, (r: Reservation) => string | number> = {
    guestName: (r) => r.guestName,
    property: (r) => r.property,
    checkIn: (r) => r.checkIn,
    checkOut: (r) => r.checkOut,
    nights: (r) => r.nights,
    total: (r) => r.total,
};

export default function ReservationsPage() {
    const [tab, setTab] = useState<string>("all");
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState<AppliedFilter[]>([]);
    const [sort, setSort] = useState<SortState | null>({ columnId: "checkIn", direction: "asc" });
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [page, setPage] = useState(1);
    const [builderOpen, setBuilderOpen] = useState(false);

    const { views, save, remove } = useSavedViews("hostaway.reservations.views");

    // Changing the result set returns to the first page (kept in handlers, not an effect).
    const changeTab = (key: string) => {
        setTab(key);
        setPage(1);
    };
    const changeSearch = (value: string) => {
        setSearch(value);
        setPage(1);
    };
    const commitFilters = (next: AppliedFilter[]) => {
        setFilters(next);
        setPage(1);
    };

    const tabCounts = useMemo(
        () => Object.fromEntries(TABS.map((t) => [t.id, RESERVATIONS.filter(t.match).length])),
        [],
    );

    // base = current tab + free-text search (the context filters apply within).
    const base = useMemo(() => {
        const tabMatch = TABS.find((t) => t.id === tab)!.match;
        const q = search.trim().toLowerCase();
        return RESERVATIONS.filter(
            (r) => tabMatch(r) && (q === "" || r.guestName.toLowerCase().includes(q) || r.code.toLowerCase().includes(q) || r.property.toLowerCase().includes(q)),
        );
    }, [tab, search]);

    const filtered = useMemo(() => applyFilters(base, filters, RESERVATION_FIELDS), [base, filters]);

    const sorted = useMemo(() => {
        if (!sort) return filtered;
        const get = sortValue[sort.columnId];
        if (!get) return filtered;
        const dir = sort.direction === "asc" ? 1 : -1;
        return [...filtered].sort((a, b) => {
            const av = get(a);
            const bv = get(b);
            return (av < bv ? -1 : av > bv ? 1 : 0) * dir;
        });
    }, [filtered, sort]);

    const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
    const safePage = Math.min(page, pageCount);
    const pageRows = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

    const previewCount = (candidate: AppliedFilter[]) => applyFilters(base, candidate, RESERVATION_FIELDS).length;

    const toggleSort = (columnId: string) =>
        setSort((s) => (s?.columnId === columnId ? { columnId, direction: s.direction === "asc" ? "desc" : "asc" } : { columnId, direction: "asc" }));

    const columns: Column<Reservation>[] = [
        {
            id: "guestName",
            header: "Guest",
            sortable: true,
            cell: (r) => (
                <div className="flex items-center gap-3">
                    <Avatar name={r.guestName} size="sm" />
                    <div className="flex flex-col">
                        <span className="font-medium text-primary">{r.guestName}</span>
                        <span className="text-xs text-quaternary">{r.code}</span>
                    </div>
                </div>
            ),
        },
        { id: "property", header: "Property", sortable: true, cell: (r) => <span className="text-secondary">{r.property}</span> },
        { id: "channel", header: "Channel", cell: (r) => <Badge color={channelColor[r.channel]}>{r.channel}</Badge> },
        { id: "status", header: "Status", cell: (r) => <Badge color={statusColor[r.status]} dot>{r.status}</Badge> },
        { id: "checkIn", header: "Check-in", sortable: true, cell: (r) => formatDate(r.checkIn) },
        { id: "checkOut", header: "Check-out", sortable: true, cell: (r) => formatDate(r.checkOut) },
        { id: "nights", header: "Nights", align: "right", sortable: true, cell: (r) => r.nights },
        { id: "total", header: "Total", align: "right", sortable: true, cell: (r) => <span className="font-medium text-primary">{currency.format(r.total)}</span> },
    ];

    const addFilterTrigger = (
        <Button variant="secondary" size="sm" iconLeading={FilterLines}>
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
                            <Button variant="secondary" iconLeading={UploadCloud02}>
                                Import
                            </Button>
                            <Button variant="primary" iconLeading={Plus}>
                                New reservation
                            </Button>
                        </>
                    }
                    tabs={
                        <TabNav
                            aria-label="Reservation views"
                            selectedKey={tab}
                            onSelectionChange={changeTab}
                            tabs={TABS.map((t) => ({ id: t.id, label: t.label, count: tabCounts[t.id] }))}
                        />
                    }
                />
            }
            toolbar={
                <Toolbar
                    left={<SearchInput value={search} onChange={(e) => changeSearch(e.target.value)} placeholder="Search guest, code, property…" />}
                    right={
                        <>
                            <SavedViews
                                views={views}
                                canSave={filters.length > 0}
                                onSave={(name) => save(name, filters)}
                                onDelete={remove}
                                onApply={(view) => commitFilters(view.filters)}
                            />
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
                        </>
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
            footer={<Pagination page={safePage} pageCount={pageCount} onPageChange={setPage} />}
        >
            <div className="flex flex-col gap-4">
                {selectedIds.size > 0 && (
                    <BulkActionBar count={selectedIds.size} onClear={() => setSelectedIds(new Set())}>
                        <Button variant="secondary" size="sm" iconLeading={Mail01}>
                            Message
                        </Button>
                        <Button variant="secondary" size="sm" iconLeading={Download01}>
                            Export
                        </Button>
                        <Button variant="destructive" size="sm" iconLeading={SlashCircle01}>
                            Cancel
                        </Button>
                    </BulkActionBar>
                )}

                <DataTable
                    columns={columns}
                    rows={pageRows}
                    getRowId={(r) => r.id}
                    selectable
                    selectedIds={selectedIds}
                    onSelectionChange={setSelectedIds}
                    sort={sort}
                    onSortChange={toggleSort}
                    emptyState={
                        <div className="flex flex-col items-center gap-1">
                            <p className="text-sm font-semibold text-secondary">No reservations match your filters</p>
                            <p className="text-sm text-tertiary">Try removing a filter or clearing your search.</p>
                        </div>
                    }
                    rowActions={(r) => (
                        <Menu
                            aria-label={`Actions for ${r.guestName}`}
                            trigger={<IconButton icon={DotsVertical} variant="tertiary" size="sm" aria-label="Row actions" />}
                            items={[
                                { id: "view", label: "View details", onAction: () => {} },
                                { id: "edit", label: "Edit reservation", onAction: () => {} },
                                { id: "message", label: "Message guest", onAction: () => {} },
                                { id: "cancel", label: "Cancel reservation", danger: true, onAction: () => {} },
                            ]}
                        />
                    )}
                />
            </div>
        </ListPageTemplate>
    );
}
