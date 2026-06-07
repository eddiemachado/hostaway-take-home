import type { ReactNode } from "react";
import { ChevronDown } from "@untitledui/icons";
import { cx } from "@/utils/cx";

export type SortDirection = "asc" | "desc" | null;

export interface TableHeaderCellProps {
    children: ReactNode;
    sortable?: boolean;
    sortDirection?: SortDirection;
    onSort?: () => void;
    align?: "left" | "right" | "center";
    className?: string;
}

/** A `<th>` for DataTable headers, with optional sortable affordance + aria-sort. */
export const TableHeaderCell = ({ children, sortable, sortDirection = null, onSort, align = "left", className }: TableHeaderCellProps) => {
    const ariaSort = sortDirection === "asc" ? "ascending" : sortDirection === "desc" ? "descending" : "none";
    const alignClass = align === "right" ? "justify-end text-right" : align === "center" ? "justify-center text-center" : "justify-start text-left";

    return (
        <th
            scope="col"
            aria-sort={sortable ? ariaSort : undefined}
            className={cx("bg-secondary px-6 py-3 text-xs font-semibold text-tertiary", className)}
        >
            {sortable ? (
                <button
                    type="button"
                    onClick={onSort}
                    className={cx(
                        "group inline-flex cursor-pointer items-center gap-1 rounded-xs outline-none transition hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                        alignClass,
                    )}
                >
                    {children}
                    <ChevronDown
                        className={cx(
                            "size-4 transition",
                            sortDirection === "asc" && "rotate-180",
                            sortDirection ? "text-fg-brand-primary opacity-100" : "opacity-0 group-hover:opacity-60",
                        )}
                    />
                </button>
            ) : (
                <span className={cx("flex", alignClass)}>{children}</span>
            )}
        </th>
    );
};
