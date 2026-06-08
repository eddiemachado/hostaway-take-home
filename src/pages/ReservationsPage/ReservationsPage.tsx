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
import { ViewTabs } from "@/organisms/ViewTabs";
import { BulkActionBar } from "@/organisms/BulkActionBar";
import { ListPageTemplate } from "@/templates/ListPageTemplate";
import { applyFilters, isEmpty, type AppliedFilter } from "@/lib/filtering";
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
 * System-level status tabs. These are a *scope* dimension, independent of the filter layer:
 * switching tabs keeps your filters in place. `statuses: null` means "no status constraint".
 */
const STATUS_TABS: { id: string; label: string; statuses: ReservationStatus[] | null }[] = [
    { id: "all", label: "All", statuses: null },
    { id: "upcoming", label: "Upcoming", statuses: ["Confirmed", "Pending"] },
];
const DEFAULT_TAB = "all";
const inStatusScope = (tabId: string, r: Reservation) => {
    const t = STATUS_TABS.find((x) => x.id === tabId);
    return !t || t.statuses === null || t.statuses.includes(r.status);
};

const sortValue: Record<string, (r: Reservation) => string | number> = {
    guestName: (r) => r.guestName,
    property: (r) => r.property,
    checkIn: (r) => r.checkIn,
    checkOut: (r) => r.checkOut,
    nights: (r) => r.nights,
    total: (r) => r.total,
};

export default function ReservationsPage() {
    const [statusTab, setStatusTab] = useState<string>(DEFAULT_TAB);
    // The single highlighted tab — a system tab id OR a saved-view id. Tracked explicitly (not
    // derived from filters) so exactly one tab is ever active, and clicking a system tab always wins.
    const [activeKey, setActiveKey] = useState<string>(DEFAULT_TAB);
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState<AppliedFilter[]>([]);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({ column: "checkIn", direction: "ascending" });
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
    const [page, setPage] = useState(1);
    const [builderOpen, setBuilderOpen] = useState(false);

    const { views: savedViews, save, remove } = useSavedViews("hostaway.reservations.views");

    const changeSearch = (value: string) => { setSearch(value); setPage(1); };
    // Editing filters (builder/chips) drops the highlight to the current system scope — you're no
    // longer "in" a saved view once you change its filters.
    const commitFilters = (next: AppliedFilter[]) => { setFilters(next); setActiveKey(statusTab); setPage(1); setSelectedKeys(new Set()); };

    // Two independent dimensions: the system status tab (scope) and the filter layer. Manually-set
    // filters persist when switching system tabs — but a saved view's filters belong to that view,
    // so leaving a saved view for a system tab clears them.
    const selectStatusTab = (id: string) => {
        const leavingSavedView = savedViews.some((v) => v.id === activeKey);
        setStatusTab(id);
        setActiveKey(id);
        if (leavingSavedView) setFilters([]);
        setPage(1);
        setSelectedKeys(new Set());
    };
    const openSavedView = (id: string) => {
        const view = savedViews.find((v) => v.id === id);
        if (!view) return;
        setActiveKey(id);
        setStatusTab(DEFAULT_TAB); // a saved preset shows across all statuses
        setFilters(view.filters);
        setPage(1);
        setSelectedKeys(new Set());
    };
    // "Clear filters" returns to the default view: no filters, default tab.
    const clearToDefault = () => { setStatusTab(DEFAULT_TAB); setActiveKey(DEFAULT_TAB); setFilters([]); setPage(1); setSelectedKeys(new Set()); };

    const base = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (q === "") return RESERVATIONS;
        return RESERVATIONS.filter(
            (r) => r.guestName.toLowerCase().includes(q) || r.code.toLowerCase().includes(q) || r.property.toLowerCase().includes(q),
        );
    }, [search]);

    // Rows in the active status scope (search applied), before the filter layer.
    const scoped = useMemo(() => base.filter((r) => inStatusScope(statusTab, r)), [base, statusTab]);

    const systemTabs = useMemo(() => STATUS_TABS.map((t) => ({ id: t.id, label: t.label })), []);
    const savedViewTabs = useMemo(() => savedViews.map((v) => ({ id: v.id, label: v.name })), [savedViews]);
    const hasFilters = filters.some((f) => {
        const field = RESERVATION_FIELDS.find((x) => x.id === f.fieldId);
        return field && !isEmpty(field.type, f.value);
    });
    // Can save when there are filters and we're not already sitting on a saved view.
    const canSaveView = hasFilters && !savedViews.some((v) => v.id === activeKey);

    const filtered = useMemo(() => applyFilters(scoped, filters, RESERVATION_FIELDS), [scoped, filters]);

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

    const previewCount = (candidate: AppliedFilter[]) => applyFilters(scoped, candidate, RESERVATION_FIELDS).length;
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
                            systemTabs={systemTabs}
                            savedViews={savedViewTabs}
                            activeKey={activeKey}
                            onSelectSystemTab={selectStatusTab}
                            onOpenSavedView={openSavedView}
                            onSaveView={(name) => save(name, filters)}
                            onDeleteView={remove}
                            canSave={canSaveView}
                        />
                    }
                />
            }
            toolbar={
                <Toolbar
                    left={
                        <FilterBuilder
                            trigger={addFilterTrigger}
                            isOpen={builderOpen}
                            onOpenChange={setBuilderOpen}
                            fields={RESERVATION_FIELDS}
                            appliedFilters={filters}
                            onApply={commitFilters}
                            previewCount={previewCount}
                            totalCount={scoped.length}
                        />
                    }
                    right={
                        <div className="w-[300px] max-w-full">
                            <Input icon={SearchLg} aria-label="Search reservations" placeholder="Search guest, code, property…" value={search} onChange={changeSearch} size="sm" />
                        </div>
                    }
                />
            }
            filters={
                <FilterBar
                    fields={RESERVATION_FIELDS}
                    filters={filters}
                    onEditFilters={() => setBuilderOpen(true)}
                    onRemoveFilter={(i) => commitFilters(filters.filter((_, idx) => idx !== i))}
                    onClearAll={clearToDefault}
                    resultCount={sorted.length}
                    totalCount={scoped.length}
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
