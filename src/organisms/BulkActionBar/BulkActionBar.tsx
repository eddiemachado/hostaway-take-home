import type { ReactNode } from "react";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";

export interface BulkActionBarProps {
    count: number;
    onClear: () => void;
    /** Bulk actions (compose Buttons here). */
    children: ReactNode;
    className?: string;
}

/** Contextual action bar shown when one or more rows are selected. */
export const BulkActionBar = ({ count, onClear, children, className }: BulkActionBarProps) => (
    <div
        role="region"
        aria-label={`${count} selected`}
        className={cx("flex flex-wrap items-center justify-between gap-4 rounded-xl border border-secondary bg-primary px-4 py-3 shadow-lg", className)}
    >
        <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-secondary">{count} selected</span>
            <Button color="tertiary" size="sm" onPress={onClear}>
                Clear
            </Button>
        </div>
        <div className="flex items-center gap-2">{children}</div>
    </div>
);
