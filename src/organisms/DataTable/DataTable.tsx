import type { ReactNode } from "react";
import { Checkbox } from "@/atoms/Checkbox";
import { TableHeaderCell, type SortDirection } from "@/molecules/TableHeaderCell";
import { cx } from "@/utils/cx";

export interface Column<T> {
    id: string;
    header: ReactNode;
    cell: (row: T) => ReactNode;
    align?: "left" | "right" | "center";
    sortable?: boolean;
    /** Tailwind width class, e.g. "w-40". */
    width?: string;
}

export interface SortState {
    columnId: string;
    direction: "asc" | "desc";
}

export interface DataTableProps<T> {
    columns: Column<T>[];
    rows: T[];
    getRowId: (row: T) => string;
    selectable?: boolean;
    selectedIds?: Set<string>;
    onSelectionChange?: (ids: Set<string>) => void;
    sort?: SortState | null;
    onSortChange?: (columnId: string) => void;
    isLoading?: boolean;
    /** Rendered when there are no rows and not loading. */
    emptyState?: ReactNode;
    /** Trailing per-row actions cell (e.g. a Menu). */
    rowActions?: (row: T) => ReactNode;
    className?: string;
}

const cellAlign = (align?: "left" | "right" | "center") => (align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left");

export function DataTable<T>({
    columns,
    rows,
    getRowId,
    selectable = false,
    selectedIds = new Set(),
    onSelectionChange,
    sort = null,
    onSortChange,
    isLoading = false,
    emptyState,
    rowActions,
    className,
}: DataTableProps<T>) {
    const allSelected = rows.length > 0 && rows.every((r) => selectedIds.has(getRowId(r)));
    const someSelected = rows.some((r) => selectedIds.has(getRowId(r)));
    const colCount = columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0);

    const toggleAll = (checked: boolean) => {
        if (!onSelectionChange) return;
        onSelectionChange(checked ? new Set(rows.map(getRowId)) : new Set());
    };
    const toggleRow = (id: string, checked: boolean) => {
        if (!onSelectionChange) return;
        const next = new Set(selectedIds);
        if (checked) next.add(id);
        else next.delete(id);
        onSelectionChange(next);
    };

    const sortDirFor = (columnId: string): SortDirection => (sort?.columnId === columnId ? sort.direction : null);

    return (
        <div className={cx("overflow-hidden rounded-xl border border-secondary bg-primary shadow-xs", className)}>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-secondary">
                            {selectable && (
                                <th scope="col" className="w-12 bg-secondary px-6 py-3">
                                    <Checkbox
                                        aria-label="Select all rows"
                                        isSelected={allSelected}
                                        isIndeterminate={someSelected && !allSelected}
                                        onChange={toggleAll}
                                    />
                                </th>
                            )}
                            {columns.map((col) => (
                                <TableHeaderCell
                                    key={col.id}
                                    align={col.align}
                                    sortable={col.sortable}
                                    sortDirection={sortDirFor(col.id)}
                                    onSort={() => onSortChange?.(col.id)}
                                    className={col.width}
                                >
                                    {col.header}
                                </TableHeaderCell>
                            ))}
                            {rowActions && <th scope="col" className="w-16 bg-secondary px-6 py-3" />}
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <tr key={`skeleton-${i}`} className="border-b border-secondary last:border-0">
                                    <td colSpan={colCount} className="px-6 py-4">
                                        <div className="h-5 w-full animate-pulse rounded bg-secondary" />
                                    </td>
                                </tr>
                            ))
                        ) : rows.length === 0 ? (
                            <tr>
                                <td colSpan={colCount} className="px-6 py-16 text-center">
                                    {emptyState ?? <span className="text-sm text-tertiary">No results.</span>}
                                </td>
                            </tr>
                        ) : (
                            rows.map((row) => {
                                const id = getRowId(row);
                                const selected = selectedIds.has(id);
                                return (
                                    <tr
                                        key={id}
                                        className={cx("border-b border-secondary transition last:border-0 hover:bg-secondary_hover", selected && "bg-active")}
                                    >
                                        {selectable && (
                                            <td className="px-6 py-4">
                                                <Checkbox aria-label={`Select row ${id}`} isSelected={selected} onChange={(c) => toggleRow(id, c)} />
                                            </td>
                                        )}
                                        {columns.map((col) => (
                                            <td key={col.id} className={cx("px-6 py-4 text-sm text-tertiary", cellAlign(col.align), col.width)}>
                                                {col.cell(row)}
                                            </td>
                                        ))}
                                        {rowActions && <td className="px-6 py-4 text-right">{rowActions(row)}</td>}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
